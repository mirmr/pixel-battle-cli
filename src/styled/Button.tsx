import styled from 'styled-components';
import { borderMixin, disabledMixin } from '../mixins';

const Button = styled.button<{ disabled?: boolean | undefined }>(
  () => borderMixin,
  (props) => ({
    padding: '5px',
    color: props.theme.colors.text,
    fontSize: props.theme.fontSizes.normal,
    backgroundColor: props.theme.colors.background,
    transition: 'background-color 0.2s ease, color 0.2s ease',
    ':not([disabled]):hover': {
      backgroundColor: props.theme.colors.primary,
      cursor: 'pointer',
    },
  }),
  (props) => props.disabled && disabledMixin,
);

export default Button;
