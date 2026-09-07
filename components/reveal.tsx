"use client";

import { useEffect, useRef, useState } from "react";

/* Lightweight fade-up-on-scroll. Not Framer Motion — a single
   IntersectionObserver + CSS transition. Reused across sections. */
export default function Reveal({
                                   children,
                                   delay = 0,
                                   className = "",
                               }: {
    children: React.ReactNode;
    delay?: number;
    className?: string;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const [shown, setShown] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const io = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setShown(true);
                    io.disconnect();
                }
            },
            { threshold: 0.15, rootMargin: "0px 0px -10% 0px" },
        );
        io.observe(el);
        return () => io.disconnect();
    }, []);

    return (
        <div
            ref={ref}
            className={`cs-reveal ${shown ? "cs-reveal-in" : ""} ${className}`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            {children}
        </div>
    );
}