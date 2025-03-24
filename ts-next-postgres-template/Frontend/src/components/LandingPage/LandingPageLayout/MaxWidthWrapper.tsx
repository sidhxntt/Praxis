import { cn } from "@/lib/utils";
import { MaxWidthWrapperProps } from "@/lib/types";

const MaxWidthWrapper: React.FC<MaxWidthWrapperProps> = ({
  className = "",
  children,
}) => {
  return (
    <div className={cn("mx-auto w-full max-w-screen-xl px-10", className)}>
      {children}
    </div>
  );
};

export default MaxWidthWrapper;
