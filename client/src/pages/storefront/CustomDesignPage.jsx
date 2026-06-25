import { CUSTOM_DESIGN } from '../../constants/homeData';
import { CustomDesignForm } from '../../components/customDesign';
import { Seo } from '../../components/seo';
import { PAGE_SEO } from '../../utils/seo';

const CustomDesignPage = () => (
  <>
    <Seo {...PAGE_SEO.customDesign} />
  <div className="py-8 sm:py-12">
    <div className="enugu-container">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 text-center sm:mb-12">
          <p className="text-xs uppercase tracking-[0.3em] text-enugu-gold">Custom Design</p>
          <h1 className="mt-2 font-display text-3xl font-bold uppercase tracking-wide text-enugu-black sm:text-4xl">
            {CUSTOM_DESIGN.title}
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-gray-600 sm:text-base">
            {CUSTOM_DESIGN.description}
          </p>
        </div>

        <div className="border border-gray-200 bg-gray-50 p-6 sm:p-10">
          <CustomDesignForm />
        </div>
      </div>
    </div>
  </div>
  </>
);

export default CustomDesignPage;
