import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/__public")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <div className="border rounded border-slate-300 p-2 m-2">
        <p>FBI Wanted</p>
      </div>
      <div className="flex w-full justify-center">
        <div className="w-[80rem]">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
