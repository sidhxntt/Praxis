"use client";
import { GalleryVerticalEnd } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import validatePassword from "@/lib/validatePassword";
import isEmail from "validator/lib/isEmail";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { onSignup } from "@/lib/onFormSubmit";
import { useRouter } from "next/navigation";

export function SignupForm({ className, ...props }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    watch,
  } = useForm({
    mode: "onChange",
  });
  const router = useRouter();
  const [serverError, setServerError] = useState(null);

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form
        onSubmit={handleSubmit((data) =>
          onSignup(data, setServerError, reset, router)
        )}
      >
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2">
            <a
              href="/"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-md">
                <GalleryVerticalEnd className="size-6" />
              </div>
              <span className="sr-only">Jolt.</span>
            </a>
            <h1 className="text-xl font-bold">Welcome to Jolt ⚡️</h1>
          </div>

          <div className="flex flex-col gap-6">
            {/* Username Input */}
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="Tyler"
                type="text"
                {...register("username", {
                  required: "*Username is required.",
                  minLength: { value: 5, message: "*Username too short." },
                  maxLength: { value: 15, message: "*Username too long." },
                })}
              />
              {errors.username && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.username.message}
                </p>
              )}
            </div>

            {/* Email Input */}
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                placeholder="projectmayhem@fc.com"
                type="email"
                {...register("email", {
                  required: "*Email is required.",
                  validate: (value) =>
                    isEmail(value) || "*Please enter a valid email.",
                })}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Input */}
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                placeholder="••••••••"
                type="password"
                {...register("password", {
                  required: "*Password is required.",
                  minLength: { value: 5, message: "*Password too short." },
                  maxLength: { value: 15, message: "*Password too long." },
                  validate: validatePassword,
                })}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password Input */}
            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                placeholder="••••••••"
                type="password"
                onCopy={(e) => e.preventDefault()}
                onPaste={(e) => e.preventDefault()}
                {...register("confirmPassword", {
                  required: "*Confirming the password is required.",
                  validate: (value) =>
                    value === watch("password") || "*Passwords do not match.",
                })}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button type="submit" disabled={isSubmitting} className="mt-4">
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="w-5 h-5 mr-3 -ml-1 text-white dark:text-black animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Signing up...
                </span>
              ) : serverError ? (
                <span className="text-red-500">{serverError}</span>
              ) : (
                <span>Signup &rarr;</span>
              )}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              By clicking continue, you agree to our{" "}
              <a href="#">Terms of Service</a> and{" "}
              <a href="#">Privacy Policy</a>.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
