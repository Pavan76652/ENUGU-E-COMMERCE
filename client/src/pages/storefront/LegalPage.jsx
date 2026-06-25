import { Link, Navigate, useLocation } from 'react-router-dom';
import { Seo } from '../../components/seo';
import { buildPageSeo } from '../../utils/seo';
import { LEGAL_PAGES } from '../../constants/legalPages';
import { ROUTES } from '../../config/routes';

const LegalPage = () => {
  const { pathname } = useLocation();
  const page = Object.values(LEGAL_PAGES).find((item) => item.path === pathname);

  if (!page) {
    return <Navigate to={ROUTES.NOT_FOUND} replace />;
  }

  const seo = buildPageSeo({
    title: page.title,
    description: page.metaDescription,
    path: page.path,
  });

  return (
    <>
      <Seo {...seo} />

      <div className="py-8 sm:py-12 lg:py-16">
        <div className="enugu-container">
          <div className="mx-auto max-w-3xl">
            <p className="text-xs uppercase tracking-[0.3em] text-enugu-gold">Legal</p>
            <h1 className="mt-2 font-display text-3xl font-bold uppercase tracking-wide text-enugu-black sm:text-4xl">
              {page.title}
            </h1>
            <p className="mt-3 text-sm text-gray-500">Last updated: {page.lastUpdated}</p>

            <div className="mt-10 space-y-8 border-t border-gray-100 pt-10">
              {page.sections.map((section) => (
                <section key={section.heading}>
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-enugu-black">
                    {section.heading}
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-gray-600">{section.body}</p>
                </section>
              ))}
            </div>

            <div className="mt-12 border-t border-gray-100 pt-8">
              <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                Related policies
              </p>
              <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
                {Object.values(LEGAL_PAGES)
                  .filter((item) => item.path !== page.path)
                  .map((item) => (
                    <li key={item.slug}>
                      <Link to={item.path} className="text-enugu-black hover:text-enugu-gold">
                        {item.title}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LegalPage;
