import styled from 'styled-components';
import { borderMixin, disabledMixin } from '../mixins';

const Input = styled.input(
  () => borderMixin,
  (props) => ({
    paddingLeft: '1px',
    color: props.theme.colors.text,
    fontSize: props.theme.fontSizes.normal,
  }),
  (props) => props.disabled && disabledMixin,
);

export default Input;
