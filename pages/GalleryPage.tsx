import React, { useState, useEffect } from 'react';
import PageWrapper from '../components/PageWrapper';
import { useLanguage } from '../context/LanguageContext';
import { EditableText } from '../components/cms/EditableText';
import {EditableImage } from '../components/cms/EditableImage';
import { apiService } from '../src/services/api';

const GalleryPage: React.FC = () => {
  const { t, getTranslation } = useLanguage();
  const [images, setImages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load gallery images from database
  useEffect(() => {
    const loadGalleryImages = async () => {
      try {
        setIsLoading(true);
        const galleryImages = await apiService.getImagesByPage('gallery');
        console.log('📸 Loading gallery images:', galleryImages);
        
        // Sort by position (extracted from ID) or created_at
        const sortedImages = galleryImages.sort((a, b) => {
          const posA = parseInt(a.id.replace('gallery-img', '')) || 0;
          const posB = parseInt(b.id.replace('gallery-img', '')) || 0;
          return posA - posB;
        }).map(img => ({
          id: img.id,
          src: img.url,
          alt: img.alt_text || t.galleryPage?.alts?.[img.id] || 'Gallery image'
        }));
        
        setImages(sortedImages);
      } catch (error) {
        console.error('❌ Failed to load gallery images:', error);
        // Fallback to hardcoded images if database fails
        const fallbackImages = [
          { id: 'img1', src: 'https://picsum.photos/600/400?random=40', alt: t.galleryPage?.alts?.img1 || 'Educational process' },
          { id: 'img2', src: 'https://picsum.photos/600/400?random=41', alt: t.galleryPage?.alts?.img2 || 'Sports day' },
          { id: 'img3', src: 'https://picsum.photos/600/400?random=42', alt: t.galleryPage?.alts?.img3 || 'Christmas celebration' },
          { id: 'img4', src: 'https://picsum.photos/600/400?random=43', alt: t.galleryPage?.alts?.img4 || 'Opening of the school year' },
          { id: 'img5', src: 'https://picsum.photos/600/400?random=44', alt: t.galleryPage?.alts?.img5 || 'Art exhibition' },
          { id: 'img6', src: 'https://picsum.photos/600/400?random=45', alt: t.galleryPage?.alts?.img6 || 'Teamwork' },
          { id: 'img7', src: 'https://picsum.photos/600/400?random=46', alt: t.galleryPage?.alts?.img7 || 'Nature trip' },
          { id: 'img8', src: 'https://picsum.photos/600/400?random=47', alt: t.galleryPage?.alts?.img8 || 'Music lesson' },
          { id: 'img9', src: 'https://picsum.photos/600/400?random=48', alt: t.galleryPage?.alts?.img9 || 'Award ceremony' },
        ];
        setImages(fallbackImages);
      } finally {
        setIsLoading(false);
      }
    };

    loadGalleryImages();
  }, [t.galleryPage?.alts]);
  
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
    <PageWrapper title={t.galleryPage?.title || 'Gallery'}>
      <EditableText
        id="gallery-intro"
        defaultContent={t.galleryPage?.intro || 'Browse moments from life at our school.'}
        tag="p"
        className="mb-12"
      />
      
      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-500 mt-2">Loading gallery images...</p>
        </div>
      ) : (
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
          
          {images.length === 0 && (
            <div className="col-span-full text-center py-12 bg-gray-50 rounded-lg">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No gallery images</h3>
              <p className="mt-1 text-sm text-gray-500">Images will appear here once added through the CMS.</p>
            </div>
          )}
        </div>
      )}

      {selectedImageIndex !== null && (
        <div 
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[100] transition-opacity duration-300 animate-fade-in"
            onClick={closeLightbox}
        >
          <button onClick={(e) => { e.stopPropagation(); closeLightbox(); }} className="absolute top-4 right-6 text-white text-5xl font-bold hover:text-brand-gold-light transition-colors" aria-label={t.galleryPage?.lightbox?.close || 'Close'}>&times;</button>
          
          <button onClick={showPrevImage} className="absolute left-4 sm:left-6 text-white text-4xl p-2 bg-black bg-opacity-30 rounded-full hover:bg-opacity-50 transition-all" aria-label={t.galleryPage?.lightbox?.prev || 'Previous image'}>&#10094;</button>

          <EditableImage
            id={`gallery-lightbox-${images[selectedImageIndex].id}`}
            defaultSrc={images[selectedImageIndex].src}
            alt={images[selectedImageIndex].alt}
            className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg shadow-2xl"
          />
          
          <button onClick={showNextImage} className="absolute right-4 sm:right-6 text-white text-4xl p-2 bg-black bg-opacity-30 rounded-full hover:bg-opacity-50 transition-all" aria-label={t.galleryPage?.lightbox?.next || 'Next image'}>&#10095;</button>
        </div>
      )}
    </PageWrapper>
  );
};

export default GalleryPage;