import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";

const wantedFormValues = z.object({
  title: z.string().optional().nullable(),
  eyes: z.string().optional().nullable(),
  build: z.string().optional().nullable(),
  sex: z.string().optional().nullable(),
});

type WantedFilterFormValues = z.infer<typeof wantedFormValues>;

type WantedFilterFormProps = {
  onSubmit: (formValues: WantedFilterFormValues) => void;
  defaultValues?: WantedFilterFormValues;
};

export function WantedFilterForm(props: WantedFilterFormProps) {
  const { onSubmit } = props;

  const { register, handleSubmit, reset } = useForm<WantedFilterFormValues>({
    resolver: zodResolver(wantedFormValues),
  });

  return (
    <form className="grid grid-cols-2 gap-1" onSubmit={handleSubmit(onSubmit)}>
      <input
        className="border rounded border-slate-300 p-1"
        placeholder="Search name"
        id="title"
        defaultValue={props.defaultValues?.title ?? ""}
        {...register("title")}
      />
      <input
        className="border rounded border-slate-300 p-1"
        placeholder="Eyes"
        id="eyes"
        defaultValue={props.defaultValues?.eyes ?? ""}
        {...register("eyes")}
      />
      <input
        className="border rounded border-slate-300 p-1"
        placeholder="Build"
        id="build"
        defaultValue={props.defaultValues?.build ?? ""}
        {...register("build")}
      />
      <select
        className="border rounded border-slate-300 p-1"
        defaultValue={props.defaultValues?.sex ?? ""}
        {...register("sex")}
      >
        <option value="male">Male</option>
        <option value="female">Female</option>
      </select>
      <button
        className="border cursor-pointer border-slate-300 rounded p-1"
        type="submit"
      >
        Search
      </button>
      <button
        className="border cursor-pointer border-red-600 text-red-600 rounded p-1"
        type="submit"
        onClick={() => reset()}
      >
        Reset
      </button>
    </form>
  );
}
