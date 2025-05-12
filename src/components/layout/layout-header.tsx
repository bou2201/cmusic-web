'use client';

import { ChevronLeftIcon, ChevronRightIcon, X } from 'lucide-react';
import {
  Button,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  InputSearch,
  Separator,
  SidebarTrigger,
} from '../ui';
import { useHistoryTracker } from '@/hooks/use-history-tracker';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useSearchHistory } from '@/hooks/use-search-history';
import { Routes } from '@/constants/routes';
import { NextIntl } from '~types/next-intl';
import { DialogState } from '~types/common';
import { useRouter } from '@/i18n/navigation';
import { useDebounce } from 'use-debounce';

function SearchDialog({ open, setOpen }: DialogState) {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchQueryDebounced] = useDebounce(searchQuery, 1000, { leading: true });

  const router = useRouter();
  const t = useTranslations<NextIntl.Namespace<'Header'>>('Header');
  const { searchHistory, addToHistory, clearHistory, deleteFromHistory } = useSearchHistory();

  const handleSubmit = (value: string) => {
    if (!value.trim()) return;
    addToHistory(value);
    router.push(`${Routes.Search}?q=${value}`);

    setOpen(false);
  };

  useEffect(() => {
    const handleUnmount = () => {
      setTimeout(() => {
        setSearchQuery('');
      }, 100);
    };
    if (!open) {
      handleUnmount();
    }
    return () => {
      handleUnmount();
    };
  }, [open]);

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput
        value={searchQuery}
        placeholder={t('search.placeholder')}
        onValueChange={setSearchQuery}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleSubmit(searchQuery);
          }
        }}
      />

      <CommandList>
        <CommandEmpty>{t('search.empty')}</CommandEmpty>
        {searchHistory.length > 0 ? (
          <CommandGroup heading={t('search.history')}>
            {searchHistory.map((item, index) => (
              <CommandItem
                key={item}
                className="!flex justify-between items-center !p-2 text-sm rounded-md cursor-pointer line-clamp-2"
                onSelect={() => {
                  handleSubmit(item);
                }}
              >
                <p>{item}</p>
                <Button
                  variant="ghost"
                  className="w-6 h-6"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    deleteFromHistory(item);
                  }}
                >
                  <X />
                </Button>
              </CommandItem>
            ))}
          </CommandGroup>
        ) : null}
      </CommandList>
    </CommandDialog>
  );
}

export function LayoutHeader() {
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  const t = useTranslations<NextIntl.Namespace<'Header'>>('Header');
  const { canGoBack, canGoForward, handleGoBack, handleGoForward } = useHistoryTracker();

  return (
    <>
      <section className="flex items-center justify-between gap-5">
        <div className="flex items-center gap-2">
          <SidebarTrigger
            className="cursor-pointer opacity-80 w-9 h-9"
            variant="secondary"
            size="icon"
          />
          <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
          <Button
            variant="outline"
            size="icon"
            className="cursor-pointer"
            disabled={!canGoBack}
            onClick={handleGoBack}
          >
            <ChevronLeftIcon className="!w-5 !h-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="cursor-pointer"
            disabled={!canGoForward}
            onClick={handleGoForward}
          >
            <ChevronRightIcon className="!w-5 !h-5" />
          </Button>
        </div>
        <InputSearch
          placeholder={t('search.placeholder')}
          onClick={() => {
            setOpenDialog(true);
          }}
          divClassName="bg-sidebar border-none rounded-full lg:w-96"
        />
      </section>

      <SearchDialog open={openDialog} setOpen={setOpenDialog} />
    </>
  );
}
