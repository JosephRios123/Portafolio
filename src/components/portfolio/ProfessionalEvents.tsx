import { useState } from "react";
import { CalendarDays, ExternalLink, FileText, Mic2 } from "lucide-react";
import { useProfessionalEvents } from "@/hooks/usePublicData";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import CertificateModal from "./CertificateModal";

export default function ProfessionalEvents() {
  const { data, loading } = useProfessionalEvents();
  const [cert, setCert] = useState<{ url: string; mime: string | null; title: string } | null>(null);

  return (
    <section id="events" className="chapter-section section-divider px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-4 flex items-center gap-3">
          <span className="h-px w-8 gradient-bg" />
          <span className="font-mono text-sm font-bold uppercase tracking-widest text-accent">Conferencias & Workshops</span>
        </div>
        <h2 className="mb-4 text-3xl font-black sm:text-4xl lg:text-5xl">Aprendizaje que sale del <span className="gradient-text">aula</span></h2>
        <p className="mb-10 max-w-2xl text-muted-foreground">Eventos, espacios técnicos y comunidades que amplían mi perspectiva profesional.</p>

        {loading ? (
          <div className="space-y-4"><Skeleton className="h-28" /><Skeleton className="h-28" /></div>
        ) : data.length === 0 ? (
          <div className="glass-card p-8 text-center">
            <Mic2 className="mx-auto mb-4 text-accent" aria-hidden="true" />
            <h3 className="text-xl font-black">Próximamente</h3>
            <p className="mt-2 text-muted-foreground">Aquí aparecerán conferencias, workshops y encuentros profesionales.</p>
          </div>
        ) : (
          <Accordion type="single" collapsible className="space-y-3">
            {data.map((event) => (
              <AccordionItem key={event.id} value={event.id} className="glass-card border px-5 sm:px-7">
                <AccordionTrigger className="min-h-20 text-left hover:no-underline">
                  <span className="flex min-w-0 items-center gap-4 pr-4">
                    <span className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-md border border-primary/20 bg-primary/10 text-xl">
                      {event.icon_image_url ? <img src={event.icon_image_url} alt="" loading="lazy" className="size-full object-cover" /> : event.icon_emoji || "🎙️"}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-xs font-bold uppercase text-accent">{event.event_type} · {event.participation_role}</span>
                      <span className="mt-1 block font-black text-foreground">{event.title}</span>
                      <span className="block text-sm text-muted-foreground">{event.organization}</span>
                    </span>
                  </span>
                </AccordionTrigger>
                <AccordionContent className="border-t border-border/60 pt-5">
                  <div className="mb-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <span className="inline-flex items-center gap-2"><CalendarDays size={15} />{event.event_date}</span>
                    {event.location && <span>{event.location}</span>}
                  </div>
                  <p className="leading-relaxed text-muted-foreground">{event.description}</p>
                  <div className="mt-5 flex flex-wrap gap-3">
                    {event.link && <Button asChild variant="outline"><a href={event.link} target="_blank" rel="noreferrer">Ver evento <ExternalLink /></a></Button>}
                    {event.certificate_url && <Button variant="secondary" onClick={() => setCert({ url: event.certificate_url as string, mime: event.certificate_mime, title: event.title })}><FileText /> Ver certificado</Button>}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>
      <CertificateModal url={cert?.url ?? null} mime={cert?.mime ?? null} title={cert?.title} onClose={() => setCert(null)} />
    </section>
  );
}