/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Friday, April 28th 2023, 5:13:16 pm
 * Author: Nagendra S @ valmi.io
 */

import React, {
  FC,
  useState,
  createContext,
  useEffect,
  PropsWithChildren
} from 'react';

import { ThemeProvider } from '@mui/material';
import { StylesProvider } from '@mui/styles';

import { themeCreator } from '@theme/base';

export const ThemeContext = createContext((_themeName: string): void => {});

interface Props {
  children: any;
}

const ThemeProviderWrapper: FC<PropsWithChildren<Props>> = ({ children }) => {
  const [themeName, _setThemeName] = useState('AppFlowyTheme');

  useEffect(() => {
    const curThemeName =
      window.localStorage.getItem('valmiTheme') || 'AppFlowyTheme';
    _setThemeName(curThemeName);
  }, []);

  const theme = themeCreator(themeName);
  const setThemeName = (themeName: string): void => {
    window.localStorage.setItem('valmiTheme', themeName);
    _setThemeName(themeName);
  };

  return (
    <StylesProvider injectFirst>
      <ThemeContext.Provider value={setThemeName}>
        <ThemeProvider theme={theme}>{children}</ThemeProvider>
      </ThemeContext.Provider>
    </StylesProvider>
  );
};

export default ThemeProviderWrapper;
