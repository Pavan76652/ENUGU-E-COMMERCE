import { useMemo, useState } from 'react';
import { getImageTypeLabel, sortProductImages } from '../../utils/imageHelpers';

const ImageGallery = ({ images = [], productName }) => {
  const gallery = useMemo(() => {
    const sorted = sortProductImages(images).filter((img) => img.url);
    return sorted.length ? sorted : [{ url: '', alt: productName, type: 'front_view' }];
  }, [images, productName]);

  const [activeIndex, setActiveIndex] = useState(0);
  const active = gallery[activeIndex] ?? gallery[0];

  return (
    <div className="lg:col-span-7">
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
        {active?.url ? (
          <img
            src={active.url}
            alt={active.alt || productName}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-gray-400">
            No image available
          </div>
        )}
        {active?.type && active?.url && (
          <span className="absolute bottom-3 left-3 rounded bg-black/60 px-2 py-1 text-[10px] font-medium uppercase tracking-wider text-white">
            {getImageTypeLabel(active.type)}
          </span>
        )}
      </div>

      {gallery.length > 1 && (
        <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-5">
          {gallery.map((img, index) => (
            <button
              key={img.publicId || `${img.url}-${index}`}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`relative aspect-square overflow-hidden border-2 transition ${
                index === activeIndex
                  ? 'border-enugu-black'
                  : 'border-transparent opacity-70 hover:opacity-100'
              }`}
            >
              <img src={img.url} alt="" className="h-full w-full object-cover" loading="lazy" />
              {img.type && (
                <span className="absolute bottom-0 left-0 right-0 bg-black/55 px-1 py-0.5 text-[8px] font-medium uppercase text-white">
                  {getImageTypeLabel(img.type).split(' ')[0]}
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
