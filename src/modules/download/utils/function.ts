import { downloadService } from '../service';

export async function downloadTrack(url: string, name?: string) {
  // const encoded = encodeURIComponent(url);
  const res = downloadService.downloadTrack(url);

  console.log(res)
  const blob = await (res as unknown as Response).blob();

  const link = document.createElement('a');

  link.href = URL.createObjectURL(blob);
  link.download = `${name ?? 'audio'}.mp3`;
  link.click();
}
