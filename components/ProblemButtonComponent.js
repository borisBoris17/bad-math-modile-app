import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text, useTheme } from "react-native-paper";


export default function ProblemButtonComponent({problem, handleProblemPress}) {
  const theme = useTheme();

  const styles = StyleSheet.create({
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
    <View style={styles.buttonContainer}>
      <TouchableOpacity style={styles.buttonStyle} onPress={() => handleProblemPress(problem)}>
        <Text style={styles.buttonLabel}>{`${problem.x} ${problem.operation} ${problem.y} = ${problem.solution}`}</Text>
      </TouchableOpacity>
    </View>
  )
}