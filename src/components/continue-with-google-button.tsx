"use client";

import { useAuth } from "@/hooks/useAuth";
import { Button } from "./ui/button";

export default function ContinueWithGoogleButton() {
  const auth = useAuth();
  return (
    <Button
      onClick={() => {
        auth?.loginWithGoogle();
      }}
      className="w-full"
    >
      Continue with Google
    </Button>
  );
}
