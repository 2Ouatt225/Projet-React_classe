import React from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Button, SafeAreaView, Platform } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { clearHistory } from './currencySlice';

import { useNavigation } from '@react-navigation/native';

export default function HistoryScreen() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const history = useSelector((state) => state.currency.history);

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.historyCard} onPress={() => navigation.navigate('HistoryDetails', { item })}>
        <View style={styles.row}>
            <View>
                <Text style={styles.conversionTitle}>{item.amount} {item.base} → {item.result} {item.target}</Text>
                <Text style={styles.dateText}>{item.date}</Text>
            </View>
            <View style={styles.iconContainer}>
                 <Text style={styles.iconText}>➔</Text>
            </View>
        </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <Text style={styles.headerTitle}>Historique</Text>
                {history.length > 0 && (
                    <TouchableOpacity style={styles.clearButton} onPress={() => dispatch(clearHistory())}>
                        <Text style={styles.clearButtonText}>Tout effacer</Text>
                    </TouchableOpacity>
                )}
            </View>
            
            {history.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyIcon}>📂</Text>
                    <Text style={styles.emptyText}>Aucune conversion récente</Text>
                    <Text style={styles.emptySubtext}>Vos conversions apparaîtront ici.</Text>
                </View>
            ) : (
                <FlatList
                    data={history}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
      flex: 1,
      backgroundColor: '#F3F4F6',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 20 : 0,
  },
  headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 20,
      marginBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
  },
  clearButton: {
      paddingVertical: 8,
      paddingHorizontal: 16,
      backgroundColor: '#FEF2F2',
      borderRadius: 20,
      borderWidth: 1,
      borderColor: '#FEE2E2',
  },
  clearButtonText: {
      color: '#EF4444',
      fontWeight: '600',
      fontSize: 14,
  },
  listContent: {
      paddingBottom: 20,
  },
  historyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
  },
  conversionTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: '#1F2937',
      marginBottom: 4,
  },
  dateText: {
      fontSize: 12,
      color: '#9CA3AF',
  },
  iconContainer: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: '#EEF2FF',
      justifyContent: 'center',
      alignItems: 'center',
  },
  iconText: {
      color: '#4F46E5',
      fontWeight: 'bold',
  },
  emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: -50,
  },
  emptyIcon: {
      fontSize: 48,
      marginBottom: 20,
  },
  emptyText: {
      fontSize: 20,
      fontWeight: '600',
      color: '#374151',
      marginBottom: 8,
  },
  emptySubtext: {
      fontSize: 16,
      color: '#9CA3AF',
  }
});
