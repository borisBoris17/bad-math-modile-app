import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { runTransaction } from '../Utilities/dbUtils';
import HighScoreTableComponent from './HighScoreTableComponent';

export function GameResultComponent({ score, handlePlayAgain, db, gameType }) {

  const [highScores, setHighScores] = useState([])

  useEffect(() => {
    fetchHighScores()
  }, []);

  const fetchHighScores = async () => {
    const foundHighScores = await runTransaction(db, `SELECT * FROM SCORE where game_type = "${gameType}" order by score desc, date_played desc, id desc limit 10;`)
    setHighScores(foundHighScores)
  }

  const theme = useTheme();

  const styles = StyleSheet.create({
    mainMessageContainer: {
      marginBottom: '10%',
    },
    gameText: {
      fontSize: 35,
      fontWeight: 'bold',
      textAlign: 'center'
    },
    buttonContainer: {
      width: '90%',
      marginVertical: '3%',
    },
    buttonStyle: {
      backgroundColor: theme.colors.primary,
      paddingVertical: 15,
      paddingHorizontal: 20,
      borderRadius: 15,
      width: '100%',
    },
    buttonLabel: {
      fontSize: 35,
      color: theme.colors.onPrimary,
      textAlign: 'center',
    },
    highScoreTitle: {
      fontSize: 28,
      margin: 10,
    },
    highScoreContainer: {
      flexDirection: 'row',
      width: '85%',
    },
    scoreText: {
      flex: 1,
      margin: 5,
      fontSize: 24,
      fontWeight: 'bold',
    },
    datePlayedText: {
      margin: 5,
      fontSize: 24,
      fontWeight: 'bold',
    },
  });

  return (
    <React.Fragment>
      <View style={styles.mainMessageContainer}>
        <Text style={styles.gameText}>Game Over!</Text>
      </View>
      <View style={styles.scoreContainer}>
        <Text style={styles.gameText}>Score: {score}</Text>
      </View>
      <HighScoreTableComponent gameType={gameType} highScores={highScores} />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.buttonStyle} onPress={() => handlePlayAgain()}>
          <Text style={styles.buttonLabel}>Play Again</Text>
        </TouchableOpacity>
      </View>
    </React.Fragment>
  )
}