import { z } from 'zod';

const optionalUrl = z.string().trim().optional().or(z.literal(''));
const optionalDate = z.union([z.string(), z.date(), z.null()]).optional();

export const loginSchema = z.object({
  email: z.string().trim().email('Valid email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters'),
});

export const profileSchema = z.object({
  name: z.string().trim().min(2, 'Name is required').max(120),
  headline: z.string().trim().min(2, 'Headline is required').max(200),
  heroBadge: z.string().trim().max(120).optional(),
  shortBio: z.string().trim().max(1000).optional(),
  fullBio: z.string().trim().max(8000).optional(),
  careerGoals: z.string().trim().max(2000).optional(),
  interests: z.array(z.string().trim()).optional(),
  email: z.string().trim().email('Invalid email').optional().or(z.literal('')),
  phone: z.string().trim().max(40).optional(),
  location: z.string().trim().max(120).optional(),
  availabilityStatus: z.enum(['open', 'freelance', 'employed', 'unavailable']).optional(),
  yearsOfExperience: z.string().trim().max(20).optional(),
  profileImage: optionalUrl,
  profileImagePublicId: z.string().optional(),
  resumeUrl: optionalUrl,
  resumePublicId: z.string().optional(),
  resumeFilename: z.string().optional(),
  socialLinks: z
    .object({
      github: optionalUrl,
      linkedin: optionalUrl,
      instagram: optionalUrl,
      facebook: optionalUrl,
      twitter: optionalUrl,
      website: optionalUrl,
      youtube: optionalUrl,
    })
    .optional(),
  highlights: z
    .array(
      z.object({
        label: z.string().trim(),
        value: z.string().trim(),
      })
    )
    .optional(),
});

export const projectSchema = z.object({
  title: z.string().trim().min(2, 'Title is required').max(140),
  slug: z.string().trim().optional(),
  shortDescription: z.string().trim().min(5, 'Short description is required').max(320),
  fullDescription: z.string().trim().min(10, 'Full description is required'),
  thumbnail: optionalUrl,
  thumbnailPublicId: z.string().optional(),
  screenshots: z
    .array(
      z.object({
        url: z.string().trim(),
        publicId: z.string().optional(),
        caption: z.string().optional(),
      })
    )
    .optional(),
  techStack: z.array(z.string().trim()).optional(),
  category: z.string().trim().min(1, 'Category is required'),
  githubUrl: optionalUrl,
  liveDemoUrl: optionalUrl,
  startDate: optionalDate,
  endDate: optionalDate,
  isFeatured: z.boolean().optional(),
  displayOrder: z.number().int().optional(),
  status: z.enum(['published', 'draft']).optional(),
});

export const achievementSchema = z.object({
  title: z.string().trim().min(2, 'Title is required').max(160),
  description: z.string().trim().min(5, 'Description is required'),
  image: optionalUrl,
  imagePublicId: z.string().optional(),
  date: z.union([z.string().min(1, 'Date is required'), z.date()]),
  organization: z.string().trim().optional(),
  category: z.string().trim().optional(),
  credentialUrl: optionalUrl,
  isFeatured: z.boolean().optional(),
  displayOrder: z.number().int().optional(),
  status: z.enum(['published', 'draft']).optional(),
});

export const certificateSchema = z.object({
  title: z.string().trim().min(2, 'Certificate title is required').max(180),
  issuingOrganization: z.string().trim().min(2, 'Issuing organization is required').max(140),
  issueDate: z.union([z.string().min(1, 'Issue date is required'), z.date()]),
  expiryDate: optionalDate,
  credentialId: z.string().trim().optional(),
  verificationUrl: optionalUrl,
  fileUrl: optionalUrl,
  filePublicId: z.string().optional(),
  fileType: z.enum(['image', 'pdf']).optional(),
  category: z.string().trim().optional(),
  description: z.string().trim().optional(),
  isFeatured: z.boolean().optional(),
  displayOrder: z.number().int().optional(),
  status: z.enum(['published', 'draft']).optional(),
});

export const gallerySchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(140),
  caption: z.string().trim().optional(),
  description: z.string().trim().optional(),
  imageUrl: z.string().trim().min(1, 'Image URL is required'),
  publicId: z.string().optional(),
  category: z.string().trim().optional(),
  altText: z.string().trim().optional(),
  dateTaken: optionalDate,
  isFeatured: z.boolean().optional(),
  displayOrder: z.number().int().optional(),
  status: z.enum(['published', 'hidden']).optional(),
});

export const skillSchema = z.object({
  name: z.string().trim().min(1, 'Skill name is required').max(80),
  category: z.string().trim().min(1, 'Category is required'),
  level: z.number().min(1).max(100).optional(),
  icon: z.string().trim().optional(),
  yearsOfExperience: z.string().trim().optional(),
  description: z.string().trim().optional(),
  isFeatured: z.boolean().optional(),
  displayOrder: z.number().int().optional(),
  status: z.enum(['published', 'draft']).optional(),
});

export const experienceSchema = z.object({
  company: z.string().trim().min(1, 'Company is required').max(140),
  position: z.string().trim().min(1, 'Position is required').max(140),
  employmentType: z.string().trim().optional(),
  location: z.string().trim().optional(),
  startDate: z.union([z.string().min(1, 'Start date is required'), z.date()]),
  endDate: optionalDate,
  isCurrent: z.boolean().optional(),
  description: z.string().trim().optional(),
  responsibilities: z.array(z.string().trim()).optional(),
  achievements: z.array(z.string().trim()).optional(),
  techUsed: z.array(z.string().trim()).optional(),
  companyLogo: optionalUrl,
  companyLogoPublicId: z.string().optional(),
  companyUrl: optionalUrl,
  displayOrder: z.number().int().optional(),
  status: z.enum(['published', 'draft']).optional(),
});

export const educationSchema = z.object({
  institution: z.string().trim().min(2, 'Institution is required').max(160),
  degree: z.string().trim().min(2, 'Degree is required').max(140),
  fieldOfStudy: z.string().trim().optional(),
  startYear: z.number().int().min(1950).max(2100),
  endYear: z.union([z.number().int().min(1950).max(2100), z.null()]).optional(),
  isCurrent: z.boolean().optional(),
  grade: z.string().trim().optional(),
  location: z.string().trim().optional(),
  description: z.string().trim().optional(),
  achievements: z.array(z.string().trim()).optional(),
  institutionLogo: optionalUrl,
  displayOrder: z.number().int().optional(),
  status: z.enum(['published', 'draft']).optional(),
});

export const serviceSchema = z.object({
  title: z.string().trim().min(2, 'Title is required').max(120),
  shortDescription: z.string().trim().min(5, 'Short description is required').max(260),
  fullDescription: z.string().trim().optional(),
  icon: z.string().trim().optional(),
  features: z.array(z.string().trim()).optional(),
  startingPrice: z.string().trim().optional(),
  deliveryTime: z.string().trim().optional(),
  isFeatured: z.boolean().optional(),
  displayOrder: z.number().int().optional(),
  status: z.enum(['published', 'draft']).optional(),
});

export const testimonialSchema = z.object({
  name: z.string().trim().min(2, 'Name is required').max(100),
  role: z.string().trim().min(2, 'Role is required').max(120),
  company: z.string().trim().optional(),
  avatar: optionalUrl,
  avatarPublicId: z.string().optional(),
  feedback: z.string().trim().min(10, 'Feedback is required').max(1200),
  rating: z.number().min(1).max(5).optional(),
  isFeatured: z.boolean().optional(),
  displayOrder: z.number().int().optional(),
  status: z.enum(['published', 'draft']).optional(),
});

export const blogSchema = z.object({
  title: z.string().trim().min(3, 'Title is required').max(180),
  slug: z.string().trim().optional(),
  excerpt: z.string().trim().min(10, 'Excerpt is required').max(400),
  content: z.string().trim().min(20, 'Content is required'),
  coverImage: optionalUrl,
  coverImagePublicId: z.string().optional(),
  category: z.string().trim().optional(),
  tags: z.array(z.string().trim()).optional(),
  readTimeMinutes: z.number().int().min(1).max(120).optional(),
  publishedAt: optionalDate,
  status: z.enum(['published', 'draft']).optional(),
  isFeatured: z.boolean().optional(),
});

export const contactSchema = z.object({
  name: z.string().trim().min(2, 'Please enter your name').max(100),
  email: z.string().trim().email('Please enter a valid email address').max(150),
  subject: z.string().trim().min(3, 'Subject must be at least 3 characters').max(180),
  message: z.string().trim().min(10, 'Message must be at least 10 characters').max(4000),
});

export const reorderSchema = z.object({
  items: z.array(
    z.object({
      id: z.string().min(1),
      displayOrder: z.number().int(),
    })
  ),
});
