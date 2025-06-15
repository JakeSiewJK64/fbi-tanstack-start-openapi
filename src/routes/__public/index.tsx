import { createFileRoute, Link } from "@tanstack/react-router";
import { createColumnHelper } from "@tanstack/react-table";

import { client } from "../../api/client";
import { trimObject } from "../../components/form/utils";
import { WantedFilterForm } from "../../components/form/WantedFilterForm";
import { Table } from "../../components/ui/Table";
import {
  Tooltip,
  TooltipContent,
  TooltipPortal,
  TooltipProvider,
  TooltipTrigger,
} from "../../components/ui/Tooltip";

import type { components, operations } from "../../api/schema";

type WantedSearchParam = {
  filter?: operations["_wanted__wanted_get"]["parameters"]["query"];
  pageIndex: number;
  pageSize: number;
};

export const Route = createFileRoute("/__public/")({
  component: RouteComponent,
  validateSearch: (data: WantedSearchParam) => data,
  beforeLoad: async (params) => {
    const { search } = params;
    const { pageIndex, pageSize, filter } = search;

    const res = await client.GET("/@wanted", {
      params: {
        query: {
          page: pageIndex + 1,
          pageSize,
          ...filter,
        },
      },
    });

    return {
      search,
      wanted: res.data,
    };
  },
});

const columnHelper =
  createColumnHelper<components["schemas"]["WantedPerson"]>();

const columns = [
  columnHelper.accessor("title", {
    header: "Name",
    cell: (info) => {
      const imgSource = info.row.original.images?.[0];

      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <p className="text-nowrap">{info.getValue()}</p>
            </TooltipTrigger>
            <TooltipPortal>
              <TooltipContent side="right">
                {imgSource?.thumb ? (
                  <img
                    width={150}
                    src={imgSource.thumb}
                    alt={imgSource?.caption ?? "N/A"}
                  />
                ) : (
                  <p>No preview available.</p>
                )}
              </TooltipContent>
            </TooltipPortal>
          </Tooltip>
        </TooltipProvider>
      );
    },
  }),
  columnHelper.accessor("build", {
    header: "Build",
    cell: (info) => <p>{info.getValue() || "N/A"}</p>,
  }),
  columnHelper.accessor("dates_of_birth_used", {
    header: "DOB",
    cell: (info) => <p className="text-nowrap">{info.getValue() || "N/A"}</p>,
  }),
  columnHelper.accessor("eyes", {
    header: "Eyes",
    cell: (info) => <p>{info.getValue() || "N/A"}</p>,
  }),
  columnHelper.accessor("nationality", {
    header: "Nationality",
    cell: (info) => <p>{info.getValue() || "N/A"}</p>,
  }),
  columnHelper.accessor("status", {
    header: "Status",
    cell: (info) => <p>{info.getValue() || "N/A"}</p>,
  }),
  columnHelper.accessor("sex", {
    header: "Gender",
    cell: (info) => <p>{info.getValue() || "N/A"}</p>,
  }),
  columnHelper.accessor("possible_countries", {
    header: "Possible Countries",
    cell: (info) => <p>{info.getValue() || "N/A"}</p>,
  }),
  columnHelper.accessor("complexion", {
    header: "Complexion",
    cell: (info) => <p>{info.getValue() || "N/A"}</p>,
  }),
  columnHelper.accessor("hair", {
    header: "Hair",
    cell: (info) => <p>{info.getValue() || "N/A"}</p>,
  }),
  columnHelper.accessor("age_min", {
    header: "Age",
    cell: (info) => <p>{info.getValue() || "N/A"}</p>,
  }),
  columnHelper.accessor("files", {
    header: "Files",
    cell: (info) => (
      <div>
        {info.getValue()?.map((file) => {
          if (!file.url) {
            return <p>N/A</p>;
          }

          return (
            <div key={file.url}>
              <a
                target="_blank"
                className="visited:text-purple-600 text-blue-600 text-nowrap"
                href={file.url}
              >
                {file.name}
              </a>
            </div>
          );
        })}
      </div>
    ),
  }),
  columnHelper.display({
    id: "action",
    header: "",
    cell: (info) => {
      const { uid } = info.row.original;

      return (
        <div>
          {uid ? (
            <Link
              className="text-nowrap"
              to="/details/$id"
              params={{ id: uid }}
            >
              View details
            </Link>
          ) : (
            <p>No actions available.</p>
          )}
        </div>
      );
    },
  }),
];

function RouteComponent() {
  const { wanted } = Route.useRouteContext();
  const navigate = Route.useNavigate();
  const search = Route.useSearch();

  return (
    <div>
      <Table
        defaultColumnPin={{ right: ["action"] }}
        filterComponent={
          <WantedFilterForm
            defaultValues={search.filter}
            onSubmit={(e) =>
              navigate({
                search: { ...search, pageIndex: 0, filter: trimObject(e) },
              })
            }
          />
        }
        fetchData={(tableMeta) => {
          const { pageIndex, pageSize } = tableMeta;

          return navigate({
            to: "/",
            search: {
              ...search,
              pageIndex,
              pageSize,
            },
          });
        }}
        serverSideDataSource
        pagination
        initialPageIndex={search.pageIndex}
        initialPageSize={search.pageSize}
        total={wanted?.total ?? 0}
        pageCount={Math.ceil((wanted?.total ?? 0) / (search.pageSize ?? 25))}
        data={wanted?.items ?? []}
        columns={columns}
      />
    </div>
  );
}
