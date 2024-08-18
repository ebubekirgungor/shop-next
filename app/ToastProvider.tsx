"use client";
import { ToastContainer } from "react-toastify";

export default function ToastProvider({
  className,
  children,
}: {
  className: string;
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <ToastContainer
        position="bottom-right"
        draggable
        pauseOnHover
        toastClassName={className}
      />
    </>
  );
}
