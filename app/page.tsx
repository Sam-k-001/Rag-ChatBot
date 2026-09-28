"use client";

import Image from "next/image";
import { useChat } from "ai/react";
import Bubble from "./components/Bubble";
import LoadingBubble from "./components/LoadingBubble";
import PromptSuggestionsRow from "./components/PromptSuggestionRow";

export default function Home() {
  const { append, isLoading, messages, input, handleInputChange, handleSubmit } = useChat();

  const noMessages = !messages || messages.length === 0;

  const handlePrompt = (promptText: string) => {
    append({
      id: crypto.randomUUID(),
      content: promptText,
      role: "user",
    });
  };

  return (
    <main>
      <h2>F1 RAG ChatBot</h2>
      <section className={noMessages ? "" : "populated"}>
        {noMessages ? (
          <>
            <p className="starter-text">
              Ask F1 GPT anything about F1 racing. In test mode, this responds instantly with a simulated stream.
            </p>
            <PromptSuggestionsRow onPromptClick={handlePrompt} />
          </>
        ) : (
          <>
            {messages.map((message, index) => (
              <Bubble key={`msg-${index}`} message={message} />
            ))}
            {isLoading && <LoadingBubble />}
          </>
        )}
      </section>

      <form onSubmit={handleSubmit}>
        <input
          className="question-box"
          onChange={handleInputChange}
          value={input}
          placeholder="Ask me something about F1..."
        />
        <input type="submit" value="Send" />
      </form>
    </main>
  );
}