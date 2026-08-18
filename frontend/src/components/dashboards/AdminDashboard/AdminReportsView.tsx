import { useEffect, useState } from "react";
import {
  fetchAdminManagedWasteReport,
  fetchAdminManagedWasteReports,
  type AdminManagedWasteReport,
  type AdminManagedWasteReportDetail,
} from "../../../api/dashboard";

const formatDate = (rawDate: string | null) => {
  if (!rawDate) {
    return "Sin registro";
  }

  const date = new Date(rawDate);
  return Number.isNaN(date.getTime())
    ? rawDate
    : date.toLocaleDateString("es-CL");
};

export default function AdminReportsView() {
  const [reports, setReports] = useState<AdminManagedWasteReport[]>([]);
  const [selectedReport, setSelectedReport] =
    useState<AdminManagedWasteReportDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadReports = async () => {
      try {
        setLoading(true);
        const managedReports = await fetchAdminManagedWasteReports();
        setReports(managedReports);
        setError("");
      } catch {
        setError("No fue posible cargar el historial de residuos gestionados.");
      } finally {
        setLoading(false);
      }
    };

    void loadReports();
  }, []);

  const selectReport = async (reportId: number) => {
    try {
      setLoadingDetail(true);
      setError("");
      setSelectedReport(await fetchAdminManagedWasteReport(reportId));
    } catch {
      setError("No fue posible cargar el reporte seleccionado.");
    } finally {
      setLoadingDetail(false);
    }
  };

  return (
    <div className="space-y-lg">
      <div>
        <span className="font-label-sm uppercase tracking-widest text-primary">
          Trazabilidad
        </span>
        <h1 className="font-display-lg text-on-surface">Reportes de residuos</h1>
        <p className="mt-xs text-body-md text-on-surface-variant">
          Revise los residuos gestionados y consulte su reporte individual.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-error bg-error-container p-md text-on-error-container">
          {error}
        </div>
      )}

      <div className="grid gap-lg xl:grid-cols-[minmax(0,1.2fr)_minmax(360px,0.8fr)]">
        <section className="overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest shadow-sm">
          <div className="border-b border-outline-variant bg-surface-container-low px-md py-md">
            <h2 className="font-headline-lg-mobile text-on-surface">Historial gestionado</h2>
          </div>
          {loading ? (
            <p className="p-lg text-on-surface-variant">Cargando residuos gestionados...</p>
          ) : reports.length === 0 ? (
            <p className="p-lg text-on-surface-variant">Aún no hay residuos gestionados.</p>
          ) : (
            <div className="divide-y divide-outline-variant/50">
              {reports.map((report) => (
                <button
                  key={report.id}
                  type="button"
                  onClick={() => void selectReport(report.id)}
                  className={`flex w-full items-center justify-between gap-md px-md py-md text-left transition-colors hover:bg-surface-container-low ${
                    selectedReport?.id === report.id
                      ? "bg-primary-fixed/30"
                      : "bg-surface-container-lowest"
                  }`}
                >
                  <span>
                    <span className="block font-semibold text-on-surface">{report.tipo}</span>
                    <span className="mt-1 block font-label-sm text-on-surface-variant">
                      {report.empresaGeneradora} - {report.cantidad} {report.unidad}
                    </span>
                  </span>
                  <span className="flex items-center gap-sm font-label-sm text-primary">
                    {formatDate(report.fechaGestion)}
                    <span className="material-symbols-outlined">chevron_right</span>
                  </span>
                </button>
              ))}
            </div>
          )}
        </section>

        <aside className="min-h-[360px] rounded-xl border border-outline-variant bg-surface-container-lowest p-lg shadow-sm">
          {loadingDetail ? (
            <p className="text-on-surface-variant">Cargando reporte...</p>
          ) : !selectedReport ? (
            <div className="flex h-full flex-col items-center justify-center text-center text-on-surface-variant">
              <span className="material-symbols-outlined mb-sm text-[48px] text-outline">description</span>
              Seleccione un residuo para ver su reporte.
            </div>
          ) : (
            <div className="space-y-md">
              <div className="flex items-start justify-between gap-sm">
                <div>
                  <span className="font-label-sm uppercase tracking-widest text-primary">Reporte #{selectedReport.id}</span>
                  <h2 className="font-headline-lg text-on-surface">{selectedReport.tipo}</h2>
                </div>
                <span className="rounded-full bg-primary-fixed px-sm py-xs font-label-sm text-primary">Gestionado</span>
              </div>
              <dl className="grid grid-cols-2 gap-md border-y border-outline-variant py-md text-body-md">
                <div><dt className="font-label-sm text-on-surface-variant">Cantidad</dt><dd className="font-semibold text-on-surface">{selectedReport.cantidad} {selectedReport.unidad}</dd></div>
                <div><dt className="font-label-sm text-on-surface-variant">Procesamiento</dt><dd className="font-semibold text-on-surface">{formatDate(selectedReport.fechaProcesamiento)}</dd></div>
                <div><dt className="font-label-sm text-on-surface-variant">Generador</dt><dd className="font-semibold text-on-surface">{selectedReport.empresaGeneradora}</dd></div>
                <div><dt className="font-label-sm text-on-surface-variant">Reciclador</dt><dd className="font-semibold text-on-surface">{selectedReport.empresaRecicladora}</dd></div>
              </dl>
              <div className="space-y-xs text-body-md text-on-surface-variant">
                <p>Publicado: {formatDate(selectedReport.fechaPublicacion)}</p>
                <p>Recolectado: {formatDate(selectedReport.fechaRecoleccion)}</p>
              </div>
              {selectedReport.certificado && (
                <a className="inline-flex items-center gap-sm font-bold text-secondary hover:underline" href={selectedReport.certificado} target="_blank" rel="noreferrer">
                  <span className="material-symbols-outlined">verified</span>
                  Ver certificado
                </a>
              )}
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}