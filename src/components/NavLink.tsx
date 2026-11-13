import Link from "next/link";
import { resolveHref, type AppRoute } from "@/lib/routes";

interface NavLinkProps {
  route: AppRoute;
  className?: string;
}

/**
 * Enlace si la ruta existe; si no, texto inactivo (sin rol ni foco) anunciado
 * como no disponible. Color sólido, no opacidad, para mantener contraste AA.
 */
export function NavLink({ route, className = "" }: NavLinkProps) {
  const href = resolveHref(route);

  if (href === null) {
    return (
      // Subrayado punteado fino: pista no cromática de "aún no es un enlace".
      <span
        className={`cursor-default text-silver underline decoration-silver/50 decoration-dotted decoration-1 underline-offset-[6px] ${className}`}
      >
        {route.label}
        <span className="sr-only">, aún no disponible</span>
      </span>
    );
  }

  return (
    <Link
      href={href}
      className={`font-medium text-ivory underline-offset-8 hover:underline focus-visible:underline ${className}`}
    >
      {route.label}
    </Link>
  );
}
