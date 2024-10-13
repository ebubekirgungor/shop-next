"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { LoginForm } from "@/components/auth";
import { Dialog } from "@/components/ui";

export default function LoginPage() {
  const router = useRouter();

  const [dialogStatus, setDialogStatus] = useState(true);

  function closeDialog() {
    setDialogStatus(false);
    setTimeout(() => router.back(), 300);
  }

  return (
    <Dialog
      title="Sign in to your account"
      close={closeDialog}
      status={dialogStatus}
    >
      <LoginForm />
    </Dialog>
  );
}
