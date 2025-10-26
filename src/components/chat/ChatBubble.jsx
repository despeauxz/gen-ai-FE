"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    Card,
    CardHeader,
    CardContent,
} from "@/components/ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
    ChevronDown,
    ChevronUp,
    Sparkles,
} from "lucide-react";
import clsx from "clsx";
import useTypingEffect from "../hooks/useTypingEffect";

const MetricBar = ({ label, value, color }) => {
    return (
        <div>
            <div className="flex justify-between text-xs mb-1">
                <span className="text-foreground font-medium">{label}</span>
                <span className="text-muted-foreground">{value.toFixed(1)}</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                    className={clsx(
                        "h-full rounded-full transition-all duration-500",
                        color === "primary" && "bg-primary",
                        color === "accent" && "bg-accent",
                        color === "secondary" && "bg-secondary"
                    )}
                    style={{ width: `${(value / 5) * 100}%` }}
                />
            </div>
        </div>
    );
};

const ExperienceResponseCard = ({ response, index }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const averageScore = (
        (response.scores.completeness +
            response.scores.coherence +
            response.scores.clarity +
            response.scores.relevance) /
        4
    ).toFixed(1);

    return (
        <Card className="bg-card border-gray-200 shadow-sm overflow-hidden group gap-1 pt-3 pb-2 transition-colors mb-4">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500/90 to-accent/80">
                            <Sparkles className="w-4 h-4 text-primary-foreground" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold text-foreground">
                                    Experience {index + 1}
                                </h3>
                                <Badge
                                    variant="outline"
                                    className="bg-indigo-800/50 text-accent border-accent/30"
                                >
                                    Avg: {averageScore}
                                </Badge>
                            </div>
                            <div className="flex gap-2 text-xs text-muted-foreground">
                                <span>
                                    Temp: {response.parameters.temperature.toFixed(2)}
                                </span>
                                <span>•</span>
                                <span>Top-p: {response.parameters.topP.toFixed(2)}</span>
                                <span>•</span>
                                <span>{response.parameters.model}</span>
                            </div>
                        </div>
                    </div>

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="text-muted-foreground hover:text-foreground"
                    >
                        {isExpanded ? (
                            <ChevronUp className="w-5 h-5" />
                        ) : (
                            <ChevronDown className="w-5 h-5" />
                        )}
                    </Button>
                </div>
            </CardHeader>

            <motion.div
                initial={false}
                animate={{ height: isExpanded ? "auto" : 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
            >
                <CardContent className="space-y-4">
                    {/* Experience Text */}
                    <div className="p-4 rounded-lg bg-muted/50 border border-border">
                        <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                            {response.content}
                        </p>
                    </div>

                    {/* Metrics */}
                    <div className="space-y-3">
                        <h4 className="text-sm font-semibold text-foreground">
                            Evaluation Metrics
                        </h4>
                        <div className="space-y-2">
                            <MetricBar
                                label="Completeness"
                                value={response.scores.completeness}
                                color="primary"
                            />
                            <MetricBar
                                label="Coherence"
                                value={response.scores.coherence}
                                color="accent"
                            />
                            <MetricBar
                                label="Clarity"
                                value={response.scores.clarity}
                                color="secondary"
                            />
                            <MetricBar
                                label="Relevance"
                                value={response.scores.relevance}
                                color="primary"
                            />
                        </div>
                        <div className="text-xs text-gray-600 space-y-1.5 mt-3 py-3 bg-muted/50 rounded-lg">
                            <p>
                                <strong>Completeness:</strong> Measures comprehensive coverage of the user’s intent
                            </p>
                            <p>
                                <strong>Coherence:</strong> Evaluates logical flow and consistency
                            </p>
                            <p>
                                <strong>Clarity:</strong> Assesses readability and precision of expression
                            </p>
                            <p>
                                <strong>Relevance:</strong> Checks how well the response stays on-topic
                            </p>
                        </div>
                    </div>
                </CardContent>
            </motion.div>
        </Card>
    );
}

export default function ChatBubble({ exp, isNew = false }) {
    const { sender, responses } = exp;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className={clsx(
                "max-w-[80%] px-4 py-2 text-sm/7 text-gray-900",
                sender === "user"
                ? "self-end bg-gray-100 rounded-md"
                : "self-start"
            )}
        >
            {sender === "user" ? (
                <p>{exp?.text}</p>
            ) : (
                <>
                    {responses?.map((res, i) => (
                        <ExperienceResponseCard key={i} response={res} index={i} />
                    ))}
                </>
            )}
        </motion.div>
    );
}