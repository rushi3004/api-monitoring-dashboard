import React, { createContext, useState, ReactNode, Dispatch, SetStateAction } from "react";

interface Account {
    username: string;
    password: string;
}

interface DataContextValue {
    accounts: Account[];
    setAccounts: Dispatch<SetStateAction<Account[]>>;
}

// export const DataContext = createContext<DataContextValue>({ accounts: [], setAccounts: () => {} });
export const DataContext = createContext<DataContextValue>({ accounts: [], setAccounts: () => {} });

interface DataProviderProps {
    children: ReactNode;
}

const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
    const [accounts, setAccounts] = useState<Account[]>([{ username: '', password: '' }]);

    return (
        <DataContext.Provider value={{
            accounts,
            setAccounts
        }}>
            {children}
        </DataContext.Provider>
    );
};


export default DataProvider;
