import { FC, useCallback, useEffect, useRef } from 'react';
import { Grid } from './types';
import { minmax } from './utils';
import styled from 'styled-components';

export type PixelData = {
  offsetX: number;
  offsetY: number;
  colInd: number;
  rowInd: number;
  color: string;
};

type CanvasTransformation = {
  scale: number;
  translateX: number;
  translateY: number;
};

const StyledPixelGrid = styled.div({
  position: 'relative',
});

const Canvas = styled.canvas({
  display: 'block',
  borderRadius: '1px',
});

const ScrollBar = styled.div<{ vertical?: boolean | undefined }>((props) => ({
  position: 'absolute',
  ...(props.vertical
    ? { right: '3px', top: '3px', width: '16px' }
    : { left: '3px', bottom: '3px', height: '16px' }),
  backgroundColor: '#000000aa',
}));

const PixelGrid: FC<{
  grid: Grid;
  width: number;
  height: number;
  onPixelSelect: (pixelData: PixelData) => void;
}> = ({ grid, width, height, onPixelSelect }) => {
  const wrapperElementRef = useRef<HTMLDivElement>(null);

  const canvasElementRef = useRef<HTMLCanvasElement>(null);

  const scrollXRef = useRef<HTMLDivElement>(null);

  const scrollYRef = useRef<HTMLDivElement>(null);

  const canvasConfigRef = useRef({
    pixelsAmountX: width,
    pixelsAmountY: height,
    width: 800,
    height: 800,
    scaleMin: 0.25,
    scaleMax: 8,
    pixelSize: 16,
    gapSize: 1,
  });

  const canvasTransformationRef = useRef({
    scale: 1,
    translateX: 0,
    translateY: 0,
  });

  const getComputedValues = ({
    scale,
    translateX,
    translateY,
  }: CanvasTransformation) => {
    const config = canvasConfigRef.current;
    const pixelSize = config.pixelSize * scale;
    const gapSize = config.gapSize * scale;
    return {
      pixelSize,
      gapSize,
      visiblePixelsOffsetX: Math.floor(
        (-translateX * scale) / (pixelSize + gapSize),
      ),
      visiblePixelsOffsetY: Math.floor(
        (-translateY * scale) / (pixelSize + gapSize),
      ),
      visiblePixelsAmountX: Math.ceil(config.width / (pixelSize + gapSize)) + 1,
      visiblePixelsAmountY:
        Math.ceil(config.height / (pixelSize + gapSize)) + 1,
      innerWidth: config.pixelsAmountX * (pixelSize + gapSize) + gapSize,
      innerHeight: config.pixelsAmountY * (pixelSize + gapSize) + gapSize,
      getXPosOffset: (index: number) => {
        return translateX * scale + index * (pixelSize + gapSize) + gapSize;
      },
      getYPosOffset: (index: number) => {
        return translateY * scale + index * (pixelSize + gapSize) + gapSize;
      },
      getPixelPosAt: (x: number, y: number) => {
        return {
          x: minmax(
            0,
            Math.floor(
              (-translateX * scale + x - gapSize / 2) / (pixelSize + gapSize),
            ),
            config.pixelsAmountX - 1,
          ),
          y: minmax(
            0,
            Math.floor(
              (-translateY * scale + y - gapSize / 2) / (pixelSize + gapSize),
            ),
            config.pixelsAmountY - 1,
          ),
        };
      },
    };
  };

  const setScrollSizes = useCallback(() => {
    const scrollXElement = scrollXRef.current;
    const scrollYElement = scrollYRef.current;
    const config = canvasConfigRef.current;
    const transformation = canvasTransformationRef.current;
    const { innerWidth, innerHeight } = getComputedValues(transformation);
    const scrollWidth = config.width - 6;
    const scrollHeight = config.height - 6;
    const scrollXSize = (scrollWidth / innerWidth) * config.width;
    const scrollYSize = (scrollHeight / innerHeight) * config.height;
    if (scrollXElement) {
      scrollXElement.style.width = `${scrollXSize}px`;
      scrollXElement.style.transform = `translateX(${
        (-transformation.translateX / innerWidth) *
        scrollWidth *
        transformation.scale
      }px)`;
    }
    if (scrollYElement) {
      scrollYElement.style.height = `${scrollYSize}px`;
      scrollYElement.style.transform = `translateY(${
        (-transformation.translateY / innerHeight) *
        scrollHeight *
        transformation.scale
      }px)`;
    }
  }, []);

  const setTransformation = useCallback(
    (transformation: CanvasTransformation) => {
      const config = canvasConfigRef.current;
      if (
        transformation.scale >= config.scaleMin &&
        transformation.scale <= config.scaleMax
      ) {
        const gridWidth =
          config.pixelsAmountX * (config.pixelSize + config.gapSize) +
          config.gapSize;
        const gridHeight =
          config.pixelsAmountY * (config.pixelSize + config.gapSize) +
          config.gapSize;
        const scale = transformation.scale;
        canvasTransformationRef.current = {
          scale: scale,
          translateX: minmax(
            -(gridWidth - config.width / scale),
            transformation.translateX,
            0,
          ),
          translateY: minmax(
            -(gridHeight - config.height / scale),
            transformation.translateY,
            0,
          ),
        };
        setScrollSizes();
      }
    },
    [setScrollSizes],
  );

  useEffect(() => {
    setScrollSizes();
    const scrollXElement = scrollXRef.current;
    const scrollYElement = scrollYRef.current;
    let capturedPointerId: number | null = null;
    const createPointerDownHandler = (
      pointerMoveHandler: (e: PointerEvent) => void,
      pointerReleaseHandler: (e: PointerEvent) => void,
    ) => {
      return (e: PointerEvent) => {
        if (e.target instanceof HTMLElement) {
          e.target.setPointerCapture((capturedPointerId = e.pointerId));
          e.target.addEventListener('pointermove', pointerMoveHandler);
          e.target.addEventListener('pointerup', pointerReleaseHandler);
          e.target.addEventListener('pointerout', pointerReleaseHandler);
        }
      };
    };
    const createPointerMoveHandler = (axis: 'x' | 'y') => {
      return (e: PointerEvent) => {
        const transformation = canvasTransformationRef.current;
        const { innerWidth, innerHeight } = getComputedValues(transformation);
        const transformationKey = axis === 'x' ? 'translateX' : 'translateY';
        setTransformation({
          ...transformation,
          [transformationKey]:
            transformation[transformationKey] -
            (axis === 'x'
              ? (e.movementX * innerWidth) / canvasConfigRef.current.width
              : (e.movementY * innerHeight) / canvasConfigRef.current.height) /
              transformation.scale,
        });
      };
    };
    const createReleasePointerHandler = (
      element: HTMLElement | null,
      pointerMoveHandler: (e: PointerEvent) => void,
    ) => {
      return () => {
        if (capturedPointerId) {
          element?.releasePointerCapture(capturedPointerId);
        }
        element?.removeEventListener('pointermove', pointerMoveHandler);
        element?.removeEventListener('pointerup', pointerReleaseXHandler);
        element?.removeEventListener('pointerup', pointerReleaseYHandler);
        element?.removeEventListener('pointerout', pointerReleaseXHandler);
        element?.removeEventListener('pointerout', pointerReleaseYHandler);
      };
    };
    const pointerMoveXHandler = createPointerMoveHandler('x');
    const pointerMoveYHandler = createPointerMoveHandler('y');
    const pointerReleaseXHandler = createReleasePointerHandler(
      scrollXElement,
      pointerMoveXHandler,
    );
    const pointerReleaseYHandler = createReleasePointerHandler(
      scrollYElement,
      pointerMoveYHandler,
    );
    const pointerDownXHandler = createPointerDownHandler(
      pointerMoveXHandler,
      pointerReleaseXHandler,
    );
    const pointerDownYHandler = createPointerDownHandler(
      pointerMoveYHandler,
      pointerReleaseYHandler,
    );
    scrollXElement?.addEventListener('pointerdown', pointerDownXHandler);
    scrollYElement?.addEventListener('pointerdown', pointerDownYHandler);
    return () => {
      scrollXElement?.removeEventListener('pointerdown', pointerDownXHandler);
      scrollYElement?.removeEventListener('pointerdown', pointerDownYHandler);
      pointerReleaseXHandler();
      pointerReleaseYHandler();
    };
  }, [setScrollSizes, setTransformation]);

  useEffect(() => {
    const context = canvasElementRef.current?.getContext('2d');
    let isRendering = true;
    if (context) {
      // context.textAlign = 'left';
      // context.textBaseline = 'top';
      const frame = () => {
        const {
          // gapSize,
          pixelSize,
          visiblePixelsOffsetX,
          visiblePixelsOffsetY,
          visiblePixelsAmountX,
          visiblePixelsAmountY,
          getXPosOffset,
          getYPosOffset,
        } = getComputedValues(canvasTransformationRef.current);

        context.fillStyle = '#000000';
        context.fillRect(
          0,
          0,
          canvasConfigRef.current.width,
          canvasConfigRef.current.height,
        );
        // context.font = `${pixelSize / 4}px Arial`;
        grid
          .slice(
            visiblePixelsOffsetY,
            visiblePixelsOffsetY + visiblePixelsAmountY,
          )
          .forEach((row) => {
            row
              .slice(
                visiblePixelsOffsetX,
                visiblePixelsOffsetX + visiblePixelsAmountX,
              )
              .forEach((cell) => {
                context.fillStyle = cell.color;
                context.fillRect(
                  getXPosOffset(cell.colInd),
                  getYPosOffset(cell.rowInd),
                  pixelSize,
                  pixelSize,
                );
                // context.strokeStyle = cell.color;
                // context.strokeRect(
                //   getXPosOffset(cell.colInd) - gapSize / 2,
                //   getYPosOffset(cell.rowInd) - gapSize / 2,
                //   pixelSize + gapSize,
                //   pixelSize + gapSize,
                // );
                // context.fillStyle = '#000000';
                // context.fillText(
                //   `${cell.colInd}`,
                //   getXPosOffset(cell.colInd),
                //   getYPosOffset(cell.rowInd),
                // );
                // context.fillText(
                //   `${cell.rowInd}`,
                //   getXPosOffset(cell.colInd),
                //   getYPosOffset(cell.rowInd) + pixelSize / 4,
                // );
              });
          });
        if (isRendering) {
          requestAnimationFrame(frame);
        }
      };
      requestAnimationFrame(frame);
    }
    return () => {
      isRendering = false;
    };
  }, [grid]);

  useEffect(() => {
    const wrapperElement = wrapperElementRef.current;
    const handler = (e: WheelEvent) => {
      e.preventDefault();
      const transformation = canvasTransformationRef.current;
      const scale = transformation.scale * 2 ** -Math.sign(e.deltaY);
      setTransformation({
        scale,
        translateX:
          transformation.translateX +
          e.offsetX / scale -
          e.offsetX / transformation.scale,
        translateY:
          transformation.translateY +
          e.offsetY / scale -
          e.offsetY / transformation.scale,
      });
    };
    wrapperElement?.addEventListener('wheel', handler, { passive: false });
    return () => {
      wrapperElement?.removeEventListener('wheel', handler);
    };
  }, [setTransformation]);

  useEffect(() => {
    const canvasElement = canvasElementRef.current;
    let capturedPointerId: number | null = null;
    let pointerMovedSinceLastPointerDown = false;
    const pointerDownHandler = (e: PointerEvent) => {
      canvasElement?.setPointerCapture((capturedPointerId = e.pointerId));
      canvasElement?.addEventListener('pointermove', pointerMoveHandler);
      canvasElement?.addEventListener('pointerup', releasePointer);
      canvasElement?.addEventListener('pointerout', releasePointer);
      pointerMovedSinceLastPointerDown = false;
    };
    const releasePointer = (e?: PointerEvent) => {
      if (capturedPointerId !== null) {
        canvasElement?.releasePointerCapture(capturedPointerId);
      }
      canvasElement?.removeEventListener('pointermove', pointerMoveHandler);
      canvasElement?.removeEventListener('pointerup', releasePointer);
      canvasElement?.removeEventListener('pointerout', releasePointer);
      if (e && !pointerMovedSinceLastPointerDown) {
        const { pixelSize, getXPosOffset, getYPosOffset, getPixelPosAt } =
          getComputedValues(canvasTransformationRef.current);
        const { x, y } = getPixelPosAt(e.offsetX, e.offsetY);
        const pixel = grid[y]?.[x];
        if (pixel) {
          onPixelSelect({
            ...pixel,
            offsetX: minmax(0, getXPosOffset(x), canvasConfigRef.current.width),
            offsetY: Math.min(
              getYPosOffset(y) + pixelSize,
              canvasConfigRef.current.height,
            ),
          });
        }
      }
    };
    const pointerMoveHandler = (e: PointerEvent) => {
      if (e.movementX !== 0 || e.movementY !== 0) {
        pointerMovedSinceLastPointerDown = true;
        const transformation = canvasTransformationRef.current;
        setTransformation({
          ...transformation,
          translateX:
            transformation.translateX + e.movementX / transformation.scale,
          translateY:
            transformation.translateY + e.movementY / transformation.scale,
        });
      }
    };
    canvasElement?.addEventListener('pointerdown', pointerDownHandler);
    return () => {
      canvasElement?.removeEventListener('pointerdown', pointerDownHandler);
      releasePointer();
    };
  }, [grid, onPixelSelect, setTransformation]);

  return (
    <StyledPixelGrid ref={wrapperElementRef}>
      <Canvas
        ref={canvasElementRef}
        width={canvasConfigRef.current.width}
        height={canvasConfigRef.current.height}
      />
      <ScrollBar ref={scrollXRef} />
      <ScrollBar ref={scrollYRef} vertical={true} />
    </StyledPixelGrid>
  );
};

export default PixelGrid;
