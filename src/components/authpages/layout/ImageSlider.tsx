// src/components/authpages/layout/ImageSlider.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './ImageSlider.module.css';

const images = [
  {
    src: '/images/slides/slide1.png',
    alt: 'Welcome'
  },
  {
    src: '/images/slides/slide2.png',
    alt: 'Welcome'
  },
  {
    src: '/images/slides/slide3.jpg',
    alt: 'Welcome'
  }
  // Add more images here once you have them
];

export default function ImageSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className={styles.slider}>
      {images.map((image, index) => (
        <div
          key={image.src}
          className={`${styles.slide} ${index === currentIndex ? styles.active : ''}`}
        >
          <div className={styles.imageWrapper}>
            <Image
              src={image.src}
              alt={image.alt}
              fill
              priority={index === 0}
              style={{ objectFit: 'cover' }}
              quality={75}
            />
          </div>
        </div>
      ))}
    </div>
  );
}