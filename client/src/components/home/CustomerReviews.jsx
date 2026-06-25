import { REVIEWS } from '../../constants/homeData';
import SectionHeader from './SectionHeader';
import Animate from './Animate';

const StarRating = ({ rating }) => (
  <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
    {Array.from({ length: 5 }).map((_, i) => (
      <svg
        key={i}
        className={`h-3.5 w-3.5 ${i < rating ? 'text-enugu-gold' : 'text-gray-300'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </div>
);

const CustomerReviews = () => (
  <section className="py-14 sm:py-20">
    <div className="enugu-container">
      <Animate>
        <SectionHeader
          eyebrow="Reviews"
          title="What They Say"
          subtitle="Trusted by streetwear enthusiasts across India."
          align="center"
        />
      </Animate>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {REVIEWS.map((review, index) => (
          <Animate key={review.id} delay={index * 100}>
            <blockquote className="flex h-full flex-col border border-gray-100 bg-white p-6 transition-shadow duration-300 hover:shadow-lg sm:p-8">
              <StarRating rating={review.rating} />
              <p className="mt-4 flex-1 text-sm leading-relaxed text-gray-600">&ldquo;{review.text}&rdquo;</p>
              <footer className="mt-6 border-t border-gray-100 pt-4">
                <cite className="not-italic">
                  <span className="text-sm font-medium text-enugu-black">{review.name}</span>
                  <span className="mt-0.5 block text-xs text-gray-400">{review.location}</span>
                </cite>
              </footer>
            </blockquote>
          </Animate>
        ))}
      </div>
    </div>
  </section>
);

export default CustomerReviews;
