import {
  Activity, Atom, Binary, Bot, Boxes, Braces, Brain, Bug, Cable, Cloud, CloudCog,
  Code2, Cog, Command, Container, Cpu, Database, DatabaseZap, FileCode2, FlaskConical,
  Folder, GitBranch, GitMerge, Globe, HardDrive, Hexagon, Infinity as InfinityIcon,
  KeyRound, Layers, LayoutGrid, LineChart, Lock, MonitorSmartphone, Network, Package,
  PanelsTopLeft, Puzzle, Radar, Rocket, Route, Satellite, Server, ServerCog, Settings2,
  Share2, Shield, ShieldCheck, Sparkles, SquareTerminal, Terminal, TestTube2, Timer,
  Workflow, Wrench, Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

/** Curated Lucide subset — keeps the bundle small and the look consistent. */
export const TECH_ICONS: Record<string, LucideIcon> = {
  Activity, Atom, Binary, Bot, Boxes, Braces, Brain, Bug, Cable, Cloud, CloudCog,
  Code2, Cog, Command, Container, Cpu, Database, DatabaseZap, FileCode2, FlaskConical,
  Folder, GitBranch, GitMerge, Globe, HardDrive, Hexagon, Infinity: InfinityIcon,
  KeyRound, Layers, LayoutGrid, LineChart, Lock, MonitorSmartphone, Network, Package,
  PanelsTopLeft, Puzzle, Radar, Rocket, Route, Satellite, Server, ServerCog, Settings2,
  Share2, Shield, ShieldCheck, Sparkles, SquareTerminal, Terminal, TestTube2, Timer,
  Workflow, Wrench, Zap,
};

export const TECH_ICON_NAMES = Object.keys(TECH_ICONS);

export function getTechIcon(name?: string | null): LucideIcon {
  return (name && TECH_ICONS[name]) || Cpu;
}

export const TECH_CATEGORIES = [
  "Frontend",
  "Backend",
  "Database",
  "Cloud",
  "DevOps",
  "AI",
  "Tools",
  "Architecture",
  "Other",
] as const;

export type TechCategory = (typeof TECH_CATEGORIES)[number];

export const CATEGORY_COLORS: Record<TechCategory, string> = {
  Frontend: "hsl(217 91% 60%)",
  Backend: "hsl(187 92% 42%)",
  Database: "hsl(150 70% 50%)",
  Cloud: "hsl(199 89% 60%)",
  DevOps: "hsl(265 85% 65%)",
  AI: "hsl(291 74% 62%)",
  Tools: "hsl(38 92% 58%)",
  Architecture: "hsl(174 72% 48%)",
  Other: "hsl(217 20% 65%)",
};
