import React, { useState } from "react";
import useDialogState from "@/Hooks/use-dialog-state";

const TasksContext = React.createContext(null);

export default function TasksProvider({ children }) {
  const [open, setOpen] = useDialogState(null);
  const [currentRow, setCurrentRow] = useState(null);

  return (
    <TasksContext.Provider value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </TasksContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useTasks = () => {
  const tasksContext = React.useContext(TasksContext);

  if (!tasksContext) {
    throw new Error("useTasks has to be used within <TasksContext.Provider>");
  }

  return tasksContext;
};
