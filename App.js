// import { StyleSheet } from 'react-native';
// import React from 'react';
// import { Provider } from 'react-redux';
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import store from './Applications/redux/Store';
// import UserList from './Applications/redux/UserList';
// import UserDetails from './Applications/redux/UserDetails';
// import CurrencyConverter from './Applications/CurrencyConverter/CurrencyConverter';
// import HistoryScreen from './Applications/CurrencyConverter/HistoryScreen';
// import HistoryDetails from './Applications/CurrencyConverter/HistoryDetails';

// const Stack = createNativeStackNavigator();

// export default function App() {
//   return (
//     <Provider store={store}>
//       <NavigationContainer>
//         <Stack.Navigator initialRouteName="CurrencyConverter">
//            <Stack.Screen name="CurrencyConverter" component={CurrencyConverter} options={{ title: 'Convertisseur de Devises' }} />
//            <Stack.Screen name="HistoryScreen" component={HistoryScreen} options={{ title: 'Historique' }} />
//            <Stack.Screen name="HistoryDetails" component={HistoryDetails} options={{ title: 'Détails de la conversion' }} />
//           <Stack.Screen name="UserList" component={UserList} options={{ title: 'Users' }} />
//           <Stack.Screen name="UserDetails" component={UserDetails} options={{ title: 'User Details' }} />
//         </Stack.Navigator>
//       </NavigationContainer>
//     </Provider>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });

import React, { useEffect } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, StatusBar, Dimensions } from 'react-native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded] = useFonts({
    'Rowdies-Regular': require('./AssetsProjet/Font/Rowdies-Regular/rowdies/Rowdies-Regular.ttf'),
    'Rowdies-Bold': require('./AssetsProjet/Font/Rowdies-Regular/rowdies/Rowdies-Bold.ttf'),
    'Rowdies-Light': require('./AssetsProjet/Font/Rowdies-Regular/rowdies/Rowdies-Light.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  const handleStart = () => {
    // Navigation vers la page principale sera ajoutée plus tard
    console.log('Commencer');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.content}>
        {/* Logo EasyChange */}
        <View style={styles.logoContainer}>
          <Text style={styles.logoEasy}>Easy</Text>
          <Text style={styles.logoChange}>Change</Text>
        </View>

        {/* Image centrale */}
        <View style={styles.imageContainer}>
          <Image 
            source={require('./AssetsProjet/Image/imagestartpage.png')}
            style={styles.centralImage}
            resizeMode="contain"
          />
        </View>

        {/* Slogan */}
        <View style={styles.sloganContainer}>
          <Text style={styles.sloganText}>
            La conversion de devises simple, rapide et{' '}
            <Text style={styles.sloganHighlight}>fiable</Text>
          </Text>
        </View>

        {/* Bouton Commencer */}
        <TouchableOpacity 
          style={styles.startButton}
          onPress={handleStart}
          activeOpacity={0.8}
        >
          <Text style={styles.startButtonText}>Commencer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#FFFFF',
  },
  content: {
    flex: 1,
    width: '100%',
    height: SCREEN_HEIGHT,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,

  },
  logoEasy: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#00000',
    fontFamily: 'Rowdies-Bold',
  },
  logoChange: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#E1A247',
    fontFamily: 'Rowdies-Bold',

  },
  imageContainer: {
    width: '100%',
    height: 450,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,

  },
  centralImage: {
    width: '100%',
    height: '100%',
  },
  sloganContainer: {
    paddingHorizontal: 20,
    marginBottom: 50,
  },
  sloganText: {
    fontSize: 20,
    textAlign: 'center',
    color: '#000000',
    fontFamily: 'Rowdies-Regular',
    lineHeight: 28,
  },
  sloganHighlight: {
    color: '#E1A247',
    fontFamily: 'Rowdies-Bold',
  },
  startButton: {
    backgroundColor: '#E1A247',
    paddingVertical: 18,
    paddingHorizontal: 60,
    borderRadius: 12,
    width: '90%',
    maxWidth: 300,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#E1A247',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    marginBottom: 20,
  },
  startButtonText: {
    color: '#000000',
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Rowdies-Bold',
  },
});