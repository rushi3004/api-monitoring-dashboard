import React, { createContext, useState } from "react";

const DataContext = createContext({
  accounts: [],
  setAccounts: () => {},
});

const DataProvider = ({ children }) => {
  const [accounts, setAccounts] = useState([{ username: "", password: "" }]);

  return (
    <DataContext.Provider value={{ accounts, setAccounts }}>
      {children}
    </DataContext.Provider>
  );
};

export { DataContext, DataProvider };
