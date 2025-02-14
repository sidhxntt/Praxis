import { cn } from "@/lib/utils";

interface MaxWidthWrapperProps {
  className?: string;
  children: React.ReactNode;
}

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
