import Constants from 'expo-constants';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Provider, Text } from 'react-native-paper';
import HomeComponent from './components/HomeComponent';
import TimedGameComponent from './components/TimedGameComponent';
import SurvivalGameComponent from './components/SurvivalGameComponent';
import GameComponent from './components/GameComponent';

const Stack = createNativeStackNavigator();

export default function App() {

  const theme = {
    "colors": {
      "primary": "#FF720A",
      "onPrimary": "rgb(255, 255, 255)",
      "primaryContainer": "#fff5ee",
      "onPrimaryContainer": "rgb(0, 31, 39)",
      "secondary": "#d5edf1",
      "onSecondary": "rgb(255, 255, 255)",
      "secondaryContainer": "rgb(206, 230, 240)",
      "onSecondaryContainer": "rgb(6, 30, 37)",
      "tertiary": "#f7fbfc",
      "onTertiary": "rgb(255, 255, 255)",
      "tertiaryContainer": "rgb(223, 224, 255)",
      "onTertiaryContainer": "rgb(21, 25, 55)",
      "error": "rgb(186, 26, 26)",
      "onError": "rgb(255, 255, 255)",
      "errorContainer": "rgb(255, 218, 214)",
      "onErrorContainer": "rgb(65, 0, 2)",
      "background": "rgb(251, 252, 254)",
      "onBackground": "rgb(25, 28, 29)",
      "surface": "#c3dddf",
      "onSurface": "rgb(25, 28, 29)",
      "surfaceVariant": "rgb(219, 228, 232)",
      "onSurfaceVariant": "rgb(64, 72, 75)",
      "outline": "rgb(112, 120, 124)",
      "outlineVariant": "rgb(191, 200, 204)",
      "shadow": "rgb(0, 0, 0)",
      "scrim": "rgb(0, 0, 0)",
      "inverseSurface": "rgb(46, 49, 50)",
      "inverseOnSurface": "rgb(239, 241, 242)",
      "inversePrimary": "rgb(89, 213, 248)",
      "elevation": {
        "level0": "transparent",
        "level1": "rgb(238, 245, 248)",
        "level2": "rgb(231, 240, 244)",
        "level3": "rgb(223, 236, 240)",
        "level4": "rgb(221, 234, 239)",
        "level5": "rgb(216, 231, 236)"
      },
      "surfaceDisabled": "rgba(25, 28, 29, 0.12)",
      "onSurfaceDisabled": "rgba(25, 28, 29, 0.38)",
      "backdrop": "rgba(41, 50, 53, 0.4)"
    }
  }

  const styles = StyleSheet.create({
    statusBar: {
      height: Constants.statusBarHeight,
      backgroundColor: theme.colors.primaryContainer,
    },
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

  return (
    <Provider theme={theme}>
      <View style={styles.statusBar}></View>
      <NavigationContainer>
        <Stack.Navigator initialRouteName='Home'>
          <Stack.Screen
            options={{ headerShown: false }}
            name="Home">
            {(props) => <HomeComponent {...props} />}
          </Stack.Screen>
          <Stack.Screen
            options={{ headerShown: false }}
            name="TimedGame">
            {(props) => <GameComponent {...props} gameType='Timed' />}
          </Stack.Screen>
          <Stack.Screen
            options={{ headerShown: false }}
            name="SurvivalGame">
            {(props) => <GameComponent {...props} gameType='Survival' startTime={3} />}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

