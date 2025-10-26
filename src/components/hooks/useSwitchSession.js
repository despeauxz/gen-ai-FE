"use client";

import { useState } from "react";
import { useExperiments } from "@/context/ExperimentContext";
import { usePutData, useGetData } from "@/lib/queries";

/**
 * A unified hook to switch sessions cleanly and reliably.
 * Ensures backend current-session update completes before fetching experiments.
 */
export function useSwitchSession() {
    const [isSwitching, setIsSwitching] = useState(false);
    const { setExperiments } = useExperiments();

    // mutation to update the current session on the backend
    const { mutate: updateCurrentSession } = usePutData(
        (session) => `/sessions/${session?.id}/current`,
        ["update-current-session"]
    );

    // lazy fetcher for experiments — called manually, not auto-triggered
    const { refetch: fetchExperiments } = useGetData(
        "", // endpoint will be dynamic
        ["experiments"],
        { enabled: false }
    );

    /**
     * Switches the current session and updates experiments context.
     */
    const switchSession = async (sessionId, options = {}) => {
        if (isSwitching || !sessionId) return;
        setIsSwitching(true);

        try {
        // Step 1: Update current session on backend
            await new Promise((resolve, reject) => {
                updateCurrentSession(
                    { id: sessionId },
                    {
                        onSuccess: resolve,
                        onError: reject,
                    }
                );
            });

            // Step 2: Clear old experiments immediately
            setExperiments([]);

            // Step 3: Fetch new experiments for this session
            const { data: newExp } = await fetchExperiments({
                queryKey: [`/experiments/${sessionId}/sessions`],
            });

            // Step 4: Update context
            if (newExp?.data) {
                setExperiments(newExp.data);
            }

            // Step 5: Optional callback after success
            if (options.onSuccess) options.onSuccess(newExp?.data);
        } catch (err) {
            console.error("Failed to switch session:", err);
            if (options.onError) options.onError(err);
        } finally {
            setIsSwitching(false);
        }
    };

    return { switchSession, isSwitching };
}
