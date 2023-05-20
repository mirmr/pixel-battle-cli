import { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import { CanvasDB } from './types';
import { useRequest } from './useRequest';
import Modal from './common/Modal';
import Form from './common/Form';
import Button from './styled/Button';
import {
  isValidDateString,
  removeMsIsoDateString,
  satisfiesMinmax,
} from './utils';
import Loading from './common/Loading';
import { useUserDataContext } from './UserDataProvider';

const StyledCanvasesPage = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
});

const OpenModalButton = styled(Button)({
  width: '50px',
  height: '50px',
  padding: '0px',
  fontSize: '36px',
});

const CanvasList = styled.div({
  display: 'flex',
  gap: '10px',
});

const CanvasItem = styled(Button)({
  padding: '5px',
});

const CanvasesPage: FC = () => {
  const { userData } = useUserDataContext();

  const { sendRequest } = useRequest();

  const [canvases, setCanvases] = useState<null | CanvasDB[]>(null);

  const [isShowCreateCanvasModal, setIsShowCreateCanvasModal] = useState(false);

  const closeCreateCanvasModal = () => {
    setIsShowCreateCanvasModal(false);
  };

  useEffect(() => {
    const controller = new AbortController();
    sendRequest('userCanvases', 'GET', '/canvas/my', {
      signal: controller.signal,
      onResponseBody: setCanvases,
    });
    return () => {
      controller.abort();
    };
  }, [sendRequest]);

  return (
    <StyledCanvasesPage>
      {isShowCreateCanvasModal && (
        <Modal closeModal={closeCreateCanvasModal}>
          <Form
            fields={{
              name: { type: 'text', label: 'Имя' },
              width: { type: 'number', label: 'Ширина' },
              height: { type: 'number', label: 'Высота' },
              active_from: {
                type: 'datetime-local',
                label: 'Активен от',
                initialValue: new Date(
                  Date.now() - new Date().getTimezoneOffset() * 60 * 1000,
                )
                  .toISOString()
                  .slice(0, -8),
              },
              active_to: { type: 'datetime-local', label: 'Активен до' },
            }}
            submitButtonText="Создать"
            isValid={(fields) => {
              return (
                satisfiesMinmax(1, fields.name.length, 64) &&
                satisfiesMinmax(1, +fields.width, 1024) &&
                satisfiesMinmax(1, +fields.height, 1024) &&
                isValidDateString(fields.active_from) &&
                isValidDateString(fields.active_to) &&
                new Date(fields.active_from).getTime() <
                  new Date(fields.active_to).getTime()
              );
            }}
            onSubmit={(fields) => {
              sendRequest('canvas', 'POST', '/canvas', {
                body: {
                  name: fields.name,
                  width: +fields.width,
                  height: +fields.height,
                  active_from: removeMsIsoDateString(
                    new Date(fields.active_from).toISOString(),
                  ),
                  active_to: removeMsIsoDateString(
                    new Date(fields.active_to).toISOString(),
                  ),
                },
                onResponseBody: (canvasDB) => {
                  setCanvases((prev) => [...(prev ?? []), canvasDB]);
                  closeCreateCanvasModal();
                },
              });
            }}
            secondButton={
              <Button type="button" onClick={closeCreateCanvasModal}>
                Закрыть
              </Button>
            }
          />
        </Modal>
      )}
      {userData && (
        <OpenModalButton onClick={() => setIsShowCreateCanvasModal(true)}>
          +
        </OpenModalButton>
      )}
      <CanvasList>
        {canvases ? (
          canvases.map((canvas) => (
            <CanvasItem key={canvas.id} as="a" href={`#/canvases/${canvas.id}`}>
              {canvas.name}
            </CanvasItem>
          ))
        ) : (
          <Loading />
        )}
      </CanvasList>
    </StyledCanvasesPage>
  );
};

export default CanvasesPage;
