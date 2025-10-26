"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner"
import { ScrollArea } from "@/components/ui/scroll-area";
import ChatBubble from "./ChatBubble";
import ChatInput from "./ChatInput";
import { useExperiments } from "@/context/ExperimentContext";
import { usePostData } from "@/lib/queries";


export default function ChatLayout() {
    const toastId = useRef(null);
    const scrollRef = useRef(null);
    const messagesEndRef = useRef(null);
    const { experiments, setExperiments } = useExperiments();
    const [message, setMessage] = useState("");
    const [isOnline, setIsOnline] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState("");

    const { mutate: createExperiment } = usePostData("/experiments", ["get-experiments"]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({
                top: scrollRef.current.scrollHeight,
                behavior: "smooth",
            });
        }
    }, [experiments]);

    useEffect(() => {
        const updateOnlineStatus = () => {
            setIsOnline(navigator.onLine);
        };

        window.addEventListener("online", updateOnlineStatus);
        window.addEventListener("offline", updateOnlineStatus);

        updateOnlineStatus();

        return () => {
            window.removeEventListener("online", updateOnlineStatus);
            window.removeEventListener("offline", updateOnlineStatus);
        };
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [experiments]);

    useEffect(() => {
        if (isOnline && toastId.current) {
            toast.dismiss(toastId.current);
            toastId.current = null;
        }
    }, [isOnline]);

    const handleSubmit = async (params) => {
        if (!message.trim()) return;
        setIsProcessing(true);

        if (!isOnline) {
            if (!toastId.current) {
                toastId.current = toast("No internet connection", {
                    position: "top-right",
                    duration: Infinity, // stay until dismissed
                    description: "We couldn’t connect to Gen Ai. Please check your network connection and try again.",
                    action: {
                        label: "Retry",
                        onClick: () => handleSubmit(params), // retry same call
                    },
                });
                }

            return;
        } else {
            const data = experiments ? experiments : []
            setMessage("");
            setExperiments([...data, { sender: "user", text: message }]);
            setTimeout(async () => {
                try {
                    await createExperiment({
                        prompt: message,
                        parameters: params,
                    }, {
                        onSuccess: (res) => {
                            setExperiments([...data, { sender: "user", text: message }, res?.experiment]);
                        }
                    })
                } catch (err) {
                    setError(err);
                }
                setIsProcessing(false);
            }, 2500);
        }


    };

    const hasExperiments = experiments?.length > 0;

    return (
        <div className="flex flex-col flex-1 relative w-full">
            <ScrollArea ref={scrollRef} className="flex-1 p-6 overflow-y-auto w-full mt-12">
                <div className="flex flex-col space-y-4 max-w-4xl mx-auto">
                    {experiments?.map((exp, i) => (
                        <ChatBubble key={i} exp={exp} />
                    ))}
                    {isProcessing && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="self-start text-gray-400 text-sm px-4"
                        >
                            Thinking...
                        </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </ScrollArea>

            <section className={`${hasExperiments ? "m-6" : ""}`}>
                <ChatInput
                    message={message}
                    setMessage={setMessage}
                    isListening={isListening}
                    isProcessing={isProcessing}
                    isSubmitting={isSubmitting}
                    error={error}
                    onSubmit={handleSubmit}
                />
            </section>
        </div>
    );
}