import uuid from 'react-native-uuid';

export const validateAlphaString = (str) => {
  return /^[A-Za-z]+$/.test(str);
}

export const createScoreObj = (score, name, gameType) => {
  const newId = uuid.v4()
  return {
    id: newId,
    score: score,
    name: name,
    gameType: gameType
  }
}

export function formatDateForQuery(date) {
  var d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2)
    month = '0' + month;
  if (day.length < 2)
    day = '0' + day;

  return [year, month, day].join('-');
}