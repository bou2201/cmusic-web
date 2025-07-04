'use client';

import { Image, uploadService } from '@/modules/upload';
import { UploadIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { FieldPath, FieldValues, Path, PathValue, useFormContext } from 'react-hook-form';
import Dropzone, { DropzoneState } from 'shadcn-dropzone';
import { NextIntl } from '~types/next-intl';

type UploadImageProps<T extends FieldValues> = {
  name: FieldPath<T>;
};

export function UploadImage<T extends FieldValues>({ name }: UploadImageProps<T>) {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [image, setImage] = useState<Image | null>(null);

  const t = useTranslations<NextIntl.Namespace<'SongsPage.songMnt.createOrUpdate'>>(
    'SongsPage.songMnt.createOrUpdate',
  );
  const tUpload = useTranslations<NextIntl.Namespace<'Component.upload'>>('Component.upload');
  const { setValue } = useFormContext<T>();

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

  return (
    <Dropzone
      onDrop={(acceptedFiles: File[]) => {
        const image = acceptedFiles[0];
        if (image) {
          handleUpload(image);
        }
      }}
      dropZoneClassName="p-6 text-center"
      containerClassName="w-36 h-36 rounded-lg border-2 border-dashed border-gray-900/10 bg-gray-900/5"
      accept={{
        'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
      }}
      multiple={false}
      maxFiles={1}
      preventDropOnDocument
    >
      {(dropzone: DropzoneState) => (
        <>
          {dropzone.isDragAccept ? (
            <div className="text-sm font-medium">{tUpload('dropFileHere')}</div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-3">
              <UploadIcon />
              <div className="text-sm font-medium opacity-80">{tUpload('uploadImage')}</div>
            </div>
          )}
        </>
      )}
    </Dropzone>
  );
}
