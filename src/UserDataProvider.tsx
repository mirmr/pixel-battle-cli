import {
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { UserData } from './types';

const getStorageUserData = () => {
  const userData = localStorage.getItem('userData');
  if (!userData) {
    return null;
  }
  try {
    return JSON.parse(userData) as UserData;
  } catch {
    return null;
  }
};

const setStorageUserData = (userData: UserData | null) => {
  if (userData) {
    localStorage.setItem('userData', JSON.stringify(userData));
  } else {
    localStorage.removeItem('userData');
  }
};

const UserDataContext = createContext(
  null as unknown as {
    userData: UserData | null;
    setUserData: Dispatch<SetStateAction<UserData | null>>;
  },
);

export const UserDataProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [userData, setUserData] = useState<UserData | null>(getStorageUserData);

  useEffect(() => {
    setStorageUserData(userData);
  }, [userData]);

  return (
    <UserDataContext.Provider value={{ userData, setUserData }}>
      {children}
    </UserDataContext.Provider>
  );
};

export const useUserDataContext = () => {
  return useContext(UserDataContext);
};
