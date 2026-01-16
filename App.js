import { StyleSheet } from 'react-native';
import React from 'react';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import store from './Applications/redux/Store';
import UserList from './Applications/redux/UserList';
import UserDetails from './Applications/redux/UserDetails';
import CurrencyConverter from './Applications/CurrencyConverter/CurrencyConverter';
import HistoryScreen from './Applications/CurrencyConverter/HistoryScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="CurrencyConverter">
           <Stack.Screen name="CurrencyConverter" component={CurrencyConverter} options={{ title: 'Convertisseur de Devises' }} />
           <Stack.Screen name="HistoryScreen" component={HistoryScreen} options={{ title: 'Historique' }} />
          <Stack.Screen name="UserList" component={UserList} options={{ title: 'Users' }} />
          <Stack.Screen name="UserDetails" component={UserDetails} options={{ title: 'User Details' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
