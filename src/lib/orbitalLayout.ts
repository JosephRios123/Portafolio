/**
 * Deterministic orbital layout engine.
 *
 * Given only the number of items and the viewport density, it computes how many
 * concentric rings are needed, their radii, how many nodes each ring holds and
 * the exact polar/cartesian position of every node. No hardcoded coordinates.
 */

export type OrbitalRing = {
  index: number;
  /** Radius as a percentage of the container half-size. */
  radius: number;
  count: number;
};

export type OrbitalPosition = {
  index: number;
  ring: number;
  radius: number;
  /** Degrees, 0 = top, clockwise. */
  angle: number;
  /** Percentage coordinates inside the square container. */
  x: number;
  y: number;
  /** Relative node scale (1 = base size). */
  scale: number;
};

export type OrbitalLayout = {
  rings: OrbitalRing[];
  nodes: OrbitalPosition[];
  /** Relative scale of the central core (1 = base size). */
  coreScale: number;
};

export type OrbitalDensity = "compact" | "regular";

const MAX_RADIUS = 44;
/** Smallest radius that still clears the central core. */
const MIN_RADIUS = 25;

/** Base node footprint as a percentage of the container width. */
const BASE_NODE = { compact: 13, regular: 11.5 } as const;

/** Minimum number of rings for a given amount of items (legibility first). */
function desiredRingCount(count: number, density: OrbitalDensity): number {
  const limit = density === "compact" ? 5 : 6;
  if (count <= limit) return 1;
  if (count <= 12) return 2;
  if (count <= 20) return 3;
  return Math.min(5, Math.ceil(count / 8));
}

function scaleForRings(ringCount: number): number {
  if (ringCount <= 1) return 1;
  if (ringCount === 2) return 0.9;
  if (ringCount === 3) return 0.8;
  if (ringCount === 4) return 0.72;
  return 0.66;
}

function ringRadii(ringCount: number): number[] {
  if (ringCount === 1) return [MAX_RADIUS];
  const step = (MAX_RADIUS - MIN_RADIUS) / (ringCount - 1);
  return Array.from({ length: ringCount }, (_, i) => MIN_RADIUS + step * i);
}

/** How many nodes fit on a ring without the nodes touching each other. */
function ringCapacity(radius: number, nodeSize: number): number {
  const circumference = 2 * Math.PI * radius;
  return Math.max(3, Math.floor(circumference / (nodeSize * 1.15)));
}

export function calculateOrbitalLayout(
  count: number,
  density: OrbitalDensity = "regular"
): OrbitalLayout {
  if (count <= 0) return { rings: [], nodes: [], coreScale: 1 };

  const baseNode = BASE_NODE[density];
  let ringCount = desiredRingCount(count, density);
  let radii = ringRadii(ringCount);
  let scale = scaleForRings(ringCount);
  let capacities = radii.map((r) => ringCapacity(r, baseNode * scale));

  // Grow the ring count until every item fits without overlapping.
  while (capacities.reduce((a, b) => a + b, 0) < count && ringCount < 8) {
    ringCount += 1;
    radii = ringRadii(ringCount);
    scale = scaleForRings(ringCount);
    capacities = radii.map((r) => ringCapacity(r, baseNode * scale));
  }

  // Distribute items proportionally to each ring's capacity (outer rings hold
  // more), clamped by capacity, pushing any overflow outwards.
  const totalCapacity = capacities.reduce((a, b) => a + b, 0);
  const allocation = capacities.map((c) => Math.floor((c / totalCapacity) * count));
  let remaining = count - allocation.reduce((a, b) => a + b, 0);
  for (let i = allocation.length - 1; i >= 0 && remaining > 0; i--) {
    const room = capacities[i] - allocation[i];
    const take = Math.min(room, remaining);
    allocation[i] += take;
    remaining -= take;
  }
  // Safety valve: if rounding still left items out, widen the outer ring.
  if (remaining > 0) allocation[allocation.length - 1] += remaining;

  const rings: OrbitalRing[] = radii
    .map((radius, index) => ({ index, radius, count: allocation[index] }))
    .filter((r) => r.count > 0);

  const nodes: OrbitalPosition[] = [];
  let cursor = 0;
  // Fill the outermost ring first so small sets read as one clean orbit.
  const ordered = [...rings].sort((a, b) => b.radius - a.radius);
  ordered.forEach((ring) => {
    const step = 360 / ring.count;
    // Stagger alternating rings so nodes never align radially.
    const offset = ring.index % 2 === 0 ? 0 : step / 2;
    for (let i = 0; i < ring.count; i++) {
      const angle = i * step + offset - 90;
      const rad = (angle * Math.PI) / 180;
      nodes.push({
        index: cursor++,
        ring: ring.index,
        radius: ring.radius,
        angle,
        x: 50 + Math.cos(rad) * ring.radius,
        y: 50 + Math.sin(rad) * ring.radius,
        scale,
      });
    }
  });

  return {
    rings: rings.sort((a, b) => a.radius - b.radius),
    nodes: nodes.sort((a, b) => a.index - b.index),
    coreScale: ringCount >= 3 ? 0.85 : 1,
  };
}
