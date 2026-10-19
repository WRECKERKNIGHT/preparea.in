/**
 * Format date for display in analytics
 */
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Format date for short display (e.g., x-axis labels)
 */
export function formatShortDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

/**
 * Format date for date picker inputs
 */
export function formatDateForInput(date: Date): string {
  return date.toISOString().split("T")[0];
}

/**
 * Parse date from string (YYYY-MM-DD)
 */
export function parseDate(dateString: string): Date {
  return new Date(dateString);
}

/**
 * Get date range for analytics (e.g., last 30 days)
 */
export function getDateRange(days: number): { start: Date; end: Date } {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - days + 1); // +1 to include the start date
  return { start, end };
}
