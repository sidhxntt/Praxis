"use client";
import React, { useState } from "react";
import useDialogState from "@/Hooks/use-dialog-state";

const UsersContext = React.createContext(null);

export default function UsersProvider({ children }) {
  const [open, setOpen] = useDialogState(null);
  const [currentRow, setCurrentRow] = useState(null);

  return (
    <UsersContext.Provider value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </UsersContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useUsers = () => {
  const usersContext = React.useContext(UsersContext);

  if (!usersContext) {
    throw new Error("useUsers has to be used within <UsersContext.Provider>");
  }

  return usersContext;
};
