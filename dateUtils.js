function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Месяцы начинаются с 0
  const day = String(date.getDate()).padStart(2, "0");

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// Функция для проверки, прошло ли 24 часа с eventDate
function has24HoursPassed(eventDateStr) {
  const eventDate = new Date(eventDateStr);
  const currentDate = new Date();

  // Вычисление разницы в миллисекундах
  const differenceInMilliseconds = currentDate - eventDate;

  // Преобразование разницы в часы
  return (differenceInHours = Math.floor(
    differenceInMilliseconds / (1000 * 60 * 60)
  ));
}

// Функция для проверки, прошло ли 24 часа с eventDate
function exactMinutesPassed(eventDateStr) {
  const eventDate = new Date(eventDateStr);
  const currentDate = new Date();

  console.log(
    "current time: " + currentDate + "   ltRewardsAdded: " + eventDate
  );
  // Вычисление разницы в миллисекундах
  const differenceInMilliseconds = currentDate - eventDate;

  // Преобразование разницы в секунды
  return (differenceInHours = differenceInMilliseconds / 1000);
}

module.exports = exactMinutesPassed;
module.exports = formatDate;
module.exports = has24HoursPassed;
