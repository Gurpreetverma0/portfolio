import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, default: 'Gurpreet Verma' },
    headline: {
      type: String,
      required: true,
      trim: true,
      default: 'Full-Stack Developer & Security Engineer',
    },
    heroBadge: { type: String, trim: true, default: 'Available for impactful roles & projects' },
    shortBio: { type: String, trim: true, default: '' },
    fullBio: { type: String, trim: true, default: '' },
    careerGoals: { type: String, trim: true, default: '' },
    interests: [{ type: String, trim: true }],
    email: { type: String, trim: true, default: '' },
    phone: { type: String, trim: true, default: '' },
    location: { type: String, trim: true, default: 'India' },
    availabilityStatus: {
      type: String,
      enum: ['open', 'freelance', 'employed', 'unavailable'],
      default: 'open',
    },
    yearsOfExperience: { type: String, trim: true, default: '2+' },
    profileImage: { type: String, default: '' },
    profileImagePublicId: { type: String, default: '' },
    resumeUrl: { type: String, default: '' },
    resumePublicId: { type: String, default: '' },
    resumeFilename: { type: String, default: 'Resume.pdf' },
    socialLinks: {
      github: { type: String, trim: true, default: '' },
      linkedin: { type: String, trim: true, default: '' },
      instagram: { type: String, trim: true, default: '' },
      facebook: { type: String, trim: true, default: '' },
      twitter: { type: String, trim: true, default: '' },
      website: { type: String, trim: true, default: '' },
      youtube: { type: String, trim: true, default: '' },
    },
    highlights: [
      {
        label: { type: String, trim: true },
        value: { type: String, trim: true },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model('Profile', profileSchema);
