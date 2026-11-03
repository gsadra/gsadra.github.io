const monthFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
});

/** "2026-11" → "Nov 2026" */
export function formatMonth(isoMonth: string): string {
  const [year, month] = isoMonth.split('-').map(Number);
  if (!year || !month) return isoMonth;
  return monthFormatter.format(new Date(Date.UTC(year, month - 1, 1)));
}

/** `datetime` attribute for a month-level date. */
export function monthDateTime(isoMonth: string): string {
  return /^\d{4}-\d{2}$/.test(isoMonth) ? `${isoMonth}-01` : isoMonth;
}

/** A project date is displayed at year precision in listings. */
export function formatYear(date: Date): string {
  return String(date.getUTCFullYear());
}

/** Full machine-readable date for <time datetime="...">. */
export function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

const fullDateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'UTC',
});

/** 2026-11-02 → "November 2, 2026" */
export function formatDate(date: Date): string {
  return fullDateFormatter.format(date);
}

/** Rough reading time in minutes, floored at one. */
export function readingTime(text: string | undefined, wordsPerMinute = 200): number {
  if (!text) return 1;
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / wordsPerMinute));
}
