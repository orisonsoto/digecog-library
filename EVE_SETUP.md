# Eve Framework Setup for DIGECOG

Este documento describe cómo Eve ha sido integrado en el proyecto DIGECOG para proporcionar asistencia inteligente mediante agentes de IA.

## ¿Qué es Eve?

Eve es un framework open-source de Vercel para construir, desplegar y operar agentes de IA en producción. Utiliza una estructura basada en el sistema de archivos, similar a cómo Next.js maneja el enrutamiento.

## Estructura del Proyecto

```
agent/
├── agent.ts                 # Configuración del agente
├── instructions.md          # Instrucciones y directrices del agente
└── tools/
    └── get_accounting_help.ts  # Herramienta de ejemplo
```

## Configuración

### 1. Variables de Entorno

Eve requiere autenticación. Elige una opción:

**Opción A: Usar Vercel OIDC Token** (recomendado para proyectos linked con Vercel)
```bash
VERCEL_OIDC_TOKEN=your_token_here
```

**Opción B: Usar AI Gateway API Key**
```bash
AI_GATEWAY_API_KEY=your_api_key_here
```

Las variables se configuran en `.env.local` (ya incluido en el proyecto).

### 2. Configuración de Eve

El archivo `eve.config.ts` contiene la configuración del proyecto:
- Nombre del agente
- Descripción
- Modelo AI por defecto (gpt-4)
- Configuraciones opcionales de canales

## Comandos Disponibles

### Desarrollo

```bash
npm run dev:agent
```

Inicia el servidor de desarrollo de Eve. El agente estará disponible localmente.

### Build para Producción

```bash
npm run build:agent
```

Construye el agente para despliegue en producción.

## Agregar Nuevas Herramientas

Las herramientas se definen en `agent/tools/` usando la función `defineTool`:

```typescript
import { defineTool } from 'eve/tools';
import { z } from 'zod';

export const miHerramienta = defineTool({
  name: 'mi_herramienta',
  description: 'Descripción de la herramienta',
  inputSchema: z.object({
    parametro: z.string().describe('Descripción del parámetro'),
  }),
  execute: async ({ parametro }) => {
    // Implementación de la herramienta
    return { resultado: 'resultado aquí' };
  },
});
```

## Despliegue

Para desplegar el agente en Vercel:

1. Link el proyecto a Vercel:
   ```bash
   vercel link
   ```

2. Configura las variables de entorno necesarias en Vercel

3. Despliega:
   ```bash
   npm run build:agent
   vercel deploy
   ```

## Recursos

- [Documentación oficial de Eve](https://eve.dev/)
- [Eve en GitHub](https://github.com/vercel/eve)
- [Guía de Vercel sobre Eve](https://vercel.com/docs/eve)

## Notas

- Eve actualmente está en beta
- Requiere Node.js >= 24 (actualmente el proyecto usa v22, esto puede causar advertencias)
- El agente está diseñado para ayudar con consultas contables y financieras de DIGECOG
