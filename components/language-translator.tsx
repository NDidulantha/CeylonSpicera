"use client";

import { useEffect } from "react";

declare global {
    interface Window {
        google?: { translate?: { TranslateElement: new (options: object, id: string) => void } };
        googleTranslateElementInit?: () => void;
    }
}

const WIDGET_ID = "google_translate_element";
const SCRIPT_ID = "google-translate-script";

export default function LanguageTranslator() {
    useEffect(() => {
        if (document.getElementById(SCRIPT_ID)) return;

        window.googleTranslateElementInit = () => {
            if (!window.google?.translate) return;
            new window.google.translate.TranslateElement(
                { pageLanguage: "en", autoDisplay: false },
                WIDGET_ID
            );
        };

        const script = document.createElement("script");
        script.id = SCRIPT_ID;
        script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
        script.async = true;
        document.body.appendChild(script);
    }, []);

    return (
        <div
            className="fixed bottom-24 right-5 z-[60] flex items-center rounded-full border bg-cream px-3 py-1.5 shadow-[0_10px_24px_-10px_rgba(0,0,0,.35)]"
            style={{ borderColor: "#D8C8AE" }}
        >
            {/* Google injects a top banner iframe on translate; keep the page from jumping. */}
            <style>{`.goog-te-banner-frame { display: none !important; } body { top: 0 !important; }`}</style>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#1F3A2A" strokeWidth={1.6} className="mr-1.5 flex-none" aria-hidden>
                <circle cx="12" cy="12" r="9" />
                <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
            </svg>
            <div id={WIDGET_ID} className="text-[12.5px]" />
        </div>
    );
}
