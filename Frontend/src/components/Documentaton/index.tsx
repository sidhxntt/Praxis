import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "./components/app-sidebar";
import { ModeToggle } from "../AdminDashboard/AdminDashboardComponents/ModeToggle";
import { useEffect, useState } from "react";
import { get_BackendEssentials_data } from "@/contentful/sample_data";
import { MappedEntry } from "@/contentful/contentfulDataFetching";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import renderOptions from "@/contentful/documentToReactComponents(options)";

interface DataState {
  // add here
  Backend_Essentials: MappedEntry[];
}

export default function Page() {
  const [data, setData] = useState<DataState>({
    // add here
    Backend_Essentials: [],
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          // add here
          Backend_Essentials,
        ] = await Promise.all([
          // add here
          get_BackendEssentials_data(),
        ]);

        setData({
          // add here
          Backend_Essentials: Backend_Essentials || [],
        });
      } catch (err) {
        setError("Failed to load data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <span>Loading...</span>
      </div>
    );
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <ModeToggle />
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">
                  Building Your Application
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Data Fetching</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3"></div>
          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min p-4">
            <h2 className="text-xl font-semibold mb-4">Backend Essentials</h2>
            <div className="grid grid-cols-1 gap-4">
              {data.Backend_Essentials.length > 0 && (
                <div className="border rounded-lg p-4 bg-card h-full">
                  <h3 className="text-lg font-medium ">
                    {data.Backend_Essentials[0].title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Reading time: {data.Backend_Essentials[0].reading_time}
                  </p>
                  {data.Backend_Essentials[0].src && (
                    <div className="my-4">
                      <img
                        src={data.Backend_Essentials[0].src}
                        alt={data.Backend_Essentials[0].title}
                        className="rounded-md w-full max-h-64 object-cover"
                      />
                    </div>
                  )}
                  <div className="mt-4 prose prose-sm max-w-none w-full text-black dark:text-white">
                    {documentToReactComponents(
                      data.Backend_Essentials[0].content,
                      renderOptions
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
