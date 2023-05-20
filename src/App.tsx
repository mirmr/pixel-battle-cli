import { FC } from 'react';
import { ThemeProvider, createGlobalStyle } from 'styled-components';
import { RouterProvider } from './RouterProvider';
import Navbar from './Navbar';
import Routes from './Routes';
import { theme } from './theme';
import { UserDataProvider } from './UserDataProvider';

const ResetStyles = createGlobalStyle((props) => ({
  '*': {
    margin: '0px',
    padding: '0px',
    boxSizing: 'border-box',
    background: 'transparent',
    fontFamily: 'Arial',
  },

  body: {
    backgroundColor: props.theme.colors.background,
    color: props.theme.colors.text,
    fontSize: props.theme.fontSizes.normal,
  },

  'button, input, textarea': {
    border: '0px',
  },

  textarea: {
    resize: 'none',
  },

  a: {
    color: props.theme.colors.text,
    textDecoration: 'none',
  },
}));

const App: FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <ResetStyles />
      <UserDataProvider>
        <RouterProvider>
          <Navbar />
          <Routes />
        </RouterProvider>
      </UserDataProvider>
    </ThemeProvider>
  );
};

export default App;
