import {
    SignInButton,
    SignedIn,
    SignedOut,
    UserButton,
  } from "@clerk/nextjs";
  import { cn } from "@/lib/utils";
  import { buttonVariants } from "../ui/button";
  import { ArrowRight } from "lucide-react";

  const DisplayPic = () => (
    <header className="text-white relative ">
      <SignedOut>
        <SignInButton>
          <div
            className={cn(
              buttonVariants({ size: "sm" }),
              "flex items-center justify-center group px-4 cursor-pointer"
            )}
          >
            <span>Sign In</span>
            <ArrowRight className="ml-1.5 transform h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </div>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <div className="scale-110">
             <UserButton/>
        </div>
     
      </SignedIn>
    </header>
  );

  export default DisplayPic