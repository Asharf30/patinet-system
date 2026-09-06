import React from "react";
import Image from "next/image";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ComponentProps<typeof Button> {
  isLoading: boolean;
  className?: string;
  children: React.ReactNode;
  loadingText?: React.ReactNode;
  loadingIcon?: React.ReactNode;
}

const SubmitButton = ({
  isLoading,
  className,
  children,
  loadingText = "Loading...",
  loadingIcon,
  type = "submit",
  disabled,
  ...props
}: ButtonProps) => {
  return (
    <Button
      type={type}
      disabled={disabled || isLoading}
      className={cn(
        "h-11 rounded-md bg-green-500 hover:bg-green-400 text-white font-medium text-base cursor-pointer transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-lime-500 active:translate-y-0 active:scale-[0.99] w-full",
        className,
      )}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center justify-center gap-3">
          {loadingIcon ?? (
            <Image
              src="/assets/icons/loader.svg"
              alt="loader"
              width={24}
              height={24}
              className="animate-spin"
            />
          )}
          <span>{loadingText}</span>
        </div>
      ) : (
        children
      )}
    </Button>
  );
};

export default SubmitButton;
