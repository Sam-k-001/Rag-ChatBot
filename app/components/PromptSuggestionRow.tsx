import PromptSuggestionButton from "./PromptSuggestionButton";

export default function PromptSuggestionsRow({
  onPromptClick,
}: {
  onPromptClick: (text: string) => void;
}) {
  const prompts = [
    "Who is the current Formula 1 World Drivers Champion?",
    "Who is the highest paid F1 driver?",
    "Who will be the newest driver for Ferrari?",
    "Tell me about recent Formula 1 seasons",
  ];

  return (
    <div className="prompt-suggestion-row">
      {prompts.map((prompt, index) => (
        <PromptSuggestionButton
          key={`prompt-${index}`}
          text={prompt}
          onClick={() => onPromptClick(prompt)}
        />
      ))}
    </div>
  );
}