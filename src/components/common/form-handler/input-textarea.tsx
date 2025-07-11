import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Textarea,
  TextareaDebounce,
} from '@/components/ui';
import { InputHTMLAttributes, ReactNode } from 'react';
import { FieldPath, FieldValues, useFormContext } from 'react-hook-form';

type InputTextareaProps<T extends FieldValues> = {
  name: FieldPath<T>;
  label?: string;
  description?: string | ReactNode;
  className?: string;
  textareaProps?: InputHTMLAttributes<HTMLTextAreaElement>;
  debounceDelay?: number;
  isDebounce?: boolean;
  disableMessage?: boolean;
  required?: boolean;
};

export const InputTextarea = <T extends FieldValues>({
  name,
  label,
  description,
  className,
  textareaProps,
  debounceDelay,
  isDebounce,
  disableMessage = false,
  required = false,
}: InputTextareaProps<T>) => {
  const { control } = useFormContext<T>();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => {
        return (
          <FormItem className={className}>
            {label && (
              <FormLabel className="text-[13px]">
                {required && <span className="text-destructive">*</span>}
                {label}
              </FormLabel>
            )}
            <FormControl>
              {isDebounce ? (
                <TextareaDebounce
                  {...field}
                  {...textareaProps}
                  debounceDelay={debounceDelay}
                  className={`${error && 'border-destructive'} ${textareaProps?.className}`}
                />
              ) : (
                <Textarea
                  {...field}
                  {...textareaProps}
                  className={`${error && 'border-destructive'} ${textareaProps?.className}`}
                />
              )}
            </FormControl>
            {description && <FormDescription>{description}</FormDescription>}
            {!disableMessage && <FormMessage className="text-[13px]" />}
          </FormItem>
        );
      }}
    />
  );
};
