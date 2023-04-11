import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

export default function HighScoreTableComponent({ highScores, gameType }) {

  const theme = useTheme();

  const styles = StyleSheet.create({
    highScoreTitleContainer: {
      margin: 10,
    },
    highScoreTitle: {
      fontSize: 28,
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
      {
        highScores?.length > 0 ?
          <View style={styles.highScoreTitleContainer}>
            <Text style={styles.highScoreTitle}>{`${gameType} High Scores`}</Text>
          </View>
          : ''
      }
      {highScores.map(highScore => (
        <View key={highScore.id} style={styles.highScoreContainer}>
          <Text style={styles.scoreText}>{highScore.score}</Text>
          <Text style={styles.datePlayedText}>{highScore.date_played}</Text>
        </View>
      ))}
    </React.Fragment>
  )
}