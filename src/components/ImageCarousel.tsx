'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageCarouselProps {
    images: string[];
    alt: string;
}

export default function ImageCarousel({ images, alt }: ImageCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);

    const minSwipeDistance = 50;

    if (!images || images.length === 0) {
        return (
            <div className="w-full h-[300px] md:h-[500px] bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl flex items-center justify-center text-gray-500 shadow-lg">
                <div className="text-center">
                    <p className="text-lg font-semibold">Sem fotos disponíveis</p>
                </div>
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
        <div className="w-full space-y-4">
            {/* Main Image Container */}
            <div 
                className="relative w-full aspect-video md:aspect-[16/9] overflow-hidden rounded-2xl shadow-2xl bg-black group"
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
            >
                {/* Image */}
                <img
                    src={images[currentIndex]}
                    alt={`${alt} - Foto ${currentIndex + 1}`}
                    className="w-full h-full object-cover transition-transform duration-300 ease-in-out"
                />

                {/* Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20 pointer-events-none" />

                {/* Navigation Arrows */}
                {images.length > 1 && (
                    <>
                        <button
                            onClick={prevSlide}
                            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white backdrop-blur-sm p-2 md:p-3 rounded-full text-gray-900 shadow-lg opacity-0 md:opacity-100 group-hover:opacity-100 transition-all duration-200 hover:scale-110 z-20"
                            aria-label="Foto anterior"
                        >
                            <ChevronLeft size={24} strokeWidth={3} />
                        </button>
                        <button
                            onClick={nextSlide}
                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white backdrop-blur-sm p-2 md:p-3 rounded-full text-gray-900 shadow-lg opacity-0 md:opacity-100 group-hover:opacity-100 transition-all duration-200 hover:scale-110 z-20"
                            aria-label="Próxima foto"
                        >
                            <ChevronRight size={24} strokeWidth={3} />
                        </button>
                    </>
                )}

                {/* Counter Badge */}
                <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase shadow-lg">
                    {currentIndex + 1} / {images.length}
                </div>
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
                <div className="flex gap-2 md:gap-3 overflow-x-auto pb-2 scroll-smooth">
                    {images.map((image, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`relative shrink-0 h-20 md:h-24 aspect-video rounded-lg overflow-hidden transition-all duration-300 border-2 ${
                                currentIndex === index
                                    ? 'border-blue-600 shadow-lg scale-105 ring-2 ring-blue-400'
                                    : 'border-gray-300 opacity-60 hover:opacity-100 hover:border-gray-400'
                            }`}
                        >
                            <img
                                src={image}
                                alt={`Thumbnail ${index + 1}`}
                                className="w-full h-full object-cover"
                            />
                            {currentIndex === index && (
                                <div className="absolute inset-0 bg-blue-500/10 pointer-events-none" />
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
