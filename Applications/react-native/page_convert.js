import React, { useState, useEffect } from 'react';

import { StyleSheet, View, Text, TouchableOpacity, Image, Dimensions, SafeAreaView, Alert, Modal, FlatList, ActivityIndicator, TextInput } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Svg, { Path } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { fetchSupportedCodes, fetchExchangeRate } from './api';
import { initDB, addTransaction } from './database';

const { width } = Dimensions.get('window');

// SVG Components
const CompareArrowsIcon = ({ size = 24, color = "#E1A246" }) => (
    <Svg width={size} height={size} viewBox="0 0 100 100" fill="none">
        <Path d="M83.3333 66.6667L77.3958 72.5L66.6666 61.7709V91.6667H58.3333V61.7709L47.6041 72.5L41.6666 66.6667L62.5 45.8334L83.3333 66.6667ZM58.3333 33.3334L37.5 54.1667L16.6666 33.3334L22.6041 27.5L33.3333 38.2292V8.33336H41.6666V38.2292L52.3958 27.5L58.3333 33.3334Z" fill={color} />
    </Svg>
);

const SwapHorizontalCircleIcon = ({ size = 24, color = "white", bgColor = "#E1A246" }) => (
    <View style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: bgColor,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 3
    }}>
        <Svg width={size * 0.6} height={size * 0.6} viewBox="0 0 35 35" fill="none">
            <Path d="M13.125 26.25L15.1666 24.2083L12.9062 21.875H18.9583V18.9583H12.9062L15.1666 16.625L13.125 14.5833L7.29163 20.4167L13.125 26.25ZM21.875 20.4167L27.7083 14.5833L21.875 8.75L19.8333 10.7917L22.0937 13.125H16.0416V16.0417H22.0937L19.8333 18.375L21.875 20.4167ZM17.5 32.0833C15.4826 32.0833 13.5868 31.7005 11.8125 30.9349C10.0382 30.1693 8.49475 29.1302 7.18225 27.8177C5.86975 26.5052 4.83069 24.9618 4.06506 23.1875C3.29944 21.4132 2.91663 19.5174 2.91663 17.5C2.91663 15.4826 3.29944 13.5868 4.06506 11.8125C4.83069 10.0382 5.86975 8.4948 7.18225 7.1823C8.49475 5.8698 10.0382 4.83073 11.8125 4.06511C13.5868 3.29948 15.4826 2.91667 17.5 2.91667C19.5173 2.91667 21.4132 3.29948 23.1875 4.06511C24.9618 4.83073 26.5052 5.8698 27.8177 7.1823C29.1302 8.4948 30.1692 10.0382 30.9349 11.8125C31.7005 13.5868 32.0833 15.4826 32.0833 17.5C32.0833 19.5174 31.7005 21.4132 30.9349 23.1875C30.1692 24.9618 29.1302 26.5052 27.8177 27.8177C26.5052 29.1302 24.9618 30.1693 23.1875 30.9349C21.4132 31.7005 19.5173 32.0833 17.5 32.0833ZM17.5 29.1667C20.7569 29.1667 23.5156 28.0365 25.776 25.776C28.0364 23.5156 29.1666 20.7569 29.1666 17.5C29.1666 14.2431 28.0364 11.4844 25.776 9.22396C23.5156 6.96355 20.7569 5.83334 17.5 5.83334C14.243 5.83334 11.4843 6.96355 9.22392 9.22396C6.9635 11.4844 5.83329 14.2431 5.83329 17.5C5.83329 20.7569 6.9635 23.5156 9.22392 25.776C11.4843 28.0365 14.243 29.1667 17.5 29.1667Z" fill={color} />
        </Svg>
    </View>
);

const VectorIcon = ({ size = 24, color = "#E1A246" }) => (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
        <Path d="M17.3333 20V8.23529H5.1L9.9 12.4706L8.03333 14.1471L0 7.05882L8 0L9.9 1.67647L5.1 5.88235H20V20H17.3333Z" fill={color} />
    </Svg>
);

export default function PageConvert() {
    const navigation = useNavigation();
    const route = useRoute(); // Might need to import useRoute or get it from props if available
    const { initialAmount } = route.params || {};

    // Default Images (Placeholders)
    const xofFlag = require('./../../AssetsProjet/Image/coin2 Background Removed 1.png');
    const euroFlag = require('./../../AssetsProjet/Image/images (4) Background Removed 1.png');
    const defaultFlag = euroFlag; // Fallback

    // State
    const [sourceCurrency, setSourceCurrency] = useState({ 
        code: 'XOF', 
        flag: xofFlag, 
        amount: initialAmount || '1500' // Use param or default
    });
    const [targetCurrency, setTargetCurrency] = useState({ code: 'EUR', flag: euroFlag, amount: '...' });

    const [currencyList, setCurrencyList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectingSide, setSelectingSide] = useState(null); // 'source' or 'target'
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        initDB();
        loadCurrencies();
    }, []);

    const loadCurrencies = async () => {
        setIsLoading(true);
        const codes = await fetchSupportedCodes();
        setCurrencyList(codes);
        setIsLoading(false);
    };

    const handleSwap = () => {
        const tempSource = { ...sourceCurrency };
        const tempTarget = { ...targetCurrency };

        setSourceCurrency({
            code: tempTarget.code,
            amount: tempSource.amount, // Keep the input amount constant
            flag: tempTarget.flag
        });
        setTargetCurrency({
            code: tempSource.code,
            amount: '...',
            flag: tempSource.flag
        });

        // Trigger conversion logic immediately after swap
        // New Source Code = tempTarget.code
        // New Target Code = tempSource.code
        // Amount = tempSource.amount (preserved)
        performConversion(tempTarget.code, tempSource.code, tempSource.amount, false); // false = don't save history
    };

    const handleSourcePress = () => {
        setSelectingSide('source');
        setModalVisible(true);
    };

    const handleTargetPress = () => {
        setSelectingSide('target');
        setModalVisible(true);
    };

    const handleSelectCurrency = (currency) => {
        // Use flagcdn for dynamic flags, with fallback for specific design assets
        let newFlag = { uri: `https://flagcdn.com/w80/${currency.code.slice(0, 2).toLowerCase()}.png` };

        if (currency.code === 'XOF') newFlag = xofFlag;
        if (currency.code === 'EUR') newFlag = euroFlag;

        if (selectingSide === 'source') {
            setSourceCurrency(prev => ({ ...prev, code: currency.code, flag: newFlag }));
            // If source changes, recalculate target
            performConversion(currency.code, targetCurrency.code, sourceCurrency.amount, false);
        } else {
            setTargetCurrency(prev => ({ ...prev, code: currency.code, flag: newFlag }));
            // If target changes, recalculate target
            performConversion(sourceCurrency.code, currency.code, sourceCurrency.amount, false);
        }
        setModalVisible(false);
        setSearchQuery('');
    };

    const performConversion = async (baseCode, targetCode, amount, saveToHistory = true) => {
        if (!amount || isNaN(parseFloat(amount))) {
            setTargetCurrency(prev => ({ ...prev, amount: '...' }));
            return;
        }
        setIsLoading(true);
        const rate = await fetchExchangeRate(baseCode, targetCode);
        if (rate) {
            const converted = (parseFloat(amount) * rate).toFixed(4);
            setTargetCurrency(prev => ({ ...prev, code: targetCode, amount: converted }));
            
            if (saveToHistory) {
                addTransaction(amount, baseCode, converted, targetCode);
            }
        } else {
            Alert.alert("Erreur de conversion", "Impossible d'obtenir le taux de change.");
            setTargetCurrency(prev => ({ ...prev, amount: 'Erreur' }));
        }
        setIsLoading(false);
    };

    const handleConvertPress = () => {
        performConversion(sourceCurrency.code, targetCurrency.code, sourceCurrency.amount, true);
    };

    const filteredCurrencies = currencyList.filter(c =>
        c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <VectorIcon size={30} color="#E1A246" />
                </TouchableOpacity>
                <View style={styles.logoContainer}>
                    <Text style={styles.logoEasy}>Easy</Text>
                    <Text style={styles.logoChange}>Change</Text>
                </View>
            </View>

            <View style={styles.content}>

                {/* Conversion Card */}
                <View style={styles.cardWrapper}>
                    <View style={styles.cardContainer}>

                        {/* Source Currency */}
                        <TouchableOpacity
                            style={styles.currencySection}
                            onPress={handleSourcePress}
                            activeOpacity={0.7}
                        >
                            <Image
                                source={sourceCurrency.flag}
                                style={styles.flagImage}
                                resizeMode="contain"
                            />
                            <Text style={styles.currencyCode}>{sourceCurrency.code}</Text>
                            <Ionicons name="caret-down" size={16} color="black" />
                        </TouchableOpacity>

                        {/* Target Currency */}
                        <TouchableOpacity
                            style={styles.currencySection}
                            onPress={handleTargetPress}
                            activeOpacity={0.7}
                        >
                            <Text style={[styles.currencyCode, { color: '#E1A246' }]}>{targetCurrency.code}</Text>
                            <Image
                                source={targetCurrency.flag}
                                style={styles.flagImage}
                                resizeMode="contain"
                            />
                        </TouchableOpacity>

                    </View>

                    {/* Swap Icon Button */}
                    <TouchableOpacity
                        style={styles.swapIconContainer}
                        onPress={handleSwap}
                        activeOpacity={0.9}
                    >
                        <SwapHorizontalCircleIcon size={50} />
                    </TouchableOpacity>
                </View>

                {/* Values Display as FlatList */}
                <View style={[styles.valueContainer, { flex: 1 }]}>
                    <FlatList
                        data={[{ id: 'source' }, { id: 'target' }]}
                        keyExtractor={(item) => item.id}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
                        renderItem={({ item }) => {
                            if (item.id === 'source') {
                                return (
                                    <View style={styles.rowValueContainer}>
                                        <TextInput
                                            style={[styles.bigValueText, { maxWidth: '80%' }]} // Limit width
                                            value={sourceCurrency.amount}
                                            onChangeText={(text) => setSourceCurrency({ ...sourceCurrency, amount: text })}
                                            keyboardType="numeric"
                                            placeholder="0"
                                            numberOfLines={1}
                                        // Note: adjustsFontSizeToFit on TextInput is iOS only usually or finicky. 
                                        // We focus on layout stability first.
                                        />
                                        <Text style={styles.currencySuffix}>{sourceCurrency.code}</Text>
                                    </View>
                                );
                            } else {
                                return (
                                    <View style={styles.rowValueContainer}>
                                        <Text
                                            style={[styles.bigValueText, { maxWidth: '80%' }]}
                                            numberOfLines={1}
                                            adjustsFontSizeToFit
                                            minimumFontScale={0.5} // Allow shrinking down to 50%
                                        >
                                            {isLoading ? <ActivityIndicator color="#E1A246" /> : targetCurrency.amount}
                                        </Text>
                                        <Text style={[styles.currencySuffix, { color: '#E1A246' }]}>{targetCurrency.code}</Text>
                                    </View>
                                );
                            }
                        }}
                        ItemSeparatorComponent={() => (
                            <View style={styles.arrowIconContainer}>
                                <CompareArrowsIcon size={120} />
                            </View>
                        )}
                    />
                </View>

                {/* Bottom Button */}
                <View style={styles.bottomContainer}>
                    <TouchableOpacity
                        style={styles.convertButton}
                        onPress={handleConvertPress}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.convertButtonText}>CONVERTIR</Text>
                    </TouchableOpacity>
                </View>

            </View>

            {/* Currency Selection Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Choisir une devise</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <Ionicons name="close" size={24} color="black" />
                            </TouchableOpacity>
                        </View>

                        <TextInput
                            style={styles.searchInput}
                            placeholder="Rechercher..."
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />

                        {isLoading ? (
                            <ActivityIndicator size="large" color="#E1A246" style={{ marginTop: 20 }} />
                        ) : (
                            <FlatList
                                data={filteredCurrencies}
                                keyExtractor={(item) => item.code}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={styles.currencyItem}
                                        onPress={() => handleSelectCurrency(item)}
                                    >
                                        <Image
                                            source={{ uri: `https://flagcdn.com/w40/${item.code.slice(0, 2).toLowerCase()}.png` }}
                                            style={styles.listItemFlag}
                                        />
                                        <Text style={styles.currencyItemCode}>{item.code}</Text>
                                        <Text style={styles.currencyItemName}>{item.name}</Text>
                                    </TouchableOpacity>
                                )}
                            />
                        )}
                    </View>
                </View>
            </Modal>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 20,
        marginTop: 30, // Added margin for better visibility
    },
    backButton: {
        padding: 5,
    },
    logoContainer: {
        flexDirection: 'row',
    },
    logoEasy: {
        fontSize: 20,
        fontFamily: 'Rowdies-Bold',
        color: '#000000',
    },
    logoChange: {
        fontSize: 20,
        fontFamily: 'Rowdies-Bold',
        color: '#E1A246',
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
        alignItems: 'center',
        paddingTop: 40,
    },
    cardWrapper: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 50,
        position: 'relative',
        zIndex: 1,
    },
    cardContainer: {
        width: '100%',
        height: 80,
        borderWidth: 2,
        borderColor: '#E1A246',
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
        backgroundColor: '#FFFFFF',
    },
    currencySection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    placeholderFlag: {
        width: 30,
        height: 20,
        backgroundColor: '#ccc',
        borderRadius: 2,
    },
    flagImage: {
        width: 40,
        height: 30,
    },
    currencyCode: {
        fontSize: 16,
        fontFamily: 'Rowdies-Bold',
        color: '#000000',
    },
    swapIconContainer: {
        position: 'absolute',
        bottom: -25,
        zIndex: 2,
    },
    valueContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        gap: 10,
    },
    rowValueContainer: {
        flexDirection: 'row',
        alignItems: 'center', // Changed from baseline for stability
        gap: 10,
        justifyContent: 'center',
        minHeight: 80, // Ensure fixed height to prevent jumping
        width: '100%',
    },
    bigValueText: {
        fontSize: 48,
        fontFamily: 'Rowdies-Bold',
        color: '#000000',
        textAlign: 'center',
        // Removed maxWidth constraint here, handled in render if needed, but flex is better
    },
    currencySuffix: {
        fontSize: 24, // Increased size to match big text better
        fontFamily: 'Rowdies-Bold',
        color: '#E1A246',
    },
    arrowIconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 120, // Reserve fixed space for the icon
        marginVertical: 10,
    },
    bottomContainer: {
        width: '100%',
        marginTop: 'auto',
        marginBottom: 40,
    },
    convertButton: {
        backgroundColor: '#E1A246',
        borderRadius: 10,
        height: 65, // Increased height
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    convertButtonText: {
        color: '#000000',
        fontFamily: 'Rowdies-Bold',
        fontSize: 22, // Increased font size
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        height: '70%',
        padding: 20,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontFamily: 'Rowdies-Bold',
    },
    searchInput: {
        backgroundColor: '#f0f0f0',
        padding: 12,
        borderRadius: 10,
        marginBottom: 10,
        fontSize: 16,
    },
    currencyItem: {
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        flexDirection: 'row',
        alignItems: 'center',
    },
    currencyItemCode: {
        fontSize: 18,
        fontWeight: 'bold',
        width: 60,
    },
    currencyItemName: {
        fontSize: 16,
        color: '#555',
        flex: 1, // Allow name to wrap if needed
    },
    listItemFlag: {
        width: 30,
        height: 20,
        marginRight: 10,
        borderRadius: 2,
        backgroundColor: '#eee', // Placeholder color while loading
    }
});
