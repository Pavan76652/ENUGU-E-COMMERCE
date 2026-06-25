import { useEffect, useRef, useState } from 'react';
import { MEASUREMENT_FIELDS, SIZE_GUIDE_SIZES } from '../../constants/sizeGuides';
import { hasSizeGuideMeasurements } from '../../utils/sizeGuideImage';
import MeasureIllustrations from './MeasureIllustrations';
import BrandLogo from '../common/BrandLogo';

const SizeGuideModal = ({ isOpen, onClose, sizeGuide }) => {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isVisible, setIsVisible] = useState(false);
  const closeButtonRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      const id = requestAnimationFrame(() => setIsVisible(true));
      return () => cancelAnimationFrame(id);
    }

    setIsVisible(false);
    const timer = setTimeout(() => setShouldRender(false), 220);
    return () => clearTimeout(timer);
  }, [isOpen]);

  useEffect(() => {
    if (!shouldRender) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    closeButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [shouldRender, onClose]);

  if (!shouldRender || !sizeGuide) return null;

  const sizes = sizeGuide.sizes?.length ? sizeGuide.sizes : SIZE_GUIDE_SIZES;
  const measurements = sizeGuide.measurements ?? {};
  const showMeasurements = hasSizeGuideMeasurements(sizeGuide);

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-end justify-center backdrop-blur-md transition-opacity duration-200 sm:items-center sm:p-4 ${
        isVisible ? 'bg-black/60 opacity-100' : 'bg-black/0 opacity-0'
      }`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="size-guide-title"
      onClick={onClose}
    >
      <div
        className={`flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl transition-all duration-200 sm:max-h-[88vh] sm:w-[90vw] sm:max-w-[900px] sm:rounded-2xl ${
          isVisible ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-4 scale-[0.98] opacity-0'
        }`}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <div className="flex items-center gap-3">
            <BrandLogo link={false} height={32} imgClassName="h-8 w-auto" />
            <div>
              <p className="text-lg font-black uppercase leading-none tracking-tight text-enugu-black">
                Size Guide
              </p>
              <h2 id="size-guide-title" className="mt-1 text-xs font-semibold uppercase tracking-wide text-gray-500">
                {sizeGuide.name}
              </h2>
            </div>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close size guide"
            className="rounded-full border border-gray-200 p-2 text-gray-600 transition hover:border-enugu-black hover:text-enugu-black"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 sm:overflow-visible">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-[3fr_2fr]">
            <div>
              <p className="mb-3 text-sm font-bold uppercase tracking-[0.1em] text-enugu-black">
                Size Chart
              </p>
              {showMeasurements ? (
                <div className="overflow-hidden rounded-xl border border-gray-200">
                  <table className="w-full border-collapse text-base">
                    <thead>
                      <tr className="bg-enugu-black text-white">
                        <th className="px-3 py-3.5 text-left text-xs font-bold uppercase tracking-wider">
                          Size
                        </th>
                        {sizes.map((size) => (
                          <th
                            key={size}
                            className="px-2 py-3.5 text-center text-xs font-bold uppercase tracking-wider"
                          >
                            {size}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {MEASUREMENT_FIELDS.map(({ key, label }, rowIndex) => (
                        <tr
                          key={key}
                          className={`border-t border-gray-100 ${rowIndex % 2 === 1 ? 'bg-gray-50' : 'bg-white'}`}
                        >
                          <td className="px-3 py-3.5 text-sm font-semibold text-enugu-black">
                            {label}
                          </td>
                          {sizes.map((size, sizeIndex) => (
                            <td
                              key={`${key}-${size}`}
                              className="px-2 py-3.5 text-center text-base font-semibold text-gray-900"
                            >
                              {measurements[key]?.[sizeIndex] ?? '—'}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700">
                  Size guide image unavailable. Please refer to the measurement chart below.
                </div>
              )}
              <p className="mt-3 text-xs text-gray-500">All measurements are in inches.</p>
            </div>

            <div className="md:border-l md:border-gray-200 md:pl-6">
              <p className="mb-3 text-sm font-bold uppercase tracking-[0.1em] text-enugu-black">
                How To Measure
              </p>
              <MeasureIllustrations compact />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SizeGuideModal;
