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

/** Loads Google's page-translate widget once and renders its picker. Meant
 *  to be embedded inside a small dropdown/panel — it has no positioning or
 *  trigger of its own. */
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
        <>
            {/* Google injects a top banner iframe on translate; keep the page from jumping. */}
            <style>{`.goog-te-banner-frame { display: none !important; } body { top: 0 !important; }`}</style>
            <div id={WIDGET_ID} className="text-[13px]" />
        </>
    );
}
