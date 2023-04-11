import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

export function GameResultComponent({score, handlePlayAgain}) {
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
  });

  return (
    <React.Fragment>
      <View style={styles.mainMessageContainer}>
        <Text style={styles.gameText}>Game Over!</Text>
      </View>
      <View style={styles.scoreContainer}>
        <Text style={styles.gameText}>Score: {score}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.buttonStyle} onPress={() => handlePlayAgain()}>
          <Text style={styles.buttonLabel}>Play Again</Text>
        </TouchableOpacity>
      </View>
    </React.Fragment>
  )
}