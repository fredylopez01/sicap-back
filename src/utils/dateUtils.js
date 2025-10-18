export const parseDateLocal = (dateString) => {
  if (!dateString) return new Date();

  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day); // month - 1 porque los meses empiezan en 0
};

export function getStartOfDay(dateObj) {
  return new Date(
    dateObj.getFullYear(),
    dateObj.getMonth(),
    dateObj.getDate(),
    0,
    0,
    0,
    0
  );
}

export function getEndOfDay(dateObj) {
  return new Date(
    dateObj.getFullYear(),
    dateObj.getMonth(),
    dateObj.getDate(),
    23,
    59,
    59,
    999
  );
}
