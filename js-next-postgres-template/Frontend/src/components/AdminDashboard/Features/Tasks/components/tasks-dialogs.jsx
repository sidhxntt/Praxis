"use client"
import { handleDeleteTask } from "@/lib/onDelete.js";
import { TasksImportDialog } from "./tasks-import-dialog";
import { TasksMutateDrawer } from "./tasks-mutate-drawer";
import { ConfirmDialog } from "@/components/AdminDashboard/AdminDashboardComponents/ConfirmDialog";
import { useTasks } from "@/Context/TasksContext";

export function TasksDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useTasks();

  // Use displayId if available, otherwise fall back to id
  const getDisplayId = (row) => {
    return row?.displayId || row?.id || 'N/A';
  };

  return (
    <>
      <TasksMutateDrawer
        key="task-create"
        open={open === "create"}
        onOpenChange={() => setOpen("create")}
      />

      <TasksImportDialog
        key="tasks-import"
        open={open === "import"}
        onOpenChange={() => setOpen("import")}
      />

      {currentRow && (
        <>
          <TasksMutateDrawer
            key={`task-update-${currentRow.id}`}
            open={open === "update"}
            onOpenChange={() => {
              setOpen("update");
              setTimeout(() => {
                setCurrentRow(null);
              }, 500);
            }}
            currentRow={currentRow}
          />

          <ConfirmDialog
            key="task-delete"
            destructive
            open={open === "delete"}
            onOpenChange={() => {
              setOpen("delete");
              setTimeout(() => {
                setCurrentRow(null);
              }, 500);
            }}
            handleConfirm={() => handleDeleteTask(currentRow, setOpen, setCurrentRow)}
            className="max-w-md"
            title={`Delete Task ${getDisplayId(currentRow)} ?`}
            desc={
              <>
                You are about to delete a task with the ID{" "}
                <strong>Task {getDisplayId(currentRow)}</strong>. <br />
                This action cannot be undone.
              </>
            }
            confirmText="Delete"
          />
        </>
      )}
    </>
  );
}