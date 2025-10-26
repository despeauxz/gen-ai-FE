"use client";
import { PencilLine, Lightbulb, Code, GraduationCap } from "lucide-react";

const prompts = [
    {
        title: "Writing",
        icon: PencilLine,
        desc: "Elevate your writing with seamless creation tools and style refinement.",
    },
    {
        title: "Research & Analysis",
        icon: Lightbulb,
        desc: "Discover, analyze, interpret, and present information with clarity.",
    },
    {
        title: "Programming",
        icon: Code,
        desc: "Develop robust code, test thoroughly, and expand your expertise.",
    },
    {
        title: "Learning Skills",
        icon: GraduationCap,
        desc: "Explore innovation, evolve ideas, and expand your skills.",
    },
];

export default function PromptGrid() {
    return (
        <div className="mt-12 w-full">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-center">
                Explore by ready prompt
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {prompts.map((item, i) => {
                    const Icon = item.icon;

                    return (
                        <div
                            key={i}
                            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 cursor-pointer transition-all hover:shadow-sm"
                        >
                            <Icon
                                className={`size-6 mb-8 ${
                                i === 0
                                    ? "text-green-400"
                                    : i === 3
                                    ? "text-[#6466ee]"
                                    : "text-amber-400"
                                }`}
                            />
                            <h3 className="font-medium text-sm text-gray-900 dark:text-white mb-2">
                                {item.title}
                            </h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                {item.desc}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
