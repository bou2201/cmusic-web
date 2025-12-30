'use client';

import { DialogState } from '~types/common';
import { User, UserChangeStatusSchemaType, useUserChangeStatusSchema } from '../../types';
import { DispDialog, InputText } from '@/components/common';
import { useTranslations } from 'next-intl';
import { NextIntl } from '~types/next-intl';
import { Button, Form } from '@/components/ui';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from '@/modules/auth';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '../../service';

export function FormChangeStatus({ open, setOpen, user }: DialogState & { user: User }) {
  const t = useTranslations<NextIntl.Namespace<'UserPage.userMnt'>>('UserPage.userMnt');
  const schema = useUserChangeStatusSchema();
  const { user: admin } = useAuthStore((state) => state);
  const queryClient = useQueryClient();

  const form = useForm<UserChangeStatusSchemaType>({
    resolver: zodResolver(schema),
    values: {
      userId: user.id,
      isBlocked: user.isBlocked,
      adminId: admin?.id ?? '',
      description: '',
    },
  });

  const { mutate, isPending: isLoadingSubmit } = useMutation({
    mutationFn: (data: UserChangeStatusSchemaType) => userService.changeStatus(data),
  });

  return (
    <DispDialog
      open={open}
      setOpen={setOpen}
      title={user.isBlocked ? t('action.unblock') : t('action.block')}
      className="sm:max-w-2xl"
    >
      <Form {...form}>
        <form
          id={`form-change-status-${user.id}`}
          onSubmit={form.handleSubmit((data) => {})}
          className="flex flex-col gap-5 mt-2"
        >
          <InputText<UserChangeStatusSchemaType>
            label={t('changeStatus.description')}
            name="description"
            inputProps={{
              placeholder: t('changeStatus.description'),
            }}
            required
          />

          <div className="flex justify-end mt-10">
            <Button
              variant="primary"
              size="lg"
              className="font-semibold text-base"
              type="submit"
              isLoading={isLoadingSubmit}
            >
              {t('changeStatus.submit')}
            </Button>
          </div>
        </form>
      </Form>
    </DispDialog>
  );
}
