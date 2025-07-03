'use client';

import { ReactNode, useState } from 'react';
import { FieldPath, FieldValues, useFormContext } from 'react-hook-form';
import {
  Button,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../../ui';
import { CheckIcon, ChevronsUpDown, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import { NextIntl } from '~types/next-intl';

type ComboboxOption = Record<string, any>;

type ComboboxProps<T extends FieldValues> = {
  name: FieldPath<T>;
  label?: string;
  description?: string | ReactNode;
  className?: string;
  disableMessage?: boolean;
  options: ComboboxOption[];
  placeholder?: string;
  isLoading?: boolean;
  /** Field name inside option to use as value */
  optionValue?: string;
  /** Field name inside option to use as label */
  optionLabel?: string;
};

export const Combobox = <T extends FieldValues>({
  name,
  label,
  description,
  className,
  disableMessage = false,
  options,
  placeholder = '...',
  isLoading,
  optionValue = 'value',
  optionLabel = 'label',
}: ComboboxProps<T>) => {
  const [open, setOpen] = useState<boolean>(false);

  const { control, setValue } = useFormContext<T>();
  const t = useTranslations<NextIntl.Namespace<'Component.formHandler'>>('Component.formHandler');

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => {
        return (
          <FormItem className={className}>
            {label && <FormLabel className="text-[13px]">{label}</FormLabel>}
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    role="combobox"
                    className={cn(
                      'w-full justify-between',
                      !field.value && 'text-muted-foreground',
                    )}
                  >
                    {field.value
                      ? options.find((opt) => opt[optionValue] === field.value)?.[optionLabel]
                      : placeholder}
                    {isLoading ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      <ChevronsUpDown className="opacity-50" />
                    )}
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-72 p-0">
                <Command>
                  <CommandInput placeholder={t('search')} className="h-9" />
                  <CommandList>
                    <CommandEmpty>{t('noResult')}</CommandEmpty>
                    <CommandGroup>
                      {options.map((opt) => (
                        <CommandItem
                          value={opt[optionLabel]}
                          key={opt[optionValue]}
                          onSelect={() => {
                            setValue(name, opt[optionValue]);
                            setOpen(false);
                          }}
                        >
                          {opt[optionLabel]}
                          <CheckIcon
                            className={cn(
                              'ml-auto',
                              opt[optionValue] === field.value ? 'opacity-100' : 'opacity-0',
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            {description && <FormDescription>{description}</FormDescription>}
            {!disableMessage && <FormMessage className="text-[13px]" />}
          </FormItem>
        );
      }}
    />
  );
};
