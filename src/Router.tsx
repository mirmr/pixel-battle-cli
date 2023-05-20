import { ReactElement } from 'react';
import { useRouterContext } from './RouterProvider';

type Route = {
  path: string;
  getNode: (path: string) => ReactElement | null;
  children?: Route[] | undefined;
};

const Router = ({ routes }: { routes: Route[] }): ReactElement | null => {
  const { route: currentRoute } = useRouterContext();

  const pathArr = currentRoute.split('/');
  let lastPath = '';
  let route: Route | undefined;

  for (let i = 0; i < pathArr.length; i++) {
    lastPath = pathArr[i] as string;
    route = (route?.children || routes).find(
      (route) => route.path === lastPath || route.path === '*',
    );
    if (!route) {
      return null;
    }
  }

  return route?.getNode(lastPath) || null;
};

export default Router;
