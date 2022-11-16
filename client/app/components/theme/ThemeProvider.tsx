import type { FunctionComponent, PropsWithChildren } from "react";
import ThemeClientContextProvider from "./ThemeClientContextProvider";
import ThemeServerContextProvider, {
  useServerTheme,
} from "./ThemeServerContextProvider";

const ThemeProviderWrapper: FunctionComponent<PropsWithChildren<{}>> = ({
  children,
}) => {
  const theme = useServerTheme();
  return (
    <ThemeClientContextProvider defaultTheme={theme}>
      {children}
    </ThemeClientContextProvider>
  );
};

const ThemeProvider: FunctionComponent<PropsWithChildren<{}>> = ({ children }) => {
  return (
    <ThemeServerContextProvider>
      <ThemeProviderWrapper>{children}</ThemeProviderWrapper>
    </ThemeServerContextProvider>
  );
};

export default ThemeProvider;
