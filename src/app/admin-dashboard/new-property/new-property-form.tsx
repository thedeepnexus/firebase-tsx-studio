"use client";

import PropertyForm from "@/components/property-form";
import { useAuth } from "@/hooks/useAuth";
import { propertyDataSchema } from "@/validation/propertySchema";
import { PlusCircleIcon } from "lucide-react";
import { z } from "zod";
import { createProperty } from "./actions";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export default function NewPropertyForm() {
  const auth = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (data: z.infer<typeof propertyDataSchema>) => {
    const token = await auth?.currentUser?.getIdToken();

    if (!token) {
      return;
    }

    const response = await createProperty(data, token);

    if (!!response.error) {
      toast({
        title: "Error",
        description: response.message,
        variant: "destructive",
      });
      return;
    }

    router.push("/admin-dashboard");

    toast({
      title: "Success",
      description: "Your property has been created successfully",
    });

    // console.log({ response });
  };
  return (
    <div>
      <PropertyForm
        handleSubmit={handleSubmit}
        submitButtonLabel={
          <>
            <PlusCircleIcon /> Create Property
          </>
        }
      />
    </div>
  );
}
