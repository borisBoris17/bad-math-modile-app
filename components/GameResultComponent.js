import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Button, Card, HelperText, Modal, Text, TextInput, useTheme } from 'react-native-paper';
import { runTransaction } from '../Utilities/dbUtils';
import { createScoreObj, validateAlphaString } from '../Utilities/utils';
import HighScoreTableComponent from './HighScoreTableComponent';

export function GameResultComponent({ score, handlePlayAgain, db, gameType, navigation, savedScore }) {

  const [highScores, setHighScores] = useState([])
  const [viewedScore, setViewedScore] = useState('mine')
  const [lastDayHighScores, setLastDayHighScores] = useState([])
  const [lastSevenDaysHighScores, setLastSevenDaysHighScores] = useState([])
  const [lastThirtyDaysHighScores, setLastThirtyDaysHighScores] = useState([])

  useEffect(() => {
    fetchHighScores()
  }, []);

  const fetchHighScores = async () => {
    const foundHighScores = await runTransaction(db, `SELECT * FROM SCORE where game_type = "${gameType}" order by score desc, date_played desc, id desc limit 10;`)
    setHighScores(foundHighScores)
    fetch(`https://7zmgqfw2d1.execute-api.us-west-1.amazonaws.com/scores?gameType=${gameType}`)
      .then(response => response.json())
      .then(json => {
        setLastDayHighScores(json.lastDay)
        setLastSevenDaysHighScores(json.lastSevenDays)
        setLastThirtyDaysHighScores(json.lastThirtyDays)
      })
      .catch(error => {
        console.error(error);
      });
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
    cardContainer: {
      backgroundColor: 'white',
    },
    highScoreGroupsButtonContainer: {
      display: 'flex',
      flexDirection: 'row',
    },
    highScoreGroupButtonStyle: {
      // backgroundColor: theme.colors.primary,
      paddingVertical: 5,
      paddingHorizontal: '1.5%',
      borderRadius: 15,
      margin: '1%',
    },
    highScoreGroupButtonTextStyle: {
      fontSize: 15,
      // color: theme.colors.onPrimary,
      textAlign: 'center',
    },
  });

  const displaySelectedHighScore = () => {
    if (viewedScore === 'lastDay') {
      return <HighScoreTableComponent gameType={gameType} highScores={lastDayHighScores} thisScore={savedScore} />
    } else if (viewedScore === '7Days') {
      return <HighScoreTableComponent gameType={gameType} highScores={lastSevenDaysHighScores} thisScore={savedScore} />
    } else if (viewedScore === '30Days') {
      return <HighScoreTableComponent gameType={gameType} highScores={lastThirtyDaysHighScores} thisScore={savedScore} />
    } else  {
      return <HighScoreTableComponent gameType={gameType} highScores={highScores} thisScore={savedScore} />
    }
  }

  return (<ScrollView>
    <View style={styles.container}>
      <View style={styles.mainMessageContainer}>
        <Text style={styles.gameText}>Game Over!</Text>
      </View>
      <View style={styles.scoreContainer}>
        <Text style={styles.gameText}>Score: {score}</Text>
      </View>
      <Card style={styles.cardContainer}>
        <View style={styles.highScoreGroupsButtonContainer}>
        <TouchableOpacity style={styles.highScoreGroupButtonStyle }  onPress={() => setViewedScore('mine')}>
            <Text style={[styles.highScoreGroupButtonTextStyle, viewedScore === 'mine' ? {color: theme.colors.primary} : {}]}>My Highs</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.highScoreGroupButtonStyle} onPress={() => setViewedScore('lastDay')}>
            <Text style={[styles.highScoreGroupButtonTextStyle, viewedScore === 'lastDay' ? {color: theme.colors.primary} : {}]}>Past Day</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.highScoreGroupButtonStyle} onPress={() => setViewedScore('7Days')}>
            <Text style={[styles.highScoreGroupButtonTextStyle, viewedScore === '7Days' ? {color: theme.colors.primary} : {}]}>Past 7 Days</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.highScoreGroupButtonStyle} onPress={() => setViewedScore('30Days')}>
            <Text style={[styles.highScoreGroupButtonTextStyle, viewedScore === '30Days' ? {color: theme.colors.primary} : {}]}>Past 30 Days</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.highScoreTableContainer}>
          {displaySelectedHighScore()}
        </View>
      </Card>
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
  </ScrollView>
  )
}