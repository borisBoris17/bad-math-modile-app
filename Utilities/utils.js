import uuid from 'react-native-uuid';

export const validateAlphaString = (str) => {
  console.log('str', str)
  console.log(/^[A-Za-z]+$/.test(str))
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