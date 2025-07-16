'use client';

import { DialogState } from '~types/common';
import { Genre, useGenreCouMntSchema, UseGenreCouMntSchemaType } from '../../types';
import { DispDialog, InputCheckbox, InputText, InputTextarea } from '@/components/common';
import { useTranslations } from 'next-intl';
import { NextIntl } from '~types/next-intl';
import { Button, Form } from '@/components/ui';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { genreService } from '../../service';
import { toast } from 'sonner';
import { getChangedFields } from '@/utiils/function';

type FormCouMntProps = DialogState & {
  genre?: Genre;
  setGenre?: (genre?: Genre) => void;
};

export function FormCouMnt({ open, setOpen, genre, setGenre }: FormCouMntProps) {
  const t = useTranslations<NextIntl.Namespace<'GenrePage.genreMnt.createOrUpdate'>>(
    'GenrePage.genreMnt.createOrUpdate',
  );
  const schema = useGenreCouMntSchema();
  const queryClient = useQueryClient();

  const form = useForm<UseGenreCouMntSchemaType>({
    resolver: zodResolver(schema),
    values: {
      isFeatured: genre?.isFeatured ?? false,
      name: genre?.name ?? '',
      description: genre?.description ?? undefined,
    },
  });

  const { mutate: executeSubmit, isPending: isLoadingSubmit } = useMutation({
    mutationFn: (data: Partial<UseGenreCouMntSchemaType>) =>
      genre
        ? genreService.updateGenre(genre.id, data)
        : genreService.createGenre(data as UseGenreCouMntSchemaType),
    onSuccess: () => {
      if (genre) {
        toast.success(t('updateSuccess'));
      } else {
        toast.success(t('addSuccess'));
      }

      queryClient.invalidateQueries({ queryKey: ['genres-mnt'] });
      setOpen(false);
      if (genre && setGenre) setGenre(undefined);
    },
    onError: (error) => {
      console.log(error);
      if (genre) {
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
        if (!open && genre && setGenre) {
          setGenre(undefined);
        }
      }}
      title={genre ? t('update') : t('add')}
      className="sm:max-w-2xl"
    >
      <Form {...form}>
        <form
          id={genre ? `form-genre-cou-mnt-update-${genre.id}` : 'form-genre-cou-mnt-create'}
          onSubmit={form.handleSubmit((data) => {
            let payload: Partial<UseGenreCouMntSchemaType> = data;

            if (genre) {
              const original = {
                isFeatured: genre.isFeatured,
                name: genre.name,
                description: genre.description,
              };
              payload = getChangedFields(original, data);
            }
            return executeSubmit(payload);
          })}
          className="flex flex-col gap-5 mt-2"
        >
          <InputText<UseGenreCouMntSchemaType>
            label={t('name')}
            name="name"
            inputProps={{
              placeholder: t('name'),
            }}
            required
          />

          <InputTextarea<UseGenreCouMntSchemaType>
            label={t('description')}
            name="description"
            isDebounce
            debounceDelay={500}
            textareaProps={{
              placeholder: t('description'),
              className: 'h-20',
            }}
          />

          <InputCheckbox<UseGenreCouMntSchemaType> label={t('featured')} name="isFeatured" />

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
