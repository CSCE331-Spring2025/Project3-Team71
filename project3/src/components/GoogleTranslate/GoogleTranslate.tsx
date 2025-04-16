"use client";
import React, { useEffect, useRef } from "react";

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: any;
  }
}

const GoogleTranslate: React.FC = () => {
  const initializedRef = useRef(false);

  useEffect(() => {
    const initGoogleTranslate = () => {
      if (
        !initializedRef.current &&
        window.google?.translate?.TranslateElement &&
        document.getElementById("google_translate_element")?.children.length === 0
      ) {
        new window.google.translate.TranslateElement(
          { pageLanguage: "en" },
          "google_translate_element"
        );
        initializedRef.current = true;
      }
    };

    window.googleTranslateElementInit = initGoogleTranslate;

    if (!document.getElementById("google-translate-script")) {
      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src =
        "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    } else {
      // Script already in DOM: try initializing again (in case it's ready)
      initGoogleTranslate();
    }
  }, []);

  return <div id="google_translate_element" className="w-full" />;
};

export default GoogleTranslate;
