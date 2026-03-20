import { Suspense } from "react";
import { Metadata } from "next";
import { lusitana } from "@/app/ui/fonts";
import { fetchFilteredCustomers } from "@/app/lib/data";
import { CustomersTableSkeleton } from "@/app/ui/skeletons";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Customers",
};

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";

  const customers = await fetchFilteredCustomers(query);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Customers</h1>
      </div>

      <Suspense key={query} fallback={<CustomersTableSkeleton />}>
        <div className="mt-6 flow-root">
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <div className="overflow-hidden rounded-md bg-gray-50 p-2 md:pt-0">
                {/* Mobile View */}
                <div className="md:hidden">
                  {customers?.map((customer) => (
                    <div
                      key={customer.id}
                      className="mb-2 w-full rounded-md bg-white p-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-10 overflow-hidden rounded-full bg-gray-200">
                          {customer.image_url ? (
                            <Image
                              src={customer.image_url}
                              alt={`${customer.name}'s profile picture`}
                              className="object-cover"
                              fill
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-sm font-medium text-gray-600">
                              {customer.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{customer.name}</p>
                          <p className="text-sm text-gray-500">
                            {customer.email}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop View */}
                <table className="hidden min-w-full rounded-md text-gray-900 md:table">
                  <thead className="rounded-md bg-gray-50 text-left text-sm font-normal">
                    <tr>
                      <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                        Customer
                      </th>
                      <th scope="col" className="px-3 py-5 font-medium">
                        Email
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-200 text-gray-900">
                    {customers?.map((customer) => (
                      <tr key={customer.id} className="group">
                        <td className="whitespace-nowrap bg-white py-5 pl-4 pr-3 text-sm text-black group-first-of-type:rounded-md group-last-of-type:rounded-md sm:pl-6">
                          <div className="flex items-center gap-3">
                            <div className="relative h-8 w-8 overflow-hidden rounded-full bg-gray-200">
                              {customer.image_url ? (
                                <Image
                                  src={customer.image_url}
                                  alt={`${customer.name}'s profile picture`}
                                  className="object-cover"
                                  fill
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center text-xs font-medium text-gray-600">
                                  {customer.name.charAt(0)}
                                </div>
                              )}
                            </div>
                            <p>{customer.name}</p>
                          </div>
                        </td>
                        <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                          {customer.email}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </Suspense>
    </div>
  );
}
