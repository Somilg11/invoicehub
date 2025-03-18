"use client";

import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";

interface SubmitButtonProps {
  children: React.ReactNode;
  className?: string;
  pendingText?: string;
  formAction?: (formData: FormData) => Promise<any>;
}

export function SubmitButton({
  children,
  className,
  pendingText = "Submitting...",
  formAction,
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button
      className={className}
      type="submit"
      disabled={pending}
      formAction={formAction}
    >
      {pending ? pendingText : children}
    </Button>
  );
}
