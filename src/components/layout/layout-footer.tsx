'use client';

import { Separator } from '../ui';

export function LayoutFooter() {
  return (
    <>
      <Separator orientation="horizontal" className="my-6" />
      <footer className="text-sm font-medium opacity-80 mb-6">
        © 2025 <strong>CMusic</strong>. All rights reserved.
      </footer>
    </>
  );
}
