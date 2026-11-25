import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, RefreshCw, Shield, Wrench } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { publicApi } from '../services/api';
import Navbar from '../components/portfolio/Navbar';
import HeroSection from '../components/portfolio/HeroSection';
import AboutSection from '../components/portfolio/AboutSection';
import SkillsSection from '../components/portfolio/SkillsSection';
import ProjectsSection from '../components/portfolio/ProjectsSection';
import { ExperienceSection, EducationSection } from '../components/portfolio/TimelineSections';
import { AchievementsSection, CertificatesSection } from '../components/portfolio/CredentialsSections';
import GallerySection from '../components/portfolio/GallerySection';
import { ServicesSection, TestimonialsSection } from '../components/portfolio/ServicesTestimonialsSections';
import {
  BlogSection,
  ResumeSection,
  ContactSection,
  Footer,
} from '../components/portfolio/BlogResumeContactFooter';
import { PageLoader } from '../components/common/Skeletons';

const SECTION_COMPONENTS = {
  hero: HeroSection,
  about: AboutSection,
  skills: SkillsSection,
  projects: ProjectsSection,
  experience: ExperienceSection,
  education: EducationSection,
  achievements: AchievementsSection,
  certificates: CertificatesSection,
  gallery: GallerySection,
  services: ServicesSection,
  testimonials: TestimonialsSection,
  blog: BlogSection,
  resume: ResumeSection,
  contact: ContactSection,
};

const DEFAULT_ORDER = Object.keys(SECTION_COMPONENTS);

export default function HomePage() {
  const { data, loading, error, refreshPortfolio } = usePortfolio();

  useEffect(() => {
    publicApi.trackView('/');
  }, []);

  if (loading) return <PageLoader />;

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-white dark:bg-obsidian-950">
        <div className="glass-card rounded-3xl p-8 max-w-md space-y-4">
          <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto" />
          <h1 className="text-xl font-bold">Connection Issue</h1>
          <p className="text-sm text-zinc-500">{error}</p>
          <button
            type="button"
            onClick={refreshPortfolio}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold"
          >
            <RefreshCw className="w-4 h-4" /> Retry
          </button>
        </div>
      </div>
    );
  }

  const settings = data?.settings;
  if (settings?.maintenanceMode) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-obsidian-950 text-white">
        <div className="glass-card rounded-3xl p-10 max-w-lg space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-400 flex items-center justify-center mx-auto">
            <Wrench className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold">{settings.siteTitle || 'Maintenance Mode'}</h1>
          <p className="text-sm text-zinc-400 leading-relaxed">{settings.maintenanceMessage}</p>
          <Link
            to="/admin/login"
            className="inline-flex items-center gap-2 text-xs text-indigo-400 hover:underline pt-2"
          >
            <Shield className="w-3.5 h-3.5" /> Admin Login
          </Link>
        </div>
      </div>
    );
  }

  const order = settings?.sectionOrder?.length ? settings.sectionOrder : DEFAULT_ORDER;
  const visible = settings?.visibleSections || {};

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-obsidian-950 text-zinc-900 dark:text-zinc-100">
      <Navbar />
      <main>
        {order.map((key) => {
          if (visible[key] === false) return null;
          const Component = SECTION_COMPONENTS[key];
          return Component ? <Component key={key} /> : null;
        })}
      </main>
      <Footer />
    </div>
  );
}
