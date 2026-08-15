import { useEffect, useRef, useState } from 'react';
import { X, Send, Sparkles } from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import { ALERTAS } from '../../data/generator';
import { responderMia, PREGUNTAS_SUGERIDAS } from '../../lib/miaEngine';
import { DemoTag, Badge } from '../ui/primitives';

interface Mensaje { autor: 'usuario' | 'mia'; texto: string }

export function PanelDerecho() {
  const abierto = useAppStore((s) => s.panelDerechoAbierto);
  const setAbierto = useAppStore((s) => s.setPanelDerechoAbierto);
  const miaAbierta = useAppStore((s) => s.miaAbierta);
  const [tab, setTab] = useState<'alertas' | 'mia'>('alertas');
  const [mensajes, setMensajes] = useState<Mensaje[]>([
    { autor: 'mia', texto: 'Hola, soy Mía, el copiloto de inteligencia contable de DIGECOG. ¿En qué puedo ayudarle hoy?' },
  ]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => { if (miaAbierta) setTab('mia'); }, [miaAbierta]);
  useEffect(() => { scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' }); }, [mensajes]);

  if (!abierto) {
    return (
      <button
        onClick={() => setAbierto(true)}
        className="fixed right-3 top-1/2 -translate-y-1/2 z-30 rounded-full bg-white shadow-lg border border-[var(--border-subtle)] p-2 text-[var(--text-muted)] hover:text-[var(--color-brand-600)]"
      >
        ‹
      </button>
    );
  }

  const enviar = (texto: string) => {
    if (!texto.trim()) return;
    setMensajes((m) => [...m, { autor: 'usuario', texto }]);
    setInput('');
    setTimeout(() => {
      const r = responderMia(texto);
      setMensajes((m) => [...m, { autor: 'mia', texto: r.texto }]);
    }, 350);
  };

  return (
    <aside className="w-[320px] shrink-0 h-full border-l border-[var(--border-subtle)] bg-white flex flex-col">
      <div className="flex items-center justify-between px-3 h-14 border-b border-[var(--border-subtle)] shrink-0">
        <div className="flex gap-1">
          <button onClick={() => setTab('alertas')} className={`px-2.5 py-1 rounded-md text-xs font-semibold ${tab === 'alertas' ? 'bg-[var(--color-brand-50)] text-[var(--color-brand-700)]' : 'text-[var(--text-muted)]'}`}>Alertas</button>
          <button onClick={() => setTab('mia')} className={`px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1 ${tab === 'mia' ? 'bg-[var(--color-brand-50)] text-[var(--color-brand-700)]' : 'text-[var(--text-muted)]'}`}><Sparkles size={12} /> Mía AI</button>
        </div>
        <button onClick={() => setAbierto(false)} className="text-[var(--text-muted)] hover:text-[var(--text-primary)]"><X size={16} /></button>
      </div>

      {tab === 'alertas' && (
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          <DemoTag />
          {ALERTAS.slice(0, 20).map((a) => (
            <div key={a.id} className="rounded-lg border border-[var(--border-subtle)] p-2.5 text-xs space-y-1">
              <div className="flex items-center justify-between">
                <Badge tono={a.severidad === 'Crítica' ? 'peligro' : a.severidad === 'Alta' ? 'alerta' : 'info'}>{a.severidad}</Badge>
                <span className="text-[var(--text-muted)]">{a.fecha}</span>
              </div>
              <div className="font-medium text-[var(--text-primary)]">{a.modulo}</div>
              <div className="text-[var(--text-secondary)]">{a.mensaje}</div>
            </div>
          ))}
        </div>
      )}

      {tab === 'mia' && (
        <>
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-3">
            {mensajes.map((m, i) => (
              <div key={i} className={`text-xs rounded-xl px-3 py-2 max-w-[92%] whitespace-pre-line ${m.autor === 'mia' ? 'bg-[var(--color-brand-50)] text-[var(--text-primary)]' : 'bg-slate-100 ml-auto text-[var(--text-primary)]'}`}>
                {m.texto}
              </div>
            ))}
            {mensajes.length <= 1 && (
              <div className="space-y-1.5 pt-2">
                {PREGUNTAS_SUGERIDAS.map((p) => (
                  <button key={p} onClick={() => enviar(p)} className="w-full text-left text-[11px] rounded-lg border border-[var(--border-subtle)] px-2.5 py-1.5 hover:border-[var(--color-brand-400)] hover:bg-[var(--color-brand-50)]">
                    {p}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="p-2.5 border-t border-[var(--border-subtle)] flex items-center gap-1.5 shrink-0">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && enviar(input)}
              placeholder="Pregúntele a Mía..."
              className="flex-1 rounded-lg border border-[var(--border-subtle)] px-2.5 py-1.5 text-xs outline-none focus:border-[var(--color-brand-500)]"
            />
            <button onClick={() => enviar(input)} className="h-8 w-8 flex items-center justify-center rounded-lg text-white shrink-0" style={{ background: 'var(--color-brand-600)' }}>
              <Send size={14} />
            </button>
          </div>
        </>
      )}
    </aside>
  );
}
