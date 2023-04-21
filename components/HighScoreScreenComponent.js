import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { runTransaction } from "../Utilities/dbUtils";
import HighScoreTableComponent from "./HighScoreTableComponent";


export default function HighScoreScreenComponent({ navigation, db }) {
  const [timedHighScores, setTimedHighScores] = useState([])
  const [survivalHighScores, setSurvivalHighScores] = useState([])

  const theme = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.primaryContainer,
      alignItems: 'center',
    },
    scrollContainer: {
      backgroundColor: theme.colors.primaryContainer,
      alignItems: 'center',
    },
    scoresTitleContainer: {
      textAlign: 'center',
      margin: 20,
    },
    scoresTitle: {
      fontWeight: 'bold',
      fontSize: 35,
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
  })

  useEffect(() => {
    fetchHighScores()
  })

  const fetchHighScores = async () => {
    const timedHS = await runTransaction(db, `SELECT * FROM SCORE where game_type = "Timed" order by score desc, date_played desc, id desc limit 10;`)
    const survivalHS = await runTransaction(db, `SELECT * FROM SCORE where game_type = "Survival" order by score desc, date_played desc, id desc limit 10;`)
    setTimedHighScores(timedHS)
    setSurvivalHighScores(survivalHS)
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <HighScoreTableComponent gameType="Timed" highScores={timedHighScores} />
        <HighScoreTableComponent gameType="Survival" highScores={survivalHighScores} />
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.buttonStyle} onPress={() => navigation.navigate('Home')}>
            <Text style={styles.buttonLabel}>Home</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  )
}