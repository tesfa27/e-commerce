// Image optimization utility for Cloudinary and other services
export const getOptimizedImage = (url, options = {}) => {
  const {
    width = 400,
    height = 400,
    quality = 'auto',
    format = 'auto',
    crop = 'fill'
  } = options;

  if (!url) return '';

  // Handle Cloudinary URLs
  if (url.includes('cloudinary.com') || url.includes('res.cloudinary.com')) {
    const transformations = `w_${width},h_${height},c_${crop},f_${format},q_${quality}`;
    return url.replace('/upload/', `/upload/${transformations}/`);
  }

  // Handle other CDN URLs or add more services as needed
  return url;
};

// Predefined image sizes for different use cases
export const IMAGE_SIZES = {
  thumbnail: { width: 80, height: 80 },
  card: { width: 400, height: 400 },
  detail: { width: 800, height: 800 },
  zoom: { width: 1200, height: 1200 },
  hero: { width: 1920, height: 1080 }
};

// Helper functions for common use cases
export const getCardImage = (url) => getOptimizedImage(url, IMAGE_SIZES.card);
export const getThumbnailImage = (url) => getOptimizedImage(url, IMAGE_SIZES.thumbnail);
export const getDetailImage = (url) => getOptimizedImage(url, IMAGE_SIZES.detail);
export const getZoomImage = (url) => getOptimizedImage(url, IMAGE_SIZES.zoom);