import { lazy, Suspense, useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

const GlobalSearchDialog = lazy(() => import("@/components/GlobalSearchDialog"));

const GlobalSearch = () => {
  const [open, setOpen] = useState(false);
  const [touched, setTouched] = useState(false);

  const openDialog = () => {
    setTouched(true);
    setOpen(true);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((v) => {
          const next = !v;
          if (next) setTouched(true);
          return next;
        });
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={openDialog}
        aria-label="Abrir pesquisa global"
        className="gap-2 text-muted-foreground hover:text-foreground"
      >
        <Search className="w-4 h-4" />
        <span className="hidden lg:inline text-xs">Buscar…</span>
      </Button>

      {touched && (
        <Suspense fallback={null}>
          <GlobalSearchDialog open={open} onOpenChange={setOpen} />
        </Suspense>
      )}
    </>
  );
};

export default GlobalSearch;