import { Button, Text, UnstyledButton } from "@mantine/core";
import { Mic, Square } from "lucide-react";

interface VoiceInputButtonProps {
  disabled?: boolean;
  idleLabel?: string;
  isListening: boolean;
  onClick: () => void;
  variant?: "compact" | "hero";
}

export function VoiceInputButton({
  disabled,
  idleLabel = "Voice",
  isListening,
  onClick,
  variant = "compact",
}: VoiceInputButtonProps) {
  if (variant === "hero") {
    return (
      <UnstyledButton
        aria-label={isListening ? "Stop voice input" : "Start voice input"}
        className={`suyle-ai-voice-hero${isListening ? " is-listening" : ""}${disabled ? " is-disabled" : ""}`}
        disabled={disabled}
        onClick={onClick}
      >
        <span className="suyle-ai-voice-hero__circle" aria-hidden="true">
          {isListening ? <Square size={24} /> : <Mic size={30} />}
        </span>
        <span className="suyle-ai-voice-hero__copy">
          <Text fw={800} size="sm">
            {isListening ? "Listening..." : "Tap to speak"}
          </Text>
          <Text c="dimmed" size="xs">
            {isListening ? "Tap again to stop" : "Say it and we will translate it"}
          </Text>
        </span>
      </UnstyledButton>
    );
  }

  return (
    <Button
      color={isListening ? "red" : "gray"}
      disabled={disabled}
      leftSection={isListening ? <Square size={14} /> : <Mic size={16} />}
      radius="xl"
      size="sm"
      variant={isListening ? "filled" : "default"}
      styles={{
        root: {
          minHeight: 44,
          borderColor: isListening ? "transparent" : "rgba(15, 23, 42, 0.08)",
          fontWeight: 700,
          paddingInline: 16,
        },
      }}
      onClick={onClick}
    >
      {isListening ? "Listening" : idleLabel}
    </Button>
  );
}
