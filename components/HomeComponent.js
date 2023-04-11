import Constants from 'expo-constants';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Provider, Text, useTheme } from 'react-native-paper';

export default function HomeComponent({ navigation }) {

  const theme = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.primaryContainer,
      alignItems: 'center',
    },
    appTitleContainer: {
      marginVertical: '10%',
    },
    appTitle: {
      fontSize: 45,
      fontWeight: 'bold',
      color: theme.colors.primary,
    },
    appLogoContainer: {
      marginTop: '10%',
      marginBottom: '35%',
    },
    appLogoIcon: {
      width: 150,
      height: 150,
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
  });

  const onTimedPress = () => {
    navigation.navigate('TimedGame')
  }

  const onSurvivalPress = () => {
    navigation.navigate('SurvivalGame')
  }

  return (
    <View style={styles.container}>
      <View style={styles.appTitleContainer}>
        <Text style={styles.appTitle}>BadMath</Text>
      </View>
      <View style={styles.appLogoContainer}>
        <Image
          style={styles.appLogoIcon}
          source={require('../assets/badMathIcon.png')}
        />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.buttonStyle} onPress={onTimedPress}>
          <Text style={styles.buttonLabel}>Timed</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.buttonStyle} onPress={onSurvivalPress}>
          <Text style={styles.buttonLabel}>Survival</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.buttonStyle}>
          <Text style={styles.buttonLabel}>High Scores</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

