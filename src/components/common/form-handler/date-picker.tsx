'use client';

import {
  Button,
  Calendar,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ReactNode, useState } from 'react';
import { FieldPath, FieldValues, useFormContext } from 'react-hook-form';
import { NextIntl } from '~types/next-intl';

type DatePickerProps<T extends FieldValues> = {
  name: FieldPath<T>;
  label?: string;
  description?: string | ReactNode;
  className?: string;
  disableMessage?: boolean;
  required?: boolean;
};

export function DatePicker<T extends FieldValues>({
  name,
  label,
  description,
  className,
  disableMessage,
  required,
}: DatePickerProps<T>) {
  const [open, setOpen] = useState<boolean>(false);

  const { control } = useFormContext<T>();
  const t = useTranslations<NextIntl.Namespace<'Component.datePicker'>>('Component.datePicker');

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <FormItem className={className}>
          {label && (
            <FormLabel className="text-[13px]">
              {required && <span className="text-destructive">*</span>}
              {label}
            </FormLabel>
          )}
          <Popover open={open} onOpenChange={setOpen} modal>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full justify-between text-left',
                    !field.value && 'text-muted-foreground',
                  )}
                >
                  {field.value ? new Date(field.value).toLocaleDateString() : t('placeholder')}
                  <CalendarIcon className="h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent
              className="w-full min-w-[var(--radix-popper-anchor-width)] max-w-[var(--radix-popper-content-width)] p-0"
              align="start"
              onWheel={(e) => e.stopPropagation()}
            >
              <Calendar
                mode="single"
                // selected={field.value}
                // onSelect={field.onChange}
                selected={field.value ? new Date(field.value) : undefined}
                onSelect={(date) => {
                  if (date) {
                    field.onChange(date.toISOString()); // store ISO string
                  } else {
                    field.onChange(null);
                  }
                }}
                disabled={(date) => date > new Date()}
                captionLayout="dropdown"
              />
            </PopoverContent>
          </Popover>

          {description && <FormDescription>{description}</FormDescription>}
          {!disableMessage && <FormMessage className="text-[13px]" />}
        </FormItem>
      )}
    />
  );
}
