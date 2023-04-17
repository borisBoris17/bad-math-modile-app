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
      fontSize: 40,
      color: theme.colors.primary,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    highScoreContainer: {
      flexDirection: 'row',
      width: '85%',
    },
    scoreText: {
      minWidth: 50,
      margin: 5,
      fontSize: 30,
      fontWeight: 'bold',
      color: theme.colors.secondary,
      textAlign: 'right',
    },
    datePlayedText: {
      flex: 1,
      margin: 5,
      fontSize: 35,
      fontWeight: 'bold',
      color: theme.colors.secondary,
      textAlign: 'right',
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
      {highScores.map((highScore, index) => (
        <View key={highScore.id} style={styles.highScoreContainer}>
          <Text style={styles.scoreText}>{index + 1}.</Text>
          <Text style={styles.datePlayedText}>{highScore.score}</Text>
        </View>
      ))}
    </React.Fragment>
  )
}