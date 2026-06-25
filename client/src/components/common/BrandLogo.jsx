import { Link } from 'react-router-dom';
import BRAND from '../../constants/brand';
import { ROUTES } from '../../config/routes';

const BrandLogo = ({
  to = ROUTES.HOME,
  height = 48,
  showName = false,
  className = '',
  imgClassName = '',
  link = true,
  onClick,
}) => {
  const content = (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <img
        src={BRAND.logoSrc}
        alt={BRAND.name}
        height={height}
        style={{ height, width: 'auto', imageRendering: 'auto' }}
        className={`select-none object-contain object-left ${imgClassName}`}
        decoding="async"
        fetchPriority="high"
      />
      {showName && (
        <span className="font-display text-lg font-bold tracking-[0.2em] text-enugu-black sm:text-xl">
          {BRAND.name}
        </span>
      )}
    </span>
  );

  if (!link) return content;

  return (
    <Link to={to} onClick={onClick} className="inline-flex shrink-0 transition-opacity hover:opacity-90">
      {content}
    </Link>
  );
};

export default BrandLogo;
