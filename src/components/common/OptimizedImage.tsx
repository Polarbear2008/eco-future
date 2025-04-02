import { useState, useEffect } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import './OptimizedImage.css';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  width?: number;
  height?: number;
}

// Function to check if the image is from the team directory
const isTeamImage = (src: string): boolean => {
  return src.includes('/images/team/');
};

// Function to get compressed image URL
const getCompressedImageUrl = (src: string, width: number = 400): string => {
  // If it's not a team image or is already a fallback image, return as is
  if (!isTeamImage(src) || src.includes('/logo.png')) {
    return src;
  }

  // For team images, add compression parameters
  // This assumes the images are being served from a path that supports these parameters
  // If using a CDN or image optimization service, adjust accordingly
  try {
    // Extract the base URL and filename
    const url = new URL(src, window.location.origin);
    
    // Add compression query parameters
    url.searchParams.set('w', width.toString());
    url.searchParams.set('q', '80'); // 80% quality is a good balance
    
    return url.toString();
  } catch (error) {
    console.error('Error creating compressed image URL:', error);
    return src; // Return original on error
  }
};

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  fallbackSrc = '/logo.png',
  width = 400,
  height,
}) => {
  const [imgSrc, setImgSrc] = useState<string>(getCompressedImageUrl(src, width));
  const [isLoaded, setIsLoaded] = useState(false);

  // Update image source if the prop changes
  useEffect(() => {
    setImgSrc(getCompressedImageUrl(src, width));
  }, [src, width]);

  const containerClassName = `image-container ${isLoaded ? 'loaded' : 'loading'} ${className}`;

  return (
    <div className={containerClassName}>
      <LazyLoadImage
        src={imgSrc}
        alt={alt}
        effect="blur"
        width={width}
        height={height}
        threshold={100}
        onError={() => {
          console.error(`Failed to load image: ${imgSrc}`);
          setImgSrc(fallbackSrc);
        }}
        afterLoad={() => setIsLoaded(true)}
        className={className}
      />
    </div>
  );
};

// Add these styles to your global CSS or create a separate CSS file
// .image-container {
//   position: relative;
//   overflow: hidden;
// }
// .loading {
//   background-color: #f0f0f0;
//   animation: pulse 1.5s infinite;
// }
// @keyframes pulse {
//   0% {
//     opacity: 0.6;
//   }
//   50% {
//     opacity: 1;
//   }
//   100% {
//     opacity: 0.6;
//   }
// }

export default OptimizedImage;
