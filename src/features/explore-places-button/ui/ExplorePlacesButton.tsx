import { Compass } from "lucide-react";
import { Button, type ButtonProps } from "@mantine/core";
import { Link } from "react-router-dom";

interface ExplorePlacesButtonProps extends ButtonProps {
  label: string;
  to?: string;
}

export function ExplorePlacesButton({
  label,
  to = "/places",
  ...props
}: ExplorePlacesButtonProps) {
  return (
    <Button component={Link} to={to} leftSection={<Compass size={16} />} {...props}>
      {label}
    </Button>
  );
}
