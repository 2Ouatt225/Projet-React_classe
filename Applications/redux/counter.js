import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { increment, decrement } from './counterSlice';

export default function Counter() {
  const count = useSelector((state) => state.counter.value);
  const dispatch = useDispatch();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Redux Counter</Text>
      <View style={styles.counterContainer}>
        <Button 
          title="Decrement" 
          onPress={() => dispatch(decrement())} 
         
        />
        <Text style={styles.countText}>{count}</Text>
        <Button 
          title="Increment" 
          onPress={() => dispatch(increment())} 

        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  countText: {
    fontSize: 48,
    fontWeight: 'bold',
    marginHorizontal: 20,
    color: '#333',
  },
});