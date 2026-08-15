interface ReportsViewProps {
  title: string;
  subtitle: string;
  roleLabel: string;
}

const managedWaste = [
  { type: 'Papel y cartón', quantity: '540 kg', status: 'Reciclado' },
  { type: 'Plásticos', quantity: '390 kg', status: 'Procesado' },
  { type: 'Metales', quantity: '220 kg', status: 'Valorizado' },
  { type: 'Vidrio', quantity: '134 kg', status: 'Recuperado' },
];

export default function ReportsView({
  title,
  subtitle,
  roleLabel,
}: ReportsViewProps) {
  const handleExportPdf = () => {
    const printWindow = window.open('', '_blank', 'width=1200,height=900');
    if (!printWindow) {
      return;
    }

    const reportHtml = `
      <!DOCTYPE html>
      <html lang="es">
        <head>
          <meta charset="UTF-8" />
          <title>Reporte EcoRetiro</title>
          <style>
            :root {
              --primary: #00450d;
              --primary-container: #1b5e20;
              --secondary: #2b5bb5;
              --secondary-container: #759efd;
              --tertiary: #004516;
              --surface: #f8fafb;
              --surface-container: #eceeef;
              --surface-container-low: #f2f4f5;
              --surface-container-lowest: #ffffff;
              --on-surface: #191c1d;
              --on-surface-variant: #41493e;
              --on-primary: #ffffff;
              --on-primary-container: #90d689;
              --on-secondary: #ffffff;
              --outline: #717a6d;
              --outline-variant: #c0c9bb;
            }

            * { box-sizing: border-box; }

            body {
              margin: 0;
              font-family: Inter, Arial, sans-serif;
              background: var(--surface);
              color: var(--on-surface);
              padding: 32px;
            }

            .page {
              max-width: 1100px;
              margin: 0 auto;
              background: var(--surface-container-lowest);
              border-radius: 24px;
              box-shadow: 0 24px 60px rgba(25, 28, 29, 0.08);
              overflow: hidden;
              position: relative;
            }

            .top-accent {
              height: 8px;
              background: linear-gradient(90deg, var(--primary), #91d78a, var(--secondary));
            }

            .content {
              padding: 40px 40px 28px;
            }

            .header {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              gap: 24px;
              margin-bottom: 24px;
            }

            .brand {
              display: flex;
              align-items: center;
              gap: 10px;
              margin-bottom: 12px;
              color: var(--primary);
              font-weight: 700;
              font-size: 20px;
            }

            .brand-mark {
              width: 26px;
              height: 26px;
              border-radius: 50%;
              background: linear-gradient(135deg, var(--primary), var(--secondary));
              display: inline-flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-size: 12px;
              font-weight: 700;
            }

            h1 {
              margin: 0;
              font-size: 38px;
              line-height: 1.1;
              color: var(--on-surface);
            }

            .subtitle {
              margin-top: 12px;
              color: var(--on-surface-variant);
              font-size: 16px;
              max-width: 700px;
            }

            .meta {
              min-width: 260px;
              background: var(--surface);
              border: 1px solid var(--outline-variant);
              border-radius: 14px;
              padding: 16px 18px;
              font-size: 12px;
              line-height: 1.75;
              color: var(--on-surface);
            }

            .meta-label {
              display: block;
              letter-spacing: 0.12em;
              text-transform: uppercase;
              color: var(--on-surface-variant);
              margin-bottom: 8px;
            }

            .tag {
              display: inline-flex;
              align-items: center;
              gap: 8px;
              background: rgba(0, 69, 13, 0.08);
              color: var(--primary);
              border-radius: 999px;
              padding: 5px 10px;
              font-weight: 700;
              margin-top: 8px;
            }

            .stats {
              display: grid;
              grid-template-columns: repeat(3, minmax(0, 1fr));
              gap: 16px;
              margin-bottom: 28px;
            }

            .stat {
              border-radius: 18px;
              padding: 18px 20px;
              background: var(--surface-container-lowest);
              border: 1px solid var(--outline-variant);
              box-shadow: 0 8px 24px rgba(25, 28, 29, 0.04);
            }

            .stat.primary {
              background: var(--primary-container);
              color: var(--on-primary-container);
            }

            .stat-title {
              font-size: 12px;
              letter-spacing: 0.08em;
              text-transform: uppercase;
              opacity: 0.78;
            }

            .stat-value {
              font-size: 34px;
              font-weight: 700;
              margin-top: 10px;
              line-height: 1.1;
            }

            .stat-detail {
              font-size: 13px;
              margin-top: 8px;
              opacity: 0.9;
            }

            .summary {
              display: grid;
              grid-template-columns: 1.5fr 1fr;
              gap: 20px;
              margin-bottom: 24px;
            }

            .panel {
              background: var(--surface-container-lowest);
              border: 1px solid var(--outline-variant);
              border-radius: 18px;
              padding: 18px 20px;
            }

            .panel h3 {
              margin: 0 0 12px;
              font-size: 24px;
            }

            .waste-list {
              width: 100%;
              border-collapse: collapse;
              margin-top: 8px;
            }

            .waste-list th,
            .waste-list td {
              border-bottom: 1px solid var(--outline-variant);
              padding: 10px 8px;
              text-align: left;
            }

            .waste-list th {
              font-size: 12px;
              letter-spacing: 0.08em;
              text-transform: uppercase;
              color: var(--on-surface-variant);
            }

            .chip {
              display: inline-block;
              padding: 6px 10px;
              background: rgba(43, 91, 181, 0.1);
              border-radius: 999px;
              color: var(--secondary);
              font-size: 12px;
              font-weight: 700;
            }

            .metrics-box {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 12px;
            }

            .metric {
              background: var(--surface-container-low);
              border-radius: 12px;
              padding: 16px 14px;
            }

            .metric-label {
              color: var(--on-surface-variant);
              font-size: 12px;
              text-transform: uppercase;
              letter-spacing: 0.08em;
            }

            .metric-value {
              margin-top: 12px;
              font-size: 30px;
              font-weight: 700;
            }

            .footer {
              margin-top: 18px;
              padding-top: 18px;
              border-top: 1px solid var(--outline-variant);
              display: flex;
              justify-content: space-between;
              align-items: center;
              font-size: 12px;
              color: var(--on-surface-variant);
            }
          </style>
        </head>
        <body>
          <div class="page">
            <div class="top-accent"></div>
            <div class="content">
              <header class="header">
                <div>
                  <div class="brand">
                    <span class="brand-mark">E</span>
                    <span>EcoRetiro</span>
                  </div>
                  <h1>${title}</h1>
                  <p class="subtitle">${subtitle}</p>
                </div>

                <div class="meta">
                  <span class="meta-label">Documento oficial</span>
                  <div>ID: ECO-REPORT-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}</div>
                  <div>Rol: ${roleLabel}</div>
                  <div>Período: últimos 30 días</div>
                  <div>Fecha emisión: ${new Date().toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit', year: 'numeric' })}</div>
                  <span class="tag">✓ Auditado</span>
                </div>
              </header>

              <section class="stats">
                <div class="stat primary">
                  <div class="stat-title">CO₂ evitado</div>
                  <div class="stat-value">42.5 kg</div>
                  <div class="stat-detail">Ahorro acumulado estimado</div>
                </div>
                <div class="stat">
                  <div class="stat-title">Volumen gestionado</div>
                  <div class="stat-value">1.284 ton</div>
                  <div class="stat-detail">Material procesado y registrado</div>
                </div>
                <div class="stat">
                  <div class="stat-title">Tasa de circularidad</div>
                  <div class="stat-value">87%</div>
                  <div class="stat-detail">Índice de aprovechamiento</div>
                </div>
              </section>

              <section class="summary">
                <div class="panel">
                  <h3>Residuos gestionados</h3>
                  <table class="waste-list">
                    <thead>
                      <tr>
                        <th>Tipo</th>
                        <th>Cantidad</th>
                        <th>Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${managedWaste
                        .map(
                          (item) => `
                            <tr>
                              <td>${item.type}</td>
                              <td>${item.quantity}</td>
                              <td><span class="chip">${item.status}</span></td>
                            </tr>
                          `,
                        )
                        .join('')}
                    </tbody>
                  </table>
                </div>

                <div class="panel">
                  <h3>Resumen del período</h3>
                  <div class="metrics-box">
                    <div class="metric">
                      <div class="metric-label">Solicitudes activas</div>
                      <div class="metric-value">24</div>
                    </div>
                    <div class="metric">
                      <div class="metric-label">Recolecciones completadas</div>
                      <div class="metric-value">18</div>
                    </div>
                  </div>
                </div>
              </section>

              <footer class="footer">
                <span>EcoRetiro • Gestión de residuos y circularidad</span>
                <span>Generado el ${new Date().toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit', year: 'numeric' })}</span>
              </footer>
            </div>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(reportHtml);
    printWindow.document.close();
    printWindow.focus();
    window.setTimeout(() => {
      printWindow.print();
    }, 300);
  };

  return (
    <div className="space-y-lg">
      <div className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-lg shadow-sm">
        <div className="flex flex-col gap-sm md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-label-sm uppercase tracking-widest text-on-surface-variant">
              {roleLabel}
            </p>
            <h2 className="font-headline-lg-mobile text-on-surface">{title}</h2>
            <p className="mt-sm text-body-md text-on-surface-variant">
              {subtitle}
            </p>
          </div>
          <button
            type="button"
            onClick={handleExportPdf}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-md py-sm font-label-sm text-on-primary transition-all hover:opacity-90"
          >
            <span className="material-symbols-outlined">download</span>
            Exportar reporte
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-gutter lg:grid-cols-3">
        <article className="rounded-xl border border-outline-variant bg-surface-container-lowest p-md shadow-sm">
          <div className="flex items-center gap-sm">
            <span className="material-symbols-outlined text-primary">co2</span>
            <h3 className="font-headline-lg-mobile text-on-surface">
              CO₂ evitado
            </h3>
          </div>
          <p className="mt-md text-display-lg text-primary">42.5 kg</p>
          <p className="mt-sm text-body-md text-on-surface-variant">
            Estimación acumulada del período.
          </p>
        </article>

        <article className="rounded-xl border border-outline-variant bg-surface-container-lowest p-md shadow-sm">
          <div className="flex items-center gap-sm">
            <span className="material-symbols-outlined text-secondary">
              scale
            </span>
            <h3 className="font-headline-lg-mobile text-on-surface">
              Volumen gestionado
            </h3>
          </div>
          <p className="mt-md text-display-lg text-secondary">1.284 ton</p>
          <p className="mt-sm text-body-md text-on-surface-variant">
            Toneladas procesadas y registradas.
          </p>
        </article>

        <article className="rounded-xl border border-outline-variant bg-surface-container-lowest p-md shadow-sm">
          <div className="flex items-center gap-sm">
            <span className="material-symbols-outlined text-tertiary">
              analytics
            </span>
            <h3 className="font-headline-lg-mobile text-on-surface">
              Tasa de circularidad
            </h3>
          </div>
          <p className="mt-md text-display-lg text-tertiary">87%</p>
          <p className="mt-sm text-body-md text-on-surface-variant">
            Índice de aprovechamiento del material.
          </p>
        </article>
      </div>

      <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-md shadow-sm">
        <div className="mb-md flex items-center justify-between">
          <h3 className="font-headline-lg-mobile text-on-surface">
            Resumen del período
          </h3>
          <span className="font-label-sm text-on-surface-variant">
            Últimos 30 días
          </span>
        </div>
        <div className="grid grid-cols-1 gap-md md:grid-cols-2">
          <div className="rounded-lg bg-surface-container-low p-md">
            <p className="font-label-sm text-on-surface-variant">
              Solicitudes activas
            </p>
            <p className="mt-sm text-headline-lg-mobile text-on-surface">24</p>
          </div>
          <div className="rounded-lg bg-surface-container-low p-md">
            <p className="font-label-sm text-on-surface-variant">
              Recolecciones completadas
            </p>
            <p className="mt-sm text-headline-lg-mobile text-on-surface">18</p>
          </div>
        </div>
      </div>
    </div>
  );
}
