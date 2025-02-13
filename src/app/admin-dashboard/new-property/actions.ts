"use server";

import { auth, firestore } from "@/lib/firebase/firebaseAdminApp";
import { propertyDataSchema } from "@/validation/propertySchema";

// export const saveNewProperty = async (data: {
export const createProperty = async (
  data: {
    status: "for-sale" | "draft" | "withdrawn" | "sold";
    address1: string;
    address2?: string;
    city: string;
    postcode: string;
    price: number;
    bedrooms: number;
    bathrooms: number;
    description: string;
    // token: string;
  },
  authToken: string
) => {
  // const { ...propertyData } = data; // Destructure token from data

  const verifiedToken = await auth.verifyIdToken(authToken);

  if (!verifiedToken.admin) {
    return {
      error: true,
      message: "You are not authorized to perform this action",
    };
  }

  const validation = propertyDataSchema.safeParse(data);
  if (!validation.success) {
    return {
      error: true,
      message: validation.error.issues[0]?.message ?? "An error occurred",
    };
  }

  // Save property to database
  const property = await firestore.collection("properties").add({
    ...data,
    created: new Date(),
    updated: new Date(),
  });

  return {
    propertyId: property.id,
  };
};

