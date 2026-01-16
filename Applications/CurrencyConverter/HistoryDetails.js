import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, Platform, Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { deleteHistoryItem } from './currencySlice';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function HistoryDetails() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const route = useRoute();
  const { item } = route.params;

  const handleDelete = () => {
    Alert.alert(
      "Supprimer",
      "Voulez-vous vraiment supprimer cet élément de l'historique ?",
      [
        {
          text: "Annuler",
          style: "cancel"
        },
        { 
          text: "Supprimer", 
          style: "destructive",
          onPress: () => {
            dispatch(deleteHistoryItem(item.id));
            navigation.goBack();
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.card}>
            <Text style={styles.label}>Montant Converti</Text>
            <Text style={styles.mainValue}>{item.amount} {item.base}</Text>
            
            <View style={styles.divider} />
            
            <Text style={styles.label}>Résultat</Text>
            <Text style={styles.resultValue}>{item.result} {item.target}</Text>
            
            <View style={styles.divider} />

            <View style={styles.row}>
                <View>
                    <Text style={styles.label}>Taux (estimé)</Text>
                    <Text style={styles.subValue}>1 {item.base} ≈ {(item.result / item.amount).toFixed(4)} {item.target}</Text>
                </View>
                <View>
                     <Text style={styles.label}>Date</Text>
                     <Text style={styles.subValue}>{item.date}</Text>
                </View>
            </View>
        </View>

        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Text style={styles.deleteButtonText}>Supprimer cet historique</Text>
        </TouchableOpacity>
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
    padding: 20,
    justifyContent: 'center',
  },
  card: {
      backgroundColor: '#FFFFFF',
      borderRadius: 24,
      padding: 30,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 8,
      marginBottom: 30,
  },
  label: {
      fontSize: 14,
      color: '#6B7280',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      fontWeight: '600',
      marginBottom: 8,
  },
  mainValue: {
      fontSize: 24,
      fontWeight: '700',
      color: '#111827',
      marginBottom: 10,
  },
  resultValue: {
      fontSize: 36,
      fontWeight: '800',
      color: '#4F46E5',
      marginBottom: 10,
  },
  divider: {
      height: 1,
      backgroundColor: '#F3F4F6',
      marginVertical: 20,
  },
  row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
  },
  subValue: {
      fontSize: 16,
      color: '#374151',
      fontWeight: '500',
  },
  deleteButton: {
      backgroundColor: '#FEF2F2',
      paddingVertical: 18,
      borderRadius: 16,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: '#FEE2E2',
  },
  deleteButtonText: {
      color: '#EF4444',
      fontSize: 18,
      fontWeight: 'bold',
  }
});
