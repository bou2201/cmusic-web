'use client';

import { Loader2Icon } from "lucide-react";

export function DispLoading() {
  return (
    <div className="w-full h-full flex justify-center items-center bg-background">
      <Loader2Icon className="animate-spin w-16 h-16" />
    </div>
  );
}
