import { css } from 'styled-components';

export const borderMixin = css((props) => ({
  border: `2px solid ${props.theme.colors.primary}`,
  borderRadius: '3px',
}));

export const disabledMixin = css((props) => ({
  color: props.theme.colors.textInactive,
  backgroundColor: props.theme.colors.inactive,
  pointerEvents: 'none',
}));
