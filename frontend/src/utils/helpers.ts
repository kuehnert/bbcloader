const format = new Intl.DateTimeFormat('en-GB', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
});

export function formatDate(date: string | Date) {
  return format.format(new Date(date));
}

const twoDigits = (n: number) => (n < 10 ? `0${n}` : n);

export const formatEpisodeNumber = (video: { series: number; episodeNumber: number }) =>
  `S${twoDigits(video.series)}E${twoDigits(video.episodeNumber)}`;
