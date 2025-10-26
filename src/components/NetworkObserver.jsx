"use client"

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react"; // optional: lucide icon

const NetworkObserver = () => {
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    const updateOnlineStatus = () => setIsOnline(navigator.onLine);

    useEffect(() => {
        window.addEventListener("online", updateOnlineStatus);
        window.addEventListener("offline", updateOnlineStatus);

        return () => {
            window.removeEventListener("online", updateOnlineStatus);
            window.removeEventListener("offline", updateOnlineStatus);
        };
    }, []);

    return (
        <AnimatePresence>
            {!isOnline && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="fixed bottom-0 left-0 right-0 z-50 bg-black text-white font-medium text-sm px-4 py-2 flex items-center justify-center gap-2 shadow-md"
                >
                <Loader2 className="animate-spin h-4 w-4 text-yellow-400" />
                No internet connection
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default NetworkObserver;