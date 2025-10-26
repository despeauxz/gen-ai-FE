"use client"

import { useState } from "react";

export default function useChatDatabase() {
	const [messages, setMessages] = useState([]);
	const [experiments, setExperiments] = useState([]);

	const addUserMessage = (text) => {
		const msg = {
			id: crypto.randomUUID(),
			sender: "user",
			text,
			timestamp: new Date().toISOString(),
		};
		setMessages((prev) => [...prev, msg]);
		return msg;
	};

	const createExperiment = (prompt, parameters, responses) => {
		const now = new Date().toISOString();
		const newRecord = {
			id: crypto.randomUUID(),
			prompt,
			parameters,
			responses,
			created_at: now,
			updated_at: now,
			sender: "assistant",
		};
		
		// Save as both experiment and message
		setExperiments((prev) => [...prev, newRecord]);
		setMessages((prev) => [...prev, {
			id: newRecord.id,
			sender: "assistant",
			experiment: newRecord,
			timestamp: now,
		}]);
		
		return newRecord;
	};

	const deleteExperiment = (id) => {
		setExperiments((prev) => prev.filter((x) => x.id !== id));
		setMessages((prev) => prev.filter((x) => x.id !== id));
	};

	const clearAll = () => {
		setMessages([]);
		setExperiments([]);
	};

	return {
		messages,
		experiments,
		addUserMessage,
		createExperiment,
		deleteExperiment,
		clearAll,
	};
}