// Catálogo de Cuentas Contables — estructura OFICIAL reproducida del documento fuente:
// "Plan de Cuentas Contables y su Descripción, Versión 2.0" (DIGECOG, Dirección de Normas,
// Políticas y Procedimientos, junio 2023), basado en NICSP versión 2021 (IPSASB/IFAC).
// El PCC oficial se abre a 7 niveles / 12 dígitos (A.B.CC.DD.EE.FF.GG). Este prototipo reproduce
// los primeros 4 niveles (Clase.Grupo.Rubro.Cuenta) con nombres y descripciones tomados
// literalmente del documento oficial suministrado por el usuario. Niveles auxiliares más
// profundos (subcuenta, subcuenta anexa, detalle) no se reproducen en el prototipo por volumen,
// pero existen en el documento fuente real.
import type { CuentaContable, Clasificacion, Naturaleza } from './types';

interface Nodo {
  codigo: string;
  descripcion: string;
  clasificacion: Clasificacion;
  hijos?: Nodo[];
}

const NATURALEZA_POR_CLASE: Record<Clasificacion, Naturaleza> = {
  Activo: 'Deudora',
  Gastos: 'Deudora',
  Pasivo: 'Acreedora',
  Patrimonio: 'Acreedora',
  Ingresos: 'Acreedora',
};

const ARBOL: Nodo[] = [
  // ============================= 1. ACTIVO =============================
  {
    codigo: '1', descripcion: 'ACTIVO', clasificacion: 'Activo',
    hijos: [
      { codigo: '1.1', descripcion: 'Activo Corriente', clasificacion: 'Activo', hijos: [
        { codigo: '1.1.01', descripcion: 'Efectivo y equivalentes de efectivo', clasificacion: 'Activo', hijos: [
          { codigo: '1.1.01.01', descripcion: 'Caja', clasificacion: 'Activo' },
          { codigo: '1.1.01.02', descripcion: 'Efectivo en bancos', clasificacion: 'Activo' },
          { codigo: '1.1.01.03', descripcion: 'Valores a depositar', clasificacion: 'Activo' },
          { codigo: '1.1.01.04', descripcion: 'Equivalentes de efectivo', clasificacion: 'Activo' },
          { codigo: '1.1.01.99', descripcion: 'Otros equivalentes de efectivo', clasificacion: 'Activo' },
        ]},
        { codigo: '1.1.02', descripcion: 'Inversiones a corto plazo', clasificacion: 'Activo', hijos: [
          { codigo: '1.1.02.01', descripcion: 'Títulos-valores a valor razonable a corto plazo', clasificacion: 'Activo' },
          { codigo: '1.1.02.02', descripcion: 'Títulos-valores a costo amortizado a corto plazo', clasificacion: 'Activo' },
          { codigo: '1.1.02.03', descripcion: 'Instrumentos derivados a corto plazo', clasificacion: 'Activo' },
          { codigo: '1.1.02.04', descripcion: 'Depósitos a plazo fijo a corto plazo', clasificacion: 'Activo' },
          { codigo: '1.1.02.99', descripcion: 'Otras inversiones a corto plazo', clasificacion: 'Activo' },
        ]},
        { codigo: '1.1.03', descripcion: 'Documentos por cobrar a corto plazo', clasificacion: 'Activo', hijos: [
          { codigo: '1.1.03.01', descripcion: 'Documentos por cobrar a corto plazo', clasificacion: 'Activo' },
          { codigo: '1.1.03.02', descripcion: 'Porción Corriente de documentos por cobrar', clasificacion: 'Activo' },
          { codigo: '1.1.03.03', descripcion: 'Deudores por avales de l.p. con vencimiento en el c.p.', clasificacion: 'Activo' },
          { codigo: '1.1.03.04', descripcion: 'Deudores en gestión judicial de l.p. con sentencia firme favorable en el c.p.', clasificacion: 'Activo' },
          { codigo: '1.1.03.05', descripcion: 'Arrendamientos financieros de l.p. con vencimiento en el c.p.', clasificacion: 'Activo' },
          { codigo: '1.1.03.06', descripcion: 'Otros documentos por cobrar de l.p. con vencimiento en el c.p.', clasificacion: 'Activo' },
        ]},
        { codigo: '1.1.04', descripcion: 'Cuentas por cobrar a corto plazo', clasificacion: 'Activo', hijos: [
          { codigo: '1.1.04.01', descripcion: 'Cuentas por cobrar de origen tributario', clasificacion: 'Activo' },
          { codigo: '1.1.04.02', descripcion: 'Cuentas por cobrar por contribuciones sociales a cobrar a corto plazo', clasificacion: 'Activo' },
          { codigo: '1.1.04.03', descripcion: 'Cuentas por cobrar por ingresos con contraprestación a corto plazo', clasificacion: 'Activo' },
          { codigo: '1.1.04.04', descripcion: 'Préstamos otorgados a corto plazo', clasificacion: 'Activo' },
          { codigo: '1.1.04.05', descripcion: 'Deudores por avales a corto plazo', clasificacion: 'Activo' },
          { codigo: '1.1.04.06', descripcion: 'Cuentas por cobrar en gestión judicial', clasificacion: 'Activo' },
          { codigo: '1.1.04.07', descripcion: 'Pagos Anticipados a corto plazo', clasificacion: 'Activo' },
          { codigo: '1.1.04.08', descripcion: 'Cuentas por cobrar por ingresos sin contraprestación a corto plazo', clasificacion: 'Activo' },
          { codigo: '1.1.04.99', descripcion: 'Cuenta por cobrar por otros ingresos a corto plazo', clasificacion: 'Activo' },
        ]},
        { codigo: '1.1.05', descripcion: 'Inventarios', clasificacion: 'Activo', hijos: [
          { codigo: '1.1.05.01', descripcion: 'Materiales y suministros para consumo y prestación de servicios', clasificacion: 'Activo' },
          { codigo: '1.1.05.02', descripcion: 'Materias primas y materiales para la producción', clasificacion: 'Activo' },
          { codigo: '1.1.05.03', descripcion: 'Inventario de productos en proceso', clasificacion: 'Activo' },
          { codigo: '1.1.05.04', descripcion: 'Inventario de bienes en proceso', clasificacion: 'Activo' },
          { codigo: '1.1.05.05', descripcion: 'Productos terminados', clasificacion: 'Activo' },
          { codigo: '1.1.05.06', descripcion: 'Inventario de bienes terminados', clasificacion: 'Activo' },
          { codigo: '1.1.05.07', descripcion: 'Inventarios destinados para la venta o cesión', clasificacion: 'Activo' },
          { codigo: '1.1.05.99', descripcion: 'Otros inventarios', clasificacion: 'Activo' },
        ]},
        { codigo: '1.1.09', descripcion: 'Otros activos corrientes', clasificacion: 'Activo', hijos: [
          { codigo: '1.1.09.01', descripcion: 'Gastos a devengar a corto plazo', clasificacion: 'Activo' },
          { codigo: '1.1.09.02', descripcion: 'Transferencias entre Entes a cobrar', clasificacion: 'Activo' },
          { codigo: '1.1.09.99', descripcion: 'Activos corrientes sujetos a depuración contable', clasificacion: 'Activo' },
        ]},
      ]},
      { codigo: '1.2', descripcion: 'Activo No Corriente', clasificacion: 'Activo', hijos: [
        { codigo: '1.2.01', descripcion: 'Cuentas por cobrar a largo plazo', clasificacion: 'Activo', hijos: [
          { codigo: '1.2.01.01', descripcion: 'Cuentas por cobrar de origen tributario', clasificacion: 'Activo' },
          { codigo: '1.2.01.02', descripcion: 'Contribuciones sociales a cobrar a largo plazo', clasificacion: 'Activo' },
          { codigo: '1.2.01.03', descripcion: 'Cuentas por cobrar por ingresos con contraprestación l/p', clasificacion: 'Activo' },
          { codigo: '1.2.01.04', descripcion: 'Cuentas por cobrar en gestión judicial', clasificacion: 'Activo' },
          { codigo: '1.2.01.05', descripcion: 'Anticipos a proveedores y contratistas a largo plazo', clasificacion: 'Activo' },
          { codigo: '1.2.01.99', descripcion: 'Cuenta por cobrar por otros ingresos a largo plazo', clasificacion: 'Activo' },
        ]},
        { codigo: '1.2.02', descripcion: 'Documentos por cobrar de largo plazo', clasificacion: 'Activo', hijos: [
          { codigo: '1.2.02.01', descripcion: 'Fideicomisos y contratos equivalentes', clasificacion: 'Activo' },
          { codigo: '1.2.02.02', descripcion: 'Préstamos otorgados a largo plazo l/p con fines liquidez', clasificacion: 'Activo' },
          { codigo: '1.2.02.03', descripcion: 'Préstamos otorgados con fines de política económica a l/p', clasificacion: 'Activo' },
          { codigo: '1.2.02.04', descripcion: 'Deudores por avales a l/p', clasificacion: 'Activo' },
        ]},
        { codigo: '1.2.03', descripcion: 'Inversiones a Largo Plazo', clasificacion: 'Activo', hijos: [
          { codigo: '1.2.03.01', descripcion: 'Títulos-valores a valor razonable a largo plazo', clasificacion: 'Activo' },
          { codigo: '1.2.03.02', descripcion: 'Títulos-valores a costo amortizado a largo plazo', clasificacion: 'Activo' },
          { codigo: '1.2.03.03', descripcion: 'Instrumentos financieros derivados a largo plazo', clasificacion: 'Activo' },
          { codigo: '1.2.03.04', descripcion: 'Depósitos a plazo fijo a largo plazo', clasificacion: 'Activo' },
          { codigo: '1.2.03.99', descripcion: 'Otras inversiones financieras a largo plazo', clasificacion: 'Activo' },
        ]},
        { codigo: '1.2.04', descripcion: 'Inversiones en asociadas', clasificacion: 'Activo', hijos: [
          { codigo: '1.2.04.01', descripcion: 'Inversiones en asociadas en el sector privado interno', clasificacion: 'Activo' },
          { codigo: '1.2.04.02', descripcion: 'Inversiones en asociadas en el sector público interno', clasificacion: 'Activo' },
          { codigo: '1.2.04.03', descripcion: 'Inversiones en asociadas en el sector externo', clasificacion: 'Activo' },
        ]},
        { codigo: '1.2.05', descripcion: 'Propiedades de Inversión', clasificacion: 'Activo', hijos: [
          { codigo: '1.2.05.01', descripcion: 'Activos no producidos', clasificacion: 'Activo' },
          { codigo: '1.2.05.02', descripcion: 'Activos producidos', clasificacion: 'Activo' },
        ]},
        { codigo: '1.2.06', descripcion: 'Propiedades, planta y equipo neto', clasificacion: 'Activo', hijos: [
          { codigo: '1.2.06.01', descripcion: 'Propiedades, planta y equipo neto no concesionados', clasificacion: 'Activo' },
          { codigo: '1.2.06.02', descripcion: 'Propiedades, planta y equipos concesionados', clasificacion: 'Activo' },
        ]},
        { codigo: '1.2.07', descripcion: 'Bienes del Patrimonio Histórico y Cultural', clasificacion: 'Activo', hijos: [
          { codigo: '1.2.07.01', descripcion: 'Bienes del Patrimonio históricos y cultural, no producidos', clasificacion: 'Activo' },
          { codigo: '1.2.07.02', descripcion: 'Bienes del Patrimonio históricos y cultural, producidos', clasificacion: 'Activo' },
        ]},
        { codigo: '1.2.08', descripcion: 'Recursos naturales', clasificacion: 'Activo', hijos: [
          { codigo: '1.2.08.01', descripcion: 'Recursos naturales no renovables en explotación no Concesionados', clasificacion: 'Activo' },
          { codigo: '1.2.08.02', descripcion: 'Recursos naturales renovables en explotación no Concesionados', clasificacion: 'Activo' },
          { codigo: '1.2.08.03', descripcion: 'Recursos naturales no renovables en conservación no Concesionados', clasificacion: 'Activo' },
          { codigo: '1.2.08.04', descripcion: 'Recursos naturales renovables en conservación no Concesionados', clasificacion: 'Activo' },
          { codigo: '1.2.08.05', descripcion: 'Recursos naturales no renovables en explotación Concesionados', clasificacion: 'Activo' },
          { codigo: '1.2.08.06', descripcion: 'Recursos naturales renovables en explotación concesionados', clasificacion: 'Activo' },
        ]},
        { codigo: '1.2.09', descripcion: 'Bienes intangibles', clasificacion: 'Activo', hijos: [
          { codigo: '1.2.09.01', descripcion: 'Productos de la propiedad intelectual no Concesionados', clasificacion: 'Activo' },
          { codigo: '1.2.09.02', descripcion: 'Intangibles no producidos no Concesionados', clasificacion: 'Activo' },
          { codigo: '1.2.09.03', descripcion: 'Productos de la propiedad intelectual Concesionados', clasificacion: 'Activo' },
          { codigo: '1.2.09.04', descripcion: 'Intangibles no producidos Concesionados', clasificacion: 'Activo' },
        ]},
        { codigo: '1.2.10', descripcion: 'Activos biológicos', clasificacion: 'Activo', hijos: [
          { codigo: '1.2.10.01', descripcion: 'Plantas', clasificacion: 'Activo' },
          { codigo: '1.2.10.02', descripcion: 'Animales', clasificacion: 'Activo' },
        ]},
        { codigo: '1.2.11', descripcion: 'Otros activos no corrientes', clasificacion: 'Activo', hijos: [
          { codigo: '1.2.11.01', descripcion: 'Objetos de valor', clasificacion: 'Activo' },
          { codigo: '1.2.11.02', descripcion: 'Bienes en Arrendamiento Financiero (leasing)', clasificacion: 'Activo' },
          { codigo: '1.2.11.03', descripcion: 'Bienes en comodato', clasificacion: 'Activo' },
          { codigo: '1.2.11.04', descripcion: 'Bienes en Tránsito', clasificacion: 'Activo' },
          { codigo: '1.2.11.05', descripcion: 'Gastos pagados por adelantado a largo plazo', clasificacion: 'Activo' },
          { codigo: '1.2.11.06', descripcion: 'Fianzas y depósitos a largo plazo', clasificacion: 'Activo' },
          { codigo: '1.2.11.99', descripcion: 'Activos no corrientes sujetos a depuración contable', clasificacion: 'Activo' },
        ]},
      ]},
    ],
  },
  // ============================= 2. PASIVO =============================
  {
    codigo: '2', descripcion: 'PASIVO', clasificacion: 'Pasivo',
    hijos: [
      { codigo: '2.1', descripcion: 'Pasivo Corriente', clasificacion: 'Pasivo', hijos: [
        { codigo: '2.1.01', descripcion: 'Cuentas a pagar a corto plazo', clasificacion: 'Pasivo', hijos: [
          { codigo: '2.1.01.01', descripcion: 'Cuentas comerciales a pagar a corto plazo', clasificacion: 'Pasivo' },
          { codigo: '2.1.01.02', descripcion: 'Transferencias a pagar a corto plazo', clasificacion: 'Pasivo' },
          { codigo: '2.1.01.03', descripcion: 'Deudas por anticipos financieros a corto plazo', clasificacion: 'Pasivo' },
          { codigo: '2.1.01.04', descripcion: 'Servicios de préstamos indirectos a pagar', clasificacion: 'Pasivo' },
          { codigo: '2.1.01.05', descripcion: 'Servicios de préstamos a pagar a corto plazo', clasificacion: 'Pasivo' },
          { codigo: '2.1.01.06', descripcion: 'Cuentas a pagar por operaciones financieras c/p', clasificacion: 'Pasivo' },
          { codigo: '2.1.01.07', descripcion: 'Viáticos a pagar a corto plazo', clasificacion: 'Pasivo' },
          { codigo: '2.1.01.08', descripcion: 'Cuentas por pagar de origen tributario', clasificacion: 'Pasivo' },
          { codigo: '2.1.01.99', descripcion: 'Cuentas varias a pagar c/p', clasificacion: 'Pasivo' },
        ]},
        { codigo: '2.1.02', descripcion: 'Préstamos a pagar en el corto plazo', clasificacion: 'Pasivo', hijos: [
          { codigo: '2.1.02.01', descripcion: 'Sobregiro Bancario', clasificacion: 'Pasivo' },
          { codigo: '2.1.02.02', descripcion: 'Endeudamiento de Tesorería a corto plazo', clasificacion: 'Pasivo' },
          { codigo: '2.1.02.03', descripcion: 'Títulos-valores de la deuda pública a pagar a corto plazo', clasificacion: 'Pasivo' },
          { codigo: '2.1.02.04', descripcion: 'Préstamos a pagar a corto plazo', clasificacion: 'Pasivo' },
        ]},
        { codigo: '2.1.03', descripcion: 'Porción corriente de préstamos a largo plazo', clasificacion: 'Pasivo', hijos: [
          { codigo: '2.1.03.01', descripcion: 'Porción corriente de préstamos la deuda pública a largo plazo', clasificacion: 'Pasivo' },
          { codigo: '2.1.03.02', descripcion: 'Porción corriente de arrendamiento financiero', clasificacion: 'Pasivo' },
          { codigo: '2.1.03.03', descripcion: 'Porción corriente de títulos y valores de deuda pública de largo plazo', clasificacion: 'Pasivo' },
          { codigo: '2.1.03.04', descripcion: 'Deuda vencida y no pagada', clasificacion: 'Pasivo' },
        ]},
        { codigo: '2.1.04', descripcion: 'Retenciones y acumulaciones a pagar a corto plazo', clasificacion: 'Pasivo', hijos: [
          { codigo: '2.1.04.01', descripcion: 'Impuestos y retenciones a pagar a corto plazo', clasificacion: 'Pasivo' },
          { codigo: '2.1.04.02', descripcion: 'Fondos de terceros en la Cuenta Única del Tesoro', clasificacion: 'Pasivo' },
          { codigo: '2.1.04.03', descripcion: 'Recaudación por cuenta de terceros', clasificacion: 'Pasivo' },
          { codigo: '2.1.04.04', descripcion: 'Depósitos en garantía', clasificacion: 'Pasivo' },
          { codigo: '2.1.04.99', descripcion: 'Otros fondos', clasificacion: 'Pasivo' },
        ]},
        { codigo: '2.1.05', descripcion: 'Provisiones a corto plazo', clasificacion: 'Pasivo', hijos: [
          { codigo: '2.1.05.01', descripcion: 'Provisiones al sector privado interno - c/p', clasificacion: 'Pasivo' },
          { codigo: '2.1.05.02', descripcion: 'Provisiones sector público - c/p', clasificacion: 'Pasivo' },
          { codigo: '2.1.05.03', descripcion: 'Provisiones al sector externo - c/p', clasificacion: 'Pasivo' },
        ]},
        { codigo: '2.1.06', descripcion: 'Beneficios a los Empleados a pagar a corto plazo', clasificacion: 'Pasivo', hijos: [
          { codigo: '2.1.06.01', descripcion: 'Remuneraciones y Aportes a Pagar a Corto Plazo', clasificacion: 'Pasivo' },
        ]},
        { codigo: '2.1.07', descripcion: 'Pensiones', clasificacion: 'Pasivo', hijos: [
          { codigo: '2.1.07.01', descripcion: 'Contributivas', clasificacion: 'Pasivo' },
          { codigo: '2.1.07.02', descripcion: 'No contributivas o graciable', clasificacion: 'Pasivo' },
        ]},
        { codigo: '2.1.09', descripcion: 'Otros pasivos corrientes', clasificacion: 'Pasivo', hijos: [
          { codigo: '2.1.09.01', descripcion: 'Obligaciones y documentos por pagar de corto plazo', clasificacion: 'Pasivo' },
          { codigo: '2.1.09.02', descripcion: 'Arrendamientos Financieros', clasificacion: 'Pasivo' },
          { codigo: '2.1.09.03', descripcion: 'Ingresos por concesiones y regalías a devengar c/p', clasificacion: 'Pasivo' },
          { codigo: '2.1.09.04', descripcion: 'Condiciones por activos transferidos c/p', clasificacion: 'Pasivo' },
          { codigo: '2.1.09.05', descripcion: 'Instrumentos Derivados a pagar a corto plazo', clasificacion: 'Pasivo' },
          { codigo: '2.1.09.06', descripcion: 'Pasivos diferidos a corto plazo', clasificacion: 'Pasivo' },
          { codigo: '2.1.09.07', descripcion: 'Cuentas Transitorias', clasificacion: 'Pasivo' },
          { codigo: '2.1.09.08', descripcion: 'Otros ingresos a devengar c/p', clasificacion: 'Pasivo' },
          { codigo: '2.1.09.99', descripcion: 'Pasivos corrientes sujetos a depuración contable', clasificacion: 'Pasivo' },
        ]},
      ]},
      { codigo: '2.2', descripcion: 'Pasivo No Corriente', clasificacion: 'Pasivo', hijos: [
        { codigo: '2.2.01', descripcion: 'Cuentas a pagar a largo plazo', clasificacion: 'Pasivo', hijos: [
          { codigo: '2.2.01.01', descripcion: 'Cuentas comerciales a pagar a largo plazo', clasificacion: 'Pasivo' },
          { codigo: '2.2.01.02', descripcion: 'Impuestos y retenciones a pagar a l/p', clasificacion: 'Pasivo' },
        ]},
        { codigo: '2.2.02', descripcion: 'Préstamos a pagar a largo plazo', clasificacion: 'Pasivo', hijos: [
          { codigo: '2.2.02.01', descripcion: 'Préstamos directos a pagar a largo plazo', clasificacion: 'Pasivo' },
          { codigo: '2.2.02.02', descripcion: 'Arrendamiento financiero de largo plazo', clasificacion: 'Pasivo' },
          { codigo: '2.2.02.03', descripcion: 'Préstamos Indirectos a pagar l/p', clasificacion: 'Pasivo' },
        ]},
        { codigo: '2.2.03', descripcion: 'Instrumento de deuda a largo plazo', clasificacion: 'Pasivo', hijos: [
          { codigo: '2.2.03.01', descripcion: 'Títulos-valores de la deuda pública a pagar a l/p', clasificacion: 'Pasivo' },
        ]},
        { codigo: '2.2.04', descripcion: 'Provisiones a largo plazo', clasificacion: 'Pasivo', hijos: [
          { codigo: '2.2.04.01', descripcion: 'Provisiones a largo plazo sector privado l/p', clasificacion: 'Pasivo' },
          { codigo: '2.2.04.02', descripcion: 'Provisiones a largo plazo sector público l/p', clasificacion: 'Pasivo' },
          { codigo: '2.2.04.03', descripcion: 'Provisiones a largo plazo sector externo l/p', clasificacion: 'Pasivo' },
        ]},
        { codigo: '2.2.05', descripcion: 'Beneficios a los Empleados a Pagar a Largo Plazo', clasificacion: 'Pasivo', hijos: [
          { codigo: '2.2.05.01', descripcion: 'Remuneraciones y aportes a pagar a largo plazo', clasificacion: 'Pasivo' },
        ]},
        { codigo: '2.2.09', descripcion: 'Otros pasivos no corrientes', clasificacion: 'Pasivo', hijos: [
          { codigo: '2.2.09.01', descripcion: 'Obligaciones y documentos por pagar de largo plazo', clasificacion: 'Pasivo' },
          { codigo: '2.2.09.02', descripcion: 'Pensiones', clasificacion: 'Pasivo' },
          { codigo: '2.2.09.03', descripcion: 'Ingresos por concesiones y regalías a devengar l/p', clasificacion: 'Pasivo' },
          { codigo: '2.2.09.04', descripcion: 'Condiciones por activos transferidos l/p', clasificacion: 'Pasivo' },
          { codigo: '2.2.09.05', descripcion: 'Instrumentos derivados a pagar a largo plazo', clasificacion: 'Pasivo' },
          { codigo: '2.2.09.06', descripcion: 'Pasivos diferidos a largo plazo', clasificacion: 'Pasivo' },
          { codigo: '2.2.09.99', descripcion: 'Pasivos no corrientes sujetos a depuración contable', clasificacion: 'Pasivo' },
        ]},
      ]},
    ],
  },
  // ============================= 3. PATRIMONIO =============================
  {
    codigo: '3', descripcion: 'PATRIMONIO', clasificacion: 'Patrimonio',
    hijos: [
      { codigo: '3.1', descripcion: 'Patrimonio público', clasificacion: 'Patrimonio', hijos: [
        { codigo: '3.1.01', descripcion: 'Capital', clasificacion: 'Patrimonio', hijos: [
          { codigo: '3.1.01.01', descripcion: 'Capital inicial', clasificacion: 'Patrimonio' },
          { codigo: '3.1.01.02', descripcion: 'Incorporaciones al capital', clasificacion: 'Patrimonio' },
          { codigo: '3.1.01.03', descripcion: 'Transferencias de capital', clasificacion: 'Patrimonio' },
        ]},
        { codigo: '3.1.02', descripcion: 'Reservas', clasificacion: 'Patrimonio', hijos: [
          { codigo: '3.1.02.01', descripcion: 'Revaluación de bienes', clasificacion: 'Patrimonio' },
          { codigo: '3.1.02.99', descripcion: 'Otras reservas', clasificacion: 'Patrimonio' },
        ]},
        { codigo: '3.1.03', descripcion: 'Variaciones no asignables a reservas', clasificacion: 'Patrimonio', hijos: [
          { codigo: '3.1.03.01', descripcion: 'Diferencias de conversión de moneda extranjera', clasificacion: 'Patrimonio' },
          { codigo: '3.1.03.02', descripcion: 'Diferencias de valor razonable de activos financieros destinados a la venta', clasificacion: 'Patrimonio' },
          { codigo: '3.1.03.03', descripcion: 'Diferencias de valor razonable de instrumentos financieros designados como cobertura', clasificacion: 'Patrimonio' },
          { codigo: '3.1.03.99', descripcion: 'Otras variaciones no asignables a reservas', clasificacion: 'Patrimonio' },
        ]},
        { codigo: '3.1.04', descripcion: 'Resultados acumulados', clasificacion: 'Patrimonio', hijos: [
          { codigo: '3.1.04.01', descripcion: 'Resultados acumulados de ejercicios anteriores', clasificacion: 'Patrimonio' },
          { codigo: '3.1.04.02', descripcion: 'Resultado del ejercicio', clasificacion: 'Patrimonio' },
        ]},
      ]},
      { codigo: '3.2', descripcion: 'Participación no Controladora', clasificacion: 'Patrimonio', hijos: [
        { codigo: '3.2.01', descripcion: 'Participación no Controladora - Participaciones en el patrimonio de entidades controladas', clasificacion: 'Patrimonio', hijos: [
          { codigo: '3.2.01.02', descripcion: 'Participaciones en el patrimonio de Instituciones Públicas Descentralizadas y Autónomas', clasificacion: 'Patrimonio' },
          { codigo: '3.2.01.03', descripcion: 'Participaciones en el patrimonio de Instituciones de la Seguridad Social', clasificacion: 'Patrimonio' },
          { codigo: '3.2.01.06', descripcion: 'Participaciones en el patrimonio de Empresas Públicas no Financieras', clasificacion: 'Patrimonio' },
          { codigo: '3.2.01.07', descripcion: 'Participaciones en el patrimonio de Instituciones Públicas Financieras', clasificacion: 'Patrimonio' },
          { codigo: '3.2.01.99', descripcion: 'Participaciones en el patrimonio de otras entidades del sector público', clasificacion: 'Patrimonio' },
        ]},
        { codigo: '3.2.02', descripcion: 'Participación no Controladora – Evolución', clasificacion: 'Patrimonio', hijos: [
          { codigo: '3.2.02.01', descripcion: 'Evolución por reservas', clasificacion: 'Patrimonio' },
          { codigo: '3.2.02.02', descripcion: 'Evolución por variaciones no asignables a reservas', clasificacion: 'Patrimonio' },
          { codigo: '3.2.02.03', descripcion: 'Evolución por resultados acumulados', clasificacion: 'Patrimonio' },
          { codigo: '3.2.02.99', descripcion: 'Evolución por otros componentes del patrimonio', clasificacion: 'Patrimonio' },
        ]},
      ]},
    ],
  },
  // ============================= 4. INGRESOS =============================
  {
    codigo: '4', descripcion: 'INGRESOS', clasificacion: 'Ingresos',
    hijos: [
      { codigo: '4.1', descripcion: 'Impuestos', clasificacion: 'Ingresos', hijos: [
        { codigo: '4.1.01', descripcion: 'Impuestos sobre los ingresos', clasificacion: 'Ingresos', hijos: [
          { codigo: '4.1.01.01', descripcion: 'Impuestos sobre los ingresos de personas físicas', clasificacion: 'Ingresos' },
          { codigo: '4.1.01.02', descripcion: 'Impuestos sobre los ingresos de empresas y otras corporaciones', clasificacion: 'Ingresos' },
          { codigo: '4.1.01.03', descripcion: 'Otros impuestos sobre los ingresos', clasificacion: 'Ingresos' },
        ]},
        { codigo: '4.1.02', descripcion: 'Impuestos sobre la nómina y la fuerza del trabajo', clasificacion: 'Ingresos', hijos: [
          { codigo: '4.1.02.01', descripcion: 'Impuestos sobre la nómina y la fuerza del trabajo', clasificacion: 'Ingresos' },
        ]},
        { codigo: '4.1.03', descripcion: 'Impuestos sobre el patrimonio', clasificacion: 'Ingresos', hijos: [
          { codigo: '4.1.03.01', descripcion: 'Impuestos sobre la tenencia de patrimonio', clasificacion: 'Ingresos' },
          { codigo: '4.1.03.02', descripcion: 'Impuestos sobre las transacciones financieras y de capital', clasificacion: 'Ingresos' },
        ]},
        { codigo: '4.1.04', descripcion: 'Impuestos sobre mercancías y servicios', clasificacion: 'Ingresos', hijos: [
          { codigo: '4.1.04.01', descripcion: 'Impuestos generales sobre bienes y servicios', clasificacion: 'Ingresos' },
          { codigo: '4.1.04.02', descripcion: 'Impuestos Adicionales y selectivos sobre los bienes y servicios', clasificacion: 'Ingresos' },
          { codigo: '4.1.04.03', descripcion: 'Impuestos sobre servicios específicos', clasificacion: 'Ingresos' },
          { codigo: '4.1.04.04', descripcion: 'Impuestos al uso de bienes y servicios', clasificacion: 'Ingresos' },
        ]},
        { codigo: '4.1.05', descripcion: 'Impuestos sobre el comercio y transacciones al comercio exterior', clasificacion: 'Ingresos', hijos: [
          { codigo: '4.1.05.01', descripcion: 'Impuestos sobre las importaciones', clasificacion: 'Ingresos' },
          { codigo: '4.1.05.02', descripcion: 'Impuestos sobre las exportaciones', clasificacion: 'Ingresos' },
          { codigo: '4.1.05.03', descripcion: 'Impuestos diversos sobre el comercio exterior', clasificacion: 'Ingresos' },
        ]},
        { codigo: '4.1.06', descripcion: 'Impuestos Ecológicos', clasificacion: 'Ingresos', hijos: [
          { codigo: '4.1.06.01', descripcion: 'Impuestos Ecológicos', clasificacion: 'Ingresos' },
        ]},
        { codigo: '4.1.09', descripcion: 'Otros impuestos', clasificacion: 'Ingresos', hijos: [
          { codigo: '4.1.09.01', descripcion: 'Impuestos diversos', clasificacion: 'Ingresos' },
        ]},
      ]},
      { codigo: '4.2', descripcion: 'Ingresos sin contraprestación', clasificacion: 'Ingresos', hijos: [
        { codigo: '4.2.01', descripcion: 'Contribuciones sociales', clasificacion: 'Ingresos', hijos: [
          { codigo: '4.2.01.01', descripcion: 'Contribuciones al seguro de salud y riesgo laboral', clasificacion: 'Ingresos' },
          { codigo: '4.2.01.02', descripcion: 'Contribuciones al seguro de pensiones', clasificacion: 'Ingresos' },
          { codigo: '4.2.01.03', descripcion: 'Contribuciones varias', clasificacion: 'Ingresos' },
        ]},
        { codigo: '4.2.02', descripcion: 'Donaciones', clasificacion: 'Ingresos', hijos: [
          { codigo: '4.2.02.01', descripcion: 'Donaciones corrientes', clasificacion: 'Ingresos' },
          { codigo: '4.2.02.02', descripcion: 'Donaciones Capital', clasificacion: 'Ingresos' },
        ]},
        { codigo: '4.2.03', descripcion: 'Transferencias', clasificacion: 'Ingresos', hijos: [
          { codigo: '4.2.03.01', descripcion: 'Transferencias corrientes', clasificacion: 'Ingresos' },
          { codigo: '4.2.03.02', descripcion: 'Transferencias de capital', clasificacion: 'Ingresos' },
        ]},
        { codigo: '4.2.04', descripcion: 'Subvenciones', clasificacion: 'Ingresos', hijos: [
          { codigo: '4.2.04.01', descripcion: 'Subvenciones recibidas', clasificacion: 'Ingresos' },
        ]},
        { codigo: '4.2.09', descripcion: 'Ingresos sin contraprestación diversos', clasificacion: 'Ingresos', hijos: [
          { codigo: '4.2.09.99', descripcion: 'Otros ingresos sin contraprestación diversos', clasificacion: 'Ingresos' },
        ]},
      ]},
      { codigo: '4.3', descripcion: 'Ingresos con contraprestación', clasificacion: 'Ingresos', hijos: [
        { codigo: '4.3.01', descripcion: 'Ingresos por venta de bienes', clasificacion: 'Ingresos', hijos: [
          { codigo: '4.3.01.01', descripcion: 'Ingresos por venta de mercancías', clasificacion: 'Ingresos' },
          { codigo: '4.3.01.02', descripcion: 'Ingresos por venta de activos no financieros', clasificacion: 'Ingresos' },
          { codigo: '4.3.01.99', descripcion: 'Otros ingresos por venta de mercancías', clasificacion: 'Ingresos' },
        ]},
        { codigo: '4.3.02', descripcion: 'Ingresos por venta de servicios', clasificacion: 'Ingresos', hijos: [
          { codigo: '4.3.02.01', descripcion: 'Ingresos por venta de formularios de aduanas', clasificacion: 'Ingresos' },
          { codigo: '4.3.02.02', descripcion: 'Ingresos por venta de servicios de transporte', clasificacion: 'Ingresos' },
          { codigo: '4.3.02.99', descripcion: 'Ingresos por otras ventas de servicios', clasificacion: 'Ingresos' },
        ]},
        { codigo: '4.3.03', descripcion: 'Ingresos por Arrendamientos', clasificacion: 'Ingresos', hijos: [
          { codigo: '4.3.03.01', descripcion: 'Ingresos por Arrendamientos de Activos Producidos', clasificacion: 'Ingresos' },
          { codigo: '4.3.03.02', descripcion: 'Arrendamientos de Activos no Producidos', clasificacion: 'Ingresos' },
        ]},
        { codigo: '4.3.04', descripcion: 'Multas y sanciones', clasificacion: 'Ingresos', hijos: [
          { codigo: '4.3.04.01', descripcion: 'Multas, sanciones y recargos sobre tasas y derechos administrativos', clasificacion: 'Ingresos' },
          { codigo: '4.3.04.02', descripcion: 'Multas de tribunales', clasificacion: 'Ingresos' },
          { codigo: '4.3.04.03', descripcion: 'Multas de tránsito', clasificacion: 'Ingresos' },
          { codigo: '4.3.04.10', descripcion: 'Multas administrativas', clasificacion: 'Ingresos' },
          { codigo: '4.3.04.99', descripcion: 'Otras multas y sanciones diversas', clasificacion: 'Ingresos' },
        ]},
        { codigo: '4.3.05', descripcion: 'Tasas y Derechos', clasificacion: 'Ingresos', hijos: [
          { codigo: '4.3.05.01', descripcion: 'Tasas', clasificacion: 'Ingresos' },
          { codigo: '4.3.05.02', descripcion: 'Derechos administrativos', clasificacion: 'Ingresos' },
        ]},
        { codigo: '4.3.06', descripcion: 'Rentas de la Propiedad', clasificacion: 'Ingresos', hijos: [
          { codigo: '4.3.06.01', descripcion: 'Intereses y rentas financieras', clasificacion: 'Ingresos' },
          { codigo: '4.3.06.02', descripcion: 'Multas, sanciones y recargos moratorios sobre los impuestos, derechos y tasas', clasificacion: 'Ingresos' },
        ]},
        { codigo: '4.3.09', descripcion: 'Ingresos con contraprestación diversos', clasificacion: 'Ingresos', hijos: [
          { codigo: '4.3.09.99', descripcion: 'Otros ingresos con contraprestación diversos', clasificacion: 'Ingresos' },
        ]},
      ]},
      { codigo: '4.4', descripcion: 'Resultados de Operación Diversos', clasificacion: 'Ingresos', hijos: [
        { codigo: '4.4.01', descripcion: 'Resultados de la Participación no Controladora', clasificacion: 'Ingresos', hijos: [
          { codigo: '4.4.01.01', descripcion: 'Resultados positivos de inversiones en asociadas, subsidiarias y negocios conjuntos', clasificacion: 'Ingresos' },
          { codigo: '4.4.01.02', descripcion: 'Dividendos por Inversiones Empresariales', clasificacion: 'Ingresos' },
          { codigo: '4.4.01.04', descripcion: 'Resultados positivos por venta de inversiones en asociadas', clasificacion: 'Ingresos' },
        ]},
        { codigo: '4.4.02', descripcion: 'Diferencia de Cambio', clasificacion: 'Ingresos', hijos: [
          { codigo: '4.4.02.01', descripcion: 'Diferencia de cambio positivas', clasificacion: 'Ingresos' },
        ]},
        { codigo: '4.4.03', descripcion: 'Resultados positivos por tenencia financiera', clasificacion: 'Ingresos', hijos: [
          { codigo: '4.4.03.01', descripcion: 'Resultados positivos por tenencia de activos financieros', clasificacion: 'Ingresos' },
          { codigo: '4.4.03.02', descripcion: 'Resultados positivos por tenencia de pasivos', clasificacion: 'Ingresos' },
          { codigo: '4.4.03.04', descripcion: 'Resultado positivo por la posición monetaria neta', clasificacion: 'Ingresos' },
        ]},
        { codigo: '4.4.04', descripcion: 'Resultados positivos por ventas', clasificacion: 'Ingresos', hijos: [
          { codigo: '4.4.04.03', descripcion: 'Resultados positivos por ventas de propiedad, planta y equipo', clasificacion: 'Ingresos' },
          { codigo: '4.4.04.06', descripcion: 'Resultados positivos por ventas de bienes de infraestructura y de beneficio y uso público', clasificacion: 'Ingresos' },
        ]},
        { codigo: '4.4.05', descripcion: 'Recuperación de depreciaciones, agotamiento y amortizaciones de bienes', clasificacion: 'Ingresos', hijos: [
          { codigo: '4.4.05.01', descripcion: 'Reversión de depreciaciones, agotamiento y amortizaciones de bienes no concesionados', clasificacion: 'Ingresos' },
        ]},
        { codigo: '4.4.07', descripcion: 'Recuperación de provisiones', clasificacion: 'Ingresos', hijos: [
          { codigo: '4.4.07.01', descripcion: 'Recuperación de provisiones para litigios y demandas', clasificacion: 'Ingresos' },
          { codigo: '4.4.07.99', descripcion: 'Recuperación de otras provisiones', clasificacion: 'Ingresos' },
        ]},
        { codigo: '4.4.09', descripcion: 'Ingresos y resultados varios', clasificacion: 'Ingresos', hijos: [
          { codigo: '4.4.09.09', descripcion: 'Ingresos y resultados positivos varios', clasificacion: 'Ingresos' },
        ]},
      ]},
      { codigo: '4.9', descripcion: 'Ingresos Transitorios', clasificacion: 'Ingresos', hijos: [
        { codigo: '4.9.99', descripcion: 'Ingresos Transitorios', clasificacion: 'Ingresos', hijos: [
          { codigo: '4.9.99.01', descripcion: 'Ingresos por especificar', clasificacion: 'Ingresos' },
          { codigo: '4.9.99.02', descripcion: 'Ingresos por asignaciones presupuestarias', clasificacion: 'Ingresos' },
        ]},
      ]},
    ],
  },
  // ============================= 5. GASTOS =============================
  {
    codigo: '5', descripcion: 'GASTOS', clasificacion: 'Gastos',
    hijos: [
      { codigo: '5.1', descripcion: 'Gastos de Operación', clasificacion: 'Gastos', hijos: [
        { codigo: '5.1.01', descripcion: 'Beneficios a los empleados', clasificacion: 'Gastos', hijos: [
          { codigo: '5.1.01.01', descripcion: 'Remuneraciones', clasificacion: 'Gastos' },
          { codigo: '5.1.01.02', descripcion: 'Adicionales e incentivos salariales', clasificacion: 'Gastos' },
          { codigo: '5.1.01.03', descripcion: 'Dietas y gastos de representación', clasificacion: 'Gastos' },
          { codigo: '5.1.01.04', descripcion: 'Beneficios por terminación', clasificacion: 'Gastos' },
          { codigo: '5.1.01.05', descripcion: 'Contribuciones a la seguridad social', clasificacion: 'Gastos' },
          { codigo: '5.1.01.99', descripcion: 'Otros beneficios a los empleados', clasificacion: 'Gastos' },
        ]},
        { codigo: '5.1.02', descripcion: 'Servicios', clasificacion: 'Gastos', hijos: [
          { codigo: '5.1.02.01', descripcion: 'Servicios básicos', clasificacion: 'Gastos' },
          { codigo: '5.1.02.02', descripcion: 'Publicidad, impresión y encuadernación', clasificacion: 'Gastos' },
          { codigo: '5.1.02.03', descripcion: 'Viáticos', clasificacion: 'Gastos' },
          { codigo: '5.1.02.04', descripcion: 'Transporte y almacenaje', clasificacion: 'Gastos' },
          { codigo: '5.1.02.05', descripcion: 'Alquileres y derechos sobre bienes', clasificacion: 'Gastos' },
          { codigo: '5.1.02.06', descripcion: 'Seguros', clasificacion: 'Gastos' },
          { codigo: '5.1.02.07', descripcion: 'Servicios de conservación, reparaciones e instalaciones temporales', clasificacion: 'Gastos' },
          { codigo: '5.1.02.08', descripcion: 'Servicios técnicos y profesionales', clasificacion: 'Gastos' },
          { codigo: '5.1.02.09', descripcion: 'Servicios de alimentación y catering', clasificacion: 'Gastos' },
          { codigo: '5.1.02.99', descripcion: 'Otros servicios', clasificacion: 'Gastos' },
        ]},
        { codigo: '5.1.03', descripcion: 'Materiales y suministros consumidos', clasificacion: 'Gastos', hijos: [
          { codigo: '5.1.03.01', descripcion: 'Alimentos y productos agroforestales consumidos', clasificacion: 'Gastos' },
          { codigo: '5.1.03.02', descripcion: 'Textiles y vestuarios consumidos', clasificacion: 'Gastos' },
          { codigo: '5.1.03.03', descripcion: 'Productos de papel, cartón e impresos consumidos', clasificacion: 'Gastos' },
          { codigo: '5.1.03.04', descripcion: 'Productos Farmacéuticos', clasificacion: 'Gastos' },
          { codigo: '5.1.03.05', descripcion: 'Materiales y útiles médicos consumidos', clasificacion: 'Gastos' },
          { codigo: '5.1.03.06', descripcion: 'Productos de cuero, caucho y plástico consumidos', clasificacion: 'Gastos' },
          { codigo: '5.1.03.07', descripcion: 'Productos de minerales metálicos y no metálicos consumidos', clasificacion: 'Gastos' },
          { codigo: '5.1.03.08', descripcion: 'Combustibles, lubricantes, productos químicos y conexos consumidos', clasificacion: 'Gastos' },
          { codigo: '5.1.03.09', descripcion: 'Materiales y suministros de defensa, orden público, protección y seguridad consumidos', clasificacion: 'Gastos' },
          { codigo: '5.1.03.10', descripcion: 'Materiales y suministros varios consumidos', clasificacion: 'Gastos' },
        ]},
        { codigo: '5.1.04', descripcion: 'Depreciaciones, agotamiento y amortizaciones de Bienes', clasificacion: 'Gastos', hijos: [
          { codigo: '5.1.04.01', descripcion: 'Depreciaciones, agotamiento y amortizaciones de bienes no concesionados', clasificacion: 'Gastos' },
          { codigo: '5.1.04.02', descripcion: 'Depreciaciones, agotamiento y amortizaciones de bienes concesionados', clasificacion: 'Gastos' },
        ]},
        { codigo: '5.1.05', descripcion: 'Deterioro y pérdidas de inventarios', clasificacion: 'Gastos', hijos: [
          { codigo: '5.1.05.01', descripcion: 'Deterioro y pérdidas de materiales y suministros para consumo y prestación de servicios', clasificacion: 'Gastos' },
          { codigo: '5.1.05.05', descripcion: 'Deterioro y pérdidas de productos terminados', clasificacion: 'Gastos' },
          { codigo: '5.1.05.07', descripcion: 'Deterioro y pérdidas de inventarios adquiridos para la venta o cesión', clasificacion: 'Gastos' },
          { codigo: '5.1.05.99', descripcion: 'Deterioro y pérdidas de otros inventarios', clasificacion: 'Gastos' },
        ]},
        { codigo: '5.1.06', descripcion: 'Pérdidas por deterioro de bienes', clasificacion: 'Gastos', hijos: [
          { codigo: '5.1.06.01', descripcion: 'Deterioro de bienes no concesionados', clasificacion: 'Gastos' },
          { codigo: '5.1.06.02', descripcion: 'Deterioro de bienes concesionados', clasificacion: 'Gastos' },
        ]},
        { codigo: '5.1.07', descripcion: 'Otros Gastos Operativos', clasificacion: 'Gastos', hijos: [
          { codigo: '5.1.07.01', descripcion: 'Otros Gastos Operativos', clasificacion: 'Gastos' },
          { codigo: '5.1.07.02', descripcion: 'Gastos institucionales pendientes de clasificación', clasificacion: 'Gastos' },
        ]},
      ]},
      { codigo: '5.2', descripcion: 'Transferencias', clasificacion: 'Gastos', hijos: [
        { codigo: '5.2.01', descripcion: 'Transferencias corrientes', clasificacion: 'Gastos', hijos: [
          { codigo: '5.2.01.01', descripcion: 'Transferencias corrientes al sector privado interno', clasificacion: 'Gastos' },
          { codigo: '5.2.01.02', descripcion: 'Transferencias corrientes al sector público', clasificacion: 'Gastos' },
          { codigo: '5.2.01.03', descripcion: 'Transferencias corrientes al sector externo', clasificacion: 'Gastos' },
          { codigo: '5.2.01.04', descripcion: 'Subvenciones', clasificacion: 'Gastos' },
        ]},
        { codigo: '5.2.02', descripcion: 'Transferencias de capital', clasificacion: 'Gastos', hijos: [
          { codigo: '5.2.02.01', descripcion: 'Transferencias de capital al sector privado interno', clasificacion: 'Gastos' },
          { codigo: '5.2.02.02', descripcion: 'Transferencias de capital al sector público', clasificacion: 'Gastos' },
          { codigo: '5.2.02.03', descripcion: 'Transferencias de capital al sector externo', clasificacion: 'Gastos' },
        ]},
      ]},
      { codigo: '5.3', descripcion: 'Costos por ventas', clasificacion: 'Gastos', hijos: [
        { codigo: '5.3.01', descripcion: 'Costos por ventas de productos y bienes', clasificacion: 'Gastos', hijos: [
          { codigo: '5.3.01.01', descripcion: 'Costos por ventas de productos', clasificacion: 'Gastos' },
          { codigo: '5.3.01.02', descripcion: 'Costos por ventas de bienes', clasificacion: 'Gastos' },
        ]},
        { codigo: '5.3.02', descripcion: 'Costos por servicios prestados', clasificacion: 'Gastos', hijos: [
          { codigo: '5.3.02.01', descripcion: 'Costos por prestaciones de servicios básicos', clasificacion: 'Gastos' },
          { codigo: '5.3.02.03', descripcion: 'Costos por prestaciones de servicios de transporte y almacenaje', clasificacion: 'Gastos' },
          { codigo: '5.3.02.05', descripcion: 'Costos por prestaciones de servicios sanitarios, sociales, técnicos, profesionales y comerciales', clasificacion: 'Gastos' },
          { codigo: '5.3.02.99', descripcion: 'Costos por otras prestaciones de servicios', clasificacion: 'Gastos' },
        ]},
      ]},
      { codigo: '5.4', descripcion: 'Gastos financieros', clasificacion: 'Gastos', hijos: [
        { codigo: '5.4.01', descripcion: 'Gastos por intereses', clasificacion: 'Gastos', hijos: [
          { codigo: '5.4.01.01', descripcion: 'Intereses por cuentas a pagar', clasificacion: 'Gastos' },
          { codigo: '5.4.01.02', descripcion: 'Intereses por endeudamiento de Tesorería', clasificacion: 'Gastos' },
          { codigo: '5.4.01.03', descripcion: 'Intereses por préstamos', clasificacion: 'Gastos' },
          { codigo: '5.4.01.05', descripcion: 'Intereses por endeudamiento público', clasificacion: 'Gastos' },
          { codigo: '5.4.01.07', descripcion: 'Interés indemnizatorio por impuestos y contribuciones', clasificacion: 'Gastos' },
        ]},
        { codigo: '5.4.02', descripcion: 'Gastos por comisiones', clasificacion: 'Gastos', hijos: [
          { codigo: '5.4.02.01', descripcion: 'Gastos por comisiones sobre activos financieros', clasificacion: 'Gastos' },
          { codigo: '5.4.02.04', descripcion: 'Gastos por comisiones sobre pasivos', clasificacion: 'Gastos' },
        ]},
        { codigo: '5.4.03', descripcion: 'Pérdidas por deterioro Activos y Pasivos Financieros', clasificacion: 'Gastos', hijos: [
          { codigo: '5.4.03.01', descripcion: 'Pérdidas por deterioro de activos financieros', clasificacion: 'Gastos' },
          { codigo: '5.4.03.02', descripcion: 'Pérdidas por deterioro de Pasivos Financieros', clasificacion: 'Gastos' },
        ]},
        { codigo: '5.4.09', descripcion: 'Otros gastos financieros', clasificacion: 'Gastos', hijos: [
          { codigo: '5.4.09.99', descripcion: 'Otros gastos financieros varios', clasificacion: 'Gastos' },
        ]},
      ]},
      { codigo: '5.5', descripcion: 'Resultados de Operación diversos (gastos)', clasificacion: 'Gastos', hijos: [
        { codigo: '5.5.01', descripcion: 'Resultados negativos de inversiones en asociadas', clasificacion: 'Gastos', hijos: [
          { codigo: '5.5.01.01', descripcion: 'Resultados negativos de inversiones en asociadas, subsidiarias y negocios conjuntos', clasificacion: 'Gastos' },
          { codigo: '5.5.01.03', descripcion: 'Resultados negativos por venta de inversiones en asociadas', clasificacion: 'Gastos' },
        ]},
        { codigo: '5.5.02', descripcion: 'Por diferencias de cambio', clasificacion: 'Gastos', hijos: [
          { codigo: '5.5.02.01', descripcion: 'Diferencia de cambio negativas', clasificacion: 'Gastos' },
        ]},
        { codigo: '5.5.03', descripcion: 'Por tenencias', clasificacion: 'Gastos', hijos: [
          { codigo: '5.5.03.01', descripcion: 'Resultados negativos por tenencia de activos financieros', clasificacion: 'Gastos' },
          { codigo: '5.5.03.02', descripcion: 'Resultados negativos por tenencia de pasivos financieros', clasificacion: 'Gastos' },
          { codigo: '5.5.03.05', descripcion: 'Resultados negativos por tenencia de activos no financieros', clasificacion: 'Gastos' },
        ]},
        { codigo: '5.5.04', descripcion: 'Resultados negativos por ventas', clasificacion: 'Gastos', hijos: [
          { codigo: '5.5.04.02', descripcion: 'Resultados negativos por ventas de propiedades, planta y equipos', clasificacion: 'Gastos' },
          { codigo: '5.5.04.05', descripcion: 'Resultados negativos por ventas de bienes de infraestructura y de beneficio y uso público', clasificacion: 'Gastos' },
        ]},
        { codigo: '5.5.09', descripcion: 'Gastos y resultados negativos diversos', clasificacion: 'Gastos', hijos: [
          { codigo: '5.5.09.01', descripcion: 'Devoluciones de ingresos sin contraprestación', clasificacion: 'Gastos' },
          { codigo: '5.5.09.02', descripcion: 'Impuestos, multas y recargos moratorios', clasificacion: 'Gastos' },
          { codigo: '5.5.09.99', descripcion: 'Gastos y resultados negativos varios', clasificacion: 'Gastos' },
        ]},
      ]},
    ],
  },
];

function nivelDe(codigo: string): 1 | 2 | 3 | 4 {
  return codigo.split('.').length as 1 | 2 | 3 | 4;
}

function aplanar(nodos: Nodo[], padreId: string | null, out: CuentaContable[]) {
  for (const n of nodos) {
    const id = `CTA-${n.codigo}`;
    out.push({
      id,
      codigo: n.codigo,
      descripcion: n.descripcion,
      nivel: nivelDe(n.codigo),
      cuentaPadreId: padreId,
      clasificacion: n.clasificacion,
      naturaleza: NATURALEZA_POR_CLASE[n.clasificacion],
      estado: 'Vigente',
    });
    if (n.hijos) aplanar(n.hijos, id, out);
  }
}

export const CATALOGO_CUENTAS: CuentaContable[] = (() => {
  const out: CuentaContable[] = [];
  aplanar(ARBOL, null, out);
  return out;
})();

export const CUENTAS_HOJA = CATALOGO_CUENTAS.filter((c) => c.nivel === 4);
export const CUENTAS_POR_ID = new Map(CATALOGO_CUENTAS.map((c) => [c.id, c]));

export function hijosDe(id: string | null): CuentaContable[] {
  return CATALOGO_CUENTAS.filter((c) => c.cuentaPadreId === id);
}

export function rutaCompleta(id: string): CuentaContable[] {
  const ruta: CuentaContable[] = [];
  let actual = CUENTAS_POR_ID.get(id) ?? null;
  while (actual) {
    ruta.unshift(actual);
    actual = actual.cuentaPadreId ? CUENTAS_POR_ID.get(actual.cuentaPadreId) ?? null : null;
  }
  return ruta;
}

export const FUENTE_PLAN_CUENTAS = {
  nombre: 'Plan de Cuentas Contables y su Descripción, Versión 2.0',
  emisor: 'DIGECOG — Dirección de Normas, Políticas y Procedimientos',
  fecha: 'Junio 2023',
  marcoConceptual: 'NICSP versión 2021 (IPSASB / IFAC)',
  nota: 'El PCC oficial completo tiene 7 niveles (12 dígitos). Este prototipo reproduce los 4 primeros niveles (Clase.Grupo.Rubro.Cuenta) con nombres tomados literalmente del documento oficial.',
};
