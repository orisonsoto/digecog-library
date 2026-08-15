import { useEffect, useRef, useState } from 'react';
import { Sparkles, Send } from 'lucide-react';
import { SectionHeader, DemoTag } from '../components/ui/primitives';
import { responderMia, PREGUNTAS_SUGERIDAS } from '../lib/miaEngine';

interface Mensaje { autor: 'usuario' | 'mia'; texto: string }

export default function MiaAI() {
  const [mensajes, setMensajes] = useState<Mensaje[]>([
    { autor: 'mia', texto: 'Hola, soy Mía DIGECOG AI. Puedo analizar instituciones, comparar empresas públicas, resumir el cierre fiscal y explicar normativas contables a partir del dataset del sistema. ¿En qué le ayudo?' },
  ]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => { scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' }); }, [mensajes]);

  const enviar = (texto: string) => {
    if (!texto.trim()) return;
    setMensajes((m) => [...m, { autor: 'usuario', texto }]);
    setInput('');
    setTimeout(() => setMensajes((m) => [...m, { autor: 'mia', texto: responderMia(texto).texto }]), 400);
  };

  return (
    <div className="space-y-4 flex flex-col h-full">
      <SectionHeader titulo="Copiloto Mía DIGECOG AI" subtitulo="Asistente conversacional que responde en lenguaje natural sobre el estado del Sistema de Contabilidad Gubernamental, basado en el dataset sintético del prototipo." esDemo />
      <div className="card flex-1 flex flex-col p-0 overflow-hidden max-w-3xl mx-auto w-full min-h-[520px]">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-[var(--border-subtle)]" style={{ background: 'linear-gradient(135deg, var(--color-brand-700), var(--color-accent-teal))' }}>
          <Sparkles size={18} className="text-white" />
          <span className="font-semibold text-white text-sm">Mía DIGECOG AI</span>
          <DemoTag label="RESPUESTAS BASADAS EN DATOS SIMULADOS" />
        </div>
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
          {mensajes.map((m, i) => (
            <div key={i} className={`text-sm rounded-2xl px-4 py-2.5 max-w-[80%] whitespace-pre-line ${m.autor === 'mia' ? 'bg-[var(--color-brand-50)] text-[var(--text-primary)]' : 'bg-slate-100 ml-auto text-[var(--text-primary)]'}`}>
              {m.texto}
            </div>
          ))}
          {mensajes.length <= 1 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {PREGUNTAS_SUGERIDAS.map((p) => (
                <button key={p} onClick={() => enviar(p)} className="text-xs rounded-full border border-[var(--border-subtle)] px-3 py-1.5 hover:border-[var(--color-brand-400)] hover:bg-[var(--color-brand-50)]">{p}</button>
              ))}
            </div>
          )}
        </div>
        <div className="p-3 border-t border-[var(--border-subtle)] flex items-center gap-2">
          <input
            value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && enviar(input)}
            placeholder="Ej: ¿Cuáles instituciones presentan mayor deterioro en liquidez?"
            className="flex-1 rounded-lg border border-[var(--border-subtle)] px-3 py-2 text-sm outline-none focus:border-[var(--color-brand-500)]"
          />
          <button onClick={() => enviar(input)} className="h-9 w-9 flex items-center justify-center rounded-lg text-white" style={{ background: 'var(--color-brand-600)' }}><Send size={15} /></button>
        </div>
      </div>
    </div>
  );
}
