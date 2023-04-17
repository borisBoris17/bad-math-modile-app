import React from 'react';
import { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { useProblems } from '../hooks/useProblems';
import { GameResultComponent } from './GameResultComponent';
import { GameStartComponent } from './GameStartComponent';
import ProblemButtonComponent from './ProblemButtonComponent';
import { runTransaction } from '../Utilities/dbUtils';

export default function GameComponent({ navigation, gameType, startTime = 30, db }) {
  const [timer, setTimer] = useState(startTime)
  const [displayMessage, setDisplayMessage] = useState(false);
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const [startGame, setStartGame] = useState(false)
  const [problems, createNewProblems] = useProblems()

  useEffect(() => {
    if (!startGame) {
      return
    }
    if (timer <= 0) {
      finishGame()
      return;
    }
    const interval = setInterval(() => {
      const newTimer = timer - 1
      setTimer(newTimer)
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [timer, startGame]);

  const finishGame = async () => {
    await runTransaction(db, `INSERT INTO SCORE (GAME_TYPE, SCORE, DATE_PLAYED) VALUES ("${gameType}", ${score}, "${"2023-04-12"}");`)
    setGameOver(true)
  }

  const theme = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.primaryContainer,
      alignItems: 'center',
    },
    gameTitleContainer: {
      // marginVertical: '10%',
    },
    appTitle: {
      fontSize: 45,
      fontWeight: 'bold',
      color: theme.colors.primary,
    },
    timerContainer: {
      marginBottom: '10%',
    },
    appLogTop: {
      fontSize: 60,
      fontWeight: 'bold',
      color: theme.colors.primary,
    },
    appLogBottom: {
      fontSize: 45,
      fontWeight: 'bold',
      color: theme.colors.primary,
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
    gameText: {
      fontSize: 35,
      fontWeight: 'bold',
      textAlign: 'center'
    }
  });

  const handleProblemPress = (problem) => {
    if (!problem.isWrong) {
      setDisplayMessage(true)
    } else {
      createNewProblems()
      setScore(score + 1)
      setDisplayMessage(false)
      if (gameType === 'Survival') {
        setTimer(startTime)
      }
    }
  }

  const handlePlayAgain = () => {
    setTimer(startTime)
    setScore(0)
    setDisplayMessage('')
    setGameOver(false)
    setStartGame(false)
  }

  const handleStart = () => {
    setStartGame(true)
  }

  return (
    <View style={styles.container}>
      {gameOver ? <GameResultComponent score={score} handlePlayAgain={handlePlayAgain} db={db} gameType={gameType} /> :
        startGame ? <React.Fragment>
          <View style={styles.timerContainer}>
            <Text style={styles.appLogTop}>{timer}</Text>
          </View>
          <View style={styles.timerContainer}>
            <Text style={styles.appLogTop}>{score}</Text>
          </View>
          <View style={styles.timerContainer}>
            {displayMessage ? <Text style={styles.gameText}>{displayMessage} opps! that one is correct!</Text> : ''}
          </View>
          {
            problems?.map((problem, index) => <ProblemButtonComponent key={index} problem={problem} handleProblemPress={handleProblemPress} />)
          }
        </React.Fragment> :
          <GameStartComponent handleStart={handleStart} gameType={gameType} startTime={startTime} />
      }
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.buttonStyle} onPress={() => navigation.navigate('Home')}>
          <Text style={styles.buttonLabel}>Home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

