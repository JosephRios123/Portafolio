import { useMemo, useState } from "react";

interface Props {
  /** ISO date strings */
  dates: string[];
  days?: number;
}

export default function ActivitySparkline({ dates, days = 14 }: Props) {
  const [hover, setHover] = useState<number | null>(null);

  const buckets = useMemo(() => {
    const out: { day: Date; count: number }[] = [];
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      out.push({ day: d, count: 0 });
    }
    dates.forEach((iso) => {
      const d = new Date(iso);
      d.setHours(0, 0, 0, 0);
      const idx = out.findIndex((b) => b.day.getTime() === d.getTime());
      if (idx >= 0) out[idx].count++;
    });
    return out;
  }, [dates, days]);

  const max = Math.max(1, ...buckets.map((b) => b.count));
  const W = 600;
  const H = 120;
  const pad = 8;
  const stepX = (W - pad * 2) / (buckets.length - 1);

  const points = buckets.map((b, i) => ({
    x: pad + i * stepX,
    y: H - pad - (b.count / max) * (H - pad * 2),
  }));

  const path = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  const area = `${path} L${points[points.length - 1].x},${H - pad} L${points[0].x},${H - pad} Z`;

  const total = buckets.reduce((s, b) => s + b.count, 0);

  return (
    <div className="glass-card rounded-2xl p-5 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-black text-foreground">Actividad</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Últimos {days} días · {total} cambios</p>
        </div>
        {hover !== null && (
          <div className="text-right text-xs">
            <div className="font-mono text-accent">{buckets[hover].count}</div>
            <div className="text-muted-foreground">
              {buckets[hover].day.toLocaleDateString("es-CO", { day: "2-digit", month: "short" })}
            </div>
          </div>
        )}
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-28 sm:h-32" preserveAspectRatio="none">
        <defs>
          <linearGradient id="spark-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(217 91% 60%)" stopOpacity="0.45" />
            <stop offset="100%" stopColor="hsl(187 92% 42%)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={area} fill="url(#spark-grad)" />
        <path d={path} fill="none" stroke="hsl(187 92% 42%)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {points.map((p, i) => (
          <g key={i} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
            <circle cx={p.x} cy={p.y} r={hover === i ? 4 : 2.5} fill="hsl(217 91% 60%)" />
            <rect x={p.x - stepX / 2} y={0} width={stepX} height={H} fill="transparent" />
          </g>
        ))}
      </svg>
    </div>
  );
}
