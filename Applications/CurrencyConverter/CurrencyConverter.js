import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Modal, FlatList, ActivityIndicator, Alert, SafeAreaView, StatusBar, Platform, Image, Animated, Easing, Vibration, useColorScheme } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { fetchRates, setBaseCurrency, setTargetCurrency, setAmount, convertCurrency, swapCurrencies } from './currencySlice';
import { useNavigation } from '@react-navigation/native';
import { getCurrencyInfo, getFlagUrl } from './countryMapping';

export default function CurrencyConverter() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const colorScheme = useColorScheme(); // 'light' or 'dark'
  const isDark = colorScheme === 'dark';

  const { rates, baseCurrency, targetCurrency, amount, result, lastUpdated, loading, error } = useSelector((state) => state.currency);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectionType, setSelectionType] = useState(null); 
  const [searchText, setSearchText] = useState('');

  // Animation Values
  const spinValue = useRef(new Animated.Value(0)).current;
  const fadeResult = useRef(new Animated.Value(0)).current;

  // Colors based on theme
  const theme = {
      bg: isDark ? '#111827' : '#F3F4F6',
      card: isDark ? '#1F2937' : '#FFFFFF',
      text: isDark ? '#F9FAFB' : '#111827',
      subText: isDark ? '#9CA3AF' : '#6B7280',
      inputBorder: isDark ? '#374151' : '#E5E7EB',
      buttonBg: isDark ? '#374151' : '#F9FAFB',
      buttonBorder: isDark ? '#4B5563' : '#F3F4F6',
      accent: '#4F46E5', // Indigo
      modalOverlay: 'rgba(0,0,0,0.7)',
  };

  useEffect(() => {
    dispatch(fetchRates(baseCurrency));
  }, [dispatch, baseCurrency]);

  // Animate result opacity when it changes
  useEffect(() => {
      if (result) {
          fadeResult.setValue(0);
          Animated.timing(fadeResult, {
              toValue: 1,
              duration: 500,
              useNativeDriver: true,
          }).start();
      }
  }, [result]);

  const handleConvert = () => {
    if (!amount) {
        Alert.alert("Oups !", "Veuillez saisir un montant à convertir.");
        return;
    }
    Vibration.vibrate(10); // Haptic
    dispatch(convertCurrency());
  };

  const handleSwap = () => {
      Vibration.vibrate(10);
      
      // Animate Rotation
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 300,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start(() => spinValue.setValue(0));

      dispatch(swapCurrencies());
  };

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const openSelection = (type) => {
    setSelectionType(type);
    setSearchText(''); 
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

  const allCurrencies = Object.keys(rates).length > 0 ? Object.keys(rates) : ['USD', 'EUR', 'XOF', 'GBP', 'JPY', 'CAD'];

  const filteredCurrencies = allCurrencies.filter(code => {
      const info = getCurrencyInfo(code);
      const query = searchText.toLowerCase();
      return (
          code.toLowerCase().includes(query) ||
          info.name.toLowerCase().includes(query) ||
          info.countries.toLowerCase().includes(query)
      );
  });

  const renderCurrencyItem = ({ item }) => {
    const info = getCurrencyInfo(item);
    return (
        <TouchableOpacity style={[styles.modalItem, { borderBottomColor: theme.buttonBorder, backgroundColor: theme.card }]} onPress={() => handleSelectCurrency(item)}>
            <View style={styles.modalItemContent}>
                <Image 
                    source={{ uri: getFlagUrl(info.flagCode) }} 
                    style={styles.flagIconList}
                    resizeMode="cover"
                />
                <View style={styles.optionTextContainer}>
                    <Text style={[styles.modalItemCode, { color: theme.text }]}>{item}</Text>
                    <Text style={[styles.modalItemName, { color: theme.subText }]}>{info.name}</Text>
                    {info.countries !== "" && <Text style={[styles.modalItemCountry, { color: theme.subText }]} numberOfLines={1}>{info.countries}</Text>}
                </View>
                <Text style={styles.modalItemArrow}>→</Text>
            </View>
        </TouchableOpacity>
    );
  };

  const baseInfo = getCurrencyInfo(baseCurrency);
  const targetInfo = getCurrencyInfo(targetCurrency);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.bg }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={theme.bg} />
      <View style={styles.container}>
        
        <View style={styles.headerContainer}>
            <Text style={[styles.headerTitle, { color: theme.text }]}>Convertisseur</Text>
            <Text style={styles.headerSubtitle}>Taux de change en temps réel</Text>
        </View>

        <View style={[styles.card, { backgroundColor: theme.card }]}>
            
            <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: theme.subText }]}>Montant</Text>
                <TextInput
                    style={[styles.input, { color: theme.text, borderBottomColor: theme.inputBorder }]}
                    keyboardType="numeric"
                    value={amount}
                    onChangeText={(text) => dispatch(setAmount(text))}
                    placeholder="0.00"
                    placeholderTextColor={theme.subText}
                />
            </View>

            <View style={styles.currencyRow}>
                <TouchableOpacity style={[styles.currencyButton, { backgroundColor: theme.buttonBg, borderColor: theme.buttonBorder }]} onPress={() => openSelection('BASE')}>
                    <Text style={styles.currencyLabel}>De</Text>
                    <View style={styles.currencyValueContainer}>
                         <Image source={{ uri: getFlagUrl(baseInfo.flagCode) }} style={styles.flagIconSmall} />
                         <Text style={[styles.currencyValue, { color: theme.text }]}>{baseCurrency}</Text>
                    </View>
                    <Text style={styles.currencySub} numberOfLines={1}>{baseInfo.name}</Text>
                </TouchableOpacity>

                {/* Animated Swap Button */}
                <TouchableOpacity onPress={handleSwap} style={styles.swapButtonWrapper}>
                    <Animated.View style={[styles.swapIcon, { transform: [{ rotate: spin }] }]}>
                        <Text style={styles.swapText}>⇄</Text>
                    </Animated.View>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.currencyButton, { backgroundColor: theme.buttonBg, borderColor: theme.buttonBorder }]} onPress={() => openSelection('TARGET')}>
                    <Text style={styles.currencyLabel}>Vers</Text>
                    <View style={styles.currencyValueContainer}>
                         <Image source={{ uri: getFlagUrl(targetInfo.flagCode) }} style={styles.flagIconSmall} />
                         <Text style={[styles.currencyValue, { color: theme.text }]}>{targetCurrency}</Text>
                    </View>
                    <Text style={styles.currencySub} numberOfLines={1}>{targetInfo.name}</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.convertButton} onPress={handleConvert} activeOpacity={0.8}>
                <Text style={styles.convertButtonText}>Convertir maintenant</Text>
            </TouchableOpacity>

        </View>

        <View style={styles.resultArea}>
            {loading ? (
                <ActivityIndicator size="large" color={theme.accent} />
            ) : (
                <>
                    {result ? (
                        <Animated.View style={[styles.resultContainer, { opacity: fadeResult }]}>
                             <Text style={[styles.exchangeRateText, { color: theme.subText }]}>1 {baseCurrency} ≈ {(result / amount).toFixed(4)} {targetCurrency}</Text>
                             <Text style={[styles.finalResult, { color: theme.text }]}>{result} <Text style={[styles.currencySuffix, { color: theme.subText }]}>{targetCurrency}</Text></Text>
                             {lastUpdated && <Text style={styles.updateDate}>Mise à jour : {new Date(lastUpdated).toLocaleDateString()}</Text>}
                        </Animated.View>
                    ) : (
                         <Text style={[styles.placeholderText, { color: theme.subText }]}>Entrez un montant et appuyez sur convertir</Text>
                    )}
                     {error && <Text style={styles.errorText}>{error}</Text>}
                </>
            )}
        </View>

        <TouchableOpacity style={styles.historyLink} onPress={() => navigation.navigate('HistoryScreen')}>
            <Text style={styles.historyLinkText}>Voir l'historique récent</Text>
        </TouchableOpacity>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={[styles.modalOverlay, { backgroundColor: theme.modalOverlay }]}>
            <View style={[styles.modalContainer, { backgroundColor: theme.card }]}>
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, { color: theme.text }]}>Choisir une devise</Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                    <Text style={styles.closeButton}>✕</Text>
                </TouchableOpacity>
              </View>
              
              <View style={[styles.searchContainer, { backgroundColor: theme.bg }]}>
                  <Text style={styles.searchIcon}>🔍</Text>
                  <TextInput
                      style={[styles.searchInput, { color: theme.text }]}
                      placeholder="Rechercher (Pays, Devise, Code)..."
                      placeholderTextColor={theme.subText}
                      value={searchText}
                      onChangeText={setSearchText}
                      autoFocus={false}
                  />
              </View>

              <FlatList
                data={filteredCurrencies}
                keyExtractor={(item) => item}
                renderItem={renderCurrencyItem}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              />
            </View>
          </View>
        </Modal>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 40 : 20,
  },
  headerContainer: { marginBottom: 30, marginTop: 10 },
  headerTitle: { fontSize: 32, fontWeight: '800', marginBottom: 5 },
  headerSubtitle: { fontSize: 16, color: '#6B7280', fontWeight: '500' },
  card: {
      borderRadius: 24, padding: 24, marginBottom: 24,
      shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 8,
  },
  inputGroup: { marginBottom: 24 },
  label: { fontSize: 14, marginBottom: 8, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  input: { fontSize: 36, fontWeight: '700', borderBottomWidth: 2, paddingVertical: 8 },
  currencyRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 },
  currencyButton: { flex: 1, padding: 16, borderRadius: 16, alignItems: 'flex-start', borderWidth: 1 },
  currencyLabel: { fontSize: 12, color: '#6B7280', marginBottom: 8 },
  currencyValueContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  flagIconSmall: { width: 24, height: 18, borderRadius: 3, marginRight: 8 },
  currencyValue: { fontSize: 20, fontWeight: '700' },
  currencySub: { fontSize: 12, color: '#9CA3AF', width: '100%' },
  
  swapButtonWrapper: { marginHorizontal: 10 },
  swapIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#EEF2FF', justifyContent: 'center', alignItems: 'center' },
  swapText: { fontSize: 20, color: '#4F46E5', fontWeight: 'bold' },
  
  convertButton: {
      backgroundColor: '#4F46E5', paddingVertical: 18, borderRadius: 16, alignItems: 'center',
      shadowColor: '#4F46E5', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5,
  },
  convertButtonText: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
  resultArea: { alignItems: 'center', justifyContent: 'center', minHeight: 100 },
  placeholderText: { fontSize: 16 },
  resultContainer: { alignItems: 'center' },
  exchangeRateText: { fontSize: 14, marginBottom: 8 },
  finalResult: { fontSize: 42, fontWeight: '800' },
  currencySuffix: { fontSize: 24, fontWeight: '600' },
  updateDate: { fontSize: 12, color: '#9CA3AF', marginTop: 8 },
  errorText: { color: '#EF4444', marginTop: 10, fontSize: 14 },
  historyLink: { marginTop: 'auto', alignSelf: 'center', marginBottom: 20, padding: 10 },
  historyLinkText: { color: '#4F46E5', fontSize: 16, fontWeight: '600' },
  
  modalOverlay: { flex: 1, justifyContent: 'center', padding: 20 },
  modalContainer: { borderRadius: 24, height: '80%', padding: 24 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 22, fontWeight: 'bold' },
  closeButton: { fontSize: 24, color: '#9CA3AF', padding: 5 },
  searchContainer: { flexDirection: 'row', alignItems: 'center', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, marginBottom: 15 },
  searchIcon: { fontSize: 16, marginRight: 8 },
  searchInput: { flex: 1, fontSize: 16 },
  modalItem: { paddingVertical: 12, borderBottomWidth: 1 },
  modalItemContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  flagIconList: { width: 40, height: 30, borderRadius: 4, marginRight: 15, backgroundColor: '#E5E7EB' },
  optionTextContainer: { flex: 1 },
  modalItemCode: { fontSize: 18, fontWeight: '700' },
  modalItemName: { fontSize: 14 },
  modalItemCountry: { fontSize: 12, fontStyle: 'italic', marginTop: 2 },
  modalItemArrow: { fontSize: 18, color: '#D1D5DB' }
});
