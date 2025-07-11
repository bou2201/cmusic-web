'use client';

import {
  Button,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui';
import { Image as ImageType, uploadService } from '@/modules/upload';
import { Loader2, UploadIcon, XIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { ReactNode, useEffect, useState } from 'react';
import { FieldPath, FieldValues, Path, PathValue, useFormContext, useWatch } from 'react-hook-form';
import Dropzone, { DropzoneState } from 'shadcn-dropzone';
import { NextIntl } from '~types/next-intl';

type UploadImageProps<T extends FieldValues> = {
  name: FieldPath<T>;
  label?: string;
  description?: string | ReactNode;
  className?: string;
  required?: boolean;
  disableMessage?: boolean;
};

export function UploadImage<T extends FieldValues>({
  name,
  className,
  description,
  label,
  required,
  disableMessage,
}: UploadImageProps<T>) {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [image, setImage] = useState<ImageType | null>(null);

  const t = useTranslations<NextIntl.Namespace<'SongsPage.songMnt.createOrUpdate'>>(
    'SongsPage.songMnt.createOrUpdate',
  );
  const tUpload = useTranslations<NextIntl.Namespace<'Component.upload'>>('Component.upload');
  const { setValue, control } = useFormContext<T>();
  const fieldValue = useWatch({ control, name }) as unknown;

  const handleUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      setIsUploading(true);

      const res = await uploadService.uploadImage(formData);
      setImage(res);
      setValue(name, res as PathValue<T, Path<T>>);
    } catch (error) {
      console.log(error);
    } finally {
      setIsUploading(false);
    }
  };

  const renderUpload = (isDragAccept: boolean) => {
    return isDragAccept ? (
      <div className="text-sm font-medium">{tUpload('dropFileHere')}</div>
    ) : (
      <div className="flex flex-col items-center justify-center gap-3">
        {isUploading ? (
          <Loader2 className="w-10 h-10 animate-spin" />
        ) : (
          <>
            <UploadIcon />
            <div className="text-sm font-medium opacity-80">{tUpload('uploadImage')}</div>
          </>
        )}
      </div>
    );
  };

  const renderImage = () => {
    return (
      image && (
        <div className="relative rounded-lg w-full h-full">
          <Image
            alt={image.url}
            src={image.url}
            width={200}
            height={200}
            className="object-cover w-full h-full rounded-lg"
          />
          <Button
            className="absolute -top-3 -right-3 rounded-full w-7 h-7"
            size="icon"
            type="button"
            variant="default"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setImage(null);
              setValue(name, null as PathValue<T, Path<T>>);
            }}
          >
            <XIcon />
          </Button>
        </div>
      )
    );
  };

  useEffect(() => {
    if (!image && fieldValue && typeof fieldValue === 'object' && 'url' in fieldValue) {
      setImage(fieldValue as ImageType);
    }

    if (!image && typeof fieldValue === 'string') {
      setImage({ url: fieldValue } as ImageType);
    }
  }, [image, fieldValue]);

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
              <Dropzone
                onDrop={(acceptedFiles: File[]) => {
                  const image = acceptedFiles[0];
                  if (image) {
                    handleUpload(image);
                  }
                }}
                dropZoneClassName="text-center w-full h-full"
                containerClassName="w-48 h-48 rounded-lg border-2 border-dashed border-gray-900/10 bg-gray-900/5"
                accept={{
                  'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
                }}
                multiple={false}
                maxFiles={1}
                preventDropOnDocument
              >
                {(dropzone: DropzoneState) => (
                  <>{image ? renderImage() : renderUpload(dropzone.isDragAccept)}</>
                )}
              </Dropzone>
            </FormControl>
            {description && <FormDescription>{description}</FormDescription>}
            {!disableMessage && <FormMessage className="text-[13px]" />}
          </FormItem>
        );
      }}
    />
  );
}
