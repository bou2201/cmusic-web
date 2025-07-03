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
  inputProps?: InputHTMLAttributes<HTMLTextAreaElement>;
  debounceDelay?: number;
  isDebounce?: boolean;
  disableMessage?: boolean;
};

export const InputTextarea = <T extends FieldValues>({
  name,
  label,
  description,
  className,
  inputProps,
  debounceDelay,
  isDebounce,
  disableMessage = false,
}: InputTextareaProps<T>) => {
  const { control } = useFormContext<T>();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => {
        return (
          <FormItem className={className}>
            {label && <FormLabel className="text-[13px]">{label}</FormLabel>}
            <FormControl>
              {isDebounce ? (
                <TextareaDebounce
                  {...field}
                  {...inputProps}
                  debounceDelay={debounceDelay}
                  className={`${error && 'border-destructive'} ${inputProps?.className}`}
                />
              ) : (
                <Textarea
                  {...field}
                  {...inputProps}
                  className={`${error && 'border-destructive'} ${inputProps?.className}`}
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
