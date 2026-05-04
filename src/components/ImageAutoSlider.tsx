import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

// Fallback images if database is empty
const defaultImages = [
  "https://images.unsplash.com/photo-1518495973542-4542c06a5843?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1472396961693-142e6e269027?q=80&w=2152&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1505142468610-359e7d316be0?q=80&w=2126&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
];

export const ImageAutoSlider = () => {
  const [isPaused, setIsPaused] = useState(false);
  const [images, setImages] = useState<string[]>(defaultImages);

  useEffect(() => {
    const fetchImages = async () => {
      const { data } = await supabase
        .from('galleries')
        .select('image_url')
        .eq('gallery_name', 'UpcomingProjects')
        .order('created_at', { ascending: false });

      if (data && data.length > 0) {
        setImages(data.map(item => item.image_url));
      }
    };

    fetchImages();
  }, []);

  const duplicatedImages = [...images, ...images];

  return (
    <>
      <style>{`
        @keyframes scroll-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .infinite-scroll-container {
          overflow: hidden;
          padding: 1rem 0;
          position: relative;
          width: 100%;
        }

        .infinite-scroll-track {
          display: flex;
          gap: 1rem;
          width: max-content;
          animation: scroll-left 40s linear infinite;
        }

        .infinite-scroll-track.paused,
        .infinite-scroll-track:hover {
          animation-play-state: paused;
        }

        .slider-image-item {
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          filter: grayscale(0.2);
        }

        .slider-image-item:hover {
          transform: scale(1.02);
          filter: grayscale(0);
        }
      `}</style>
      
      <div className="w-full bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 border dark:border-gray-700">
        <div className="flex items-center justify-between mb-4 px-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-brand-red rounded-full animate-pulse"></span>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Live Pipeline Preview</h3>
          </div>
          <span className="text-[10px] font-mono text-gray-400 uppercase">{images.length} Assets Active</span>
        </div>

        <div 
          className="relative z-10 w-full overflow-hidden"
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          <div className="infinite-scroll-container">
            <div className={`infinite-scroll-track ${isPaused ? 'paused' : ''}`}>
              {duplicatedImages.map((image, index) => (
                <div
                  key={index}
                  className="slider-image-item flex-shrink-0 w-32 h-32 md:w-48 md:h-48 rounded-lg overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700"
                >
                  <img
                    src={image}
                    alt={`Preview ${index}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
