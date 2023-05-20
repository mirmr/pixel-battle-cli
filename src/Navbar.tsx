import { FC, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import Button from './styled/Button';
import AuthModal from './AuthModal';
import { borderMixin } from './mixins';
import { useUserDataContext } from './UserDataProvider';
import DropDown from './common/DropDown';
import ConfirmModal from './common/ConfirmModal';
import ChangePasswordModal from './ChangePasswordModal';
import { useRouterContext } from './RouterProvider';

const StyledNavbar = styled.div(() => borderMixin, {
  margin: '10px auto',
  width: '1280px',
  height: '55px',
  display: 'flex',
  justifyContent: 'space-between',
  padding: '5px',
});

const ButtonsGroup = styled.div({
  display: 'flex',
  gap: '5px',
});

const DropDownContent = styled.div(
  () => borderMixin,
  (props) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
    padding: '5px',
    width: '250px',
    background: props.theme.colors.background,
  }),
);

const Navbar: FC = () => {
  const { route } = useRouterContext();

  const [isShowAuthModal, setIsShowAuthModal] = useState(false);

  const [isShowDropDown, setIsShowDropDown] = useState(false);

  const [isShowChangePasswordModal, setIsShowChangePasswordModal] =
    useState(false);

  const [isShowConfirmExitModal, setIsShowConfirmExitModal] = useState(false);

  const { userData, setUserData } = useUserDataContext();

  const dropDownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: PointerEvent) => {
      if (
        !(e.target instanceof Node && dropDownRef.current?.contains(e.target))
      ) {
        setIsShowDropDown(false);
      }
    };
    document.addEventListener('pointerdown', handler);
    return () => {
      document.removeEventListener('pointerdown', handler);
    };
  }, []);

  return (
    <StyledNavbar>
      {isShowAuthModal && (
        <AuthModal closeModal={() => setIsShowAuthModal(false)} />
      )}
      {isShowChangePasswordModal && (
        <ChangePasswordModal
          closeModal={() => setIsShowChangePasswordModal(false)}
        />
      )}
      {isShowConfirmExitModal && (
        <ConfirmModal
          closeModal={() => setIsShowConfirmExitModal(false)}
          text="Вы уверены, что хотите выйти?"
          confirmButtonText="Выйти"
          onConfirm={() => {
            setUserData(null);
            setIsShowConfirmExitModal(false);
          }}
        />
      )}
      <ButtonsGroup>
        <Button as="a" href="#/canvases" disabled={route === 'canvases'}>
          Canvases
        </Button>
      </ButtonsGroup>
      <ButtonsGroup>
        {userData ? (
          <DropDown
            ref={dropDownRef}
            align="right"
            button={
              <Button onClick={() => setIsShowDropDown((prev) => !prev)}>
                {userData.account_name}
              </Button>
            }
            show={isShowDropDown}
          >
            <DropDownContent>
              <Button onClick={() => setIsShowChangePasswordModal(true)}>
                Сменить пароль
              </Button>
              <Button onClick={() => setIsShowConfirmExitModal(true)}>
                Выйти
              </Button>
            </DropDownContent>
          </DropDown>
        ) : (
          <Button onClick={() => setIsShowAuthModal(true)}>Авторизация</Button>
        )}
      </ButtonsGroup>
    </StyledNavbar>
  );
};

export default Navbar;
