import React, { useState, useEffect } from 'react';
import PageWrapper from '../components/PageWrapper';
import { useLanguage } from '../context/LanguageContext';
import { EditableText } from '../components/cms/EditableText';
import {EditableImage } from '../components/cms/EditableImage';

const GalleryPage: React.FC = () => {
  const { t } = useLanguage();
  const g = t.galleryPage;

  const images = [
    { id: 'img1', src: 'https://picsum.photos/600/400?random=40', alt: g.alts.img1 },
    { id: 'img2', src: 'https://picsum.photos/600/400?random=41', alt: g.alts.img2 },
    { id: 'img3', src: 'https://picsum.photos/600/400?random=42', alt: g.alts.img3 },
    { id: 'img4', src: 'https://picsum.photos/600/400?random=43', alt: g.alts.img4 },
    { id: 'img5', src: 'https://picsum.photos/600/400?random=44', alt: g.alts.img5 },
    { id: 'img6', src: 'https://picsum.photos/600/400?random=45', alt: g.alts.img6 },
    { id: 'img7', src: 'https://picsum.photos/600/400?random=46', alt: g.alts.img7 },
    { id: 'img8', src: 'https://picsum.photos/600/400?random=47', alt: g.alts.img8 },
    { id: 'img9', src: 'https://picsum.photos/600/400?random=48', alt: g.alts.img9 },
  ];
  
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => {
    document.body.style.overflow = 'hidden';
    setSelectedImageIndex(index);
  };

  const closeLightbox = () => {
    document.body.style.overflow = 'auto';
    setSelectedImageIndex(null);
  };

  const showNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((selectedImageIndex + 1) % images.length);
    }
  };

  const showPrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((selectedImageIndex - 1 + images.length) % images.length);
    }
  };
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImageIndex === null) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') showNextImage(e as any);
      if (e.key === 'ArrowLeft') showPrevImage(e as any);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [selectedImageIndex]);

  return (
    <PageWrapper title={g.title}>
      <EditableText
        id="gallery-intro"
        defaultContent={g.intro}
        tag="p"
        className="mb-12"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((image, index) => (
          <div key={image.id} className="overflow-hidden rounded-lg shadow-md group cursor-pointer" onClick={() => openLightbox(index)}>
            <EditableImage
              id={`gallery-${image.id}`}
              defaultSrc={image.src}
              alt={image.alt}
              className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500 ease-in-out"
            />
          </div>
        ))}
      </div>

      {selectedImageIndex !== null && (
        <div 
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[100] transition-opacity duration-300 animate-fade-in"
            onClick={closeLightbox}
        >
          <button onClick={(e) => { e.stopPropagation(); closeLightbox(); }} className="absolute top-4 right-6 text-white text-5xl font-bold hover:text-brand-gold-light transition-colors" aria-label={g.lightbox.close}>&times;</button>
          
          <button onClick={showPrevImage} className="absolute left-4 sm:left-6 text-white text-4xl p-2 bg-black bg-opacity-30 rounded-full hover:bg-opacity-50 transition-all" aria-label={g.lightbox.prev}>&#10094;</button>

          <EditableImage
            id={`gallery-lightbox-${images[selectedImageIndex].id}`}
            defaultSrc={images[selectedImageIndex].src}
            alt={images[selectedImageIndex].alt}
            className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg shadow-2xl"
          />
          
          <button onClick={showNextImage} className="absolute right-4 sm:right-6 text-white text-4xl p-2 bg-black bg-opacity-30 rounded-full hover:bg-opacity-50 transition-all" aria-label={g.lightbox.next}>&#10095;</button>
        </div>
      )}
    </PageWrapper>
  );
};

export default GalleryPage;