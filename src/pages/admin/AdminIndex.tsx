import { Briefcase, History, Brain, GraduationCap } from "lucide-react";
import { Link } from "react-router-dom";

const cards = [
  { to: "/admin/projects",   label: "Proyectos",   icon: Briefcase,     desc: "Gestiona tus proyectos personales y profesionales" },
  { to: "/admin/experience", label: "Experiencia", icon: History,       desc: "Trayectoria laboral y logros" },
  { to: "/admin/mindset",    label: "Mentalidad",  icon: Brain,         desc: "Principios que definen cómo trabajas" },
  { to: "/admin/formations", label: "Formación",   icon: GraduationCap, desc: "Cursos, carreras y certificaciones" },
];

export default function AdminIndex() {
  return (
    <div>
      <h1 className="text-3xl font-black text-foreground mb-2">Bienvenido</h1>
      <p className="text-muted-foreground mb-10">Gestiona el contenido de tu portafolio en tiempo real.</p>

      <div className="grid sm:grid-cols-2 gap-5">
        {cards.map(({ to, label, icon: Icon, desc }) => (
          <Link
            key={to}
            to={to}
            className="glass-card-hover rounded-2xl p-6 flex items-start gap-4 group"
          >
            <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "hsl(217 91% 60% / 0.12)", border: "1px solid hsl(217 91% 60% / 0.3)" }}>
              <Icon size={20} className="text-primary" />
            </div>
            <div>
              <h3 className="font-black text-foreground group-hover:text-accent transition-colors">{label}</h3>
              <p className="text-sm text-muted-foreground mt-1">{desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
