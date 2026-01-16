"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export default function ScrollToTopButton() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener("scroll", toggleVisibility);
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    if (!isVisible) return null;

    return (
        <button
            onClick={scrollToTop}
            style={{
                position: "fixed",
                bottom: "30px",
                right: "30px", // Changed to right for RTL layout convenience or use left based on preference? Usually right in RTL too or left? Let's use left for RTL common pattern opposite to scrollbar? 
                // Actually, common UX is right bottom corner regardless of RTL/LTR usually, but let's stick to Right.
                // Wait, in RTL `right` is `right`. Let's stick to standard `bottom-right` or `bottom-left`.
                // Let's use `left: 30px` to avoid covering the scrollbar if any, or WhatsApp button usually on right.
                // Wait user requested "Top" button. 
                // Let's put it on the Left side to balance checking if there are other floating buttons.
                left: "30px",
                backgroundColor: "var(--color-gold)",
                color: "#000",
                border: "none",
                borderRadius: "50%",
                width: "50px",
                height: "50px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                cursor: "pointer",
                boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
                zIndex: 1000,
                transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            title="العودة للأعلى"
        >
            <ArrowUp size={24} strokeWidth={3} />
        </button>
    );
}
