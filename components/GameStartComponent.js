import React, { useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View, ScrollView } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

export function GameStartComponent({ handleStart, gameType, startTime, navigation, numGamesPosted, handleSecondPostedGame, canPostSecond }) {
  const theme = useTheme();

  const styles = StyleSheet.create({
    mainMessageContainer: {
      marginBottom: '10%',
    },
    gameTitleText: {
      fontSize: 40,
      fontWeight: 'bold',
      textAlign: 'center',
      marginTop: '3%',
      color: theme.colors.primary,
    },
    gameText: {
      fontSize: 30,
      fontWeight: 'bold',
      textAlign: 'center',
      marginVertical: '3%',
    },
    buttonContainer: {
      width: '98%',
      marginLeft: '1%',
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
      <ScrollView>
        <View style={styles.mainMessageContainer}>
          <Text style={styles.gameTitleText}>{gameType}</Text>
        </View>
        <View style={styles.scoreContainer}>
          <Text style={styles.gameText}>Which Problem is Incorrect?</Text>
          {gameType === 'Survival' ?
            <Text style={styles.gameText}>How many badMath problems can you find? Only {startTime} seconds to find it!</Text>
            : <Text style={styles.gameText}>How many badMath problems can you find in {startTime} seconds?</Text>
          }
          {canPostSecond ? <Text style={styles.gameText}>Post your second score of the day!</Text> : numGamesPosted === 1 ? <Text style={styles.gameText}>Watch an Ad to Post one more time?</Text> : <Text style={styles.gameText}>Post one Score a day!</Text>}
        </View>
        {numGamesPosted === 0 || canPostSecond ? <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.buttonStyle} onPress={() => handleStart(true)}>
            <Text style={styles.buttonLabel}>Start Posted Game</Text>
          </TouchableOpacity>
        </View> : numGamesPosted === 1 && !canPostSecond ? <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.buttonStyle} onPress={() => handleSecondPostedGame()}>
            <Text style={styles.buttonLabel}>Watch Ad!</Text>
          </TouchableOpacity>
        </View> : ''}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.buttonStyle} onPress={() => handleStart(false)}>
            <Text style={styles.buttonLabel}>Start Practice Game</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.buttonStyle} onPress={() => navigation.navigate('Home')}>
            <Text style={styles.buttonLabel}>Home</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </React.Fragment>
  )
}