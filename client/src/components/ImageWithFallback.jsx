import { useState } from 'react';
import placeholder from '../assets/medicine-placeholder.svg';

const ImageWithFallback = ({ src, alt = '', className = '', fallbackSrc = placeholder, ...props }) => {
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) setHasError(true);
  };

  return (
    <img
      src={!src || hasError ? fallbackSrc : src}
      alt={alt}
      className={className}
      onError={handleError}
      {...props}
    />
  );
};

export default ImageWithFallback;
