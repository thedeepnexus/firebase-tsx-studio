"use client";

import PropertyForm from "@/components/property-form";
import { useAuth } from "@/hooks/useAuth";
import { propertyDataSchema } from "@/validation/propertySchema";
import { PlusCircleIcon } from "lucide-react";
import { z } from "zod";
import { createProperty } from "./actions";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { ref, uploadBytesResumable, UploadTask } from "firebase/storage";
import { storage } from "@/lib/firebase/firebaseClientApp";
import { savePropertyImages } from "../actions";

export default function NewPropertyForm() {
  const auth = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (data: z.infer<typeof propertyDataSchema>) => {
    const token = await auth?.currentUser?.getIdToken();

    if (!token) {
      return;
    }

    // data = { ...firestore data, storage images }
    const { images, ...rest } = data;
    // 1. add rest to firestore
    const response = await createProperty(rest, token);

    if (!!response.error || !response.propertyId) {
      toast({
        title: "Error",
        description: response.message,
        variant: "destructive",
      });
      return;
    }

    // 2. add images to storage
    // actions return propertyId: property.id,
    const uploadTasks: UploadTask[] = [];
    const paths: string[] = [];

    images.forEach((image, index) => {
      if (image.file) {
        const path = `properties/${
          response.propertyId
        }/${Date.now()}-${index}-${image.file.name}`;
        paths.push(path);
        const storageRef = ref(storage, path);
        uploadTasks.push(uploadBytesResumable(storageRef, image.file));
      }
    });

    await Promise.all(uploadTasks);
    await savePropertyImages(
      {
        propertyId: response.propertyId,
        images: paths,
      },
      token
    );


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
