"use client"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { User, editFormSchema, formSchema } from "@/SampleData/AdminDashboard/Users/schema"; 
import { PasswordInput } from "@/components/AdminDashboard/AdminDashboardComponents/PasswordInput";
import { SelectDropdown } from "@/components/AdminDashboard/AdminDashboardComponents/SelectDropdown";
import { useEffect, useState } from "react";
import { onUserSubmit } from "@/lib/onSubmit";
import { userTypes } from "@/SampleData/AdminDashboard/Users/data";

interface Props {
  currentRow?: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UsersActionDialog({ currentRow, open, onOpenChange }: Props) {
  // Store userId separately to ensure it's available during submission
  const [userId, setUserId] = useState<string | undefined>(undefined);
  const [isEditMode, setIsEditMode] = useState(false);

  // Update state when currentRow changes
  useEffect(() => {
    const newIsEditMode = !!currentRow;
    setIsEditMode(newIsEditMode);

    // Store the user ID if it exists
    if (currentRow?.id) {
      setUserId(currentRow.id.toString());
    } else {
      setUserId(undefined);
    }

    // Reset form with appropriate values
    form.reset({
      firstName: currentRow?.firstName || "",
      lastName: currentRow?.lastName || "",
      username: currentRow?.username || "",
      email: currentRow?.email || "",
      role: currentRow?.role || "",
      phoneNumber: currentRow?.phoneNumber || "",
      password: "",
      confirmPassword: "",
    });

    form.clearErrors();
  }, [currentRow]);

  // Set up the form using the appropriate schema
  const form = useForm({
    resolver: zodResolver(isEditMode ? editFormSchema : formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      role: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
    },
  });

  const isPasswordTouched = !!form.formState.dirtyFields.password;

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        if (!state) {
          form.reset();
        }
        onOpenChange(state);
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="text-left">
          <DialogTitle>{isEditMode ? "Edit User" : "Add New User"}</DialogTitle>
          <DialogDescription>
            {isEditMode ? "Update the user here. " : "Create new user here. "}
            Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="-mr-4 h-[26.25rem] w-full py-1 pr-4">
          <Form {...form}>
            <form
              id="user-form"
              onSubmit={form.handleSubmit((values) => {
                onUserSubmit(values, userId, form, onOpenChange);
              })}
              className="space-y-4 p-0.5"
            >
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-6 items-center gap-x-4 gap-y-1 space-y-0">
                    <FormLabel className="col-span-2 text-right">
                      First Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="John"
                        className="col-span-4"
                        autoComplete="off"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="col-span-4 col-start-3" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-6 items-center gap-x-4 gap-y-1 space-y-0">
                    <FormLabel className="col-span-2 text-right">
                      Last Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Doe"
                        className="col-span-4"
                        autoComplete="off"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="col-span-4 col-start-3" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-6 items-center gap-x-4 gap-y-1 space-y-0">
                    <FormLabel className="col-span-2 text-right">
                      Username
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="john_doe"
                        className="col-span-4"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="col-span-4 col-start-3" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-6 items-center gap-x-4 gap-y-1 space-y-0">
                    <FormLabel className="col-span-2 text-right">
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="john.doe@gmail.com"
                        className="col-span-4"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="col-span-4 col-start-3" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-6 items-center gap-x-4 gap-y-1 space-y-0">
                    <FormLabel className="col-span-2 text-right">
                      Phone Number
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="+123456789"
                        className="col-span-4"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="col-span-4 col-start-3" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-6 items-center gap-x-4 gap-y-1 space-y-0">
                    <FormLabel className="col-span-2 text-right">
                      Role
                    </FormLabel>
                    <SelectDropdown
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                      placeholder="Select a role"
                      className="col-span-4"
                      items={userTypes.map(({ label, value }) => ({
                        label,
                        value,
                      }))}
                    />
                    <FormMessage className="col-span-4 col-start-3" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-6 items-center gap-x-4 gap-y-1 space-y-0">
                    <FormLabel className="col-span-2 text-right">
                      {isEditMode ? "New Password" : "Password"}
                    </FormLabel>
                    <FormControl>
                      <PasswordInput
                        placeholder={
                          isEditMode
                            ? "Leave blank to keep current"
                            : "e.g., S3cur3P@ssw0rd"
                        }
                        className="col-span-4"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="col-span-4 col-start-3" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-6 items-center gap-x-4 gap-y-1 space-y-0">
                    <FormLabel className="col-span-2 text-right">
                      Confirm Password
                    </FormLabel>
                    <FormControl>
                      <PasswordInput
                        disabled={!isPasswordTouched}
                        placeholder={
                          isEditMode
                            ? "Leave blank to keep current"
                            : "e.g., S3cur3P@ssw0rd"
                        }
                        className="col-span-4"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="col-span-4 col-start-3" />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </ScrollArea>
        <DialogFooter>
          <Button type="submit" form="user-form">
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
