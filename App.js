import Constants from 'expo-constants';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet, View } from 'react-native';
import { Provider, Text, TextInput } from 'react-native-paper';
import HomeComponent from './components/HomeComponent';
import GameComponent from './components/GameComponent';
import { useEffect, useState } from 'react';
import * as SQLite from 'expo-sqlite'
import { initDatabase } from './Utilities/dbUtils';
import HighScoreScreenComponent from './components/HighScoreScreenComponent';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';

Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;
TextInput.defaultProps = TextInput.defaultProps || {};
TextInput.defaultProps.allowFontScaling = false;

const Stack = createNativeStackNavigator();

export default function App() {
  const [db, setDb] = useState(undefined)

  useEffect(() => {
    const newDb = SQLite.openDatabase('db.db');
    initDatabase(newDb)
    setDb(newDb)
  }, [])

  const theme = {
    "colors": {
      "primary": "#FF720A",
      "onPrimary": "rgb(255, 255, 255)",
      "primaryContainer": "#fff5ee",
      "onPrimaryContainer": "rgb(0, 31, 39)",
      "secondary": "#16537e",
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
    bannerStyle: {
      alignItems: 'center',
      backgroundColor: theme.colors.primaryContainer,
      paddingBottom: '5%',
    },
    safeAreaContainer: {
      flex: 1,
    },
    navigationContainer: {
      height: '90%',
      backgroundColor: theme.colors.primaryContainer,
    },
  });

  return (
    <Provider theme={theme}>
      <View style={styles.statusBar}></View>
      <NavigationContainer style={styles.navigationContainer}>
        <Stack.Navigator initialRouteName='Home'>
          <Stack.Screen
            options={{ headerShown: false }}
            name="Home">
            {(props) => <HomeComponent {...props} />}
          </Stack.Screen>
          <Stack.Screen
            options={{ headerShown: false }}
            name="TimedGame">
            {(props) => <GameComponent {...props} gameType='Timed' db={db} />}
          </Stack.Screen>
          <Stack.Screen
            options={{ headerShown: false }}
            name="SurvivalGame">
            {(props) => <GameComponent {...props} gameType='Survival' startTime={3} db={db} />}
          </Stack.Screen>
          <Stack.Screen
            options={{ headerShown: false }}
            name="HighScores">
            {(props) => <HighScoreScreenComponent {...props} db={db} />}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
      <View style={styles.bannerStyle}>
        <BannerAd
          unitId={process.env.NODE_ENV !== 'production' ? TestIds.BANNER : 'ca-app-pub-4235799806003930/1021392220'}
          size={BannerAdSize.BANNER}
          requestOptions={{
            requestNonPersonalizedAdsOnly: true
          }}
        />
      </View>
    </Provider>
  );
}

