const StarRating = ({ rating }) => (
  <div className="flex gap-0.5">
    {Array.from({ length: 5 }).map((_, i) => (
      <svg
        key={i}
        className={`h-4 w-4 ${i < Math.round(rating) ? 'text-enugu-gold' : 'text-gray-300'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </div>
);

const ProductReviews = ({ reviews = [], rating = 0, count = 0 }) => (
  <div className="mt-10 border-t border-gray-100 pt-8">
    <div className="flex items-center justify-between">
      <h2 className="text-xs font-medium uppercase tracking-[0.2em] text-enugu-black">Reviews</h2>
      {count > 0 && (
        <div className="flex items-center gap-2">
          <StarRating rating={rating} />
          <span className="text-sm text-gray-500">({count})</span>
        </div>
      )}
    </div>

    <div className="mt-6 space-y-4">
      {reviews.map((review) => (
        <div key={review.id} className="border border-gray-100 p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-enugu-black">{review.name}</p>
            <StarRating rating={review.rating} />
          </div>
          {review.date && (
            <p className="mt-1 text-xs text-gray-400">{review.date}</p>
          )}
          <p className="mt-2 text-sm leading-relaxed text-gray-600">&ldquo;{review.text}&rdquo;</p>
        </div>
      ))}
    </div>
  </div>
);

export default ProductReviews;
