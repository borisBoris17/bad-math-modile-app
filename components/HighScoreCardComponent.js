import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';
import { runTransaction } from '../Utilities/dbUtils';
import HighScoreTableComponent from './HighScoreTableComponent';

export default function HighScoreCardComponent({ gameType, savedScore, db, postedScore }) {

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
    cardContainer: {
      marginVertical: 10,
      backgroundColor: 'white',
    },
    highScoreTitleContainer: {
      margin: 10,
    },
    highScoreTitle: {
      fontSize: 35,
      color: theme.colors.primary,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    highScoreGroupsButtonContainer: {
      display: 'flex',
      flexDirection: 'row',
      marginTop: 10,
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
    selectedHighScores: {
      color: theme.colors.onPrimary,
      padding: 5,
      fontSize: 18,
    },
    selectedHighScoresButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: 10,
    }
  });

  const displaySelectedHighScore = () => {
    if (viewedScore === 'lastDay') {
      return <HighScoreTableComponent gameType={gameType} highScores={lastDayHighScores} thisScore={postedScore} />
    } else if (viewedScore === '7Days') {
      return <HighScoreTableComponent gameType={gameType} highScores={lastSevenDaysHighScores} thisScore={postedScore} />
    } else if (viewedScore === '30Days') {
      return <HighScoreTableComponent gameType={gameType} highScores={lastThirtyDaysHighScores} thisScore={postedScore} />
    } else {
      return <HighScoreTableComponent gameType={gameType} highScores={highScores} thisScore={savedScore} />
    }
  }

  return (
    <Card style={styles.cardContainer}>
      <View style={styles.highScoreTitleContainer}>
        <Text style={styles.highScoreTitle}>{`${gameType} High Scores`}</Text>
      </View>
      <View style={styles.highScoreGroupsButtonContainer}>
        <TouchableOpacity style={[styles.highScoreGroupButtonStyle, viewedScore === 'mine' ? styles.selectedHighScoresButton : {}]} onPress={() => setViewedScore('mine')}>
          <Text style={[styles.highScoreGroupButtonTextStyle, viewedScore === 'mine' ? styles.selectedHighScores : {}]}>My Highs</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.highScoreGroupButtonStyle, viewedScore === 'lastDay' ? styles.selectedHighScoresButton : {}]} onPress={() => setViewedScore('lastDay')}>
          <Text style={[styles.highScoreGroupButtonTextStyle, viewedScore === 'lastDay' ? styles.selectedHighScores : {}]}>Past Day</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.highScoreGroupButtonStyle, viewedScore === '7Days' ? styles.selectedHighScoresButton : {}]} onPress={() => setViewedScore('7Days')}>
          <Text style={[styles.highScoreGroupButtonTextStyle, viewedScore === '7Days' ? styles.selectedHighScores : {}]}>Past 7 Days</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.highScoreGroupButtonStyle, viewedScore === '30Days' ? styles.selectedHighScoresButton : {}]} onPress={() => setViewedScore('30Days')}>
          <Text style={[styles.highScoreGroupButtonTextStyle, viewedScore === '30Days' ? styles.selectedHighScores : {}]}>Past 30 Days</Text>
        </TouchableOpacity>
      </View>
      <View>
        {displaySelectedHighScore()}
      </View>
    </Card>
  )
}