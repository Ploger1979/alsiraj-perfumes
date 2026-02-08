"use client";

import { useState, useEffect } from 'react';

const images = [
    "https://images.unsplash.com/photo-1615634260167-c8cdede054de?q=80&w=2000&auto=format&fit=crop",
    "/images/hero/hero-seite-bild-1.webp",
    "/images/hero/hero-seite-bild-2.webp",
    "/images/hero/hero-seite-bild-3.jpg",
    "/images/hero/hero-seite-bild-4.jpg",
    "/images/hero/hero-seite-bild-5.jpg",
    "/images/hero/hero-seite-bild-6.jpg"
];

export default function HeroSlider() {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            zIndex: 0
        }}>
            {/* Dark overlay for text readability - matching the original design */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'linear-gradient(rgba(11, 18, 33, 0.6), rgba(11, 18, 33, 0.8))',
                zIndex: 2,
            }}></div>

            {images.map((src, index) => (
                <div
                    key={index}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        opacity: index === currentIndex ? 1 : 0,
                        transition: 'opacity 1.5s ease-in-out',
                        zIndex: 1
                    }}
                >
                    <img
                        src={src}
                        alt={`Hero Background ${index + 1}`}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                        }}
                    />
                </div>
            ))}
        </div>
    );
}
