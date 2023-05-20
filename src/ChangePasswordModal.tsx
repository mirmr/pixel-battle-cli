import { FC } from 'react';
import Modal from './common/Modal';
import Form from './common/Form';
import Button from './styled/Button';
import { useRequest } from './useRequest';

const ChangePasswordModal: FC<{ closeModal: () => void }> = ({
  closeModal,
}) => {
  const { sendRequest } = useRequest();

  return (
    <Modal closeModal={closeModal}>
      <Form
        fields={{ password: { label: 'Пароль' } }}
        secondButton={
          <Button type="button" onClick={() => closeModal()}>
            Отмена
          </Button>
        }
        submitButtonText="Сменить пароль"
        isValid={(fields) =>
          fields.password.length >= 4 && fields.password.length <= 32
        }
        onSubmit={(fields) => {
          sendRequest('account', 'PATCH', '/account', {
            body: fields,
            onResponse: (response) => {
              if (response.ok) {
                closeModal();
              }
            },
          });
        }}
      />
    </Modal>
  );
};

export default ChangePasswordModal;
