import Image from 'next/image';
import { useState, useEffect } from 'react';

interface PreviewImageProps {
  src: string
  alt: string
  width?: number
  height?: number
}

interface RemoteImageProps {
  src: string
  alt: string
  fallback?: any
}

export function PreviewImage({ src, width, height, alt, ...rest }: PreviewImageProps) {
  return (
    <img src={src} alt={alt} />
  );
}

export function RemoteImage({ src, alt, fallback, ...rest }: RemoteImageProps) {
  const [_src, setSrc] = useState<string>();
  const [hasError, setHasError] = useState<any>();

  useEffect(() => {
    async function getImage() {
      const endpoint = process.env.API_HOST ? `${process.env.API_HOST}/storage/file` : 'http://localhost:3006/storage/file';

      return await fetch(`${endpoint}/${src}`);
    }
    getImage().then((res) => {
      setSrc(res.url);
    });
  }, [src, _src, setSrc]);

  if (hasError && fallback) {
    return fallback;
  }

  return (
    <img src={_src} alt={alt} {...rest} onError={onError} />
  );

  function onError() {
    setHasError(true);
  }
}
