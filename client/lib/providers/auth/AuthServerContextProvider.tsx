import type { FunctionComponent, PropsWithChildren } from "react";
// @ts-ignore -- createServerContext is not in @types/react atm
import { useContext, createServerContext } from "react";
import { cookies } from "next/headers";
import { Theme, THEME_COOKIE_NAME } from "./theme";
import { DEFAULT_THEME } from "./theme";

const ThemeContext = createServerContext<Theme | null>(null);

export function useServerTheme(): Theme {
  return useContext(ThemeContext);
}

const ThemeServerContextProvider: FunctionComponent<PropsWithChildren> = ({
  children,
}) => {
  const cookiesList = cookies();
  const theme = cookiesList.get(THEME_COOKIE_NAME) ?? DEFAULT_THEME;

  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
};

export default ThemeServerContextProvider;
