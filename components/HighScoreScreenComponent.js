import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { runTransaction } from "../Utilities/dbUtils";
import HighScoreCardComponent from "./HighScoreCardComponent";
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
      display: 'flex',
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

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <HighScoreCardComponent gameType="Timed" db={db} />
        <HighScoreCardComponent gameType="Survival" db={db} />
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.buttonStyle} onPress={() => navigation.navigate('Home')}>
            <Text style={styles.buttonLabel}>Home</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  )
}