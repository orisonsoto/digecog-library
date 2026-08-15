import { useEffect, useRef } from 'react';
import { FileText, Binary, ShieldCheck } from 'lucide-react';

/**
 * Aviso legal que se superpone al acceso institucional.
 * Debe aceptarse explícitamente antes de poder usar el prototipo: deja constancia
 * de que la plataforma es un ejercicio conceptual construido sobre información
 * pública y cifras sintéticas, sin uso de información confidencial.
 */
export function AvisoLegal({ onAceptar }: { onAceptar: () => void }) {
  const botonRef = useRef<HTMLButtonElement>(null);

  // El foco arranca en el botón (accesibilidad), pero sin desplazar la vista:
  // en móvil el botón queda bajo el pliegue y el scroll automático ocultaría el aviso.
  useEffect(() => { botonRef.current?.focus({ preventScroll: true }); }, []);

  const puntos = [
    {
      icon: FileText,
      titulo: 'Solo fuentes públicas',
      texto: 'Construido con información de acceso público: portal institucional de DIGECOG, Plan de Cuentas Contables, marco legal y nombres de instituciones del Estado.',
    },
    {
      icon: Binary,
      titulo: 'Cifras generadas por algoritmo',
      texto: 'Todos los saldos, movimientos, estados financieros e indicadores son sintéticos, producidos por un generador de datos con fines exclusivamente demostrativos.',
    },
    {
      icon: ShieldCheck,
      titulo: 'Sin información confidencial',
      texto: 'No se ha accedido, utilizado ni divulgado información confidencial, reservada, interna o privilegiada de ninguna institución pública.',
    },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="aviso-titulo"
      className="fixed inset-0 z-[100] overflow-y-auto"
      style={{ background: 'linear-gradient(135deg, var(--color-brand-950), var(--color-brand-900) 55%, var(--color-brand-800))' }}
    >
      <div className="min-h-full flex items-center justify-center p-5 py-7 sm:p-8">
        <div className="w-full max-w-3xl text-white">

          <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/40 bg-amber-300/10 px-3 py-1.5 mb-4 sm:mb-6">
            <span className="h-2 w-2 rounded-full bg-amber-300 animate-pulse" />
            <span className="text-[11px] sm:text-xs font-bold tracking-[0.18em] text-amber-200 uppercase">
              Prototipo conceptual · No es un sistema oficial
            </span>
          </div>

          <h1 id="aviso-titulo" className="font-black leading-[0.88] tracking-tight mb-5">
            <span className="block text-[3.25rem] sm:text-7xl lg:text-8xl">DATOS</span>
            <span
              className="block text-[3.25rem] sm:text-7xl lg:text-8xl"
              style={{ background: 'linear-gradient(100deg, var(--color-accent-teal), #7dd3fc 60%, #fcd34d)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}
            >
              SIMULADOS
            </span>
          </h1>

          <p className="text-[15px] sm:text-xl text-white/85 leading-relaxed max-w-2xl mb-5 sm:mb-8">
            <strong className="text-white">DIGECOG 360° es un ejercicio de diseño.</strong> Ninguna cifra
            que verá a continuación proviene de un sistema real ni ha sido publicada oficialmente.
          </p>

          <div className="grid gap-2.5 sm:gap-3 sm:grid-cols-3 mb-5 sm:mb-8">
            {puntos.map((p) => (
              <div key={p.titulo} className="rounded-xl border border-white/15 bg-white/[0.07] p-3.5 sm:p-4">
                <p.icon size={22} className="text-[var(--color-accent-teal)] mb-2.5" />
                <div className="font-bold text-sm mb-1.5 leading-snug">{p.titulo}</div>
                <div className="text-[12.5px] text-white/65 leading-relaxed">{p.texto}</div>
              </div>
            ))}
          </div>

          <div className="rounded-xl border-l-4 border-amber-300 bg-white/[0.07] px-4 py-3.5 mb-5 sm:mb-8">
            <p className="text-sm sm:text-base text-white/90 leading-relaxed">
              Las cifras mostradas <strong className="text-white">no deben citarse ni reproducirse como
              información oficial</strong> de DIGECOG ni del Estado dominicano.
            </p>
          </div>

          <button
            ref={botonRef}
            onClick={onAceptar}
            className="w-full rounded-xl py-4 sm:py-5 text-base sm:text-lg font-black tracking-wide text-[var(--color-brand-950)] transition-transform hover:scale-[1.015] focus:outline-none focus:ring-4 focus:ring-white/40"
            style={{ background: 'linear-gradient(100deg, var(--color-accent-teal), #7dd3fc)' }}
          >
            ENTENDIDO Y ACEPTADO
          </button>

          <p className="text-center text-[11px] text-white/40 mt-4">
            Al continuar usted reconoce haber leído este aviso.
          </p>
        </div>
      </div>
    </div>
  );
}
