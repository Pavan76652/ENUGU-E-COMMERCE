import { Link } from 'react-router-dom';
import { Seo } from '../../components/seo';
import { buildPageSeo } from '../../utils/seo';
import { ROUTES } from '../../config/routes';
import BRAND from '../../constants/brand';
import env from '../../config/env';
import { getWhatsAppUrl } from '../../utils/contactHelpers';

const ABOUT_SECTIONS = [
  {
    id: 'story',
    title: 'Our Story',
    content:
      'ENUGU was born from a simple belief: what you wear should speak before you do. We create premium streetwear for people who carry strength, individuality, and confidence in everything they do. Every piece is designed to help you wear your identity — boldly, authentically, and without compromise.',
  },
  {
    id: 'vision',
    title: 'Brand Vision',
    content:
      'To become India\'s most trusted premium streetwear label — where quality, design, and self-expression meet. We envision a community that doesn\'t follow trends but sets them, one intentional drop at a time.',
  },
  {
    id: 'mission',
    title: 'Brand Mission',
    content:
      'To deliver heavyweight, premium cotton apparel with exceptional print quality, honest pricing, and limited runs that respect both the craft and the customer. We exist to outfit the bold.',
  },
  {
    id: 'why',
    title: 'Why ENUGU',
    bullets: [
      'Premium 240 GSM cotton with signature oversized fit',
      'High-definition prints built to last',
      'Limited drops — no mass-market noise',
      'Designed and fulfilled with care in India',
      'Custom design services for one-of-one pieces',
    ],
  },
  {
    id: 'quality',
    title: 'Premium Quality',
    content:
      'Every ENUGU piece goes through strict quality checks — from fabric selection to print curing to final packaging. We use premium cotton, reinforced stitching, and colour-fast inks so your tee looks as sharp on day one hundred as day one.',
  },
  {
    id: 'custom',
    title: 'Custom Design Services',
    content:
      'Have a vision? Our custom design studio turns your ideas into wearable art. Share your concept, reference images, and quantity — our team handles design, sampling, and production on premium ENUGU blanks.',
    cta: { label: 'Start Custom Design', to: ROUTES.CUSTOM_DESIGN },
  },
];

const AboutPage = () => {
  const seo = buildPageSeo({
    title: 'About ENUGU',
    description: `Learn about ${BRAND.name} — premium streetwear built on strength, individuality, and identity. ${BRAND.tagline}.`,
    path: '/about',
  });

  return (
    <>
      <Seo {...seo} />

      <div className="py-8 sm:py-12">
        <div className="enugu-container max-w-4xl">
          <header className="mb-12 border-b border-gray-100 pb-10 text-center sm:mb-16">
            <p className="text-xs uppercase tracking-[0.3em] text-enugu-gold">About</p>
            <h1 className="mt-3 font-display text-4xl font-bold uppercase tracking-wide text-enugu-black sm:text-5xl">
              {BRAND.name}
            </h1>
            <p className="mt-4 text-lg font-medium tracking-wide text-gray-600">{BRAND.tagline}</p>
            <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-gray-600 sm:text-base">
              ENUGU represents strength, individuality, confidence and identity. We craft premium
              streetwear for those who refuse to blend in.
            </p>
          </header>

          <div className="space-y-12 sm:space-y-16">
            {ABOUT_SECTIONS.map((section) => (
              <section key={section.id} id={section.id}>
                <h2 className="font-display text-xl font-bold uppercase tracking-wide text-enugu-black sm:text-2xl">
                  {section.title}
                </h2>
                {section.content && (
                  <p className="mt-4 text-sm leading-relaxed text-gray-600 sm:text-base">
                    {section.content}
                  </p>
                )}
                {section.bullets && (
                  <ul className="mt-4 space-y-2">
                    {section.bullets.map((item) => (
                      <li key={item} className="flex gap-2 text-sm text-gray-600 sm:text-base">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-enugu-gold" />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
                {section.cta && (
                  <Link to={section.cta.to} className="enugu-btn-primary mt-6 inline-flex">
                    {section.cta.label}
                  </Link>
                )}
              </section>
            ))}

            <section id="contact" className="rounded-lg border border-gray-200 bg-gray-50 p-6 sm:p-8">
              <h2 className="font-display text-xl font-bold uppercase tracking-wide text-enugu-black">
                Contact Information
              </h2>
              <dl className="mt-6 space-y-4 text-sm sm:text-base">
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wider text-gray-500">Email</dt>
                  <dd className="mt-1">
                    <a href={`mailto:${env.supportEmail}`} className="text-enugu-black hover:text-enugu-gold">
                      {env.supportEmail}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wider text-gray-500">Phone / WhatsApp</dt>
                  <dd className="mt-1">
                    <a
                      href={getWhatsAppUrl('Hi ENUGU, I have a question about your brand.')}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-enugu-black hover:text-enugu-gold"
                    >
                      +{env.whatsappNumber}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wider text-gray-500">Get in touch</dt>
                  <dd className="mt-1">
                    <Link to={ROUTES.CONTACT} className="font-medium text-enugu-gold hover:underline">
                      Contact form →
                    </Link>
                  </dd>
                </div>
              </dl>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutPage;
