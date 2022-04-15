import * as React from "react";

const defaultValue = {
  hex: "#000000",
};

// interface Context {
// palette: Palette
// }

const useAppContext = () => {
  const [hex, setContextHex] = React.useState("#000000");

  const setHex = React.useCallback((value) => {
    setContextHex(value);
  }, []);

  return {
    hex,
    setHex,
  };
};

export const AppContext = React.createContext({});

export const AppContextProvider = (props) => {
  const { value = defaultValue, children } = props;

  return (
    <AppContext.Provider value={value} {...props}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
