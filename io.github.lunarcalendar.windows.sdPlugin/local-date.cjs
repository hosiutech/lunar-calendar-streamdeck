function localDate(now) {
  return {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    day: now.getDate(),
    weekday: now.getDay()
  };
}

module.exports = { localDate };
