import * as React from 'react';

import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { cva } from 'class-variance-authority';
import { useDebounce } from 'use-debounce';

const inputStyles = cva(
  'border-input file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
);

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input type={type} data-slot="input" className={cn(inputStyles(), className)} {...props} />
  );
}

interface InputDebounceProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onChange: (...event: any[]) => void;
  value: string | number | readonly string[] | undefined;
  debounceDelay?: number;
}

function InputDebounce({
  onChange,
  className,
  value,
  debounceDelay = 300,
  ...props
}: InputDebounceProps) {
  const [innerValue, setInnerValue] = React.useState(value);
  const [debouncedValue] = useDebounce(innerValue, debounceDelay);

  // Sync debounced value to react-hook-form
  React.useEffect(() => {
    if (debouncedValue !== value) {
      onChange(debouncedValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue]);

  React.useEffect(() => {
    setInnerValue(value); // if external value changes
  }, [value]);

  return (
    <input
      {...props}
      value={innerValue}
      onChange={(e) => setInnerValue(e.target.value)}
      className={cn(inputStyles(), className)}
    />
  );
}

type InputSearchProps = {
  divClassName?: string;
} & React.ComponentProps<'input'>;

function InputSearch({ className, divClassName, type, ...props }: InputSearchProps) {
  return (
    <div
      className={cn(
        'flex h-9 items-center rounded-md border border-input pl-3 text-sm ring-offset-background focus-within:ring-1 focus-within:ring-ring',
        divClassName,
      )}
    >
      <Search className="!w-5 !h-5 opacity-80" />
      <input
        type="search"
        data-slot="input"
        className={cn(
          'w-full p-2 placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        {...props}
      />
    </div>
  );
}

export { Input, InputSearch, InputDebounce };
