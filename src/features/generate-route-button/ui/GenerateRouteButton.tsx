import { Sparkles } from "lucide-react";
import { Button, type ButtonProps } from "@mantine/core";
import { Link } from "react-router-dom";
import { useI18n } from "@/shared/i18n/provider";

interface GenerateRouteButtonProps extends ButtonProps {
  label?: string;
  to?: string;
}

export function GenerateRouteButton({
  label,
  to = "/route",
  ...props
}: GenerateRouteButtonProps) {
  const { t } = useI18n();

  return (
    <Button component={Link} to={to} leftSection={<Sparkles size={16} />} {...props}>
      {label ?? t("common.actions.buildRoute")}
    </Button>
  );
}
