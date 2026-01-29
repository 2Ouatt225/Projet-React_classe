import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Launcher from './Applications/react-native/Launcher';
import PageAcceuil from './Applications/react-native/pageAcceuil';
import Recherchedevise from './Applications/react-native/recherchedevise';
import HistoriqueTransaction from './Applications/react-native/Historique.transaction';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Launcher"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Launcher" component={Launcher} />
        <Stack.Screen name="PageAcceuil" component={PageAcceuil} />
        <Stack.Screen name="Recherchedevise" component={Recherchedevise} />
        <Stack.Screen name="HistoriqueTransaction" component={HistoriqueTransaction} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
