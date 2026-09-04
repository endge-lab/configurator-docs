interface MermaidRoleColors {
  fill: string
  stroke: string
  text: string
}

interface MermaidPalette {
  canvas: string
  cluster: string
  clusterBorder: string
  edgeLabel: string
  line: string
  mutedText: string
  shadow: string
  text: string
  roles: Record<string, MermaidRoleColors>
}

export interface EndgeMermaidTheme {
  look: 'neo'
  theme: 'base'
  themeCSS: string
  themeVariables: Record<string, boolean | string>
}

const lightPalette: MermaidPalette = {
  canvas: '#f8fafc',
  cluster: '#f1f5f9',
  clusterBorder: '#cbd5e1',
  edgeLabel: '#f8fafc',
  line: '#64748b',
  mutedText: '#475569',
  shadow: 'rgba(15, 23, 42, 0.12)',
  text: '#172033',
  roles: {
    endgeInput: { fill: '#172554', stroke: '#60a5fa', text: '#eff6ff' },
    endgeProcess: { fill: '#e0f2fe', stroke: '#0284c7', text: '#0c4a6e' },
    endgeDecision: { fill: '#cffafe', stroke: '#0891b2', text: '#164e63' },
    endgePackage: { fill: '#ede9fe', stroke: '#7c3aed', text: '#4c1d95' },
    endgeRegistry: { fill: '#fef3c7', stroke: '#d97706', text: '#78350f' },
    endgeFederation: { fill: '#172554', stroke: '#60a5fa', text: '#eff6ff' },
    endgeModule: { fill: '#e0f2fe', stroke: '#0284c7', text: '#0c4a6e' },
    endgeSubmodule: { fill: '#dcfce7', stroke: '#16a34a', text: '#14532d' },
    endgeAI: { fill: '#fef3c7', stroke: '#d97706', text: '#78350f' },
    endgeClarification: { fill: '#ede9fe', stroke: '#7c3aed', text: '#4c1d95' },
    endgeSuccess: { fill: '#dcfce7', stroke: '#16a34a', text: '#14532d' },
    endgeFailure: { fill: '#ffe4e6', stroke: '#e11d48', text: '#881337' },
    endgeTerminal: { fill: '#e2e8f0', stroke: '#64748b', text: '#334155' },
  },
}

const darkPalette: MermaidPalette = {
  canvas: '#0b1220',
  cluster: '#111c2f',
  clusterBorder: '#334155',
  edgeLabel: '#111827',
  line: '#94a3b8',
  mutedText: '#cbd5e1',
  shadow: 'rgba(2, 6, 23, 0.42)',
  text: '#e5edf7',
  roles: {
    endgeInput: { fill: '#172554', stroke: '#60a5fa', text: '#eff6ff' },
    endgeProcess: { fill: '#0c4a6e', stroke: '#38bdf8', text: '#e0f2fe' },
    endgeDecision: { fill: '#164e63', stroke: '#22d3ee', text: '#cffafe' },
    endgePackage: { fill: '#4c1d95', stroke: '#a78bfa', text: '#f5f3ff' },
    endgeRegistry: { fill: '#78350f', stroke: '#fbbf24', text: '#fef3c7' },
    endgeFederation: { fill: '#172554', stroke: '#60a5fa', text: '#eff6ff' },
    endgeModule: { fill: '#0c4a6e', stroke: '#38bdf8', text: '#e0f2fe' },
    endgeSubmodule: { fill: '#14532d', stroke: '#4ade80', text: '#dcfce7' },
    endgeAI: { fill: '#78350f', stroke: '#fbbf24', text: '#fef3c7' },
    endgeClarification: { fill: '#4c1d95', stroke: '#a78bfa', text: '#f5f3ff' },
    endgeSuccess: { fill: '#14532d', stroke: '#4ade80', text: '#dcfce7' },
    endgeFailure: { fill: '#881337', stroke: '#fb7185', text: '#ffe4e6' },
    endgeTerminal: { fill: '#334155', stroke: '#94a3b8', text: '#f1f5f9' },
  },
}

export function createEndgeMermaidTheme(isDark: boolean): EndgeMermaidTheme {
  const palette = isDark ? darkPalette : lightPalette

  return {
    look: 'neo',
    theme: 'base',
    themeVariables: {
      background: palette.canvas,
      darkMode: isDark,
      edgeLabelBackground: palette.edgeLabel,
      fontFamily: '\'Avenir Next\', Avenir, \'Segoe UI\', sans-serif',
      fontSize: '15px',
      lineColor: palette.line,
      mainBkg: palette.cluster,
      primaryBorderColor: palette.clusterBorder,
      primaryColor: palette.cluster,
      primaryTextColor: palette.text,
      secondaryBorderColor: palette.clusterBorder,
      secondaryColor: palette.cluster,
      secondaryTextColor: palette.text,
      tertiaryBorderColor: palette.clusterBorder,
      tertiaryColor: palette.canvas,
      tertiaryTextColor: palette.text,
      textColor: palette.text,
    },
    themeCSS: createThemeCSS(palette),
  }
}

function createThemeCSS(palette: MermaidPalette): string {
  const roleStyles = Object.entries(palette.roles)
    .map(([className, colors]) => createRoleCSS(className, colors))
    .join('\n')

  return `
    .node .label-container,
    .node .label-container > circle,
    .node .label-container > ellipse,
    .node .label-container > path,
    .node .label-container > polygon,
    .node .label-container > rect,
    .node > circle,
    .node > ellipse,
    .node > path,
    .node > polygon,
    .statediagram-state .label-container {
      filter: drop-shadow(0 8px 12px ${palette.shadow});
    }

    .cluster rect {
      fill: ${palette.cluster} !important;
      stroke: ${palette.clusterBorder} !important;
      stroke-width: 1.5px !important;
      rx: 0 !important;
      ry: 0 !important;
    }

    .node rect,
    .node .label-container rect,
    .statediagram-state rect {
      rx: 0 !important;
      ry: 0 !important;
    }

    .cluster-label text,
    .cluster-label span {
      color: ${palette.mutedText} !important;
      fill: ${palette.mutedText} !important;
      font-weight: 700 !important;
    }

    .edgeLabel rect,
    .labelBkg {
      fill: ${palette.edgeLabel} !important;
      opacity: 0.94 !important;
    }

    .edgeLabel,
    .edgeLabel p,
    .edgeLabel span {
      color: ${palette.mutedText} !important;
      font-size: 13px !important;
    }

    .flowchart-link,
    .transition {
      stroke: ${palette.line} !important;
      stroke-width: 1.7px !important;
    }

    marker path,
    .marker {
      fill: ${palette.line} !important;
      stroke: ${palette.line} !important;
    }

    ${roleStyles}
  `
}

function createRoleCSS(className: string, colors: MermaidRoleColors): string {
  return `
    .${className} .label-container,
    .${className} .label-container > circle,
    .${className} .label-container > ellipse,
    .${className} .label-container > path,
    .${className} .label-container > polygon,
    .${className} .label-container > rect,
    .${className} > circle,
    .${className} > ellipse,
    .${className} > path,
    .${className} > polygon,
    .${className} .state-note {
      fill: ${colors.fill} !important;
      stroke: ${colors.stroke} !important;
      stroke-width: 2px !important;
    }

    .${className} .label,
    .${className} .nodeLabel,
    .${className} .stateLabel,
    .${className} p,
    .${className} span,
    .${className} text {
      color: ${colors.text} !important;
      fill: ${colors.text} !important;
      font-weight: 650 !important;
    }
  `
}
