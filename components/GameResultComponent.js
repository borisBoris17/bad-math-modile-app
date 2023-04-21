import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { runTransaction } from '../Utilities/dbUtils';
import HighScoreTableComponent from './HighScoreTableComponent';

export function GameResultComponent({ score, handlePlayAgain, db, gameType, navigation, savedScore }) {

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
    container: {
      display: 'flex',
    },
    mainMessageContainer: {
      marginVertical: '2%',
    },
    gameText: {
      fontSize: 35,
      fontWeight: 'bold',
      textAlign: 'center'
    },
    scoreContainer: {
      marginVertical: '2%',
    },
    buttonContainer: {
      margin: '3%',
    },
    homeButtonContainer: {
      margin: '3%',
      marginLeft: 'auto',
    },
    buttonStyle: {
      backgroundColor: theme.colors.primary,
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 15,
      width: '100%',
    },
    buttonLabel: {
      fontSize: 25,
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
    buttonsContainer: {
      display: 'flex',
      flexDirection: 'row',
      marginTop: 'auto',
    },
    highScoreTableContainer: {
      flex: 1,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.mainMessageContainer}>
        <Text style={styles.gameText}>Game Over!</Text>
      </View>
      <View style={styles.scoreContainer}>
        <Text style={styles.gameText}>Score: {score}</Text>
      </View>
      <View style={styles.highScoreTableContainer}>
        <HighScoreTableComponent gameType={gameType} highScores={highScores} thisScore={savedScore} />
      </View>
      <View style={styles.buttonsContainer}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.buttonStyle} onPress={() => handlePlayAgain()}>
            <Text style={styles.buttonLabel}>Replay</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.homeButtonContainer}>
          <TouchableOpacity style={styles.buttonStyle} onPress={() => navigation.navigate('Home')}>
            <Text style={styles.buttonLabel}>Home</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}