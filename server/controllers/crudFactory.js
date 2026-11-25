import { asyncHandler } from '../middleware/errorHandler.js';
import { logActivity } from '../utils/activity.js';

/**
 * Creates standard public + admin CRUD controllers for a Mongoose model.
 * Keeps filtering, search, sorting, pagination, publish toggle, and reorder uniform.
 */
export const createCrudController = ({
  Model,
  resourceName,
  searchFields = ['title'],
  defaultSort = { displayOrder: 1, createdAt: -1 },
  publishedStatus = 'published',
  beforeCreate,
  beforeUpdate,
  afterDelete,
}) => {
  const buildFilter = (query, isAdmin = false) => {
    const filter = {};
    if (!isAdmin) {
      filter.status = publishedStatus;
    } else if (query.status && query.status !== 'all') {
      filter.status = query.status;
    }

    if (query.category && query.category !== 'all') {
      filter.category = query.category;
    }

    if (query.featured === 'true') {
      filter.isFeatured = true;
    }

    if (query.search && query.search.trim()) {
      const regex = new RegExp(query.search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      filter.$or = searchFields.map((field) => ({ [field]: regex }));
    }

    return filter;
  };

  const buildSort = (sortParam) => {
    if (!sortParam) return defaultSort;
    switch (sortParam) {
      case 'newest':
        return { createdAt: -1 };
      case 'oldest':
        return { createdAt: 1 };
      case 'title':
      case 'name':
        return { [sortParam]: 1 };
      case 'order':
        return { displayOrder: 1, createdAt: -1 };
      case 'featured':
        return { isFeatured: -1, displayOrder: 1, createdAt: -1 };
      default:
        return defaultSort;
    }
  };

  const listPublic = asyncHandler(async (req, res) => {
    const filter = buildFilter(req.query, false);
    const sort = buildSort(req.query.sort);
    const limit = Math.min(Number(req.query.limit) || 100, 100);
    const page = Math.max(Number(req.query.page) || 1, 1);

    const [items, total] = await Promise.all([
      Model.find(filter).sort(sort).skip((page - 1) * limit).limit(limit).lean(),
      Model.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: items,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
    });
  });

  const listAdmin = asyncHandler(async (req, res) => {
    const filter = buildFilter(req.query, true);
    const sort = buildSort(req.query.sort);
    const limit = Math.min(Number(req.query.limit) || 20, 100);
    const page = Math.max(Number(req.query.page) || 1, 1);

    const [items, total] = await Promise.all([
      Model.find(filter).sort(sort).skip((page - 1) * limit).limit(limit).lean(),
      Model.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: items,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
    });
  });

  const getOnePublic = asyncHandler(async (req, res) => {
    const { idOrSlug } = req.params;
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(idOrSlug);
    const query = isObjectId ? { _id: idOrSlug } : { slug: idOrSlug };
    query.status = publishedStatus;

    const item = await Model.findOne(query);
    if (!item) {
      return res.status(404).json({ success: false, message: `${resourceName} not found` });
    }

    if (typeof item.views === 'number') {
      item.views += 1;
      await item.save();
    }

    res.json({ success: true, data: item });
  });

  const create = asyncHandler(async (req, res) => {
    let payload = { ...req.body };
    if (beforeCreate) {
      payload = await beforeCreate(payload, req);
    }

    const item = await Model.create(payload);
    await logActivity({
      admin: req.admin,
      action: 'CREATE',
      resourceType: resourceName,
      resourceId: item._id,
      summary: `Created ${resourceName}: ${item.title || item.name || item.company || item.institution || item._id}`,
    });

    res.status(201).json({ success: true, data: item, message: `${resourceName} created successfully` });
  });

  const update = asyncHandler(async (req, res) => {
    const existing = await Model.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: `${resourceName} not found` });
    }

    let payload = { ...req.body };
    if (beforeUpdate) {
      payload = await beforeUpdate(payload, existing, req);
    }

    const updated = await Model.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true,
    });

    await logActivity({
      admin: req.admin,
      action: 'UPDATE',
      resourceType: resourceName,
      resourceId: updated._id,
      summary: `Updated ${resourceName}: ${updated.title || updated.name || updated.company || updated.institution || updated._id}`,
    });

    res.json({ success: true, data: updated, message: `${resourceName} updated successfully` });
  });

  const remove = asyncHandler(async (req, res) => {
    const existing = await Model.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: `${resourceName} not found` });
    }

    await existing.deleteOne();
    if (afterDelete) {
      await afterDelete(existing);
    }

    await logActivity({
      admin: req.admin,
      action: 'DELETE',
      resourceType: resourceName,
      resourceId: existing._id,
      summary: `Deleted ${resourceName}: ${existing.title || existing.name || existing.company || existing.institution || existing._id}`,
    });

    res.json({ success: true, message: `${resourceName} deleted successfully` });
  });

  const toggleStatus = asyncHandler(async (req, res) => {
    const existing = await Model.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: `${resourceName} not found` });
    }

    const hiddenStatus = resourceName === 'Gallery' ? 'hidden' : 'draft';
    const nextStatus = existing.status === publishedStatus ? hiddenStatus : publishedStatus;
    existing.status = nextStatus;

    if (resourceName === 'Blog' && nextStatus === 'published' && !existing.publishedAt) {
      existing.publishedAt = new Date();
    }

    await existing.save();

    await logActivity({
      admin: req.admin,
      action: nextStatus === publishedStatus ? 'PUBLISH' : 'UNPUBLISH',
      resourceType: resourceName,
      resourceId: existing._id,
      summary: `${nextStatus === publishedStatus ? 'Published' : 'Unpublished'} ${resourceName}: ${existing.title || existing.name || existing._id}`,
    });

    res.json({ success: true, data: existing, message: `${resourceName} marked as ${nextStatus}` });
  });

  const toggleFeatured = asyncHandler(async (req, res) => {
    const existing = await Model.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: `${resourceName} not found` });
    }

    existing.isFeatured = !existing.isFeatured;
    await existing.save();

    res.json({
      success: true,
      data: existing,
      message: `${resourceName} ${existing.isFeatured ? 'marked as featured' : 'removed from featured'}`,
    });
  });

  const reorder = asyncHandler(async (req, res) => {
    const { items } = req.body;
    const bulkOps = items.map(({ id, displayOrder }) => ({
      updateOne: {
        filter: { _id: id },
        update: { $set: { displayOrder } },
      },
    }));

    if (bulkOps.length > 0) {
      await Model.bulkWrite(bulkOps);
    }

    await logActivity({
      admin: req.admin,
      action: 'REORDER',
      resourceType: resourceName,
      summary: `Reordered ${bulkOps.length} ${resourceName} items`,
    });

    res.json({ success: true, message: `${resourceName} order updated` });
  });

  return {
    listPublic,
    listAdmin,
    getOnePublic,
    create,
    update,
    remove,
    toggleStatus,
    toggleFeatured,
    reorder,
  };
};
