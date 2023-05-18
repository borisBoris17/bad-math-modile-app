import React from 'react';
import { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Modal, Text, TextInput, useTheme, HelperText} from 'react-native-paper';
import { useProblems } from '../hooks/useProblems';
import { GameResultComponent } from './GameResultComponent';
import { GameStartComponent } from './GameStartComponent';
import ProblemButtonComponent from './ProblemButtonComponent';
import { runTransaction } from '../Utilities/dbUtils';
import { createScoreObj, validateAlphaString } from '../Utilities/utils';

export default function GameComponent({ navigation, gameType, startTime = 30, db }) {
  const [timer, setTimer] = useState(startTime)
  const [displayMessage, setDisplayMessage] = useState(false);
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const [startGame, setStartGame] = useState(false)
  const [problems, createNewProblems] = useProblems()
  const [savedScore, setSavedScore] = useState(undefined)
  const [postedScore, setPostedScore] = useState(undefined)
  const [openPostScore, setOpenPostScore] = useState(false)
  const [name, setName] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

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
    const savedScore = await runTransaction(db, `INSERT INTO SCORE (GAME_TYPE, SCORE, DATE_PLAYED) VALUES ("${gameType}", ${score}, "${"2023-04-12"}") RETURNING *;`)
    setSavedScore(savedScore[0]);
    setOpenPostScore(true)
  }

  const theme = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.primaryContainer,
      alignItems: 'center',
      width: '100%'
    },
    appTitle: {
      fontSize: 45,
      fontWeight: 'bold',
      color: theme.colors.primary,
    },
    timerContainer: {
      marginBottom: '10%',
    },
    messageContainer: {
      marginBottom: '5%',
      height: 100,
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
    gameContainer: {
      width: '100%',
      alignItems: 'center',
    },
    buttonContainer: {
      width: '90%',
      marginVertical: '3%',
    },
    homeButtonContainer: {
      width: '90%',
      marginVertical: '3%',
    },
    buttonStyle: {
      backgroundColor: theme.colors.primary,
      paddingVertical: 15,
      paddingHorizontal: 20,
      borderRadius: 15,
      margin: '3%'
    },
    buttonLabel: {
      fontSize: 35,
      color: theme.colors.onPrimary,
      textAlign: 'center',
    },
    gameText: {
      fontSize: 20,
      fontWeight: 'bold',
      textAlign: 'center',
      paddingHorizontal: 20,
    },
    postScoreContainer: {
      margin: '5%',
      backgroundColor: theme.colors.tertiary,
      height: '40%',
      width: '90%',
      borderRadius: 5,
    },
    modalTitleRow: {
      display: 'flex',
      flexDirection: 'row',
      borderBottomWidth: 3,
      borderBottomColor: theme.colors.primary,
      alignItems: 'center',
      width: '100%',
    },
    modalTitle: {
      flex: 1,
      fontSize: 24,
      borderBottomColor: theme.colors.primary,
      margin: 10
    },
    formContainer: {
      flex: 1,
      display: 'flex',
    },
    formElement: {
      marginHorizontal: '2%',
      marginVertical: '2%'
    },
    nameInputContainer: {
      flex: 1,
    }
  });

  const handleProblemPress = (problem) => {
    if (!problem.isWrong) {
      if (displayMessage) {
        setTimer(0)
        finishGame()
        return;
      }
      setDisplayMessage(true)
      if (gameType === 'Timed') {
        const newTime = timer - 2
        if (newTime <= 0) {
          finishGame()
          return;
        }
        setTimer(timer - 2)
      }
    } else {
      createNewProblems()
      setScore(score + 1)
      setDisplayMessage(false)
      if (gameType === 'Survival') {
        setTimer(startTime)
      } else {
        setTimer(timer + 1)
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

  const handlePostScore = () => {
    if (name.length > 15) {
      setErrorMsg('Name must be less than 15 letters.')
      return
    }
    if (!validateAlphaString(name)) {
      setErrorMsg('Name must be letters only.')
      return
    }
    setErrorMsg('')
    const scoreObj = createScoreObj(score, name, gameType)
    postScore(scoreObj)
    setOpenPostScore(false);
    setGameOver(true)
    setName('')
    // TODO: Implement Toast message
  }

  const postScore = async (scoreObj) => {
    try {
      const response = await fetch('https://7zmgqfw2d1.execute-api.us-west-1.amazonaws.com/score',{
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(scoreObj),
      });
      const json = await response.json()
      setPostedScore(json)
      return;
    } catch (error) {
      console.error(error);
    }
  }

  const handleDismissModal = () => {
    setOpenPostScore(false)
    setName('')
    setGameOver(true)
  }

  return (
    <View style={styles.container}>
      {gameOver ? <GameResultComponent score={score} handlePlayAgain={handlePlayAgain} db={db} gameType={gameType} navigation={navigation} savedScore={savedScore} postedScore={postedScore} /> :
        startGame ? <View style={styles.gameContainer}>
          <View style={styles.timerContainer}>
            <Text style={styles.appLogTop}>{timer}</Text>
          </View>
          <View style={styles.timerContainer}>
            <Text style={styles.appLogTop}>{score}</Text>
          </View>
          <View style={styles.messageContainer}>
            {displayMessage ? <View>
              <Text style={styles.gameText}>Oops! That one is correct! </Text>
              <Text style={styles.gameText}>Two wrong guesses in a row is game over!</Text>
              </View> : ''}
          </View>
          {
            problems?.map((problem, index) => <ProblemButtonComponent key={index} problem={problem} handleProblemPress={handleProblemPress} />)
          }
          <View style={styles.homeButtonContainer}>
            <TouchableOpacity style={styles.buttonStyle} onPress={() => navigation.navigate('Home')}>
              <Text style={styles.buttonLabel}>Home</Text>
            </TouchableOpacity>
          </View>
        </View> :
          <GameStartComponent handleStart={handleStart} gameType={gameType} startTime={startTime} navigation={navigation} />
      }
      <Modal visible={openPostScore} contentContainerStyle={styles.postScoreContainer} onDismiss={handleDismissModal}>
        <View style={styles.modalTitleRow}>
          <Text style={styles.modalTitle}>Post Score</Text>
        </View>
        <View style={styles.formContainer}>
          <View style={[styles.formElement, styles.nameInputContainer]}>
            <TextInput mode='outlined' label='Name' value={name} onChangeText={(text) => setName(text)} error={errorMsg.length > 0}></TextInput>
            {errorMsg.length > 0 ? <HelperText type="error" >
              {errorMsg}
            </HelperText> : null}
            <TextInput style={{marginVertical: '5%'}} disabled={true} mode='outlined' label='Score' value={score > 0 ? score : ' '}>{score}</TextInput>
          </View>
          <TouchableOpacity style={styles.buttonStyle} onPress={() => handlePostScore()}>
            <Text style={styles.buttonLabel}>Post Score</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

