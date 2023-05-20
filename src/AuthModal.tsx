import { FC, useState } from 'react';
import Form from './common/Form';
import Button from './styled/Button';
import styled from 'styled-components';
import Modal from './common/Modal';
import { useUserDataContext } from './UserDataProvider';
import { useRequest } from './useRequest';

const StyledAuthModal = styled.div({
  margin: '0px auto',
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  width: '425px',
  padding: '10px',
});

const FormSelectionButtonsRow = styled.div({
  display: 'flex',
  gap: '10px',
});

const FormSelectionButton = styled(Button)({
  flex: '1 0 50px',
});

const AuthModal: FC<{ closeModal: () => void }> = ({ closeModal }) => {
  const { sendRequest } = useRequest();

  const [selectedForm, setSelectedForm] = useState<'login' | 'register'>(
    'login',
  );

  const { setUserData } = useUserDataContext();

  const commonProperties = {
    key: selectedForm,
    secondButton: (
      <Button type="button" onClick={closeModal}>
        Закрыть
      </Button>
    ),
    submitButtonText: selectedForm === 'login' ? 'Войти' : 'Зарегистрироваться',
  };

  return (
    <Modal closeModal={closeModal}>
      <StyledAuthModal>
        <FormSelectionButtonsRow>
          <FormSelectionButton
            onClick={() => setSelectedForm('login')}
            disabled={selectedForm === 'login'}
          >
            Войти
          </FormSelectionButton>
          <FormSelectionButton
            onClick={() => setSelectedForm('register')}
            disabled={selectedForm === 'register'}
          >
            Регистрация
          </FormSelectionButton>
        </FormSelectionButtonsRow>
        {selectedForm === 'login' ? (
          <Form
            {...commonProperties}
            fields={{
              name: { label: 'Имя' },
              password: { label: 'Пароль', type: 'password' },
            }}
            isValid={(fields) =>
              Object.values(fields).every(
                (field) => field.length >= 4 && field.length <= 32,
              )
            }
            onSubmit={(fields) => {
              sendRequest('login', 'POST', '/login', {
                body: fields,
                onResponseBody: (userData) => {
                  setUserData(userData);
                  closeModal();
                },
              });
            }}
          />
        ) : (
          <Form
            {...commonProperties}
            fields={{
              name: { label: 'Имя' },
              password: { label: 'Пароль', type: 'password' },
              repeatPassword: { label: 'Повторите пароль', type: 'password' },
            }}
            isValid={(fields) =>
              Object.values(fields).every(
                (field) => field.length >= 4 && field.length <= 32,
              ) && fields.password === fields.repeatPassword
            }
            onSubmit={(fields) => {
              sendRequest('account', 'POST', '/account', {
                body: {
                  name: fields.name,
                  password: fields.password,
                },
                onResponseBody: () => {
                  closeModal();
                },
              });
            }}
          />
        )}
      </StyledAuthModal>
    </Modal>
  );
};

export default AuthModal;
