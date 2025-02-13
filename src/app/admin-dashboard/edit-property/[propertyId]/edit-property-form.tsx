"use client";

import PropertyForm from "@/components/property-form";
import { useAuth } from "@/hooks/useAuth";
import { Property } from "@/types/property";
import { propertySchema } from "@/validation/propertySchema";
import { SaveIcon } from "lucide-react";
import { z } from "zod";
import { updateProperty } from "./actions";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import {
  deleteObject,
  ref,
  uploadBytesResumable,
  UploadTask,
} from "firebase/storage";
import { storage } from "@/lib/firebase/firebaseClientApp";
import { savePropertyImages } from "../../actions";

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
  images = [],
}: Props) {
  const router = useRouter();
  const auth = useAuth();
  const { toast } = useToast();
  const handleSubmit = async (data: z.infer<typeof propertySchema>) => {
    const token = await auth?.currentUser?.getIdToken();

    if (!token) {
      return;
    }

    // de structure images from data
    const { images: newImages, ...rest } = data;
    const response = await updateProperty({ ...rest, id }, token);

    if (!!response?.error) {
      toast({
        title: "Error",
        description: response.message,
        variant: "destructive",
      });
      return;
    }

    // 2. update images to storage
    const storageTasks: (UploadTask | Promise<void>)[] = [];
    const imagesToDelete = images.filter(
      (image) => !newImages.find((newImage) => image === newImage.url)
    );

    imagesToDelete.forEach((image) => {
      storageTasks.push(deleteObject(ref(storage, image)));
    });

    const paths: string[] = [];
    newImages.forEach((image, index) => {
      if (image.file) {
        const path = `properties/${id}/${Date.now()}-${index}-${
          image.file.name
        }`;
        paths.push(path);
        const storageRef = ref(storage, path);
        storageTasks.push(uploadBytesResumable(storageRef, image.file));
      } else {
        paths.push(image.url);
      }
    });

    await Promise.all(storageTasks);
    await savePropertyImages(
      {
        propertyId: id,
        images: paths,
      },
      token
    );

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
          // add
          images: images.map((image) => ({
            id: image,
            url: image,
          })),
        }}
      />
    </div>
  );
}
