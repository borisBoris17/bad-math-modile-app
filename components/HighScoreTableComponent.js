import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

export default function HighScoreTableComponent({ highScores, gameType, thisScore }) {

  const theme = useTheme();

  const styles = StyleSheet.create({
    highScoreContainer: {
      flexDirection: 'row',
      width: '85%',
    },
    placeText: {
      minWidth: 50,
      margin: 5,
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.colors.secondary,
      textAlign: 'right',
    },
    nameText: {
      minWidth: 50,
      margin: 5,
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.colors.secondary,
      textAlign: 'left',
    },
    thisPlaceText: {
      fontSize: 30,
      color: theme.colors.primary,
      margin: 0
    },
    highScoreText: {
      flex: 1,
      marginHorizontal: 5,
      fontSize: 25,
      fontWeight: 'bold',
      color: theme.colors.secondary,
      textAlign: 'right',
    },
  });

  return (
    <React.Fragment>
      { highScores?.map((highScore, index) => (
        <View key={highScore.id} style={styles.highScoreContainer}>
          <Text style={[styles.placeText, thisScore && thisScore.id === highScore.id ? styles.thisPlaceText : '']}>{index + 1}.</Text>
          <Text style={[styles.nameText, thisScore && thisScore.id === highScore.id ? styles.thisPlaceText : '']}>{highScore.name}</Text>
          <Text style={[styles.highScoreText, thisScore && thisScore.id === highScore.id ? styles.thisPlaceText : '']}>{highScore.score}</Text>
        </View>
      ))}
    </React.Fragment>
  )
}