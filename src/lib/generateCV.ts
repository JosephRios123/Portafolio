import jsPDF from "jspdf";

export function generateCV() {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const W = 210;
  const margin = 18;
  const contentW = W - margin * 2;
  let y = 18;

  // Colors
  const blue: [number, number, number] = [59, 130, 246];
  const cyan: [number, number, number] = [6, 182, 212];
  const dark: [number, number, number] = [15, 23, 42];
  const muted: [number, number, number] = [100, 116, 139];
  const white: [number, number, number] = [248, 250, 252];

  // Background
  doc.setFillColor(...dark);
  doc.rect(0, 0, W, 297, "F");

  // Header accent bar
  doc.setFillColor(...blue);
  doc.rect(0, 0, W, 3, "F");

  // Name
  y = 16;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(26);
  doc.setTextColor(...white);
  doc.text("JOSE MANUEL RIOS RESTREPO", margin, y);

  // Title
  y += 9;
  doc.setFontSize(11);
  doc.setTextColor(...cyan);
  doc.text("Backend Developer  |  PHP & Laravel Expert  |  Clean Code Advocate", margin, y);

  // Contact line
  y += 8;
  doc.setFontSize(8.5);
  doc.setTextColor(...muted);
  doc.text(
    "cresposfelices@gmail.com  •  +57 318 753 7304  •  linkedin.com/in/jose-manuel-rios-restrepo-69ab691b4",
    margin,
    y
  );

  // Divider
  y += 5;
  doc.setDrawColor(...blue);
  doc.setLineWidth(0.4);
  doc.line(margin, y, W - margin, y);

  // Helper: section title
  const sectionTitle = (title: string) => {
    y += 9;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...cyan);
    doc.text(title.toUpperCase(), margin, y);
    y += 1.5;
    doc.setDrawColor(59, 130, 246);
    doc.setLineWidth(0.3);
    doc.line(margin, y, margin + 40, y);
    y += 5;
  };

  // Helper: body text
  const bodyText = (text: string, indent = 0) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...white);
    const lines = doc.splitTextToSize(text, contentW - indent);
    doc.text(lines, margin + indent, y);
    y += lines.length * 4.2;
  };

  // Helper: bullet
  const bullet = (text: string, indent = 4) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(200, 210, 220);
    const lines = doc.splitTextToSize(text, contentW - indent - 4);
    doc.setFillColor(...cyan);
    doc.circle(margin + indent + 1, y - 1.2, 0.8, "F");
    doc.text(lines, margin + indent + 4, y);
    y += lines.length * 3.8;
  };

  // ── PERFIL PROFESIONAL ──
  sectionTitle("Perfil Profesional");
  bodyText(
    "Desarrollador backend especializado en la creación de soluciones eficientes y escalables. " +
      "Experiencia en PHP/Laravel, .NET, testing y desarrollo ágil (SCRUM). " +
      "Me enfoco en código limpio, mantenible y orientado a resultados. " +
      "Busco aportar valor en equipos innovadores con mentalidad de crecimiento constante."
  );

  // ── STACK TECNOLÓGICO ──
  sectionTitle("Stack Tecnológico");
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...white);

  const techs = [
    ["Backend:", "PHP (Laravel), C# (ASP.NET), Python, Java"],
    ["Frontend:", "HTML, CSS, JavaScript, React"],
    ["Base de datos:", "MySQL"],
  ];
  techs.forEach(([label, value]) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...cyan);
    doc.text(label, margin + 4, y);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...white);
    doc.text(value, margin + 30, y);
    y += 5;
  });

  // ── EXPERIENCIA PROFESIONAL ──
  sectionTitle("Experiencia Profesional");

  // Exp 1
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(...white);
  doc.text("Desarrollador de Software & Tester", margin + 4, y);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...muted);
  doc.text("Visual Contact S.A.S  |  Ene 2023 – Jul 2024", W - margin, y, { align: "right" });
  y += 5;
  [
    "Desarrollo backend con PHP y Laravel",
    "Integración con .NET Core 6+ en ecosistemas empresariales",
    "Testing, documentación técnica y aseguramiento de calidad",
    "Gestión y optimización de bases de datos MySQL",
    "Metodologías ágiles (SCRUM)",
  ].forEach((t) => bullet(t));

  y += 3;

  // Exp 2
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(...white);
  doc.text("Soporte y Mantenimiento de Equipos HP", margin + 4, y);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...muted);
  doc.text("Soporte Caribe S.A.S  |  Feb 2025 – Jun 2025", W - margin, y, { align: "right" });
  y += 5;
  [
    "Soporte técnico empresarial de alto nivel",
    "Mantenimiento físico de equipos EliteBook G9 y G10",
    "Formateos seguros con KillDisk y protocolos de seguridad",
    "Resolución eficiente de incidencias técnicas críticas",
  ].forEach((t) => bullet(t));

  // ── FORMACIÓN ACADÉMICA ──
  sectionTitle("Formación Académica");

  const formations = [
    { title: "Tecnólogo en Análisis y Desarrollo de Software", inst: "SENA", period: "Abr 2022 – Jul 2024" },
    { title: "Introducción a la IA Generativa", inst: "Google Cloud - Coursera", period: "2025" },
    { title: "Programación en JAVA", inst: "Politécnico de Antioquia", period: "2025" },
    { title: "Operador Medios Tecnológicos", inst: "AVIPS LTDA", period: "2025" },
  ];

  formations.forEach((f) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...white);
    doc.text(f.title, margin + 4, y);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...muted);
    doc.text(`${f.inst}  |  ${f.period}`, W - margin, y, { align: "right" });
    y += 5;
  });

  // ── HABILIDADES CLAVE ──
  sectionTitle("Habilidades Clave");

  const skills = [
    "Resolución de problemas complejos",
    "Capacidad analítica y pensamiento estructurado",
    "Trabajo en equipo y comunicación efectiva",
    "Aprendizaje continuo y adaptación rápida",
    "Testing & aseguramiento de calidad",
  ];

  // Two columns
  const col1 = skills.slice(0, 3);
  const col2 = skills.slice(3);
  const startY = y;
  col1.forEach((s) => bullet(s));
  y = startY;
  col2.forEach((s) => {
    doc.setFillColor(...cyan);
    doc.circle(margin + contentW / 2 + 1, y - 1.2, 0.8, "F");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(200, 210, 220);
    doc.text(s, margin + contentW / 2 + 4, y);
    y += 3.8;
  });
  y = Math.max(y, startY + col1.length * 3.8);

  // Languages
  y += 4;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...cyan);
  doc.text("Idiomas:", margin + 4, y);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...white);
  doc.text("Español (Nativo)  •  Inglés (Intermedio)", margin + 24, y);

  // Footer line
  doc.setDrawColor(...blue);
  doc.setLineWidth(0.3);
  doc.line(margin, 290, W - margin, 290);
  doc.setFontSize(7);
  doc.setTextColor(...muted);
  doc.text("Jose Manuel Rios Restrepo  •  Backend Developer  •  Generado desde portafolio personal", W / 2, 294, {
    align: "center",
  });

  doc.save("Jose_Manuel_Rios_Restrepo_CV.pdf");
}
