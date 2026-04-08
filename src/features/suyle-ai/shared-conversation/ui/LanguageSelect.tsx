import { Select } from "@mantine/core";
import type { LanguageOption } from "../model/types";

interface LanguageSelectProps<TValue extends string> {
  compact?: boolean;
  data: LanguageOption<TValue>[];
  ariaLabel?: string;
  label?: string;
  value: TValue;
  onChange: (value: TValue) => void;
}

export function LanguageSelect<TValue extends string>({
  compact = false,
  data,
  ariaLabel,
  label,
  value,
  onChange,
}: LanguageSelectProps<TValue>) {
  return (
    <Select
      allowDeselect={false}
      aria-label={ariaLabel ?? label ?? "Language select"}
      checkIconPosition="right"
      comboboxProps={{ withinPortal: false }}
      data={data}
      label={label}
      radius={compact ? "lg" : "xl"}
      size={compact ? "xs" : "sm"}
      styles={{
        dropdown: {
          border: "1px solid rgba(15, 23, 42, 0.08)",
          boxShadow: "0 14px 24px rgba(33, 25, 17, 0.08)",
        },
        input: {
          background: "rgba(255, 255, 255, 0.96)",
          border: "1px solid rgba(15, 23, 42, 0.08)",
          fontSize: compact ? "0.83rem" : "0.9rem",
          fontWeight: 600,
          minHeight: 44,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          boxShadow: compact ? "0 6px 18px rgba(33, 25, 17, 0.04)" : "none",
        },
        label: {
          color: "#6b7280",
          fontSize: compact ? "0.68rem" : "0.72rem",
          fontWeight: 700,
          marginBottom: compact ? 4 : 6,
        },
      }}
      value={value}
      onChange={(nextValue) => {
        if (nextValue) {
          onChange(nextValue as TValue);
        }
      }}
    />
  );
}
