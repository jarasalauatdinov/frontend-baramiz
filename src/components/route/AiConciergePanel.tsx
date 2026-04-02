import { useState } from "react";
import { BotMessageSquare, Send } from "lucide-react";
import { useChatMutation } from "@/hooks/useRouteGeneration";
import { appConfig } from "@/lib/config";
import { Button } from "@/components/shared/Button";

const suggestionPrompts = [
  "What should I prioritize in Nukus for half a day?",
  "Is Moynaq better for scenic routes or history?",
  "What should I pack for a desert day trip?",
];

export function AiConciergePanel() {
  const [message, setMessage] = useState("");
  const chatMutation = useChatMutation();

  const submit = async (nextMessage?: string) => {
    const resolvedMessage = (nextMessage ?? message).trim();
    if (!resolvedMessage) {
      return;
    }

    setMessage(resolvedMessage);
    await chatMutation.mutateAsync({
      message: resolvedMessage,
      language: appConfig.defaultLanguage,
    });
  };

  return (
    <section className="panel concierge-panel">
      <div className="concierge-panel__header">
        <span className="pill">
          <BotMessageSquare size={16} />
          AI concierge
        </span>
        <h3>Ask for quick travel guidance without leaving the flow.</h3>
        <p>
          This panel uses the backend chat endpoint, so the frontend stays thin while the
          assistant logic remains server-owned.
        </p>
      </div>

      <div className="meta-row">
        {suggestionPrompts.map((prompt) => (
          <button
            key={prompt}
            type="button"
            className="tag tag-button"
            onClick={() => void submit(prompt)}
          >
            {prompt}
          </button>
        ))}
      </div>

      <div className="form-grid">
        <label className="input-label">
          Your question
          <textarea
            className="text-area"
            value={message}
            placeholder="Ask about packing, timing, city priorities, or local expectations."
            onChange={(event) => setMessage(event.target.value)}
          />
        </label>
        <Button
          variant="accent"
          type="button"
          disabled={chatMutation.isPending}
          onClick={() => void submit()}
        >
          <Send size={16} />
          {chatMutation.isPending ? "Thinking..." : "Ask Baramiz AI"}
        </Button>
      </div>

      {chatMutation.data ? (
        <div className="concierge-panel__reply">
          <span className="eyebrow">AI response</span>
          <p>{chatMutation.data.reply}</p>
          {chatMutation.data.suggestions?.length ? (
            <div className="meta-row">
              {chatMutation.data.suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  className="tag tag-button"
                  onClick={() => void submit(suggestion)}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
