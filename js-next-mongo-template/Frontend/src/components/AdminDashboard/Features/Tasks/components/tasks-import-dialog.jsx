"use client"
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = {
  file: (value) => {
    if (!(value instanceof FileList)) {
      return "Invalid file input";
    }
    if (value.length === 0) {
      return "Please upload a file";
    }
    if (value[0]?.type !== "text/csv") {
      return "Please upload CSV format.";
    }
    return true;
  }
};

export function TasksImportDialog({ open, onOpenChange }) {
  const form = useForm({
    resolver: (values) => {
      const errors = {};
      
      Object.keys(formSchema).forEach(key => {
        const result = formSchema[key](values[key]);
        if (result !== true) {
          errors[key] = { message: result };
        }
      });
      
      return {
        values,
        errors
      };
    },
    defaultValues: { file: undefined },
  });
  
  const [fileName, setFileName] = useState(null);
  
  const handleFileChange = (event) => {
    const files = event.target.files;
    if (files) {
      form.setValue("file", files);
      setFileName(files[0]?.name || null);
    }
  };
  
  const onSubmit = (data) => {
    if (data.file && data.file[0]) {
      const fileDetails = {
        name: data.file[0].name,
        size: data.file[0].size,
        type: data.file[0].type,
      };
      toast({
        title: "You have imported the following file:",
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">
              {JSON.stringify(fileDetails, null, 2)}
            </code>
          </pre>
        ),
      });
    }
    onOpenChange(false);
  };
  
  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        onOpenChange(val);
        form.reset();
        setFileName(null);
      }}
    >
      <DialogContent className="gap-2 sm:max-w-sm">
        <DialogHeader className="text-left">
          <DialogTitle>Import Tasks</DialogTitle>
          <DialogDescription>
            Import tasks quickly from a CSV file.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form id="task-import-form" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="file"
              render={({ field }) => (
                <FormItem className="mb-2 space-y-1">
                  <FormLabel>File</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept=".csv"
                      onChange={handleFileChange}
                      className="h-8"
                    />
                  </FormControl>
                  {fileName && (
                    <p className="text-sm text-gray-500">Selected: {fileName}</p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter className="gap-2 sm:gap-0">
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
          <Button type="submit" form="task-import-form">
            Import
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}