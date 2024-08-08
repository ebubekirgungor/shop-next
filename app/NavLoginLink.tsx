"use client";

import NavButton from "@/components/NavButton";
import { hasCookie } from "cookies-next";
import { useEffect, useState } from "react";

export default function NavLoginLink() {
  const [hasRole, setHasRole] = useState<boolean>();

  useEffect(() => {
    setHasRole(hasCookie("role"));
  }, []);

  return (
    <>
      {hasRole ? (
        <NavButton icon="account" href={"/account/personal-details"}>
          Account
        </NavButton>
      ) : (
        <NavButton icon="account" href={"/login"}>
          Login
        </NavButton>
      )}
    </>
  );
}
