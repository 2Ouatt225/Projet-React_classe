import React from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Button } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { clearHistory } from './currencySlice';

export default function HistoryScreen() {
  const dispatch = useDispatch();
  const history = useSelector((state) => state.currency.history);

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
        <View style={styles.leftCol}>
            <Text style={styles.conversionText}>{item.amount} {item.base} ➔ {item.result} {item.target}</Text>
            <Text style={styles.dateText}>{item.date}</Text>
        </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
          <Text style={styles.header}>Historique</Text>
          {history.length > 0 && <Button title="Effacer" onPress={() => dispatch(clearHistory())} color="red" />}
      </View>
      
      {history.length === 0 ? (
        <Text style={styles.emptyText}>Aucun historique disponible.</Text>
      ) : (
        <FlatList
            data={history}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  itemContainer: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    marginVertical: 8,
    borderRadius: 8,
    borderLeftWidth: 5,
    borderLeftColor: '#007bff'
  },
  leftCol: {
      flex: 1
  },
  conversionText: {
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 5
  },
  dateText: {
      fontSize: 12,
      color: 'gray'
  },
  emptyText: {
      fontSize: 16,
      color: 'gray',
      textAlign: 'center',
      marginTop: 50
  }
});
