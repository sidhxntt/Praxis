
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Label } from "./label";
import { Input } from "./Signup";
import isEmail from "validator/lib/isEmail";
import { cn } from "@/lib/utils";
import { Github, Twitter } from "lucide-react";
import validatePassword from "@/lib/validatePassword";

interface SignupFormInputs {
  username: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

export function SignupFormDemo() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    watch,
  } = useForm<SignupFormInputs>({
    mode: "onChange",
  });

  const onSubmit: SubmitHandler<SignupFormInputs> = async (data) => {
    await new Promise((resolve) => {
      setTimeout(() => {
        console.log("Submitted:", data);
        resolve(data);
      }, 5000);
    });
  };

  const handleOAuthSignIn = async (text: string) => {
    console.log(text)
  };

  return (
    <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-[#f8f9fa] dark:bg-[#15202b]">
      <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
        Welcome to Coderush
      </h2>
      <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
        Login to coderush if you can because we don&apos;t have a login flow yet
      </p>

      <form className="my-8" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
          <LabelInputContainer>
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
          </LabelInputContainer>
        </div>

        <LabelInputContainer className="mb-4">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            placeholder="projectmayhem@fc.com"
            type="email"
            {...register("email", {
              required: "*Email is required",
              validate: (value) =>
                isEmail(value) || "*Please enter a valid email.",
            })}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </LabelInputContainer>

        <LabelInputContainer className="mb-4">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            placeholder="••••••••"
            type="password"
            {...register("password", {
              required: "*Password is required",
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
        </LabelInputContainer>

        <LabelInputContainer className="mb-8">
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
            button={true}
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </LabelInputContainer>

        <button
          type="submit"
          disabled={isSubmitting || isSubmitSuccessful}
          className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg
                className="w-5 h-5 mr-3 -ml-1 text-white animate-spin"
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
          ) : isSubmitSuccessful ? (
            <span className="flex items-center justify-center">
              Signed up (refresh to redo)
            </span>
          ) : (
            <span>Sign up &rarr;</span>
          )}
        </button>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 text-neutral-600 dark:text-neutral-400 bg-[#f8f9fa] dark:bg-[#15202b]">
                Or continue with
              </span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => handleOAuthSignIn('github')}
              className="flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <Github className="h-5 w-5 mr-2" />
              GitHub
            </button>

            <button
              type="button"
              onClick={() => handleOAuthSignIn('twitter')}
              className="flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <Twitter className="h-5 w-5 mr-2" />
              Twitter
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};

export default SignupFormDemo;