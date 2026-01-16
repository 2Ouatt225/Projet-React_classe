import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, TouchableOpacity, Modal, FlatList, ActivityIndicator, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { fetchRates, setBaseCurrency, setTargetCurrency, setAmount, convertCurrency } from './currencySlice';
import { useNavigation } from '@react-navigation/native';

export default function CurrencyConverter() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { rates, baseCurrency, targetCurrency, amount, result, lastUpdated, loading, error } = useSelector((state) => state.currency);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectionType, setSelectionType] = useState(null); // 'BASE' or 'TARGET'

  useEffect(() => {
    dispatch(fetchRates(baseCurrency));
  }, [dispatch, baseCurrency]);

  const handleConvert = () => {
    if (!amount) {
        Alert.alert("Erreur", "Veuillez saisir un montant.");
        return;
    }
    dispatch(convertCurrency());
  };

  const openSelection = (type) => {
    setSelectionType(type);
    setModalVisible(true);
  };

  const handleSelectCurrency = (currency) => {
    if (selectionType === 'BASE') {
      dispatch(setBaseCurrency(currency));
    } else {
      dispatch(setTargetCurrency(currency));
    }
    setModalVisible(false);
  };

  const renderCurrencyItem = ({ item }) => (
    <TouchableOpacity style={styles.modalItem} onPress={() => handleSelectCurrency(item)}>
      <Text style={styles.modalItemText}>{item}</Text>
    </TouchableOpacity>
  );

  const currencyList = Object.keys(rates).length > 0 ? Object.keys(rates) : ['USD', 'EUR', 'XOF', 'GBP', 'JPY', 'CAD'];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Convertisseur de devises</Text>

      {/* Inputs */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Montant</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={amount}
          onChangeText={(text) => dispatch(setAmount(text))}
          placeholder="Ex: 100"
        />
      </View>

      <View style={styles.row}>
        <View style={styles.currencyBlock}>
            <Text style={styles.label}>De</Text>
            <TouchableOpacity style={styles.picker} onPress={() => openSelection('BASE')}>
                <Text style={styles.pickerText}>{baseCurrency}</Text>
            </TouchableOpacity>
        </View>
        <View style={styles.currencyBlock}>
            <Text style={styles.label}>Vers</Text>
            <TouchableOpacity style={styles.picker} onPress={() => openSelection('TARGET')}>
                <Text style={styles.pickerText}>{targetCurrency}</Text>
            </TouchableOpacity>
        </View>
      </View>

      <View style={styles.buttonContainer}>
          <Button title="Convertir" onPress={handleConvert} />
      </View>

      {/* Results */}
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <View style={styles.resultContainer}>
          {result && (
            <>
                <Text style={styles.resultText}>{amount} {baseCurrency} = </Text>
                <Text style={styles.resultValue}>{result} {targetCurrency}</Text>
            </>
          )}
          {lastUpdated && <Text style={styles.dateText}>Mise à jour : {new Date(lastUpdated).toLocaleString()}</Text>}
          {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
      )}

      <View style={styles.historyButton}>
        <Button title="Voir l'historique" onPress={() => navigation.navigate('HistoryScreen')} color="gray" />
      </View>

      {/* Currency Selection Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Sélectionner une devise</Text>
          <FlatList
            data={currencyList}
            keyExtractor={(item) => item}
            renderItem={renderCurrencyItem}
            initialNumToRender={20}
          />
          <Button title="Fermer" onPress={() => setModalVisible(false)} color="red"/>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    marginTop: 20
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: '600'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    fontSize: 18,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  currencyBlock: {
    flex: 0.45,
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  pickerText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonContainer: {
      marginBottom: 20
  },
  resultContainer: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#e6f7ff',
    borderRadius: 10,
    marginBottom: 20
  },
  resultText: {
    fontSize: 18,
  },
  resultValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#007bff',
    marginVertical: 10
  },
  dateText: {
    fontSize: 12,
    color: 'gray',
    marginTop: 10,
  },
  errorText: {
    color: 'red',
    marginTop: 10,
  },
  historyButton: {
      marginTop: 10
  },
  // Modal Styles
  modalView: {
    flex: 1,
    marginTop: 50,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 15,
      textAlign: 'center'
  },
  modalItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalItemText: {
    fontSize: 18,
    textAlign: 'center',
  },
});
