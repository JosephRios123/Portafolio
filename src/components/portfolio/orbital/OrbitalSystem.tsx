import { useMemo } from "react";
import { calculateOrbitalLayout } from "@/lib/orbitalLayout";
import type { OrbitalCoreConfig, OrbitalTechnology } from "@/hooks/usePublicData";
import { useIsMobile } from "@/hooks/use-mobile";
import OrbitalCore from "./OrbitalCore";
import OrbitalNode from "./OrbitalNode";

type Props = {
  technologies: OrbitalTechnology[];
  core: OrbitalCoreConfig | null;
  activeId: string | null;
  onActivate: (tech: OrbitalTechnology) => void;
};

export default function OrbitalSystem({ technologies, core, activeId, onActivate }: Props) {
  const isMobile = useIsMobile();
  const layout = useMemo(
    () => calculateOrbitalLayout(technologies.length, isMobile ? "compact" : "regular"),
    [technologies.length, isMobile]
  );

  return (
    <div className="tech-hub" role="group" aria-label="Sistema orbital de tecnologías">
      <div className="tech-hub__ambient" aria-hidden="true" />

      <svg className="tech-hub__geometry" viewBox="0 0 100 100" aria-hidden="true">
        {layout.rings.map((ring) => (
          <circle
            key={ring.index}
            cx="50"
            cy="50"
            r={ring.radius}
            className={`tech-hub__ring${ring.index % 2 ? " tech-hub__ring--inner" : ""}`}
          />
        ))}
      </svg>

      <div className="tech-hub__rotor">
        <svg className="tech-hub__geometry" viewBox="0 0 100 100" aria-hidden="true">
          {layout.nodes.map((node, i) => {
            const tech = technologies[i];
            const rad = (node.angle * Math.PI) / 180;
            return (
              <line
                key={node.index}
                x1={50 + Math.cos(rad) * 14}
                y1={50 + Math.sin(rad) * 14}
                x2={node.x}
                y2={node.y}
                className="tech-hub__line"
                data-active={tech && tech.id === activeId ? "true" : undefined}
              />
            );
          })}
        </svg>

        {layout.nodes.map((node, i) => {
          const tech = technologies[i];
          if (!tech) return null;
          return (
            <OrbitalNode
              key={tech.id}
              tech={tech}
              position={node}
              isActive={tech.id === activeId}
              dimmed={!!activeId && tech.id !== activeId}
              onActivate={onActivate}
              delay={i * 45}
            />
          );
        })}
      </div>

      <OrbitalCore
        label={core?.label ?? "BACKEND"}
        statusText={core?.status_text ?? "CORE_ACTIVE"}
        iconName={core?.icon_name}
        scale={layout.coreScale}
      />
    </div>
  );
}
