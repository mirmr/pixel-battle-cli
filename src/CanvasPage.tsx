import { FC, useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import PixelGrid, { PixelData } from './PixelGrid';
import Input from './styled/Input';
import { CanvasDB, Grid } from './types';
import { removeMsIsoDateString, setGridIndicies } from './utils';
import { borderMixin } from './mixins';
import { useUserDataContext } from './UserDataProvider';
import Loading from './common/Loading';
import { useRequest } from './useRequest';
import { isValidDateString } from './utils';
import Button from './styled/Button';

const StyledCanvasPage = styled.div({
  display: 'flex',
  gap: '10px',
  alignItems: 'flex-start',
});

const PositionedContainer = styled.div(() => borderMixin, {
  position: 'relative',
  width: 'fit-content',
  height: 'fit-content',
});

const StyledInput = styled(Input)<{ top: number; left: number }>((props) => ({
  position: 'absolute',
  top: '0px',
  left: '0px',
  transform: `translate(${props.left}px, calc(${props.top}px - 100%))`,
  visibility: 'hidden',
}));

const DateInput = styled(Input)({
  height: '40px',
});

const CanvasPage: FC<{ canvasId: string }> = ({ canvasId }) => {
  const { userData } = useUserDataContext();

  const { sendRequest } = useRequest();

  const [grid, setGrid] = useState<CanvasDB | null>(null);

  const isGridOfUser = !!userData && userData.account_id === grid?.account_id;

  const [isWatchingOldCanvas, setIsWatchingOldCanvas] = useState(false);

  const canEdit =
    !!userData &&
    grid &&
    Date.now() > new Date(grid.active_from).getTime() &&
    Date.now() < new Date(grid.active_to).getTime();

  const dateInputRef = useRef<HTMLInputElement>(null);

  const [gridData, setGridData] = useState<Grid | null>(null);

  const [pixelData, setPixelData] = useState<PixelData | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  if (!canEdit && pixelData) {
    setPixelData(null);
  }

  const onPixelSelect = useCallback(
    (data: PixelData) => {
      if (canEdit) {
        setPixelData(data);
      }
    },
    [canEdit],
  );

  const onPixelRepaint = useCallback(
    ({ x, y, color }: { x: number; y: number; color: string }) => {
      if (userData) {
        sendRequest('canvasData', 'POST', `/canvas/${canvasId}/data`, {
          body: { x, y, color },
          onResponse: (response) => {
            if (response.ok) {
              setGridData(
                (prev) =>
                  prev &&
                  prev.map((row) =>
                    row.map((pixel) =>
                      pixel.colInd === x && pixel.rowInd === y
                        ? { ...pixel, color }
                        : pixel,
                    ),
                  ),
              );
            }
          },
        });
      }
    },
    [userData, sendRequest, canvasId],
  );

  useEffect(() => {
    const dateInputElem = dateInputRef.current;
    const handler = (e: Event) => {
      if (
        e.target instanceof HTMLInputElement &&
        isValidDateString(e.target.value)
      ) {
        if (new Date(e.target.value).getTime() < Date.now()) {
          setIsWatchingOldCanvas(true);
          sendRequest('canvasData', 'GET', `/canvas/${canvasId}/data`, {
            params: {
              at: removeMsIsoDateString(new Date(e.target.value).toISOString()),
            },
            onResponseBody: (grid) => {
              setGridData(setGridIndicies(grid));
            },
          });
        } else {
          e.target.value = '';
        }
      }
    };
    dateInputElem?.addEventListener('change', handler);
    return () => {
      dateInputElem?.removeEventListener('change', handler);
    };
  }, [grid, gridData, sendRequest, canvasId]);

  useEffect(() => {
    const inputElem = inputRef.current;
    if (inputElem && pixelData) {
      inputElem.value = pixelData.color;
    }
    const changeHandler = (e: Event) => {
      if (pixelData && e.target instanceof HTMLInputElement) {
        onPixelRepaint({
          x: pixelData.colInd,
          y: pixelData.rowInd,
          color: e.target.value,
        });
      }
    };
    inputElem?.addEventListener('change', changeHandler);
    requestAnimationFrame(() => {
      inputRef.current?.showPicker();
    });
    return () => {
      inputElem?.removeEventListener('change', changeHandler);
    };
  }, [pixelData, onPixelRepaint]);

  useEffect(() => {
    const controller = new AbortController();
    sendRequest('canvasManagement', 'GET', `/canvas/${canvasId}`, {
      signal: controller.signal,
      onResponseBody: setGrid,
    });
    sendRequest('canvasData', 'GET', `/canvas/${canvasId}/data`, {
      signal: controller.signal,
      onResponseBody: (grid) => {
        setGridData(setGridIndicies(grid));
      },
    });
    return () => {
      controller.abort();
    };
  }, [sendRequest, canvasId]);

  useEffect(() => {
    const controller = new AbortController();
    let timeoutId: number | undefined = undefined;
    if (grid && !isGridOfUser && !isWatchingOldCanvas) {
      const cb = () => {
        sendRequest('canvasData', 'GET', `/canvas/${canvasId}/data`, {
          signal: controller.signal,
          onResponseBody: (grid) => {
            setGridData(setGridIndicies(grid));
            timeoutId = window.setTimeout(cb, 5000);
          },
        });
      };
      timeoutId = window.setTimeout(cb, 5000);
    }
    return () => {
      controller.abort();
      window.clearTimeout(timeoutId);
    };
  }, [grid, isGridOfUser, isWatchingOldCanvas, sendRequest, canvasId]);

  return (
    <StyledCanvasPage>
      {grid && gridData ? (
        <>
          <PositionedContainer>
            <PixelGrid
              width={grid.width}
              height={grid.height}
              grid={gridData}
              onPixelSelect={onPixelSelect}
            />
            {pixelData && (
              <StyledInput
                ref={inputRef}
                top={pixelData.offsetY}
                left={pixelData.offsetX}
                type="color"
                defaultValue={pixelData.color}
              />
            )}
          </PositionedContainer>
          <DateInput
            type="datetime-local"
            ref={dateInputRef}
            max={new Date().toISOString().slice(0, -1)}
          />
          {isWatchingOldCanvas && (
            <Button
              onClick={() => {
                const dateInputElem = dateInputRef.current;
                if (dateInputElem) {
                  dateInputElem.value = '';
                }
                setIsWatchingOldCanvas(false);
                sendRequest('canvasData', 'GET', `/canvas/${canvasId}/data`, {
                  onResponseBody: (grid) => {
                    setGridData(setGridIndicies(grid));
                  },
                });
              }}
            >
              Актуальная версия
            </Button>
          )}
        </>
      ) : (
        <Loading />
      )}
    </StyledCanvasPage>
  );
};

export default CanvasPage;
