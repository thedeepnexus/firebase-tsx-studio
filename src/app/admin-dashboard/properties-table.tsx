import { getProperties } from "@/data/properties";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { EyeIcon, PencilIcon } from "lucide-react";
import numeral from "numeral";
import PropertyStatusBadge from "@/components/property-status-badge";

export default async function PropertiesTable({ page = 1 }: { page?: number }) {
  //   const { data } = await getProperties()
  const { data, totalPages } = await getProperties({
    pagination: {
      pageSize: 2,
    }, // 페이지 크기를 3으로 설정 또는 조정 가능
  });
  // console.log({ data, totalPages });

  return (
    <>
      {!data && (
        <h1 className="py-20 text-center text-3xl font-bold text-zinc-400">
          You have no properties
        </h1>
      )}
      {!!data && (
        <Table className="mt-5">
          <TableHeader>
            <TableRow>
              <TableHead>Address</TableHead>
              <TableHead>Listing Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((property) => {
              const address = [
                property.address1,
                property.address2,
                property.city,
                property.postcode,
              ]
                .filter((addressLine) => !!addressLine)
                .join(", ");
              return (
                <TableRow key={property.id}>
                  <TableCell>{address}</TableCell>
                  <TableCell>
                    {/* ${property.price} */}$
                    {numeral(property.price).format("0,0")}
                  </TableCell>
                  {/* edit */}
                  <TableCell>
                    {/* {property.status} */}
                    <PropertyStatusBadge status={property.status} />
                  </TableCell>
                  <TableCell>
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/property/${property.id}`}>
                        <EyeIcon />
                      </Link>
                    </Button>{" "}
                    /{" "}
                    <Button asChild variant="outline" size="sm">
                      <Link
                        href={`/admin-dashboard/edit-property/${property.id}`}
                      >
                        <PencilIcon />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <Button
                    // edit
                    disabled={page === i + 1}
                    key={i}
                    // edit
                    asChild={page !== i + 1}
                    variant="outline"
                    className="mx-1"
                  >
                    <Link href={`/admin-dashboard?page=${i + 1}`}>{i + 1}</Link>
                  </Button>
                ))}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      )}
    </>
  );
}
