'use client';

import { DialogState } from '~types/common';
import { Artist, useArtistCouMntSchema, UseArtistCouMntSchemaType } from '../../types';
import {
  DispDialog,
  InputCheckbox,
  InputText,
  InputTextarea,
  UploadImage,
} from '@/components/common';
import { useTranslations } from 'next-intl';
import { NextIntl } from '~types/next-intl';
import { Button, Form } from '@/components/ui';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { artistService } from '../../service';
import { toast } from 'sonner';
import { getChangedFields } from '@/utiils/function';

type FormCouMntProps = DialogState & {
  artist?: Artist;
  setArtist?: (artist?: Artist) => void;
};

export function FormCouMnt({ open, setOpen, artist, setArtist }: FormCouMntProps) {
  const t = useTranslations<NextIntl.Namespace<'ArtistPage.artistMnt.createOrUpdate'>>(
    'ArtistPage.artistMnt.createOrUpdate',
  );
  const schema = useArtistCouMntSchema();
  const queryClient = useQueryClient();

  const form = useForm<UseArtistCouMntSchemaType>({
    resolver: zodResolver(schema),
    values: {
      isPopular: artist?.isPopular ?? false,
      name: artist?.name ?? '',
      bio: artist?.bio ?? '',
      avatar: artist?.avatar ?? undefined,
    },
  });

  const { mutate: executeSubmit, isPending: isLoadingSubmit } = useMutation({
    mutationFn: (data: Partial<UseArtistCouMntSchemaType>) =>
      artist
        ? artistService.updateArtist(artist.id, data)
        : artistService.createArtist(data as UseArtistCouMntSchemaType),
    onSuccess: () => {
      if (artist) {
        toast.success(t('updateSuccess'));
      } else {
        toast.success(t('addSuccess'));
      }

      queryClient.invalidateQueries({ queryKey: ['artists-mnt'] });
      queryClient.invalidateQueries({ queryKey: ['songs-mnt', 'artist'] });
      queryClient.invalidateQueries({ queryKey: ['mnt', 'artist'] });
      setOpen(false);
      if (artist && setArtist) setArtist(undefined);
    },
    onError: (error) => {
      console.log(error);
      if (artist) {
        toast.error(t('updateFailed'));
      } else {
        toast.error(t('addFailed'));
      }
    },
  });

  return (
    <DispDialog
      open={open}
      setOpen={(open) => {
        setOpen(open);
        if (!open && artist && setArtist) {
          setArtist(undefined);
        }
      }}
      title={artist ? t('update') : t('add')}
      className="sm:max-w-2xl"
    >
      <Form {...form}>
        <form
          id={artist ? `form-artist-cou-mnt-update-${artist.id}` : 'form-artist-cou-mnt-create'}
          onSubmit={form.handleSubmit((data) => {
            let payload: Partial<UseArtistCouMntSchemaType> = data;

            if (artist) {
              const original = {
                isPopular: artist.isPopular,
                name: artist.name,
                bio: artist.bio,
                avatar: artist.avatar,
              };
              payload = getChangedFields(original, data);
            }
            return executeSubmit(payload);
          })}
          className="flex flex-col gap-5 mt-2"
        >
          <UploadImage<UseArtistCouMntSchemaType> name="avatar" label={t('avatar')} />

          <InputText<UseArtistCouMntSchemaType>
            label={t('name')}
            name="name"
            inputProps={{
              placeholder: t('name'),
            }}
            required
          />

          <InputTextarea<UseArtistCouMntSchemaType>
            label={t('bio')}
            name="bio"
            isDebounce
            debounceDelay={500}
            textareaProps={{
              placeholder: t('bio'),
              className: 'h-20',
            }}
          />

          <InputCheckbox<UseArtistCouMntSchemaType> label={t('popular')} name="isPopular" />

          <div className="flex justify-end mt-5">
            <Button
              variant="primary"
              size="lg"
              className="font-semibold text-base"
              type="submit"
              isLoading={isLoadingSubmit}
              disabled={!form.formState.isDirty}
            >
              {t('save')}
            </Button>
          </div>
        </form>
      </Form>
    </DispDialog>
  );
}
