export function getAllDatesOfMonth(month, year) {
  const dates = [];
  const daysInMonth = new Date(year, month, 0).getDate();

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month - 1, day);
    const formattedDate = `${date.toLocaleString("default", {
      month: "short",
    })} ${day}`;
    dates.push({ day: formattedDate, date });
  }

  return dates;
}
