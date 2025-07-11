'use client';

import { Audio, uploadService } from '@/modules/upload';
import { Loader2, UploadIcon, XIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ReactNode, useEffect, useState } from 'react';
import { FieldPath, FieldValues, Path, PathValue, useFormContext, useWatch } from 'react-hook-form';
import { NextIntl } from '~types/next-intl';
import { DispHlsAudioPlayer } from '../data-display/disp-hls-audio-player';
import {
  Button,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui';
import Dropzone, { DropzoneState } from 'shadcn-dropzone';
import { cn } from '@/lib/utils';

type UploadAudioProps<T extends FieldValues> = {
  name: FieldPath<T>;
  namePublicId?: FieldPath<T>;
  nameDuration?: FieldPath<T>;
  label?: string;
  description?: string | ReactNode;
  className?: string;
  required?: boolean;
  disableMessage?: boolean;
};

export function UploadAudio<T extends FieldValues>({
  name,
  namePublicId = 'audioPublicId' as Path<T>,
  nameDuration = 'duration' as Path<T>,
  className,
  description,
  label,
  required,
  disableMessage,
}: UploadAudioProps<T>) {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [audio, setAudio] = useState<Audio | null>(null);

  const t = useTranslations<NextIntl.Namespace<'Component.upload'>>('Component.upload');
  const { control, setValue } = useFormContext<T>();
  const audioUrl = useWatch({ control, name }) as string;
  const publicId = useWatch({ control, name: namePublicId }) as string;
  const duration = useWatch({ control, name: nameDuration }) as number;

  const handleUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      setIsUploading(true);
      const res = await uploadService.uploadAudio(formData);
      setAudio(res);
      setValue(name, res.url as PathValue<T, Path<T>>);
      setValue(namePublicId, res.publicId as PathValue<T, Path<T>>);
      setValue(nameDuration, res.duration as PathValue<T, Path<T>>);
    } catch (error) {
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  const renderAudio = () => {
    if (!audio) return null;

    return (
      <div className="relative w-full h-full p-2 bg-muted rounded-md shadow">
        <DispHlsAudioPlayer src={audio.url} />
        <Button
          type="button"
          size="icon"
          className="absolute -top-3 -right-3 rounded-full w-7 h-7"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setAudio(null);
            setValue(name, null as PathValue<T, Path<T>>);
            setValue(namePublicId, null as PathValue<T, Path<T>>);
            setValue(nameDuration, null as PathValue<T, Path<T>>);
          }}
        >
          <XIcon className="w-4 h-4" />
        </Button>
      </div>
    );
  };

  const renderUpload = (isDragAccept: boolean) => {
    return isDragAccept ? (
      <p className="text-sm font-medium">{t('dropFileHere')}</p>
    ) : (
      <div className="flex flex-col items-center justify-center gap-2 p-4">
        {isUploading ? (
          <Loader2 className="w-6 h-6 animate-spin" />
        ) : (
          <>
            <UploadIcon />
            <p className="text-sm font-medium opacity-80">{t('uploadAudio')}</p>
          </>
        )}
      </div>
    );
  };

  useEffect(() => {
    if (!audio && audioUrl) {
      setAudio({
        url: audioUrl,
        publicId: publicId ?? '',
        duration: duration ?? 0,
        format: 'mp3',
      });
    }
  }, [audio, audioUrl, publicId, duration]);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <FormItem className={className}>
          {label && (
            <FormLabel className="text-[13px]">
              {required && <span className="text-destructive">*</span>} {label}
            </FormLabel>
          )}

          <FormControl>
            <Dropzone
              onDrop={(files) => {
                const file = files[0];
                if (file) handleUpload(file);
              }}
              dropZoneClassName="text-center w-full h-full"
              containerClassName={cn(
                'w-full rounded-lg border-2 border-dashed',
                error ? 'border-destructive' : 'border-gray-900/10',
              )}
              accept={{ 'audio/*': ['.mpeg', '.mp3', 'wav', 'ogg'] }}
              multiple={false}
              maxFiles={1}
              preventDropOnDocument
            >
              {(dropzone: DropzoneState) =>
                audio ? renderAudio() : renderUpload(dropzone.isDragAccept)
              }
            </Dropzone>
          </FormControl>

          {description && <FormDescription>{description}</FormDescription>}
          {!disableMessage && <FormMessage className="text-[13px]" />}
        </FormItem>
      )}
    />
  );
}
