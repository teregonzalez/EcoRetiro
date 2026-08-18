import { useEffect, useState } from "react";
import {
  createWasteCategory,
  fetchWasteCategories,
  type WasteCategory,
} from "../../../api/dashboard";

const categoryPresentation = (name: string) => {
  const normalizedName = name.toLowerCase();

  if (normalizedName.includes("plástico") || normalizedName.includes("plastico")) {
    return { icon: "water_bottle", color: "text-[#2196F3]", background: "bg-[#2196F3]/10", accent: "bg-[#2196F3]" };
  }
  if (normalizedName.includes("cartón") || normalizedName.includes("papel")) {
    return { icon: "description", color: "text-[#8D6E63]", background: "bg-[#8D6E63]/10", accent: "bg-[#8D6E63]" };
  }
  if (normalizedName.includes("metal")) {
    return { icon: "precision_manufacturing", color: "text-[#757575]", background: "bg-[#9E9E9E]/10", accent: "bg-[#9E9E9E]" };
  }
  if (normalizedName.includes("aceite")) {
    return { icon: "oil_barrel", color: "text-[#d97706]", background: "bg-[#f59e0b]/10", accent: "bg-[#f59e0b]" };
  }
  return { icon: "recycling", color: "text-tertiary", background: "bg-tertiary-fixed/40", accent: "bg-tertiary" };
};

export default function AdminWasteCatalogView() {
  const [categories, setCategories] = useState<WasteCategory[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryUnit, setNewCategoryUnit] = useState("kg");

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        setCategories(await fetchWasteCategories());
        setError("");
      } catch {
        setError("No fue posible cargar el catálogo de residuos.");
      } finally {
        setLoading(false);
      }
    };

    void loadCategories();
  }, []);

  const filteredCategories = categories.filter((category) =>
    category.name.toLocaleLowerCase("es-CL").includes(query.toLocaleLowerCase("es-CL")),
  );

  const handleCreateCategory = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      setIsSubmitting(true);
      setError("");
      const createdCategory = await createWasteCategory({
        name: newCategoryName,
        unit: newCategoryUnit,
      });
      setCategories((currentCategories) => [...currentCategories, createdCategory].sort(
        (firstCategory, secondCategory) => firstCategory.name.localeCompare(secondCategory.name, "es-CL"),
      ));
      setNewCategoryName("");
      setNewCategoryUnit("kg");
      setIsCreating(false);
    } catch (createError: any) {
      setError(createError.response?.data?.error || "No fue posible crear la categoría.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-lg">
      <div className="flex flex-col gap-md md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 font-label-sm uppercase tracking-widest text-primary">
            <span className="material-symbols-outlined text-[16px]">eco</span>
            Módulo de Gestión
          </span>
          <h1 className="mt-base font-display-lg text-on-surface">Catálogo de Residuos</h1>
          <p className="mt-xs text-body-md text-on-surface-variant">
            Categorías y tipos de materiales aceptados en la red EcoRetiro.
          </p>
        </div>
        <button type="button" onClick={() => setIsCreating(true)} className="flex items-center justify-center gap-sm rounded-xl bg-secondary px-md py-sm font-label-sm uppercase text-on-secondary transition-colors hover:bg-on-secondary-fixed-variant">
          <span className="material-symbols-outlined">add_circle</span>
          Agregar Nueva Categoría
        </button>
      </div>

      <div className="relative rounded-xl bg-surface-container-lowest shadow-sm ring-1 ring-outline/10">
        <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
        <input
          className="w-full rounded-xl bg-transparent py-md pl-[52px] pr-md text-body-md text-on-surface outline-none transition-colors focus:bg-surface-container-low focus:ring-2 focus:ring-secondary"
          placeholder="Buscar por material..."
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>

      {error && <p className="rounded-lg border border-error bg-error-container p-md text-on-error-container">{error}</p>}
      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-on-surface/40 p-margin backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="new-category-title">
          <form onSubmit={handleCreateCategory} className="w-full max-w-md rounded-xl bg-surface-container-lowest p-lg shadow-xl">
            <div className="flex items-start justify-between gap-md">
              <div>
                <h2 id="new-category-title" className="font-headline-lg text-on-surface">Agregar categoría</h2>
                <p className="mt-xs text-body-md text-on-surface-variant">Registre un nuevo material para que esté disponible en la plataforma.</p>
              </div>
              <button type="button" aria-label="Cerrar formulario" onClick={() => setIsCreating(false)} className="flex h-10 w-10 flex-none items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="mt-lg space-y-md">
              <div className="space-y-xs">
                <label className="font-label-sm text-on-surface-variant" htmlFor="category-name">Nombre de categoría</label>
                <input id="category-name" className="input-field" placeholder="Ej: Vidrio" value={newCategoryName} onChange={(event) => setNewCategoryName(event.target.value)} required autoFocus />
              </div>
              <div className="space-y-xs">
                <label className="font-label-sm text-on-surface-variant" htmlFor="category-unit">Unidad de medida</label>
                <select id="category-unit" className="input-field" value={newCategoryUnit} onChange={(event) => setNewCategoryUnit(event.target.value)} required>
                  <option value="kg">Kilogramos (kg)</option>
                  <option value="litros">Litros</option>
                  <option value="unidades">Unidades</option>
                </select>
              </div>
            </div>
            <div className="mt-lg flex justify-end gap-sm">
              <button type="button" onClick={() => setIsCreating(false)} className="px-md py-sm font-bold text-on-surface-variant hover:bg-surface-container">Cancelar</button>
              <button type="submit" disabled={isSubmitting} className="rounded-lg bg-primary px-lg py-sm font-bold text-on-primary transition-colors hover:bg-primary-container disabled:opacity-60">
                {isSubmitting ? "Guardando..." : "Crear categoría"}
              </button>
            </div>
          </form>
        </div>
      )}
      {loading ? (
        <p className="rounded-xl bg-surface-container-low p-lg text-on-surface-variant">Cargando categorías...</p>
      ) : filteredCategories.length === 0 ? (
        <p className="rounded-xl bg-surface-container-low p-lg text-on-surface-variant">No se encontraron categorías.</p>
      ) : (
        <div className="grid grid-cols-1 gap-gutter md:grid-cols-2 xl:grid-cols-3">
          {filteredCategories.map((category) => {
            const presentation = categoryPresentation(category.name);
            return (
              <article key={category.id} className="relative flex min-h-[220px] flex-col overflow-hidden rounded-xl bg-surface-container-lowest p-md shadow-sm ring-1 ring-outline/10 transition-shadow hover:shadow-md">
                <div className={`absolute inset-y-0 left-0 w-1 ${presentation.accent}`} />
                <div className="flex items-start justify-between">
                  <span className={`flex h-12 w-12 items-center justify-center rounded-xl ${presentation.background} ${presentation.color}`}>
                    <span className="material-symbols-outlined text-[24px]">{presentation.icon}</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-sm py-xs font-label-sm uppercase text-primary">
                    <span className="h-2 w-2 rounded-full bg-primary" /> Activo
                  </span>
                </div>
                <div className="mt-md">
                  <h2 className="font-headline-lg-mobile text-on-surface">{category.name}</h2>
                  <p className="mt-xs text-body-md text-on-surface-variant">Unidad de registro: {category.unit}</p>
                </div>
                <div className="mt-auto flex items-center justify-between border-t border-outline-variant pt-md">
                  <span className="font-label-sm uppercase tracking-wider text-on-surface-variant">Categoría #{category.id}</span>
                  <button type="button" aria-label={`Editar ${category.name}`} disabled title="La edición de categorías requiere una API administrativa" className="flex h-10 w-10 items-center justify-center rounded-full text-on-surface-variant opacity-60">
                    <span className="material-symbols-outlined">edit</span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}