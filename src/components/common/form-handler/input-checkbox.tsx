'use client';

import {
  Checkbox,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui';
import { CheckedState } from '@radix-ui/react-checkbox';
import { ReactNode } from 'react';
import {
  ControllerRenderProps,
  FieldPath,
  FieldValues,
  Path,
  useFormContext,
} from 'react-hook-form';

export type InputCheckboxProps<T extends FieldValues> = {
  name: FieldPath<T>;
  label?: string;
  description?: string | ReactNode;
  className?: string;
  options?: Record<string, any>[];
  /** Field name inside option to use as value */
  optionValue?: string;
  /** Field name inside option to use as label */
  optionLabel?: string;
  mode?: 'boolean' | 'array';
  onChange?: (checked: CheckedState) => void;
  disableMessage?: boolean;
  disabled?: boolean;
};

export const InputCheckbox = <T extends FieldValues>({
  name,
  label,
  description,
  className,
  disableMessage = false,
  disabled,
  onChange,
  options,
  optionValue = 'value',
  optionLabel = 'label',
  mode = 'boolean',
}: InputCheckboxProps<T>) => {
  const { control } = useFormContext<T>();

  const renderItemBoolean = (field: ControllerRenderProps<T, Path<T>>) => {
    return (
      <FormItem
        className={`${className} flex flex-row ${
          description ? 'items-start' : 'items-center'
        } space-x-3 space-y-0`}
      >
        <FormControl>
          <Checkbox
            checked={field.value}
            onCheckedChange={(checked) => {
              if (onChange) {
                onChange(checked);
              } else {
                field.onChange(checked);
              }
            }}
            disabled={disabled}
          />
        </FormControl>
        <div className="space-y-1 leading-none">
          <FormLabel>{label}</FormLabel>
          {description && <FormDescription>{description}</FormDescription>}
        </div>
        {!disableMessage && <FormMessage className="text-[13px]" />}
      </FormItem>
    );
  };

  const renderItemArray = () => {
    return (
      <FormItem className={className}>
        {options?.map((option) => (
          <FormField
            key={option[optionLabel]}
            control={control}
            name={name}
            render={({ field }) => {
              return (
                <FormItem
                  key={option[optionValue]}
                  className="flex flex-row items-start space-x-3 space-y-0"
                >
                  <FormControl>
                    <Checkbox
                      checked={field.value?.includes(option[optionLabel])}
                      onCheckedChange={(checked) => {
                        if (onChange) {
                          onChange(checked);
                        } else {
                          return checked
                            ? field.onChange([...field.value, option[optionLabel]])
                            : field.onChange(
                                field.value?.filter(
                                  (value: string) => value !== option[optionLabel],
                                ),
                              );
                        }
                      }}
                    />
                  </FormControl>
                  <FormLabel className="text-sm font-normal">{option[optionValue]}</FormLabel>
                </FormItem>
              );
            }}
          />
        ))}
        {!disableMessage && <FormMessage className="text-[13px]" />}
      </FormItem>
    );
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => {
        return mode === 'boolean' ? renderItemBoolean(field) : renderItemArray();
      }}
    />
  );
};
