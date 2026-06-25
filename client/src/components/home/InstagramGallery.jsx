import env from '../../config/env';
import { INSTAGRAM_POSTS } from '../../constants/homeData';
import SectionHeader from './SectionHeader';
import Animate from './Animate';

const InstagramGallery = () => (
  <section className="border-t border-gray-100 bg-gray-50 py-14 sm:py-20">
    <div className="enugu-container">
      <Animate>
        <SectionHeader
          eyebrow="Community"
          title="@enuguofficial"
          subtitle="Tag us in your fits. Get featured on our page."
          align="center"
        />
      </Animate>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-6">
        {INSTAGRAM_POSTS.map((post, index) => (
          <Animate key={post.id} delay={index * 60}>
            <a
              href={env.instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="group relative block aspect-square overflow-hidden bg-gray-200"
            >
              <img
                src={post.image}
                alt={post.alt}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:opacity-80"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-enugu-black/0 transition-colors duration-300 group-hover:bg-enugu-black/40">
                <svg
                  className="h-6 w-6 scale-0 text-enugu-white transition-transform duration-300 group-hover:scale-100"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </div>
            </a>
          </Animate>
        ))}
      </div>

      <Animate delay={200}>
        <p className="mt-8 text-center">
          <a
            href={env.instagramUrl}
            target="_blank"
            rel="noreferrer"
            className="text-xs font-medium uppercase tracking-[0.2em] text-enugu-black transition hover:text-enugu-gold"
          >
            Follow on Instagram →
          </a>
        </p>
      </Animate>
    </div>
  </section>
);

export default InstagramGallery;
