import { Activity } from "lucide-react";
import { getTechIcon } from "@/lib/techIcons";

type Props = {
  label: string;
  statusText: string;
  iconName?: string | null;
  scale?: number;
};

export default function OrbitalCore({ label, statusText, iconName, scale = 1 }: Props) {
  const Icon = getTechIcon(iconName);
  return (
    <div className="tech-hub__core" style={{ scale: String(scale), translate: "-50% -50%" }}>
      <div className="tech-hub__core-icon">
        <Icon aria-hidden="true" />
      </div>
      <strong>{label}</strong>
      <span>
        <Activity aria-hidden="true" /> {statusText}
      </span>
    </div>
  );
}
