import { ReactNode } from 'react';
import { FC } from 'react';
import styled from 'styled-components';
import { borderMixin } from '../mixins';

const Wrapper = styled.div({
  position: 'fixed',
  top: '0px',
  left: '0px',
  width: '100vw',
  height: '100vh',
  zIndex: '10',
});

const Background = styled.div({
  position: 'absolute',
  top: '0px',
  left: '0px',
  width: '100vw',
  height: '100vh',
  backgroundColor: '#00000088',
  zIndex: '11',
});

const StyledModal = styled.div(
  () => borderMixin,
  (props) => ({
    position: 'relative',
    margin: '10px auto',
    width: 'fit-content',
    zIndex: '12',
    backgroundColor: props.theme.colors.background,
  }),
);

const Modal: FC<{ closeModal: () => void; children: ReactNode }> = ({
  closeModal,
  children,
}) => {
  return (
    <Wrapper>
      <Background onClick={closeModal} />
      <StyledModal>{children}</StyledModal>
    </Wrapper>
  );
};

export default Modal;
