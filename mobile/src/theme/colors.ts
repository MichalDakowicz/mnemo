// Matro's tokens (matro/src/styles.css :root), translated once. Monochrome warm, no accent.
// Same values as the web app's src/styles/global.css. No raw hex in components: use these.
export const colors = {
  ground: '#0a0a0b',
  panel: '#161618',
  text: '#ece9e4',
  textBright: '#f4f1ec',
  muted: '#a9a59d',
  dim: '#8f8c87',
  soft: '#bebab3',
  nav: '#b9b6b0',
  hairline: '#ffffff14',
  line: '#ece9e41f',
  lineStrong: '#ece9e433',
  wash: '#ece9e409',
  primary: '#f3f1ec',
  onPrimary: '#0a0a0b',
  glass: '#1a1a1c8c',
  glassSolid: '#161618f2',
  good: '#9fd6b0',
  warn: '#e3a58b',
  // interaction fills used across pills, chips and menu rows
  hover: '#ece9e414',
  active: '#ece9e41f',
  chipBorder: '#ece9e429',
  // Matro's search field (Downloads artboard): border and placeholder
  fieldBorder: '#ece9e438',
  placeholder: '#6f6c68',
  inputFill: '#1a1a1cb3',
  scrim: '#0a0a0bf0',
  sheen: '#ffffff1a',
  white: '#ffffff',
  black: '#000000',
} as const;

export type ColorName = keyof typeof colors;
