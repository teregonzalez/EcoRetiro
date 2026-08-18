import { useState } from "react";

type ActivityType = "residuo" | "ruta" | "alerta" | "sistema";

interface Activity {
  id: number;
  type: ActivityType;
  time: string;
  title: string;
  description: string;
  actor: string;
}

const activities: Activity[] = [
  {
    id: 1,
    type: "residuo",
    time: "Hoy, 14:32",
    title: "Residuo ingresado",
    description: "Se registró un nuevo lote de material para gestión en la plataforma.",
    actor: "Operación EcoRetiro",
  },
  {
    id: 2,
    type: "ruta",
    time: "Hoy, 11:15",
    title: "Ruta completada",
    description: "Una recolección fue completada y su trazabilidad quedó actualizada.",
    actor: "Sistema logístico",
  },
  {
    id: 3,
    type: "alerta",
    time: "Ayer, 23:45",
    title: "Alerta de operación",
    description: "Se detectó una condición que requiere revisión de la operación.",
    actor: "Monitor de red",
  },
  {
    id: 4,
    type: "sistema",
    time: "Ayer, 18:30",
    title: "Cierre de turno",
    description: "Se generó el reporte automático de cierre de operaciones.",
    actor: "Sistema EcoRetiro",
  },
];

const presentationByType: Record<ActivityType, { icon: string; dot: string; chip: string }> = {
  residuo: { icon: "recycling", dot: "bg-tertiary", chip: "bg-tertiary-fixed/40 text-on-tertiary-fixed" },
  ruta: { icon: "local_shipping", dot: "bg-secondary", chip: "bg-secondary-container text-on-secondary-container" },
  alerta: { icon: "warning", dot: "bg-error", chip: "bg-error-container text-on-error-container" },
  sistema: { icon: "settings", dot: "bg-outline", chip: "bg-surface-container-high text-on-surface-variant" },
};

export default function ActivityHistoryView() {
  const [activityType, setActivityType] = useState("todos");
  const [actorQuery, setActorQuery] = useState("");

  const filteredActivities = activities.filter((activity) => {
    const matchesType = activityType === "todos" || activity.type === activityType;
    const matchesActor = activity.actor.toLowerCase().includes(actorQuery.toLowerCase());
    return matchesType && matchesActor;
  });

  return (
    <div className="space-y-lg">
      <div className="flex flex-col justify-between gap-md md:flex-row md:items-end">
        <div>
          <span className="font-label-sm uppercase tracking-widest text-secondary">Auditoría del sistema</span>
          <h1 className="font-display-lg text-on-surface">Historial de Actividades</h1>
        </div>
        <button type="button" className="inline-flex items-center justify-center gap-xs rounded-xl bg-secondary px-md py-sm font-label-sm text-on-secondary shadow-sm transition-colors hover:bg-secondary/90">
          <span className="material-symbols-outlined text-[18px]">download</span>
          Exportar Log
        </button>
      </div>

      <div className="flex flex-col gap-sm rounded-xl bg-surface-container-low p-sm shadow-sm md:flex-row md:items-center">
        <div className="flex flex-1 items-center gap-xs text-on-surface-variant">
          <span className="material-symbols-outlined">filter_list</span>
          <select aria-label="Tipo de actividad" value={activityType} onChange={(event) => setActivityType(event.target.value)} className="w-full bg-transparent py-sm outline-none">
            <option value="todos">Tipo de actividad: todos</option>
            <option value="residuo">Ingreso de residuos</option>
            <option value="ruta">Rutas completadas</option>
            <option value="alerta">Alertas</option>
            <option value="sistema">Sistema</option>
          </select>
        </div>
        <div className="hidden h-6 w-px bg-outline-variant/50 md:block" />
        <div className="flex flex-1 items-center gap-xs text-on-surface-variant">
          <span className="material-symbols-outlined">person_search</span>
          <input aria-label="Filtrar por actor" value={actorQuery} onChange={(event) => setActorQuery(event.target.value)} className="w-full bg-transparent py-sm outline-none placeholder:text-on-surface-variant/60" placeholder="Filtrar por actor..." />
        </div>
      </div>

      <section className="overflow-hidden rounded-2xl bg-surface-container-lowest p-md shadow-sm">
        {filteredActivities.length === 0 ? (
          <p className="p-lg text-center text-on-surface-variant">No hay actividades que coincidan con los filtros.</p>
        ) : (
          <div className="relative space-y-lg border-l-2 border-surface-container-high pl-xl">
            {filteredActivities.map((activity, index) => {
              const presentation = presentationByType[activity.type];
              return (
                <article key={activity.id} className={index === filteredActivities.length - 1 ? "relative" : "relative pb-lg"}>
                  <span className="absolute -left-[29px] top-1 flex h-6 w-6 items-center justify-center rounded-full bg-surface-container-lowest">
                    <span className={`h-3 w-3 rounded-full ${presentation.dot}`} />
                  </span>
                  <div className="flex flex-col justify-between gap-sm md:flex-row">
                    <div>
                      <span className="font-label-sm text-on-surface-variant">{activity.time}</span>
                      <h2 className="mt-xs font-headline-lg-mobile text-on-surface">{activity.title}</h2>
                      <p className="mt-xs max-w-2xl text-body-md text-on-surface-variant">{activity.description}</p>
                    </div>
                    <div className="flex h-fit items-center gap-sm">
                      <span className={`inline-flex items-center gap-xs rounded-full px-sm py-xs font-label-sm ${presentation.chip}`}>
                        <span className="material-symbols-outlined text-[15px]">{presentation.icon}</span>
                        {activity.actor}
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}