'use client';

import { Routes } from '@/constants/routes';
import { useSearchHistory } from '@/hooks/use-search-history';
import { useRouter } from '@/i18n/navigation';
import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';
import { DialogState } from '~types/common';
import { NextIntl } from '~types/next-intl';
import {
  Button,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  Skeleton,
} from '@/components/ui';
import Image from 'next/image';
import { X } from 'lucide-react';
import { Song, songService } from '@/modules/song';
import { Artist, artistService } from '@/modules/artist';
import { formatDuration, getArtistName } from '@/utiils/function';

function ResultSongSearched({ song, onClose }: { song: Song; onClose: () => void }) {
  const router = useRouter();

  return (
    <div
      key={song.id}
      className="!flex items-center gap-4 !p-2 text-sm rounded-md cursor-pointer hover:bg-accent hover:text-accent-foreground"
      onClick={() => {
        router.push(`${Routes.Songs}/${song.id}`);
        onClose();
      }}
    >
      <div className="w-10 h-10 rounded-full overflow-hidden shrink-0">
        <Image
          width={120}
          height={120}
          alt={song.title}
          src={song.cover ? song.cover.url : '/images/song-default-white.png'}
          className="object-cover w-full h-full"
        />
      </div>
      <div className="flex items-center justify-between gap-4 w-full">
        <div className="flex-1">
          <p className="font-semibold text-base line-clamp-2">{song.title}</p>
          <span className="opacity-70 text-[13px] truncate">
            {getArtistName(song.artist, song.artists)}
          </span>
        </div>
        <span className="font-semibold opacity-70">{formatDuration(song.duration)}</span>
      </div>
    </div>
  );
}

function ResultArtistSearched({ artist, onClose }: { artist: Artist; onClose: () => void }) {
  const t = useTranslations<NextIntl.Namespace<'Section'>>('Section');
  const router = useRouter();

  return (
    <div
      key={artist.id}
      className="!flex items-center gap-4 !p-2 text-sm rounded-md cursor-pointer hover:bg-accent hover:text-accent-foreground"
      onClick={() => {
        router.push(`${Routes.Artists}/${artist.id}`);
        onClose();
      }}
    >
      <div className="w-10 h-10 rounded-full overflow-hidden">
        <Image
          width={120}
          height={120}
          alt={artist.name}
          src={artist.avatar.url}
          className="object-cover w-full h-full"
        />
      </div>
      <div>
        <p className="font-semibold text-base">{artist.name}</p>
        <span className="opacity-70 text-[13px]">
          {t('artist.role')} ∙ {artist._count.followers} followers
        </span>
      </div>
    </div>
  );
}

function ResultSkeleton() {
  return (
    <div className="flex items-center space-x-4 p-2">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  );
}

export function LayoutSearchDialog({ open, setOpen }: DialogState) {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchQueryDebounced] = useDebounce(searchQuery, 300);

  const router = useRouter();
  const t = useTranslations<NextIntl.Namespace<'Header'>>('Header');
  const { searchHistory, addToHistory, clearHistory, deleteFromHistory } = useSearchHistory();

  const handleSubmit = (value: string) => {
    if (!value.trim()) return;
    addToHistory(value);
    router.replace(`${Routes.Search}?q=${value}`);

    setOpen(false);
  };

  const {
    data: songResults,
    isLoading: loadingSong,
    isSuccess: successSong,
  } = useQuery({
    queryKey: ['song', searchQueryDebounced],
    queryFn: () => songService.getListSong({ page: 1, limit: 10, search: searchQueryDebounced }),
    enabled: !!searchQueryDebounced,
  });

  const {
    data: artistResults,
    isLoading: loadingArtist,
    isSuccess: successArtist,
  } = useQuery({
    queryKey: ['artist', searchQueryDebounced],
    queryFn: () =>
      artistService.getListArtist({ page: 1, limit: 10, search: searchQueryDebounced }),
    enabled: !!searchQueryDebounced,
  });

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
        {!successSong && !loadingSong ? <CommandEmpty>{t('search.empty')}</CommandEmpty> : null}

        {loadingSong
          ? Array.from({ length: 3 }).map((_, index) => <ResultSkeleton key={index} />)
          : null}

        {songResults ? (
          <div className="flex flex-col px-2 py-1">
            <div className="text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-xs outline-hidden select-none pointer-events-none opacity-50">
              {t('search.resultSong')}
            </div>
            {songResults.meta.total > 0 ? (
              songResults?.data?.map((song) => (
                <ResultSongSearched
                  song={song}
                  key={song.id}
                  onClose={() => {
                    setOpen(false);
                  }}
                />
              ))
            ) : (
              <div className="py-6 text-center text-sm">{t('search.empty')}</div>
            )}
          </div>
        ) : null}

        {!successArtist && !loadingArtist ? <CommandEmpty>{t('search.empty')}</CommandEmpty> : null}

        {loadingArtist
          ? Array.from({ length: 3 }).map((_, index) => <ResultSkeleton key={index} />)
          : null}

        {artistResults ? (
          <div className="flex flex-col px-2 py-1">
            <div className="text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-xs outline-hidden select-none pointer-events-none opacity-50">
              {t('search.resultArtist')}
            </div>
            {artistResults.meta.total > 0 ? (
              artistResults?.data?.map((artist) => (
                <ResultArtistSearched
                  artist={artist}
                  key={artist.id}
                  onClose={() => {
                    setOpen(false);
                  }}
                />
              ))
            ) : (
              <div className="py-6 text-center text-sm">{t('search.empty')}</div>
            )}
          </div>
        ) : null}

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
