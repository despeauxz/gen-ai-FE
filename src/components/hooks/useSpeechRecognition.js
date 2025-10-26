"use client";

import { useEffect, useRef, useState } from "react";

/**
 * useSpeechRecognition Hook
 *
 * Handles browser speech-to-text with live transcription and voice state management.
 *
 * Usage:
 * const {
 *   transcript,
 *   isListening,
 *   isSupported,
 *   error,
 *   startListening,
 *   stopListening,
 *   resetTranscript
 * } = useSpeechRecognition({ lang: "en-US" });
 */


export default function useSpeechRecognition() {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState("");
    const [error, setError] = useState(null);
    const recognitionRef = useRef(null);

    useEffect(() => {
        if (typeof window === "undefined") return;

        const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            setError("Speech recognition not supported in this browser.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = "en-US";
        recognition.continuous = false;
        recognition.interimResults = true;

        recognition.onstart = () => {
            setIsListening(true);
            setError(null);
            setTranscript("");
        };

        recognition.onerror = (e) => {
            setError(e.error || "Speech recognition error");
            setIsListening(false);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognition.onresult = (event) => {
            let interimTranscript = "";
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    setTranscript(event.results[i][0].transcript.trim());
                } else {
                    interimTranscript += event.results[i][0].transcript;
                }
            }
        };

        recognitionRef.current = recognition;
        return () => recognition.stop();
    }, []);

    const startListening = () => {
        try {
            recognitionRef.current?.start();
        } catch (err) {
            console.error(err);
            setError("Failed to start speech recognition.");
        }
    };

    const stopListening = () => {
        recognitionRef.current?.stop();
    };

    const confirmTranscript = () => {
        stopListening();
    };

    const cancelTranscript = () => {
        stopListening();
        setTranscript("");
    };

    return {
        isListening,
        transcript,
        error,
        startListening,
        stopListening,
        confirmTranscript,
        cancelTranscript,
    };
}
