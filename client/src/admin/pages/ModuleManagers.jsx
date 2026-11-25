import ResourceManager from '../components/ResourceManager';
import { formatDate, formatFullDate } from '../../utils/formatters';
import MarkdownContent from '../../components/common/MarkdownContent';

export function AdminProjects() {
  return (
    <ResourceManager
      module="projects"
      title="Projects"
      singularName="Project"
      subtitle="Manage portfolio projects, thumbnails, multi-screenshots, tech stacks, and links."
      categories={['Full-Stack', 'Frontend', 'Backend', 'Cybersecurity', 'AI / ML', 'Mobile', 'Automation']}
      columns={[
        {
          key: 'title',
          label: 'Project',
          render: (item) => (
            <div className="flex items-center gap-3">
              {item.thumbnail ? (
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-12 h-9 rounded-lg object-cover shrink-0 border border-zinc-200 dark:border-white/10"
                />
              ) : (
                <div className="w-12 h-9 rounded-lg bg-zinc-200 dark:bg-white/10 shrink-0" />
              )}
              <div className="min-w-0">
                <p className="font-semibold truncate">{item.title}</p>
                <p className="text-xs text-zinc-500 truncate">{item.category}</p>
              </div>
            </div>
          ),
        },
        {
          key: 'techStack',
          label: 'Tech Stack',
          render: (item) => (
            <div className="flex flex-wrap gap-1">
              {(item.techStack || []).slice(0, 3).map((t) => (
                <span
                  key={t}
                  className="px-2 py-0.5 text-[11px] rounded-md bg-zinc-100 dark:bg-white/10"
                >
                  {t}
                </span>
              ))}
            </div>
          ),
        },
      ]}
      fields={[
        { name: 'title', label: 'Project Title', required: true },
        {
          name: 'category',
          label: 'Category',
          type: 'select',
          defaultValue: 'Full-Stack',
          options: ['Full-Stack', 'Frontend', 'Backend', 'Cybersecurity', 'AI / ML', 'Mobile', 'Automation'],
        },
        { name: 'shortDescription', label: 'Short Description', type: 'textarea', rows: 2, required: true },
        { name: 'fullDescription', label: 'Full Description (Markdown supported)', type: 'textarea', rows: 5, required: true },
        { name: 'techStack', label: 'Tech Stack (comma separated)', type: 'tags', placeholder: 'React, Node.js, MongoDB, Tailwind CSS', fullWidth: true },
        { name: 'githubUrl', label: 'GitHub Repository URL', placeholder: 'https://github.com/...' },
        { name: 'liveDemoUrl', label: 'Live Demo URL', placeholder: 'https://...' },
        { name: 'startDate', label: 'Start Date', type: 'date' },
        { name: 'endDate', label: 'Completion Date', type: 'date' },
        { name: 'thumbnail', label: 'Project Thumbnail', type: 'image', publicIdField: 'thumbnailPublicId' },
        { name: 'screenshots', label: 'Additional Screenshots', type: 'multiImage' },
        { name: 'isFeatured', label: 'Feature on Home / Top Projects', type: 'checkbox', defaultValue: false },
      ]}
      renderPreview={(item) => (
        <div className="space-y-4">
          {item.thumbnail && (
            <img src={item.thumbnail} alt={item.title} className="w-full h-56 object-cover rounded-xl" />
          )}
          <div className="flex flex-wrap gap-2">
            {(item.techStack || []).map((t) => (
              <span key={t} className="px-2.5 py-1 text-xs rounded-lg bg-indigo-500/10 text-indigo-400">
                {t}
              </span>
            ))}
          </div>
          <p className="text-sm text-zinc-500">{item.shortDescription}</p>
          <MarkdownContent content={item.fullDescription} />
        </div>
      )}
    />
  );
}

export function AdminAchievements() {
  return (
    <ResourceManager
      module="achievements"
      title="Achievements"
      singularName="Achievement"
      subtitle="Awards, hackathons, competitions, and academic milestones."
      categories={['Award', 'Hackathon', 'Academic', 'Competition', 'Milestone']}
      columns={[
        {
          key: 'title',
          label: 'Achievement',
          render: (item) => (
            <div className="flex items-center gap-3">
              {item.image && (
                <img src={item.image} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0" />
              )}
              <div>
                <p className="font-semibold">{item.title}</p>
                <p className="text-xs text-zinc-500">{item.organization}</p>
              </div>
            </div>
          ),
        },
        { key: 'category', label: 'Category' },
        { key: 'date', label: 'Date', render: (item) => formatDate(item.date) },
      ]}
      fields={[
        { name: 'title', label: 'Achievement Title', required: true },
        {
          name: 'category',
          label: 'Category',
          type: 'select',
          defaultValue: 'Award',
          options: ['Award', 'Hackathon', 'Academic', 'Competition', 'Milestone'],
        },
        { name: 'organization', label: 'Organization / Event' },
        { name: 'date', label: 'Date', type: 'date', required: true },
        { name: 'credentialUrl', label: 'Reference / Proof URL', fullWidth: true },
        { name: 'description', label: 'Description', type: 'textarea', rows: 4, required: true },
        { name: 'image', label: 'Achievement Photo', type: 'image', publicIdField: 'imagePublicId' },
        { name: 'isFeatured', label: 'Mark as Featured', type: 'checkbox' },
      ]}
    />
  );
}

export function AdminCertificates() {
  return (
    <ResourceManager
      module="certificates"
      title="Certifications"
      singularName="Certificate"
      subtitle="Upload certificate images or PDFs with credential IDs and verification URLs."
      categories={['Technical', 'Cybersecurity', 'Cloud', 'Full-Stack', 'Academic', 'Leadership']}
      columns={[
        {
          key: 'title',
          label: 'Certificate',
          render: (item) => (
            <div>
              <p className="font-semibold">{item.title}</p>
              <p className="text-xs text-zinc-500">{item.issuingOrganization}</p>
            </div>
          ),
        },
        { key: 'category', label: 'Category' },
        { key: 'issueDate', label: 'Issued', render: (item) => formatDate(item.issueDate) },
      ]}
      fields={[
        { name: 'title', label: 'Certificate Name', required: true },
        { name: 'issuingOrganization', label: 'Issuing Organization', required: true },
        { name: 'issueDate', label: 'Issue Date', type: 'date', required: true },
        { name: 'expiryDate', label: 'Expiration Date (Optional)', type: 'date' },
        { name: 'credentialId', label: 'Credential ID (Optional)' },
        {
          name: 'category',
          label: 'Category',
          type: 'select',
          defaultValue: 'Technical',
          options: ['Technical', 'Cybersecurity', 'Cloud', 'Full-Stack', 'Academic', 'Leadership'],
        },
        { name: 'verificationUrl', label: 'Verification URL', fullWidth: true },
        { name: 'description', label: 'Description', type: 'textarea', rows: 3 },
        {
          name: 'fileUrl',
          label: 'Certificate Image or PDF',
          type: 'asset',
          publicIdField: 'filePublicId',
          fileTypeField: 'fileType',
        },
        { name: 'isFeatured', label: 'Mark as Featured', type: 'checkbox' },
      ]}
    />
  );
}

export function AdminGallery() {
  return (
    <ResourceManager
      module="gallery"
      title="Professional Gallery"
      singularName="Photo"
      subtitle="Upload profile, internship, event, hackathon, and work photos with drag-and-drop."
      categories={['Profile', 'Internship', 'Events', 'Coding & Work', 'Awards', 'Other']}
      hiddenStatus="hidden"
      supportsBulkGalleryUpload
      columns={[
        {
          key: 'title',
          label: 'Photo',
          render: (item) => (
            <div className="flex items-center gap-3">
              <img src={item.imageUrl} alt={item.altText || item.title} className="w-12 h-10 rounded-lg object-cover shrink-0" />
              <div>
                <p className="font-semibold">{item.title}</p>
                <p className="text-xs text-zinc-500 truncate max-w-[200px]">{item.caption}</p>
              </div>
            </div>
          ),
        },
        { key: 'category', label: 'Category' },
      ]}
      fields={[
        { name: 'title', label: 'Photo Title', required: true },
        {
          name: 'category',
          label: 'Category',
          type: 'select',
          defaultValue: 'Events',
          options: ['Profile', 'Internship', 'Events', 'Coding & Work', 'Awards', 'Other'],
        },
        { name: 'caption', label: 'Caption' },
        { name: 'altText', label: 'Alt Text (Accessibility & SEO)' },
        { name: 'dateTaken', label: 'Date Taken (Optional)', type: 'date' },
        { name: 'description', label: 'Description', type: 'textarea', rows: 3 },
        { name: 'imageUrl', label: 'Photo Upload', type: 'image', publicIdField: 'publicId', required: true },
        { name: 'isFeatured', label: 'Mark as Featured Photo', type: 'checkbox' },
      ]}
    />
  );
}

export function AdminSkills() {
  return (
    <ResourceManager
      module="skills"
      title="Skills"
      singularName="Skill"
      subtitle="Manage technical skills, proficiency indicators, and categories."
      categories={['Languages', 'Frontend', 'Backend', 'Databases', 'Cybersecurity', 'Tools & DevOps']}
      columns={[
        { key: 'name', label: 'Skill', render: (item) => <span className="font-semibold">{item.name}</span> },
        { key: 'category', label: 'Category' },
        {
          key: 'level',
          label: 'Proficiency',
          render: (item) => (
            <div className="flex items-center gap-2 min-w-[120px]">
              <div className="flex-1 h-2 rounded-full bg-zinc-200 dark:bg-white/10 overflow-hidden">
                <div className="h-full bg-indigo-500" style={{ width: `${item.level}%` }} />
              </div>
              <span className="text-xs font-mono">{item.level}%</span>
            </div>
          ),
        },
      ]}
      fields={[
        { name: 'name', label: 'Skill Name', required: true },
        {
          name: 'category',
          label: 'Category',
          type: 'select',
          defaultValue: 'Frontend',
          options: ['Languages', 'Frontend', 'Backend', 'Databases', 'Cybersecurity', 'Tools & DevOps'],
        },
        { name: 'level', label: 'Proficiency Level (1-100)', type: 'number', min: 1, max: 100, defaultValue: 85 },
        { name: 'yearsOfExperience', label: 'Experience (e.g. 2 yrs)' },
        { name: 'icon', label: 'Lucide Icon Name (e.g. Code2, Server, ShieldCheck)', defaultValue: 'Code2' },
        { name: 'description', label: 'Notes (Optional)', type: 'textarea', rows: 2 },
        { name: 'isFeatured', label: 'Featured Skill', type: 'checkbox' },
      ]}
    />
  );
}

export function AdminExperience() {
  return (
    <ResourceManager
      module="experience"
      title="Experience & Internships"
      singularName="Experience"
      subtitle="Manage work history, internships, responsibilities, and achievements."
      supportsFeatured={false}
      columns={[
        {
          key: 'position',
          label: 'Role & Company',
          render: (item) => (
            <div>
              <p className="font-semibold">{item.position}</p>
              <p className="text-xs text-zinc-500">{item.company} • {item.location}</p>
            </div>
          ),
        },
        {
          key: 'dates',
          label: 'Timeline',
          render: (item) =>
            `${formatDate(item.startDate)} – ${item.isCurrent ? 'Present' : formatDate(item.endDate)}`,
        },
      ]}
      fields={[
        { name: 'company', label: 'Company Name', required: true },
        { name: 'position', label: 'Position / Role', required: true },
        { name: 'employmentType', label: 'Employment Type', defaultValue: 'Full-time', placeholder: 'Internship, Full-time, Freelance' },
        { name: 'location', label: 'Location', defaultValue: 'Remote' },
        { name: 'startDate', label: 'Start Date', type: 'date', required: true },
        { name: 'endDate', label: 'End Date (leave empty if current)', type: 'date' },
        { name: 'isCurrent', label: 'I currently work here', type: 'checkbox', fullWidth: true },
        { name: 'companyUrl', label: 'Company Website URL', fullWidth: true },
        { name: 'description', label: 'Summary', type: 'textarea', rows: 3 },
        { name: 'responsibilities', label: 'Responsibilities (one per line)', type: 'lines', rows: 4 },
        { name: 'achievements', label: 'Key Achievements (one per line)', type: 'lines', rows: 3 },
        { name: 'techUsed', label: 'Technologies Used (comma separated)', type: 'tags', fullWidth: true },
        { name: 'companyLogo', label: 'Company Logo', type: 'image', publicIdField: 'companyLogoPublicId' },
      ]}
    />
  );
}

export function AdminEducation() {
  return (
    <ResourceManager
      module="education"
      title="Education"
      singularName="Education"
      subtitle="Manage degrees, institutions, coursework, and CGPA/grades."
      supportsFeatured={false}
      columns={[
        {
          key: 'degree',
          label: 'Degree & Institution',
          render: (item) => (
            <div>
              <p className="font-semibold">{item.degree}</p>
              <p className="text-xs text-zinc-500">{item.institution}</p>
            </div>
          ),
        },
        { key: 'grade', label: 'Grade / CGPA' },
        {
          key: 'years',
          label: 'Years',
          render: (item) => `${item.startYear} – ${item.isCurrent ? 'Present' : item.endYear || ''}`,
        },
      ]}
      fields={[
        { name: 'institution', label: 'College / University', required: true },
        { name: 'degree', label: 'Degree', required: true },
        { name: 'fieldOfStudy', label: 'Course / Field of Study' },
        { name: 'grade', label: 'Grade or CGPA' },
        { name: 'startYear', label: 'Start Year', type: 'number', required: true, defaultValue: 2022 },
        { name: 'endYear', label: 'End Year', type: 'number', defaultValue: 2026 },
        { name: 'isCurrent', label: 'Currently Studying', type: 'checkbox', fullWidth: true },
        { name: 'location', label: 'Location', fullWidth: true },
        { name: 'description', label: 'Description & Coursework', type: 'textarea', rows: 3 },
        { name: 'achievements', label: 'Academic Highlights (one per line)', type: 'lines', rows: 3 },
      ]}
    />
  );
}

export function AdminServices() {
  return (
    <ResourceManager
      module="services"
      title="Services"
      singularName="Service"
      subtitle="Define services offered such as Full-Stack Development, UI/UX, or Security Audits."
      columns={[
        { key: 'title', label: 'Service', render: (item) => <span className="font-semibold">{item.title}</span> },
        { key: 'deliveryTime', label: 'Delivery' },
      ]}
      fields={[
        { name: 'title', label: 'Service Title', required: true },
        { name: 'icon', label: 'Lucide Icon Name (Layers, ShieldCheck, Sparkles, Globe)', defaultValue: 'Code2' },
        { name: 'shortDescription', label: 'Short Description', type: 'textarea', rows: 2, required: true },
        { name: 'fullDescription', label: 'Detailed Scope (Optional)', type: 'textarea', rows: 3 },
        { name: 'features', label: 'Key Deliverables (one per line)', type: 'lines', rows: 4 },
        { name: 'startingPrice', label: 'Starting Price (Optional)' },
        { name: 'deliveryTime', label: 'Typical Delivery Time' },
        { name: 'isFeatured', label: 'Featured Service', type: 'checkbox' },
      ]}
    />
  );
}

export function AdminTestimonials() {
  return (
    <ResourceManager
      module="testimonials"
      title="Testimonials"
      singularName="Testimonial"
      subtitle="Client, mentor, and teammate endorsements."
      columns={[
        {
          key: 'name',
          label: 'Person',
          render: (item) => (
            <div className="flex items-center gap-3">
              {item.avatar && (
                <img src={item.avatar} alt={item.name} className="w-9 h-9 rounded-full object-cover" />
              )}
              <div>
                <p className="font-semibold">{item.name}</p>
                <p className="text-xs text-zinc-500">{item.role}{item.company ? ` @ ${item.company}` : ''}</p>
              </div>
            </div>
          ),
        },
        { key: 'rating', label: 'Rating', render: (item) => `${item.rating || 5} / 5` },
      ]}
      fields={[
        { name: 'name', label: 'Client / Mentor Name', required: true },
        { name: 'role', label: 'Role / Title', required: true },
        { name: 'company', label: 'Company / Organization' },
        { name: 'rating', label: 'Rating (1-5)', type: 'number', min: 1, max: 5, defaultValue: 5 },
        { name: 'feedback', label: 'Feedback Quote', type: 'textarea', rows: 4, required: true },
        { name: 'avatar', label: 'Profile Avatar', type: 'image', publicIdField: 'avatarPublicId' },
        { name: 'isFeatured', label: 'Featured Testimonial', type: 'checkbox' },
      ]}
    />
  );
}

export function AdminBlogs() {
  return (
    <ResourceManager
      module="blogs"
      title="Blog & Articles"
      singularName="Article"
      subtitle="Write and publish technical articles with Markdown, tags, and cover images."
      categories={['Engineering', 'Security', 'Architecture', 'Frontend', 'DevOps', 'Career']}
      columns={[
        {
          key: 'title',
          label: 'Article',
          render: (item) => (
            <div>
              <p className="font-semibold">{item.title}</p>
              <p className="text-xs text-zinc-500">{item.category} • {item.readTimeMinutes || 4} min read</p>
            </div>
          ),
        },
        { key: 'publishedAt', label: 'Published', render: (item) => formatFullDate(item.publishedAt) || 'Draft' },
      ]}
      fields={[
        { name: 'title', label: 'Article Title', required: true },
        {
          name: 'category',
          label: 'Category',
          type: 'select',
          defaultValue: 'Engineering',
          options: ['Engineering', 'Security', 'Architecture', 'Frontend', 'DevOps', 'Career'],
        },
        { name: 'excerpt', label: 'Excerpt / Summary', type: 'textarea', rows: 2, required: true },
        { name: 'content', label: 'Article Content (Markdown)', type: 'textarea', rows: 10, required: true },
        { name: 'tags', label: 'Tags (comma separated)', type: 'tags', placeholder: 'Node.js, Security, React' },
        { name: 'readTimeMinutes', label: 'Read Time (minutes)', type: 'number', min: 1, max: 60, defaultValue: 5 },
        { name: 'coverImage', label: 'Cover Image', type: 'image', publicIdField: 'coverImagePublicId' },
        { name: 'isFeatured', label: 'Featured Article', type: 'checkbox' },
      ]}
      renderPreview={(item) => (
        <div className="space-y-4">
          {item.coverImage && (
            <img src={item.coverImage} alt={item.title} className="w-full h-52 object-cover rounded-xl" />
          )}
          <p className="text-sm text-zinc-500">{item.excerpt}</p>
          <MarkdownContent content={item.content} />
        </div>
      )}
    />
  );
}
