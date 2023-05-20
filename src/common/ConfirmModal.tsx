import { FC } from 'react';
import Modal from './Modal';
import styled from 'styled-components';
import Button from '../styled/Button';

const Wrapper = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: '5px',
  padding: '5px',
});

const Text = styled.p((props) => ({
  textAlign: 'center',
  fontSize: props.theme.fontSizes.normal,
}));

const ButtonsRow = styled.div({
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '10px',
});

const ConfirmModal: FC<{
  text: string;
  confirmButtonText: string;
  closeModal: () => void;
  onConfirm: () => void;
}> = ({ text, confirmButtonText, closeModal, onConfirm }) => {
  return (
    <Modal closeModal={closeModal}>
      <Wrapper>
        <Text>{text}</Text>
        <ButtonsRow>
          <Button onClick={() => closeModal()}>Отмена</Button>
          <Button onClick={() => onConfirm()}>{confirmButtonText}</Button>
        </ButtonsRow>
      </Wrapper>
    </Modal>
  );
};

export default ConfirmModal;
