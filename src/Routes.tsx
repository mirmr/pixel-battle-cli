import { FC } from 'react';
import { useRouterContext } from './RouterProvider';
import Router from './Router';
import styled from 'styled-components';
import CanvasPage from './CanvasPage';
import CanvasesPage from './CanvasesPage';

const RoutesContainer = styled.div({
  margin: '0px auto',
  width: '1280px',
});

const Routes: FC = () => {
  const { setRoute } = useRouterContext();

  return (
    <RoutesContainer>
      <Router
        routes={[
          {
            path: 'canvases',
            getNode: () => <CanvasesPage />,
            children: [
              {
                path: '*',
                getNode: (canvasId) => <CanvasPage canvasId={canvasId} />,
              },
            ],
          },
          {
            path: '*',
            getNode: () => {
              setRoute('canvases');
              return null;
            },
          },
        ]}
      />
    </RoutesContainer>
  );
};

export default Routes;
