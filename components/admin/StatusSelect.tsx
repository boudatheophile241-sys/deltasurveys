"use client";

import { useTransition } from "react";
import { Loader2 } from "lucide-react";

type Option = { value: string; label: string };

export function StatusSelect({
  id,
  current,
  options,
  action,
}: {
  id: string;
  current: string;
  options: Option[];
  action: (id: string, status: string) => Promise<void>;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <span className="inline-flex items-center gap-2">
      <select
        defaultValue={current}
        disabled={pending}
        onChange={(e) => {
          const status = e.target.value;
          startTransition(() => action(id, status));
        }}
        className="h-9 rounded-lg border border-navy-200 bg-white px-2 text-xs font-medium text-navy-800 outline-none focus:border-navy-400"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {pending && <Loader2 className="h-3.5 w-3.5 animate-spin text-navy-400" />}
    </span>
  );
}
