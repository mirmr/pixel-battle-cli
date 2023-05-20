export const theme = {
  colors: {
    background: '#ffffff',
    text: '#000000',
    primary: '#bbbbbb',
    inactive: '#dddddd',
    textInactive: '#888888',
  },
  fontSizes: {
    normal: '22px',
    large: '30px',
  },
} as const;

type Theme = typeof theme;

declare module 'styled-components' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface DefaultTheme extends Theme {}
}
