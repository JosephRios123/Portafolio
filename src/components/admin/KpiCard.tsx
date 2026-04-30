import { useEffect, useState } from "react";
import { LucideIcon } from "lucide-react";

interface Props {
  label: string;
  value: number;
  icon: LucideIcon;
  color: string;
  delay?: number;
}

export default function KpiCard({ label, value, icon: Icon, color, delay = 0 }: Props) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const start = performance.now();
    const duration = 900;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(eased * value));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);

  return (
    <div
      className="glass-card rounded-2xl p-5 sm:p-6 animate-fade-in"
      style={{ animationDelay: `${delay}ms`, animationFillMode: "both" }}
    >
      <div className="flex items-start justify-between mb-3 sm:mb-4">
        <div
          className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center"
          style={{ background: `${color}1f`, border: `1px solid ${color}55` }}
        >
          <Icon size={18} style={{ color }} />
        </div>
        <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">live</span>
      </div>
      <div className="text-3xl sm:text-4xl font-black text-foreground tabular-nums">{display}</div>
      <div className="text-xs sm:text-sm text-muted-foreground mt-1">{label}</div>
    </div>
  );
}
