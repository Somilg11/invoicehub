"use client";

export interface Message {
  error?: boolean;
  success?: boolean;
  message?: string;
}

export function FormMessage({ message }: { message: Message }) {
  if (!message || (!message.error && !message.success)) {
    return null;
  }

  const isError = message.error;
  const isSuccess = message.success;

  if (!message.message) {
    return null;
  }

  return (
    <div
      className={`p-3 rounded-md text-sm ${isError ? "bg-destructive/10 text-destructive" : ""} ${isSuccess ? "bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400" : ""}`}
    >
      {message.message}
    </div>
  );
}
