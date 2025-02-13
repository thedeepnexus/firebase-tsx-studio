"use client";

import { useAuth } from "@/hooks/useAuth";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

export default function ContinueWithGoogleButton() {
  const auth = useAuth();
  const router = useRouter(); 
  return (
    <Button
      onClick={async () => {
        await auth?.loginWithGoogle();
        router.refresh();
      }}
      className="w-full"
    >
      Continue with Google
    </Button>
  );
}
