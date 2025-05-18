'use client';

import { Separator } from '../ui';

export function LayoutFooter() {
  return (
    <>
      <Separator orientation="horizontal" className="my-5" />
      <footer className="text-sm font-semibold opacity-80">
        © 2025 <strong>CMusic</strong>. All rights reserved.
      </footer>
    </>
  );
}
