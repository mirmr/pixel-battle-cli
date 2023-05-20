import {
  FC,
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

const removeLeadingFragmentAndSlash = (url: string) => {
  return url.replace(/^#?\/?/g, '');
};

const RouterContext = createContext(
  null as unknown as { route: string; setRoute: (path: string) => void },
);

export const RouterProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [path, setPath] = useState(() =>
    removeLeadingFragmentAndSlash(location.hash),
  );

  const setRoute = (route: string) => {
    location.hash = '/' + route;
  };

  useEffect(() => {
    const handler = (e: HashChangeEvent) => {
      setPath(
        removeLeadingFragmentAndSlash(e.newURL.slice(e.newURL.indexOf('#'))),
      );
    };
    window.addEventListener('hashchange', handler);
    return () => {
      window.removeEventListener('hashchange', handler);
    };
  }, []);

  useEffect(() => {
    setPath(removeLeadingFragmentAndSlash(location.hash));
  }, []);

  return (
    <RouterContext.Provider value={{ route: path, setRoute }}>
      {children}
    </RouterContext.Provider>
  );
};

export const useRouterContext = () => {
  return useContext(RouterContext);
};
