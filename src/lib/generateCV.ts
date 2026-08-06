import jsPDF from "jspdf";
import { supabase } from "@/integrations/supabase/client";
import type { PublicExperience, PublicFormation, PublicProfessionalEvent, PublicProject } from "@/hooks/usePublicData";

type CVData = { projects: PublicProject[]; experiences: PublicExperience[]; formations: PublicFormation[]; events: PublicProfessionalEvent[] };
type RGB = [number, number, number];

const STACK = [
  { category: "Backend", items: ["PHP", "Laravel", "C# / .NET Core", "Java", "Python", "REST APIs", "Node.js"] },
  { category: "Bases de datos", items: ["MySQL", "PostgreSQL", "Diseño relacional", "Optimización de consultas"] },
  { category: "Herramientas / DevOps", items: ["Git", "Linux", "VS Code", "Postman", "GitHub Actions"] },
  { category: "Metodologías", items: ["SCRUM", "Testing y QA", "Clean Code", "Pair Programming", "Code Review"] },
];

const neutralizeExperienceText = (text: string) => {
  const replacements: Array<[RegExp, string]> = [
    [/^Impulsé\s+/i, "Implementación de "],
    [/^Construí\s+/i, "Construcción de "],
    [/^Lideré\s+/i, "Coordinación de "],
    [/^Desarrollé\s+/i, "Desarrollo de "],
    [/^Participé en\s+/i, "Participación en "],
    [/^Realicé pruebas\s+/i, "Pruebas "],
    [/^Realicé\s+/i, "Ejecución de "],
    [/^Brindo soporte\s+/i, "Soporte "],
    [/^Realizo formateos\s+/i, "Formateo "],
    [/^Llevo a cabo mantenimiento\s+/i, "Mantenimiento "],
    [/^Instalo y actualizo\s+/i, "Instalación y actualización de "],
    [/^Me destaco por resolver\s+/i, "Resolución de "],
  ];
  return replacements.reduce((result, [pattern, replacement]) => result.replace(pattern, replacement), text);
};

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
  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 18;
  const contentWidth = pageWidth - margin * 2;
  const contentBottom = pageHeight - 18;
  const ink: RGB = [13, 13, 13];
  const accent: RGB = [15, 118, 110];
  const muted: RGB = [88, 88, 88];
  const subtle: RGB = [205, 205, 202];
  const paper: RGB = [250, 250, 249];
  let y = 0;
  let pageNumber = 1;

  const paintPage = () => {
    doc.setFillColor(...paper);
    doc.rect(0, 0, pageWidth, pageHeight, "F");
    doc.setDrawColor(...accent);
    doc.setLineWidth(0.6);
    doc.line(margin, 12, margin + 18, 12);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(...muted);
    doc.text(`Jose Manuel Rios Restrepo  ·  ${pageNumber}`, pageWidth - margin, pageHeight - 10, { align: "right" });
  };

  const newPage = () => {
    doc.addPage();
    pageNumber += 1;
    paintPage();
    y = 22;
  };

  const ensureSpace = (height: number) => {
    if (y + height > contentBottom) newPage();
  };

  const sectionLabel = (title: string) => {
    ensureSpace(15);
    y += 7;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(...accent);
    doc.text(title.toUpperCase(), margin, y);
    doc.setDrawColor(...subtle);
    doc.setLineWidth(0.15);
    doc.line(margin + 47, y - 1, pageWidth - margin, y - 1);
    y += 5;
  };

  const bodyParagraph = (text: string) => {
    doc.setFont("times", "normal");
    doc.setFontSize(10);
    const lines = doc.splitTextToSize(text, contentWidth) as string[];
    const height = lines.length * 4.6;
    ensureSpace(height);
    doc.setTextColor(...ink);
    doc.text(lines, margin, y);
    y += height;
  };

  const bullet = (text: string) => {
    doc.setFont("times", "normal");
    doc.setFontSize(9.5);
    const lines = doc.splitTextToSize(text, contentWidth - 7) as string[];
    const height = Math.max(4.6, lines.length * 4.4);
    ensureSpace(height + 1);
    doc.setFillColor(...accent);
    doc.circle(margin + 1.4, y - 1.2, 0.55, "F");
    doc.setTextColor(...ink);
    doc.text(lines, margin + 5, y);
    y += height;
  };

  const entryHeader = (title: string, subtitle: string, meta: string, followingHeight = 0) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    const titleLines = doc.splitTextToSize(title, contentWidth * 0.66) as string[];
    ensureSpace(titleLines.length * 4.2 + 6 + followingHeight);
    doc.setTextColor(...ink);
    doc.text(titleLines, margin, y);
    doc.setFont("times", "italic");
    doc.setFontSize(9);
    doc.setTextColor(...muted);
    if (meta) doc.text(meta, pageWidth - margin, y, { align: "right", maxWidth: contentWidth * 0.3 });
    y += titleLines.length * 4.2;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...accent);
    doc.text(subtitle, margin, y);
    y += 5;
  };

  const stackRow = (category: string, items: string[]) => {
    const categoryWidth = 43;
    const itemsX = margin + categoryWidth;
    const itemsWidth = contentWidth - categoryWidth - 3;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    const lines = doc.splitTextToSize(items.join("  ·  "), itemsWidth) as string[];
    const rowHeight = Math.max(9, lines.length * 4.2 + 4);
    ensureSpace(rowHeight);
    doc.setFillColor(244, 246, 245);
    doc.rect(margin, y - 3.3, contentWidth, rowHeight, "F");
    doc.setDrawColor(...subtle);
    doc.setLineWidth(0.15);
    doc.line(itemsX - 3, y - 3.3, itemsX - 3, y - 3.3 + rowHeight);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(...accent);
    doc.text(category.toUpperCase(), margin + 3, y + 1);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...ink);
    doc.text(lines, itemsX, y + 1);
    y += rowHeight + 1.5;
  };

  paintPage();
  y = 24;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(28);
  doc.setTextColor(...ink);
  doc.text("Jose Manuel Rios Restrepo", margin, y);
  y += 7;
  doc.setFontSize(11);
  doc.setTextColor(...accent);
  doc.text("Backend Developer · API & Database Architecture", margin, y);
  y += 6;
  doc.setFont("times", "italic");
  doc.setFontSize(9);
  doc.setTextColor(...muted);
  doc.text("Medellín, Colombia  ·  +57 318 753 7304  ·  cresposfelices@gmail.com", margin, y);
  y += 4.5;
  doc.text("linkedin.com/in/jose-manuel-rios-restrepo-69ab691b4  ·  cvjosemanuelriosrestrepo.lovable.app", margin, y);
  y += 6;
  doc.setDrawColor(...subtle);
  doc.setLineWidth(0.15);
  doc.line(margin, y, pageWidth - margin, y);

  sectionLabel("Perfil");
  bodyParagraph("Desarrollador backend con experiencia en implementación de APIs, modelado de bases de datos, pruebas y optimización de rendimiento. Trabajo con PHP/Laravel, .NET y equipos ágiles, con énfasis en código mantenible y reglas de negocio claras.");

  sectionLabel("Experiencia");
  if (data.experiences.length === 0) bodyParagraph("Experiencia profesional disponible próximamente.");
  data.experiences.forEach((experience) => {
    entryHeader(experience.role, experience.company, `${experience.start_date} — ${experience.is_current ? "Actualidad" : experience.end_date ?? ""}`, experience.bullets.length ? 5 : 0);
    experience.bullets.forEach((entry) => bullet(neutralizeExperienceText(entry.text)));
    y += 2;
  });

  if (data.projects.length > 0) {
    sectionLabel("Proyectos");
    data.projects.forEach((project) => {
      entryHeader(project.name, project.tags.join(" · "), project.country ?? "", 5);
      bullet(project.description);
      y += 2;
    });
  }

  sectionLabel("Stack técnico");
  STACK.forEach((row) => stackRow(row.category, row.items));

  if (data.formations.length > 0) {
    sectionLabel("Formación");
    data.formations.forEach((formation) => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9.5);
      const titleLines = doc.splitTextToSize(formation.course, contentWidth * 0.57) as string[];
      ensureSpace(Math.max(6, titleLines.length * 4.2));
      doc.setTextColor(...ink);
      doc.text(titleLines, margin, y);
      doc.setFont("times", "italic");
      doc.setFontSize(9);
      doc.setTextColor(...muted);
      doc.text(`${formation.institution}  ·  ${formation.obtained_date ?? formation.status}`, pageWidth - margin, y, { align: "right", maxWidth: contentWidth * 0.39 });
      y += Math.max(5, titleLines.length * 4.2);
    });
  }

  if (data.events.length > 0) {
    sectionLabel("Conferencias y workshops");
    data.events.forEach((event) => {
      entryHeader(event.title, event.organization, event.event_date, 5);
      bullet(`${event.event_type} · ${event.participation_role}. ${event.description}`);
      y += 2;
    });
  }

  sectionLabel("Idiomas");
  bodyParagraph("Español · Nativo    |    Inglés · Intermedio (B1)");
  ensureSpace(17);
  y += 5;
  doc.setDrawColor(...accent);
  doc.setLineWidth(0.3);
  doc.line(margin, y, margin + 10, y);
  y += 6;
  doc.setFont("times", "italic");
  doc.setFontSize(10);
  doc.setTextColor(...ink);
  doc.text("Desarrollo backend con criterios de calidad, mantenibilidad y rendimiento.", margin, y);

  doc.save("Jose_Manuel_Rios_Restrepo_CV.pdf");
}