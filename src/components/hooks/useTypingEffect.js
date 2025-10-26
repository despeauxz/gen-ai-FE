"use client";
import { useEffect, useState, useRef } from "react";

export default function useTypingEffect(text, speed = 30) {
    const [displayed, setDisplayed] = useState("");
    const intervalRef = useRef(null);

    useEffect(() => {
        // Stop if text is empty or null
        if (!text || text.length === 0) {
            setDisplayed("");
            return;
        }

        // Clear any running interval before starting new
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        // Reset the displayed text fully before typing starts
        setDisplayed("");

        let index = 0;

        intervalRef.current = setInterval(() => {
            setDisplayed((prev) => {
                const next = text.slice(0, index + 1);
                index++;

                if (index >= text.length) {
                    clearInterval(intervalRef.current);
                }

                return next;
            });
        }, speed);

        // Cleanup on unmount or when text changes
        return () => {
            clearInterval(intervalRef.current);
        };
    }, [text, speed]);

    return displayed;
}
