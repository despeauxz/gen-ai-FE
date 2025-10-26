"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import ChatLayout from "@/components/chat/ChatLayout";
import PromptGrid from "@/components/chat/PromptGrid";
import { useExperiments } from "@/context/ExperimentContext";

export default function Home() {
    const { experiments } = useExperiments();

    const hasConversation = experiments?.length > 0;

    return (
        <div className="flex h-screen w-full bg-white dark:bg-neutral-800">
            <Sidebar />

            {!hasConversation ? (
                <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 min-h-screen">
                    <div className="w-full max-w-4xl flex flex-col items-center justify-center">
                        <div className="w-full mb-8">
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Ask me anything—I'm here to help!
                            </h1>
                            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                                Whatever you need, just ask!
                            </p>
                        </div>
                        <ChatLayout />
                        <PromptGrid />
                    </div>
                </main>
            ) : (
                <ChatLayout />
            )}
        </div>
    );
}