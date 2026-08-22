import type { OrbitalPosition } from "@/lib/orbitalLayout";
import { getTechIcon } from "@/lib/techIcons";
import type { OrbitalTechnology } from "@/hooks/usePublicData";

type Props = {
  tech: OrbitalTechnology;
  position: OrbitalPosition;
  isActive: boolean;
  dimmed: boolean;
  onActivate: (tech: OrbitalTechnology) => void;
  delay: number;
};

export default function OrbitalNode({ tech, position, isActive, dimmed, onActivate, delay }: Props) {
  const Icon = getTechIcon(tech.icon_name);
  const accent = tech.color || undefined;

  return (
    <div
      className="tech-hub__node-position"
      style={{ left: `${position.x}%`, top: `${position.y}%` }}
    >
      <div className="tech-hub__node-spin">
        <button
          type="button"
          className="tech-hub__node"
          data-dimmed={dimmed ? "true" : undefined}
          aria-label={`${tech.name} — ${tech.category}${tech.description ? `. ${tech.description}` : ""}`}
          aria-pressed={isActive}
          style={{
            scale: String(position.scale),
            animationDelay: `${delay}ms`,
            ...(accent ? ({ "--node-accent": accent } as React.CSSProperties) : {}),
          }}
          onFocus={() => onActivate(tech)}
          onMouseEnter={() => onActivate(tech)}
          onClick={() => onActivate(tech)}
        >
          <Icon aria-hidden="true" />
          <span className="tech-hub__tooltip" role="tooltip">
            <strong>{tech.name}</strong>
            <span className="tech-hub__tooltip-cat">{tech.category}</span>
            {tech.description && <span>{tech.description}</span>}
          </span>
        </button>
      </div>
    </div>
  );
}
