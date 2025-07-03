import * as React from 'react';

import { cn } from '@/lib/utils';
import { cva } from 'class-variance-authority';
import { useDebounce } from 'use-debounce';

const textareaStyles = cva(
  'border-input file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground flex min-h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
);

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return <textarea data-slot="textarea" className={cn(textareaStyles(), className)} {...props} />;
}

interface TextareaDebounceProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  onChange: (...event: any[]) => void;
  value: string | number | readonly string[] | undefined;
  debounceDelay?: number;
}

const TextareaDebounce = ({
  onChange,
  className,
  value,
  debounceDelay = 300,
  ...rest
}: TextareaDebounceProps) => {
  const [innerValue, setInnerValue] = React.useState(value);
  const [debouncedValue] = useDebounce(innerValue, debounceDelay);

  // Notify react-hook-form when debounced value changes
  React.useEffect(() => {
    if (debouncedValue !== value) {
      onChange(debouncedValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue]);

  // Keep in sync with external value
  React.useEffect(() => {
    setInnerValue(value);
  }, [value]);

  return (
    <textarea
      {...rest}
      value={innerValue}
      onChange={(e) => setInnerValue(e.target.value)}
      className={cn(textareaStyles(), className)}
    />
  );
};

export { Textarea, TextareaDebounce };
