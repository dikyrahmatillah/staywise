export const generateCalendarDates = (baseDate: Date): Date[] => {
  const year = baseDate.getFullYear();
  const month = baseDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDate = new Date(firstDay);
  const endDate = new Date(lastDay);

  startDate.setDate(startDate.getDate() - startDate.getDay());
  endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));

  const dates: Date[] = [];
  const current = new Date(startDate);

  while (current <= endDate) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  return dates;
};

export const formatDateKey = (date: Date): string =>
  date.toISOString().split("T")[0];

export const isCurrentMonth = (date: Date, baseDate: Date): boolean =>
  date.getMonth() === baseDate.getMonth();

export const isPastDate = (date: Date): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
};
