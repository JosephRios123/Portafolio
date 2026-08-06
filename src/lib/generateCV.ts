import jsPDF from "jspdf";
import { supabase } from "@/integrations/supabase/client";
import type { PublicExperience, PublicFormation, PublicProfessionalEvent, PublicProject } from "@/hooks/usePublicData";

/**
 * CV editorial — paleta sobria (negro profundo + acento teal #0F766E)
 * - Tipografía dual: Helvetica (proxy de Inter) para titulares, Times para cuerpo
 * - Layout 1 columna ATS-safe (texto vectorial puro, sin imágenes)
 * - Chips de skills con borde fino sin relleno
 * - Bullets con verbos de impacto en pasado
 * - Frase firma de cierre
 */
type CVData = { projects: PublicProject[]; experiences: PublicExperience[]; formations: PublicFormation[]; events: PublicProfessionalEvent[] };

async function loadCVData(): Promise<CVData> {
  const [projects, experiences, bullets, formations, events] = await Promise.all([
    supabase.from("projects").select("*").order("display_order"),
    supabase.from("experiences").select("*").order("display_order"),
    supabase.from("experience_bullets").select("*").order("display_order"),
    supabase.from("formations").select("*").order("display_order"),
    supabase.from("professional_events").select("*").order("display_order"),
  ]);
  const error = [projects, experiences, bullets, formations, events].find((result) => result.error)?.error;
  if (error) throw error;
  return {
    projects: (projects.data ?? []) as PublicProject[],
    experiences: (experiences.data ?? []).map((experience) => ({
      ...experience,
      bullets: (bullets.data ?? []).filter((bullet) => bullet.experience_id === experience.id),
    })) as PublicExperience[],
    formations: (formations.data ?? []) as PublicFormation[],
    events: (events.data ?? []) as PublicProfessionalEvent[],
  };
}

export async function generateCV() {
  const data = await loadCVData();
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const W = 210;
  const H = 297;
  const margin = 18;
  const contentW = W - margin * 2;
  let y = 0;

  // Paleta editorial
  const ink: [number, number, number] = [13, 13, 13];     // #0D0D0D
  const accent: [number, number, number] = [15, 118, 110]; // teal #0F766E
  const muted: [number, number, number] = [88, 88, 88];
  const subtle: [number, number, number] = [180, 180, 180];
  const paper: [number, number, number] = [250, 250, 249]; // #FAFAF9

  // Background paper
  doc.setFillColor(...paper);
  doc.rect(0, 0, W, H, "F");

  // Top hairline accent
  doc.setDrawColor(...accent);
  doc.setLineWidth(0.6);
  doc.line(margin, 12, margin + 18, 12);

  // ── HEADER ──────────────────────────────────────────
  y = 24;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(28);
  doc.setTextColor(...ink);
  doc.text("Jose Manuel Rios Restrepo", margin, y);

  y += 7;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...accent);
  doc.text("Backend Developer · API & Database Architect", margin, y);

  y += 6;
  doc.setFont("times", "italic");
  doc.setFontSize(9);
  doc.setTextColor(...muted);
  doc.text(
    "Medellín, Colombia  ·  +57 318 753 7304  ·  cresposfelices@gmail.com",
    margin,
    y
  );

  y += 4.5;
  doc.text(
    "linkedin.com/in/jose-manuel-rios-restrepo-69ab691b4  ·  cvjosemanuelriosrestrepo.lovable.app",
    margin,
    y
  );

  // Hairline divider
  y += 6;
  doc.setDrawColor(...subtle);
  doc.setLineWidth(0.15);
  doc.line(margin, y, W - margin, y);

  // ── STATS ROW ───────────────────────────────────────
  y += 9;
  const stats = [
    { num: String(data.experiences.length), label: "EXPERIENCIAS" },
    { num: String(data.projects.length), label: "PROYECTOS" },
    { num: String(data.formations.length), label: "FORMACIONES" },
  ];
  const colW = contentW / 3;
  stats.forEach((s, i) => {
    const cx = margin + colW * i;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(...accent);
    doc.text(s.num, cx, y);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.setTextColor(...muted);
    doc.text(spaced(s.label), cx, y + 4.5);
  });
  y += 11;
  doc.setDrawColor(...subtle);
  doc.line(margin, y, W - margin, y);

  // ── HELPERS ─────────────────────────────────────────
  function spaced(s: string) {
    // simulate letter-spacing by inserting hairspaces
    return s.split("").join(" ");
  }

  function sectionLabel(title: string) {
    y += 8;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(...accent);
    doc.text(spaced(title.toUpperCase()), margin, y);
    y += 4.5;
  }

  function bodyP(text: string) {
    doc.setFont("times", "normal");
    doc.setFontSize(10);
    doc.setTextColor(...ink);
    const lines = doc.splitTextToSize(text, contentW);
    doc.text(lines, margin, y);
    y += lines.length * 4.6;
  }

  function bullet(verb: string, rest: string) {
    doc.setFont("times", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(...ink);
    // marker
    doc.setDrawColor(...accent);
    doc.setLineWidth(0.5);
    doc.line(margin + 1, y - 1.5, margin + 3.5, y - 1.5);
    // verb bold
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.text(verb, margin + 5.5, y);
    const verbW = doc.getTextWidth(verb + " ");
    // rest
    doc.setFont("times", "normal");
    const lines = doc.splitTextToSize(rest, contentW - 5.5 - verbW);
    doc.text(lines[0] ?? "", margin + 5.5 + verbW, y);
    if (lines.length > 1) {
      const extra = doc.splitTextToSize(lines.slice(1).join(" "), contentW - 5.5);
      y += 4.4;
      doc.text(extra, margin + 5.5, y);
      y += (extra.length - 1) * 4.4;
    }
    y += 4.6;
  }

  function chips(items: string[]) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    let cx = margin;
    const padX = 2.5;
    const padY = 1.6;
    const gap = 2;
    const lineH = 6;
    items.forEach((t) => {
      const w = doc.getTextWidth(t) + padX * 2;
      if (cx + w > W - margin) {
        cx = margin;
        y += lineH + 1.5;
      }
      doc.setDrawColor(...ink);
      doc.setLineWidth(0.2);
      doc.roundedRect(cx, y - lineH + 1.5, w, lineH, 1.2, 1.2);
      doc.setTextColor(...ink);
      doc.text(t, cx + padX, y - 1);
      cx += w + gap;
    });
    y += 2;
  }

  function jobHeader(role: string, company: string, period: string) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    doc.setTextColor(...ink);
    doc.text(role, margin, y);
    doc.setFont("times", "italic");
    doc.setFontSize(9);
    doc.setTextColor(...muted);
    doc.text(period, W - margin, y, { align: "right" });
    y += 4.6;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...accent);
    doc.text(company, margin, y);
    y += 5;
  }

  // ── PERFIL ──────────────────────────────────────────
  sectionLabel("Perfil");
  bodyP(
    "Backend developer enfocado en construir APIs, bases de datos y arquitecturas que escalan sin romperse. " +
    "Experiencia en PHP/Laravel, .NET y testing dentro de equipos ágiles (SCRUM). " +
    "Trabajo el código como un producto: limpio, mantenible y orientado a impacto medible."
  );

  // ── EXPERIENCIA ─────────────────────────────────────
  sectionLabel("Experiencia");

  if (data.experiences.length === 0) bodyP("Experiencia disponible próximamente.");
  data.experiences.forEach((experience) => {
    jobHeader(experience.role, experience.company, `${experience.start_date} — ${experience.is_current ? "Actualidad" : experience.end_date ?? ""}`);
    experience.bullets.forEach((entry) => bullet("Impulsé", entry.text));
    y += 1.5;
  });

  if (data.projects.length) {
    sectionLabel("Proyectos");
    data.projects.forEach((project) => {
      jobHeader(project.name, project.tags.join(" · "), project.country ?? "");
      bullet("Construí", project.description);
    });
  }

  // ── STACK TÉCNICO ───────────────────────────────────
  sectionLabel("Stack técnico");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...muted);
  doc.text("BACKEND CORE", margin, y);
  y += 4;
  chips(["PHP", "Laravel", "C# / .NET Core", "Java", "Python", "REST APIs", "Node.js"]);

  y += 3;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...muted);
  doc.text("BASES DE DATOS", margin, y);
  y += 4;
  chips(["MySQL", "PostgreSQL", "Diseño relacional", "Optimización de consultas"]);

  y += 3;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...muted);
  doc.text("DEVOPS & TOOLING", margin, y);
  y += 4;
  chips(["Git", "Linux", "VS Code", "Postman", "GitHub Actions"]);

  y += 3;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...muted);
  doc.text("METODOLOGÍAS", margin, y);
  y += 4;
  chips(["SCRUM", "Testing & QA", "Clean Code", "Pair Programming", "Code Review"]);

  // ── FORMACIÓN ───────────────────────────────────────
  sectionLabel("Formación");
  data.formations.forEach((formation) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(...ink);
    doc.text(formation.course, margin, y);
    doc.setFont("times", "italic");
    doc.setFontSize(9);
    doc.setTextColor(...muted);
    doc.text(`${formation.institution}  ·  ${formation.obtained_date ?? formation.status}`, W - margin, y, { align: "right" });
    y += 4.8;
  });

  if (data.events.length) {
    sectionLabel("Conferencias y workshops");
    data.events.forEach((event) => {
      jobHeader(event.title, event.organization, event.event_date);
      bullet("Participé", `${event.event_type} como ${event.participation_role}. ${event.description}`);
    });
  }

  // ── IDIOMAS ─────────────────────────────────────────
  sectionLabel("Idiomas");
  doc.setFont("times", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...ink);
  doc.text("Español  ·  Nativo            Inglés  ·  Intermedio (B1)", margin, y);
  y += 5;

  // ── FRASE FIRMA ─────────────────────────────────────
  // Place near bottom
  const sigY = H - 22;
  doc.setDrawColor(...accent);
  doc.setLineWidth(0.3);
  doc.line(margin, sigY - 6, margin + 10, sigY - 6);
  doc.setFont("times", "italic");
  doc.setFontSize(11);
  doc.setTextColor(...ink);
  doc.text("\u201CConstruyo backends que sobreviven al éxito.\u201D", margin, sigY);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(...muted);
  doc.text(spaced("— J.M.R.R."), margin, sigY + 4.5);

  doc.save("Jose_Manuel_Rios_Restrepo_CV.pdf");
}
