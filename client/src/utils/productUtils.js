export const getCoverImage = (product) => {
  if (product.image) return product.image;
  const cover = product.images?.find((img) => img.isCover);
  return cover?.url ?? product.images?.[0]?.url ?? '';
};

export const normalizeProduct = (product) => {
  const sizeGuide =
    product.sizeGuide ??
    (product.sizeGuideId && typeof product.sizeGuideId === 'object' ? product.sizeGuideId : null);

  return {
    ...product,
    id: product.id ?? product._id,
    price: product.sellingPrice ?? product.price,
    image: getCoverImage(product),
    metaTitle: product.metaTitle,
    metaDescription: product.metaDescription,
    slug: product.slug,
    sizeGuide,
    discountPercentage:
      product.discountPercentage ??
      (product.mrp
        ? Math.round(((product.mrp - (product.sellingPrice ?? product.price)) / product.mrp) * 100)
        : 0),
  };
};
