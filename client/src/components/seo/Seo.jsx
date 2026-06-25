import { Helmet } from 'react-helmet-async';

const Seo = ({
  title,
  description,
  canonical,
  image,
  keywords,
  noindex = false,
  openGraph = {},
  jsonLd,
}) => (
  <Helmet>
    <title>{title}</title>
    <meta name="description" content={description} />
    {keywords && <meta name="keywords" content={keywords} />}
    {canonical && <link rel="canonical" href={canonical} />}
    {noindex && <meta name="robots" content="noindex,nofollow" />}

    <meta property="og:title" content={openGraph.title || title} />
    <meta property="og:description" content={openGraph.description || description} />
    <meta property="og:type" content={openGraph.type || 'website'} />
    {openGraph.url && <meta property="og:url" content={openGraph.url} />}
    {(openGraph.image || image) && (
      <meta property="og:image" content={openGraph.image || image} />
    )}
    {openGraph.siteName && <meta property="og:site_name" content={openGraph.siteName} />}

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={openGraph.title || title} />
    <meta name="twitter:description" content={openGraph.description || description} />
    {(openGraph.image || image) && (
      <meta name="twitter:image" content={openGraph.image || image} />
    )}

    {jsonLd && (
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
    )}
  </Helmet>
);

export default Seo;
