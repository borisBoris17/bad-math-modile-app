import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

export function GameStartComponent({ handleStart, gameType, startTime }) {
  const theme = useTheme();

  const styles = StyleSheet.create({
    mainMessageContainer: {
      marginBottom: '10%',
    },
    gameText: {
      fontSize: 35,
      fontWeight: 'bold',
      textAlign: 'center',
      marginVertical: '3%',
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
        <Text style={styles.gameText}>{gameType}</Text>
      </View>
      <View style={styles.scoreContainer}>
        <Text style={styles.gameText}>Which Problem is incorrect?</Text>
        {gameType === 'Survival' ?
          <Text style={styles.gameText}>How many incorrect problems can you find? You only get {startTime} seconds for each problem!</Text>
          : <Text style={styles.gameText}>How many incorrect problems can you find in 30 seconds?</Text>
        }
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.buttonStyle} onPress={() => handleStart()}>
          <Text style={styles.buttonLabel}>Start</Text>
        </TouchableOpacity>
      </View>
    </React.Fragment>
  )
}