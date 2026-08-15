import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, KeyRound, Fingerprint } from 'lucide-react';
import { DemoTag } from '../components/ui/primitives';

const ROLES = [
  'Director General', 'Directores Misionales', 'Planificación y Desarrollo',
  'Políticas, Normas y Procedimientos Contables', 'Procesamiento Contable y Estados Financieros',
  'Análisis de Información Financiera', 'Tecnología', 'Jurídico / Cumplimiento', 'OAI',
  'Entidad Reportante (SPNF)', 'Auditor', 'Ciudadanía',
];

export default function Login() {
  const navigate = useNavigate();
  const [rol, setRol] = useState(ROLES[0]);
  const [paso, setPaso] = useState<'credenciales' | 'mfa'>('credenciales');

  return (
    <div className="min-h-screen w-full flex" style={{ background: 'linear-gradient(135deg, var(--color-brand-950), var(--color-brand-800) 60%, var(--color-brand-600))' }}>
      <div className="hidden lg:flex flex-1 flex-col justify-between p-12 text-white">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-xl bg-white/10 border border-white/25 flex items-center justify-center font-bold text-lg">D</div>
          <div>
            <div className="font-bold tracking-wide">DIGECOG 360°</div>
            <div className="text-xs text-white/60">Plataforma Integral de Gestión y Analítica Contable Gubernamental</div>
          </div>
        </div>
        <div className="max-w-md space-y-4">
          <div className="text-3xl font-bold leading-tight">
            El sistema nervioso financiero y contable del Estado dominicano.
          </div>
          <p className="text-white/70 text-sm leading-relaxed">
            "Dirigir el Sistema de Contabilidad del Sector Público para la consolidación, transparencia
            y la efectiva toma de decisiones de las finanzas públicas." — Misión institucional 2025-2028.
          </p>
          <div className="flex gap-6 pt-2 text-sm">
            <div><div className="text-2xl font-bold">114</div><div className="text-white/50 text-xs">instituciones en la muestra</div></div>
            <div><div className="text-2xl font-bold">5</div><div className="text-white/50 text-xs">años fiscales (2022-2026)</div></div>
            <div><div className="text-2xl font-bold">30</div><div className="text-white/50 text-xs">módulos integrados</div></div>
          </div>
        </div>
        <div className="text-[11px] text-white/40">
          Órgano rector del Sistema de Contabilidad Gubernamental — Ley 126-01 · Decreto 526-09
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="card w-full max-w-sm p-7">
          <div className="lg:hidden flex items-center gap-2 mb-6">
            <div className="h-9 w-9 rounded-lg bg-[var(--color-brand-900)] text-white flex items-center justify-center font-bold">D</div>
            <div className="font-bold text-[var(--color-brand-900)]">DIGECOG 360°</div>
          </div>

          {paso === 'credenciales' ? (
            <>
              <h1 className="text-lg font-bold text-[var(--text-primary)] mb-1">Acceso institucional</h1>
              <p className="text-xs text-[var(--text-secondary)] mb-5">Ecosistema DIGECOG Interno · Entidades del SPNF · Inteligencia Nacional</p>

              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Perfil de acceso (demo)</label>
              <select value={rol} onChange={(e) => setRol(e.target.value)} className="w-full mb-4 rounded-lg border border-[var(--border-subtle)] px-3 py-2 text-sm outline-none focus:border-[var(--color-brand-500)]">
                {ROLES.map((r) => <option key={r}>{r}</option>)}
              </select>

              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Usuario institucional</label>
              <input defaultValue="director.general@digecog.gob.do" className="w-full mb-3 rounded-lg border border-[var(--border-subtle)] px-3 py-2 text-sm outline-none focus:border-[var(--color-brand-500)]" />
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Contraseña</label>
              <input type="password" defaultValue="••••••••••" className="w-full mb-4 rounded-lg border border-[var(--border-subtle)] px-3 py-2 text-sm outline-none focus:border-[var(--color-brand-500)]" />

              <button
                onClick={() => setPaso('mfa')}
                className="w-full rounded-lg py-2.5 text-sm font-semibold text-white mb-3"
                style={{ background: 'var(--color-brand-700)' }}
              >
                Continuar
              </button>
              <div className="flex items-center gap-2 text-[11px] text-[var(--text-muted)] justify-center mb-1">
                <ShieldCheck size={13} /> Single Sign-On · Segregación de funciones (RBAC)
              </div>
              <div className="flex justify-center"><DemoTag label="ENTORNO DE DEMOSTRACIÓN" /></div>
            </>
          ) : (
            <>
              <div className="flex flex-col items-center text-center gap-3 py-4">
                <div className="h-14 w-14 rounded-full bg-[var(--color-brand-50)] flex items-center justify-center text-[var(--color-brand-600)]">
                  <Fingerprint size={26} />
                </div>
                <h1 className="text-lg font-bold text-[var(--text-primary)]">Verificación en dos pasos</h1>
                <p className="text-xs text-[var(--text-secondary)]">Ingrese el código de 6 dígitos enviado a su dispositivo autenticador (MFA).</p>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <input key={i} maxLength={1} defaultValue={String((i * 7) % 10)} className="w-9 h-11 text-center rounded-lg border border-[var(--border-subtle)] text-lg font-bold outline-none focus:border-[var(--color-brand-500)]" />
                  ))}
                </div>
                <button
                  onClick={() => navigate('/')}
                  className="w-full rounded-lg py-2.5 text-sm font-semibold text-white flex items-center justify-center gap-2 mt-2"
                  style={{ background: 'var(--color-brand-700)' }}
                >
                  <KeyRound size={15} /> Ingresar como {rol}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
