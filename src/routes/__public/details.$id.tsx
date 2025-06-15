import { createFileRoute } from "@tanstack/react-router";
import React from "react";

import { client } from "../../api/client";
import { components } from "../../api/schema";

export const Route = createFileRoute("/__public/details/$id")({
  component: RouteComponent,
  beforeLoad: async (props) => {
    const { params } = props;
    const { id } = params;

    const res = await client.GET("/@wanted-person/{id}", {
      params: {
        path: {
          id,
        },
      },
    });

    return {
      wanted: res.data,
    };
  },
});

type ProfileCarouselProps = {
  images:
    | {
        caption?: string | null;
        original?: string | null;
        large?: string | null;
        thumb?: string | null;
      }[]
    | null;
};

function ProfileCarousel(props: ProfileCarouselProps) {
  const { images } = props;
  const [page, setPage] = React.useState(0);

  if (!images) {
    return <p className="text-center">No images available.</p>;
  }

  return (
    <div className="flex flex-row justify-between items-center h-[15rem]">
      <button
        disabled={page === 0}
        className="cursor-pointer p-1 h-fit disabled:text-slate-600 disabled:cursor-not-allowed"
        onClick={() => setPage(page - 1)}
      >
        Prev
      </button>
      {images.map((image, index) => {
        if (!image.original) {
          return null;
        }

        if (index === page) {
          return (
            <img
              key={image.original}
              src={image.original}
              alt={image.original}
              width={150}
            />
          );
        }

        return null;
      })}
      <button
        disabled={page === images.length - 1}
        className="cursor-pointer p-1 h-fit disabled:text-slate-600 disabled:cursor-not-allowed"
        onClick={() => setPage(page + 1)}
      >
        Next
      </button>
    </div>
  );
}

function FilesSection(props: {
  files: components["schemas"]["WantedFile"][] | null;
}) {
  const { files } = props;

  return (
    <div className="border border-slate-300 rounded p-1">
      <strong className="text-xl">Files</strong>
      {files?.map((file) => {
        if (!file.url) {
          return;
        }

        return (
          <div key={file.url}>
            <a
              className="visited:text-purple-600 text-blue-600"
              href={file.url}
            >
              {file.name}
            </a>
          </div>
        );
      })}
    </div>
  );
}

function FieldOffices(props: { offices: string[] | null }) {
  const { offices } = props;

  return (
    <div className="border border-slate-300 rounded p-1">
      <strong className="text-xl">Field offices</strong>
      {!offices ? (
        <p>No field offices available.</p>
      ) : (
        offices.map((office) => (
          <div key={office} className="px-1 bg-slate-300 w-fit rounded">
            {office}
          </div>
        ))
      )}
    </div>
  );
}

function ImagesSection(props: ProfileCarouselProps) {
  const { images } = props;

  return (
    <div className="border border-slate-300 rounded p-1">
      <strong className="text-xl">Images</strong>
      {!images ? (
        <p>No field images available.</p>
      ) : (
        <div className="flex flex-row gap-1">
          {images.map((image) => {
            if (image.original) {
              return (
                <img src={image.original} alt={image.original} width={150} />
              );
            }
          })}
        </div>
      )}
    </div>
  );
}

function RouteComponent() {
  const { wanted } = Route.useRouteContext();

  if (!wanted) {
    return <p>There are no information associated with this id.</p>;
  }

  return (
    <div className="grid grid-cols-4 gap-1">
      <div className="col-span-1 flex flex-col gap-1 border border-slate-300 p-1 h-fit">
        <ProfileCarousel images={wanted.images} />
        <p className="text-center">{wanted.title}</p>
      </div>
      <div className="col-span-3 flex flex-col gap-1">
        <div className="border border-slate-300 rounded p-1">
          <strong className="text-xl">Biography</strong>
          <div className="grid grid-cols-2 py-2">
            <div className="flex flex-row gap-1">
              <strong>Eye: </strong>
              <p>{wanted.eyes}</p>
            </div>
            <div className="flex flex-row gap-1">
              <strong>Build: </strong>
              <p>{wanted.build ?? "N/A"}</p>
            </div>
            <div className="flex flex-row gap-1">
              <strong>Hair: </strong>
              <p>{wanted.hair ?? "N/A"}</p>
            </div>
            <div className="flex flex-row gap-1">
              <strong>Race: </strong>
              <p>{wanted.race ?? "N/A"}</p>
            </div>
            <div className="flex flex-row gap-1">
              <strong>Height: </strong>
              <p>
                {wanted.height_min ?? "N/A"} - {wanted.height_max ?? "N/A"}
              </p>
            </div>
            <div className="flex flex-row gap-1">
              <strong>Date of birth: </strong>
              <p>{wanted.dates_of_birth_used}</p>
            </div>
            <div className="flex flex-row gap-1">
              <strong>Complexion: </strong>
              <p>{wanted.complexion ?? "N/A"}</p>
            </div>
            <div className="flex flex-row gap-1">
              <strong>Age: </strong>
              <p>
                {wanted.age_min ?? "N/A"} - {wanted.age_max ?? "N/A"}
              </p>
            </div>
            <div className="flex flex-row gap-1">
              <strong>Gender</strong>
              <p>{wanted.sex ?? "N/A"}</p>
            </div>
            <div className="flex flex-row gap-1">
              <strong>Status: </strong>
              <p className="px-1 bg-slate-300 border rounded">
                {wanted.status ?? "N/A"}
              </p>
            </div>
          </div>
          <strong className="text-nowrap">Scars / Marks: </strong>
          <p>{wanted.scars_and_marks ?? "N/A"}</p>
          <strong>Description:</strong>
          <p>{wanted.description}</p>
          <strong>Warning:</strong>
          <p>{wanted.warning_message ?? "N/A"}</p>
          <strong>Details:</strong>
          <p>{wanted.details ?? "N/A"}</p>
          <strong>Additional information:</strong>
          <p>{wanted.additional_information ?? "N/A"}</p>
          <strong>Reward:</strong>
          <p>{wanted.reward_text ?? "N/A"}</p>
          <strong>Caution:</strong>
          <p>{wanted.caution ?? "N/A"}</p>
        </div>
        <FilesSection files={wanted.files} />
        <FieldOffices offices={wanted.field_offices} />
        <ImagesSection images={wanted.images} />
      </div>
    </div>
  );
}
