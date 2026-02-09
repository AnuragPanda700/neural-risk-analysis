import React, { useRef, useEffect, useState } from 'react';

const FocusSection = ({ children, id, className = "" }) => {
    const ref = useRef(null);
    const [isFocused, setIsFocused] = useState(false);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    // Calculate closeness to center
                    // We define "focused" as being roughly in the middle 50% of the screen
                    // or simply having a high intersection ratio if it's a tall element.

                    // Alternatively, simply check isIntersecting with a high threshold for "Center" feel,
                    // but for true "Center Focus" (Apple style), we often want to know if it's the *most* visible one.

                    // Simplified logic based on USER SPEC: 
                    // "active" means it's effectively the main thing on screen.
                    // Let's use a threshold. If > 50% visible, it's focused.
                    // Or we can refine this to be more dynamic based on the prompt's request for "Center of the screen".

                    const rect = entry.boundingClientRect;
                    const windowHeight = window.innerHeight;
                    const elementCenter = rect.top + rect.height / 2;
                    const windowCenter = windowHeight / 2;

                    // Calculate distance from center
                    const distanceFromCenter = Math.abs(windowCenter - elementCenter);

                    // Define a "sweet spot" range (e.g., within 300px of center)
                    const isCentered = distanceFromCenter < (windowHeight * 0.35) && entry.isIntersecting;

                    setIsFocused(isCentered);
                });
            },
            {
                threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
                rootMargin: "-10% 0px -10% 0px" // Shrink the active area slightly to force "center" focus
            }
        );

        observer.observe(element);
        return () => observer.disconnect();
    }, []);

    return (
        <div
            id={id}
            ref={ref}
            className={`transition-all duration-700 ease-out transform will-change-transform ${className}
        ${isFocused
                    ? 'blur-0 opacity-100 scale-100'
                    : 'blur-md opacity-40 scale-95'
                }`}
        >
            {children}
        </div>
    );
};

export default FocusSection;
