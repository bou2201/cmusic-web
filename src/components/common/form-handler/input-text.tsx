'use client';

import { InputHTMLAttributes, ReactNode, useState } from 'react';
import { FieldPath, FieldValues, useFormContext } from 'react-hook-form';
import {
  Button,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  InputDebounce,
} from '../../ui';
import { Eye, EyeOff } from 'lucide-react';

type InputTextProps<T extends FieldValues> = {
  name: FieldPath<T>;
  label?: string;
  description?: string | ReactNode;
  className?: string;
  inputProps?: InputHTMLAttributes<HTMLInputElement>;
  debounceDelay?: number;
  isDebounce?: boolean;
  disableMessage?: boolean;
  required?: boolean;
};

export const InputText = <T extends FieldValues>({
  name,
  label,
  description,
  className,
  inputProps,
  debounceDelay,
  isDebounce,
  disableMessage = false,
  required,
}: InputTextProps<T>) => {
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
                {required && '*'}
                {label}
              </FormLabel>
            )}
            <FormControl>
              {isDebounce ? (
                <InputDebounce
                  {...field}
                  {...inputProps}
                  debounceDelay={debounceDelay}
                  className={`${error && 'border-destructive'} ${inputProps?.className}`}
                />
              ) : (
                <Input
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

export const InputTextPassword = <T extends FieldValues>({
  name,
  label,
  description,
  className,
  inputProps,
  disableMessage = false,
  required,
}: Omit<InputTextProps<T>, 'debounceDelay' | 'isDebounce'>) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

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
                {required && '*'}
                {label}
              </FormLabel>
            )}
            <FormControl>
              <div className="relative">
                <Input
                  {...field}
                  {...inputProps}
                  onChange={field.onChange}
                  className={`${error && 'border-destructive'} hide-password-toggle`}
                  type={showPassword ? 'text' : 'password'}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? (
                    <Eye className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <EyeOff className="h-4 w-4" aria-hidden="true" />
                  )}
                  <span className="sr-only">
                    {showPassword ? 'Hide password' : 'Show password'}
                  </span>
                </Button>
              </div>
            </FormControl>
            {description && <FormDescription>{description}</FormDescription>}
            {!disableMessage && <FormMessage className="text-[13px]" />}
          </FormItem>
        );
      }}
    />
  );
};
