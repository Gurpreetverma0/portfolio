export const slugifyText = (text) => {
  return String(text || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
};

export const generateUniqueSlug = async (Model, title, excludeId = null) => {
  const base = slugifyText(title) || `item-${Date.now()}`;
  let slug = base;
  let counter = 1;

  while (true) {
    const query = { slug };
    if (excludeId) query._id = { $ne: excludeId };
    const existing = await Model.findOne(query).select('_id').lean();
    if (!existing) return slug;
    slug = `${base}-${counter++}`;
  }
};
