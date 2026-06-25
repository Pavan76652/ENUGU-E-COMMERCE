const SectionHeader = ({ eyebrow, title, subtitle, align = 'left' }) => (
  <div
    className={`mb-8 sm:mb-12 ${
      align === 'center' ? 'text-center' : 'text-left'
    }`}
  >
    {eyebrow && (
      <p className="text-xs font-medium uppercase tracking-[0.3em] text-enugu-gold">{eyebrow}</p>
    )}
    <h2 className="mt-2 font-display text-2xl font-bold uppercase tracking-wide text-enugu-black sm:text-3xl lg:text-4xl">
      {title}
    </h2>
    {subtitle && (
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-gray-500 sm:text-base">{subtitle}</p>
    )}
  </div>
);

export default SectionHeader;
