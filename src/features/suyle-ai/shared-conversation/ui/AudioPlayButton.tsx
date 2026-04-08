import { Button, Loader } from "@mantine/core";
import { Volume2 } from "lucide-react";

interface AudioPlayButtonProps {
  disabled?: boolean;
  isLoading?: boolean;
  onClick: () => void;
}

export function AudioPlayButton({ disabled, isLoading, onClick }: AudioPlayButtonProps) {
  return (
    <Button
      color="gray"
      disabled={disabled || isLoading}
      leftSection={isLoading ? <Loader color="gray" size={14} /> : <Volume2 size={16} />}
      radius="lg"
      size="sm"
      variant="default"
      styles={{
        root: {
          minHeight: 44,
          paddingInline: 16,
          background: "rgba(248, 250, 252, 0.96)",
          borderColor: "rgba(15, 23, 42, 0.08)",
          color: "#334155",
          fontWeight: 700,
        },
      }}
      onClick={onClick}
    >
      Play audio
    </Button>
  );
}
