'use client';

import { ReactNode, useState } from 'react';
import { FieldPath, FieldValues, Path, PathValue, useFormContext } from 'react-hook-form';
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
  mode?: 'single' | 'multiple';
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
  mode = 'single',
}: ComboboxProps<T>) => {
  const [open, setOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { control, setValue } = useFormContext<T>();
  const t = useTranslations<NextIntl.Namespace<'Component.formHandler'>>('Component.formHandler');

  const filteredOptions = options.filter(
    (opt) =>
      opt[optionLabel].toLowerCase().includes(searchTerm.toLowerCase()) ||
      opt[optionValue].toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => {
        const selectedValues: string[] =
          mode === 'multiple' ? field.value || [] : field.value ? [field.value] : [];

        const isSelected = (val: string) => selectedValues.includes(val);

        const toggleValue = (val: string) => {
          if (mode === 'multiple') {
            const current = new Set(selectedValues);
            if (current.has(val)) {
              current.delete(val);
            } else {
              current.add(val);
            }
            setValue(name, Array.from(current) as PathValue<T, Path<T>>, { shouldValidate: true });
          } else {
            setValue(name, val as PathValue<T, Path<T>>, { shouldValidate: true });
            setOpen(false); // close on single select
          }
        };

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
                      'w-full justify-between text-left',
                      selectedValues.length === 0 && 'text-muted-foreground',
                      mode === 'multiple' && 'h-auto',
                    )}
                  >
                    <div className="flex gap-6 whitespace-break-spaces">
                      {selectedValues.length > 0
                        ? selectedValues
                            .map(
                              (val: string) =>
                                options.find((opt) => opt[optionValue] === val)?.[optionLabel],
                            )
                            .filter(Boolean)
                            .join(', ')
                        : placeholder}
                    </div>
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
                  <CommandInput
                    placeholder={t('search')}
                    className="h-9"
                    onValueChange={setSearchTerm}
                  />
                  <CommandList>
                    <CommandEmpty>{t('noResult')}</CommandEmpty>
                    <CommandGroup>
                      {filteredOptions.map((opt) => {
                        const val = opt[optionValue];
                        const label = opt[optionLabel];

                        return (
                          <CommandItem key={val} value={label} onSelect={() => toggleValue(val)}>
                            {label}
                            <CheckIcon
                              className={cn(
                                'ml-auto h-4 w-4',
                                isSelected(val) ? 'opacity-100' : 'opacity-0',
                              )}
                            />
                          </CommandItem>
                        );
                      })}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            {description && <FormDescription>{description}</FormDescription>}
            {!disableMessage && <FormMessage className="text-[13px]" />}
          </FormItem>
          // <FormItem className={className}>
          //   {label && <FormLabel className="text-[13px]">{label}</FormLabel>}
          //   <Popover open={open} onOpenChange={setOpen}>
          //     <PopoverTrigger asChild>
          //       <FormControl>
          //         <Button
          //           variant="outline"
          //           role="combobox"
          //           className={cn(
          //             'w-full justify-between',
          //             !field.value && 'text-muted-foreground',
          //           )}
          //         >
          //           {field.value
          //             ? options.find((opt) => opt[optionValue] === field.value)?.[optionLabel]
          //             : placeholder}
          //           {isLoading ? (
          //             <Loader2 className="animate-spin" />
          //           ) : (
          //             <ChevronsUpDown className="opacity-50" />
          //           )}
          //         </Button>
          //       </FormControl>
          //     </PopoverTrigger>
          //     <PopoverContent className="w-72 p-0">
          //       <Command>
          //         <CommandInput
          //           placeholder={t('search')}
          //           className="h-9"
          //           onValueChange={(e) => {
          //             setSearchTerm(e);
          //           }}
          //         />
          //         <CommandList>
          //           <CommandEmpty>{t('noResult')}</CommandEmpty>
          //           <CommandGroup>
          //             {filteredOptions.map((opt) => (
          //               <CommandItem
          //                 value={opt[optionLabel]}
          //                 key={opt[optionValue]}
          //                 onSelect={() => {
          //                   setValue(name, opt[optionValue]);
          //                   setOpen(false);
          //                 }}
          //               >
          //                 {opt[optionLabel]}
          //                 <CheckIcon
          //                   className={cn(
          //                     'ml-auto',
          //                     opt[optionValue] === field.value ? 'opacity-100' : 'opacity-0',
          //                   )}
          //                 />
          //               </CommandItem>
          //             ))}
          //           </CommandGroup>
          //         </CommandList>
          //       </Command>
          //     </PopoverContent>
          //   </Popover>
          //   {description && <FormDescription>{description}</FormDescription>}
          //   {!disableMessage && <FormMessage className="text-[13px]" />}
          // </FormItem>
        );
      }}
    />
  );
};
