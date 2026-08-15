import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { ShieldCheck, KeyRound, Fingerprint, AlertCircle } from 'lucide-react';
import { useAppStore, validarCredencial, CREDENCIAL_DEMO } from '../store/appStore';
import { ALCANCE_POR_ROL, rutaInicialDe } from '../lib/permisos';

const ROLES = [
  'Director General', 'Directores Misionales', 'Planificación y Desarrollo',
  'Políticas, Normas y Procedimientos Contables', 'Procesamiento Contable y Estados Financieros',
  'Análisis de Información Financiera', 'Tecnología', 'Jurídico / Cumplimiento', 'OAI',
  'Entidad Reportante (SPNF)', 'Auditor', 'Ciudadanía',
];

const CODIGO_MFA_DEMO = '482913';

export default function Login() {
  const navigate = useNavigate();
  const iniciarSesion = useAppStore((s) => s.iniciarSesion);
  const autenticado = useAppStore((s) => s.autenticado);
  const rolSesion = useAppStore((s) => s.rol);

  const [rol, setRol] = useState(ROLES[0]);
  const [paso, setPaso] = useState<'credenciales' | 'mfa'>('credenciales');
  // Campos precargados con las credenciales de demostración: el evaluador solo pulsa los botones.
  const [usuario, setUsuario] = useState(CREDENCIAL_DEMO.usuario);
  const [clave, setClave] = useState(CREDENCIAL_DEMO.clave);
  const [error, setError] = useState<string | null>(null);
  const [digitos, setDigitos] = useState<string[]>(CODIGO_MFA_DEMO.split(''));
  const [errorMfa, setErrorMfa] = useState<string | null>(null);

  function validarCredenciales() {
    const resultado = validarCredencial(usuario, clave);
    if (!resultado.ok) {
      setError(resultado.error ?? 'No fue posible iniciar sesión.');
      return;
    }
    // Credenciales válidas → segundo factor (simulado). La sesión solo se abre tras el MFA.
    setError(null);
    setPaso('mfa');
  }

  function confirmarMfa() {
    const codigo = digitos.join('');
    if (codigo !== CODIGO_MFA_DEMO) {
      setErrorMfa(`Código incorrecto. En el entorno de demostración el código es ${CODIGO_MFA_DEMO}.`);
      return;
    }
    setErrorMfa(null);
    const resultado = iniciarSesion(usuario, clave, rol);
    // Cada perfil aterriza en la primera pantalla de su alcance (RBAC).
    if (resultado.ok) navigate(rutaInicialDe(rol));
  }

  /**
   * Acepta un dígito por casilla, pero también escritura rápida y pegado del
   * código completo: los dígitos sobrantes se distribuyen en las casillas siguientes.
   */
  function actualizarDigito(indice: number, valorCrudo: string) {
    const anterior = digitos[indice];
    let entrada = valorCrudo.replace(/\D/g, '');

    // Al escribir sobre una casilla que ya tenía dígito, el navegador concatena: descartamos el previo.
    if (anterior && entrada.length > 1 && entrada.startsWith(anterior)) {
      entrada = entrada.slice(anterior.length);
    }

    if (!entrada) {
      setDigitos((prev) => { const next = [...prev]; next[indice] = ''; return next; });
      return;
    }

    setDigitos((prev) => {
      const next = [...prev];
      for (let k = 0; k < entrada.length && indice + k < 6; k++) {
        next[indice + k] = entrada[k];
      }
      return next;
    });

    const siguiente = Math.min(indice + entrada.length, 5);
    requestAnimationFrame(() => document.getElementById(`mfa-${siguiente}`)?.focus());
  }

  // Si ya hay sesión activa, vamos a la pantalla de inicio que corresponda al perfil.
  if (autenticado) return <Navigate to={rutaInicialDe(rolSesion)} replace />;

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
            Una sola visión de las finanzas públicas dominicanas.
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
              <select value={rol} onChange={(e) => setRol(e.target.value)} className="w-full mb-2 rounded-lg border border-[var(--border-subtle)] px-3 py-2.5 text-sm outline-none focus:border-[var(--color-brand-500)]">
                {ROLES.map((r) => <option key={r}>{r}</option>)}
              </select>
              <div className="mb-4 rounded-lg bg-slate-50 border border-[var(--border-subtle)] px-2.5 py-2 text-[11px] text-[var(--text-secondary)]">
                <span className="font-semibold text-[var(--text-primary)]">Alcance:</span> {ALCANCE_POR_ROL[rol]}
              </div>

              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Usuario institucional</label>
              <input
                value={usuario}
                onChange={(e) => { setUsuario(e.target.value); setError(null); }}
                onKeyDown={(e) => e.key === 'Enter' && validarCredenciales()}
                placeholder="correo@ejemplo.com"
                autoComplete="username"
                className="w-full mb-3 rounded-lg border border-[var(--border-subtle)] px-3 py-2.5 text-sm outline-none focus:border-[var(--color-brand-500)]"
              />
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Contraseña</label>
              <input
                type="password"
                value={clave}
                onChange={(e) => { setClave(e.target.value); setError(null); }}
                onKeyDown={(e) => e.key === 'Enter' && validarCredenciales()}
                placeholder="••••"
                autoComplete="current-password"
                className="w-full mb-3 rounded-lg border border-[var(--border-subtle)] px-3 py-2.5 text-sm outline-none focus:border-[var(--color-brand-500)]"
              />

              {error && (
                <div className="flex items-start gap-1.5 mb-3 rounded-lg bg-red-50 border border-red-200 px-2.5 py-2 text-[11px] text-red-700">
                  <AlertCircle size={13} className="shrink-0 mt-px" /> {error}
                </div>
              )}

              <button
                onClick={validarCredenciales}
                className="w-full rounded-lg py-2.5 text-sm font-semibold text-white mb-3"
                style={{ background: 'var(--color-brand-700)' }}
              >
                Continuar
              </button>
              <div className="flex items-center gap-2 text-[11px] text-[var(--text-muted)] justify-center mb-2">
                <ShieldCheck size={13} /> Single Sign-On · Segregación de funciones (RBAC)
              </div>
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
                  {digitos.map((d, i) => (
                    <input
                      key={i}
                      id={`mfa-${i}`}
                      inputMode="numeric"
                      value={d}
                      onChange={(e) => { actualizarDigito(i, e.target.value); setErrorMfa(null); }}
                      onKeyDown={(e) => e.key === 'Enter' && confirmarMfa()}
                      className="w-9 h-11 text-center rounded-lg border border-[var(--border-subtle)] text-lg font-bold outline-none focus:border-[var(--color-brand-500)]"
                    />
                  ))}
                </div>

                {errorMfa && (
                  <div className="flex items-start gap-1.5 w-full rounded-lg bg-red-50 border border-red-200 px-2.5 py-2 text-[11px] text-red-700 text-left">
                    <AlertCircle size={13} className="shrink-0 mt-px" /> {errorMfa}
                  </div>
                )}

                <button
                  onClick={confirmarMfa}
                  className="w-full rounded-lg py-2.5 text-sm font-semibold text-white flex items-center justify-center gap-2 mt-1"
                  style={{ background: 'var(--color-brand-700)' }}
                >
                  <KeyRound size={15} /> Ingresar como {rol}
                </button>
                <button onClick={() => { setPaso('credenciales'); setErrorMfa(null); }} className="text-[11px] text-[var(--text-muted)] hover:text-[var(--color-brand-600)]">
                  ← Volver
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
