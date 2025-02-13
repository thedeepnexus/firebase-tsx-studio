"use client";

import PropertyForm from "@/components/property-form";
import { useAuth } from "@/hooks/useAuth";
import { Property } from "@/types/property";
import { propertyDataSchema } from "@/validation/propertySchema";
import { SaveIcon } from "lucide-react";
import { z } from "zod";
import { updateProperty } from "./actions";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { auth} from "@/lib/firebase/firebaseClientApp"; // Import auth from firebaseClientApp

type Props = Property;

export default function EditPropertyForm({
  id,
  address1,
  address2,
  city,
  postcode,
  price,
  bedrooms,
  bathrooms,
  description,
  status,
}: Props) {
  const router = useRouter();
  const auth = useAuth();
  const { toast } = useToast();
  const handleSubmit = async (data: z.infer<typeof propertyDataSchema>) => {
    const token = await auth?.currentUser?.getIdToken();

    if (!token) {
      return;
    }

    await updateProperty({ ...data, id }, token);
    toast({
        title: "Property Updated",
        description: "The property has been updated successfully",
        value: "success",
    });  
    router.push("/admin-dashboard");
  };

  return (
    <div>
      <PropertyForm
        handleSubmit={handleSubmit}
        submitButtonLabel={
          <>
            <SaveIcon /> Update Property
          </>
        }
        defaultValues={{
          status,
          address1,
          address2,
          city,
          postcode,
          price,
          bedrooms,
          bathrooms,
          description,
        }}
      />
    </div>
  );
}
