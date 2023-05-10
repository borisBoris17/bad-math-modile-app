import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Button, HelperText, Modal, Text, TextInput, useTheme } from 'react-native-paper';
import { runTransaction } from '../Utilities/dbUtils';
import { createScoreObj, validateAlphaString } from '../Utilities/utils';
import HighScoreTableComponent from './HighScoreTableComponent';
import { v4 as uuidv4 } from 'uuid';

export function GameResultComponent({ score, handlePlayAgain, db, gameType, navigation, savedScore }) {

  const [highScores, setHighScores] = useState([])
  const [openPostScore, setOpenPostScore] = useState(false)
  const [name, setName] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    setOpenPostScore(true)
    fetchHighScores()
  }, []);

  const fetchHighScores = async () => {
    const foundHighScores = await runTransaction(db, `SELECT * FROM SCORE where game_type = "${gameType}" order by score desc, date_played desc, id desc limit 10;`)
    setHighScores(foundHighScores)
  }

  const theme = useTheme();

  const styles = StyleSheet.create({
    container: {
      width: '100%',
      height: '100%',
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
      margin: '3%',
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

  const handlePostScore = () => {
    if (name.length > 25) {
      setErrorMsg('Name must be less than 25 letters.')
      return
    }
    if (!validateAlphaString(name)) {
      setErrorMsg('Name must be letters only.')
      return
    }
    setErrorMsg('')
    const scoreObj = createScoreObj(score, name, gameType)
    console.log('scoreObj', scoreObj)
    postScore(scoreObj)
    setOpenPostScore(false);
    // TODO: Implement Toast message
  }

  const postScore = async (scoreObj) => {
    console.log('scoreObj str', JSON.stringify(scoreObj))
    const strJSON = JSON.stringify(scoreObj)
    try {
      const response = await fetch('https://7zmgqfw2d1.execute-api.us-west-1.amazonaws.com/score',{
        method: 'POST',
        headers: {
          Accept: 'application/json',
        },
        body: strJSON,
      });
      const json = await response.json()
      console.log("response". json)
      return json;
    } catch (error) {
      console.error(error);
    }
  }

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
      <Modal visible={openPostScore} contentContainerStyle={styles.postScoreContainer} onDismiss={() => navigation.navigate('Home')}>
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
  )
}