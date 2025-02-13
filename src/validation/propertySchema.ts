import { z } from "zod";

export const propertyDataSchema = z.object({
  status: z.enum(["draft", "for-sale", "withdrawn", "sold"]),
  address1: z.string().min(1, "Address line 1 must contain a value"),
  address2: z.string().optional(),
  city: z.string().min(3, "City must contain at least 3 characters"),
  postcode: z.string().refine((postcode) => {
    // const postcodeRegex = /^[A-Z]{1,2}[0-9]{1,2}[A-Z]?\s?[0-9][A-Z]{2}$/i; //UK postcode regex
    // const postcodeRegex = /^\d{3}[\-]\d{3}$/; // KR postcode regex
    const postcodeRegex = /^\d{5}$/; // new KR postcode regex
    return postcodeRegex.test(postcode);
  }, "Invalid UK postcode"),
  price: z.coerce.number().positive("Price must be greater than zero"),
  bedrooms: z.coerce.number().min(0, "Bedrooms must be at least 0"),
  bathrooms: z.coerce.number().min(0, "Bathrooms must be at least 0"),
  description: z
    .string()
    .min(40, "Description must contain at least 40 characters"),
});

export const propertyImagesSchema = z.object({
  images: z.array(
    z.object({
      id: z.string(),
      url: z.string(),
      file: z.instanceof(File).optional(),
    })
  ),
});

export const propertySchema = propertyDataSchema.and(propertyImagesSchema);
