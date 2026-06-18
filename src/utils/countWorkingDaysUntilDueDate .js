export const countWorkingDaysUntilDueDate = (
  dueDate,
  workingDays
) => {
  const dayMap = {
    sun: 0,
    mon: 1,
    tue: 2,
    wed: 3,
    thu: 4,
    fri: 5,
    sat: 6,
  };

  const allowedDays = workingDays.map(
    (day) => dayMap[day.toLowerCase()]
  );
  

  const startDate = new Date();
  const endDate = new Date(dueDate);

  startDate.setHours(0, 0, 0, 0);
  endDate.setHours(0, 0, 0, 0);

  let count = 0;

  const current = new Date(startDate);

  while (current <= endDate) {
    if (allowedDays.includes(current.getDay())) {
      count++;
    }

    current.setDate(current.getDate() + 1);
  }

  return count;
};