import { Link } from 'react-router-dom';
import { CUSTOM_DESIGN } from '../../constants/homeData';
import Animate from './Animate';

const CustomDesignBanner = () => (
  <section className="relative overflow-hidden bg-enugu-black py-16 text-enugu-white sm:py-24">
    <div className="absolute inset-0 opacity-20">
      <div className="absolute -left-1/4 top-0 h-full w-1/2 rotate-12 bg-enugu-gold/30 blur-3xl" />
      <div className="absolute -right-1/4 bottom-0 h-full w-1/2 -rotate-12 bg-enugu-gold/20 blur-3xl" />
    </div>

    <div className="enugu-container relative text-center">
      <Animate>
        <p className="text-xs font-medium uppercase tracking-[0.4em] text-enugu-gold">Custom Design</p>
        <h2 className="mx-auto mt-4 max-w-2xl font-display text-3xl font-bold uppercase tracking-wide sm:text-4xl lg:text-5xl">
          {CUSTOM_DESIGN.title}
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-gray-400 sm:text-base">
          {CUSTOM_DESIGN.description}
        </p>
        <Link
          to={CUSTOM_DESIGN.cta.to}
          className="mt-8 inline-flex enugu-btn-primary border border-enugu-gold bg-transparent text-enugu-gold hover:bg-enugu-gold hover:text-enugu-black"
        >
          {CUSTOM_DESIGN.cta.label}
        </Link>
      </Animate>
    </div>
  </section>
);

export default CustomDesignBanner;
