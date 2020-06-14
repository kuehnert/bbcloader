import { format } from 'date-fns';

export function formatDate(date: string | Date, formatStr = 'MM/yy') {
  return format(new Date(date), formatStr);
}

const twoDigits = (n: number) => (n < 10 ? `0${n}` : n);

export const formatEpisodeNumber = (video: { series: number; episodeNumber: number }) =>
  `S${twoDigits(video.series)}E${twoDigits(video.episodeNumber)}`;
