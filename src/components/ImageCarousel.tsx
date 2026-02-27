'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

interface ImageCarouselProps {
    images: string[];
    alt: string;
}

export default function ImageCarousel({ images, alt }: ImageCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);

    // Distância mínima para considerar um swipe
    const minSwipeDistance = 50;

    if (!images || images.length === 0) {
        return (
            <div className="w-full h-[300px] md:h-[500px] bg-gray-200 rounded-2xl flex items-center justify-center text-gray-500">
                Sem fotos disponíveis
            </div>
        );
    }

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    };

    const onTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;

        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe) {
            nextSlide();
        } else if (isRightSwipe) {
            prevSlide();
        }
    };

    return (
        <div className="relative group w-full">
            {/* Main Image */}
            <div
                className="relative h-[350px] md:h-[550px] w-full overflow-hidden rounded-2xl shadow-xl bg-gray-100"
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
            >
                <img
                    src={images[currentIndex]}
                    alt={`${alt} - Foto ${currentIndex + 1}`}
                    className="w-full h-full object-cover transition-all duration-700 ease-in-out pointer-events-none"
                />

                {/* Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />

                {/* Navigation Arrows */}
                {images.length > 1 && (
                    <>
                        <button
                            onClick={prevSlide}
                            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-3 rounded-full text-blue-900 shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-blue-600 hover:text-white z-20"
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <button
                            onClick={nextSlide}
                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-3 rounded-full text-blue-900 shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-blue-600 hover:text-white z-20"
                        >
                            <ChevronRight size={24} />
                        </button>
                    </>
                )}

                {/* Counter Badge */}
                <div className="absolute bottom-6 right-6 bg-black/50 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase">
                    {currentIndex + 1} / {images.length}
                </div>
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
                <div className="flex gap-3 mt-4 overflow-x-auto pb-2 scrollbar-hide snap-x">
                    {images.map((image, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`relative shrink-0 w-24 h-20 rounded-xl overflow-hidden snap-start transition-all duration-300 border-2 ${currentIndex === index ? 'border-blue-600 scale-105 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'
                                }`}
                        >
                            <img
                                src={image}
                                alt={`Thumbnail ${index + 1}`}
                                className="w-full h-full object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
