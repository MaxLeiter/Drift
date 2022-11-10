"use client";

import clsx from "clsx";
import type {
  ChangeEventHandler,
  FunctionComponent,
  PropsWithChildren,
} from "react";
import Cookies from "js-cookie";
import React, { useContext, useState, createContext } from "react";
import { DEFAULT_THEME, Theme, THEME_COOKIE_NAME } from "./theme";

const ThemeContext = createContext<Theme | null>(null);

export function useTheme(): Theme {
  return useContext(ThemeContext);
}

interface Props extends PropsWithChildren {
  defaultTheme: Theme;
}

const ThemeClientContextProvider: FunctionComponent<Props> = ({
  defaultTheme,
  children,
}) => {
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const onChange: ChangeEventHandler<HTMLSelectElement> = (e) => {
    const value = e.target.value as Theme;
    setTheme(value);

    if (value === DEFAULT_THEME) {
      Cookies.remove(THEME_COOKIE_NAME);
    } else {
      Cookies.set(THEME_COOKIE_NAME, value);
    }
  };
  const onReset = () => {
    setTheme(DEFAULT_THEME);
    Cookies.remove(THEME_COOKIE_NAME);
  };

  return (
    <div className={clsx(theme === "dark" && "dark")}>
      <div className="mb-2">
        <h2 className="mb-2 font-bold text-xl">Theme Switcher</h2>
        <select value={theme} onChange={onChange} className="mr-2 inline-block">
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
        <button className="bg-gray-300 p-2" onClick={onReset}>
          Reset
        </button>
      </div>
      <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
    </div>
  );
};

export default ThemeClientContextProvider;
