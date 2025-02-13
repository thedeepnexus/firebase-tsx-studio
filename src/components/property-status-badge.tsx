import { PropertyStatus } from "@/types/propertyStatus";
import { Badge } from "./ui/badge";

const statusLabel = {
  "for-sale": "For Sale",
  draft: "Draft",
  withdrawn: "Withdrawn",
  sold: "Sold",
};

const variant: {
  [key: string]: "primary" | "secondary" | "destructive" | "success";
} = {
  "for-sale": "primary",
  draft: "secondary",
  withdrawn: "destructive",
  sold: "success",
};

export default function PropertyStatusBadge({
  status,
}: {
  status: PropertyStatus;
}) {
  const label = statusLabel[status];

  return <Badge variant={variant[status]}>{label}</Badge>;
}
