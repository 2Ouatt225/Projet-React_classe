import React, { useEffect, useState, useCallback, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, TextInput, ScrollView, Image, FlatList } from "react-native";
import { Svg, Path, Circle, Defs, LinearGradient, Stop } from "react-native-svg";
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from '@react-navigation/native';
import { getTransactions, initDB } from './database';
import { fetchSupportedCodes, fetchExchangeRate } from './api';

SplashScreen.preventAutoHideAsync();

// Helper to get currency symbol
const getCurrencySymbol = (code) => {
    const symbols = {
        USD: "$", EUR: "€", GBP: "£", JPY: "¥", CNY: "¥", KRW: "₩", INR: "₹",
        RUB: "₽", BRL: "R$", TRY: "₺", ZAR: "R", XOF: "CFA", XAF: "CFA",
        NGN: "₦", GHS: "₵", KES: "KSh", EGP: "E£", AUD: "A$", CAD: "C$",
        CHF: "Fr", HKD: "HK$", SGD: "S$", MXN: "Mex$", 
    };
    return symbols[code] || code.substring(0, 2);
};

// Helper: Generate chart path
const createPath = (data, width, height) => {
    if (!data || data.length === 0) return "";
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const points = data.map((val, index) => {
        const x = (index / (data.length - 1)) * width;
        const y = height - ((val - min) / range) * height;
        return { x, y };
    });
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
        const midX = (points[i - 1].x + points[i].x) / 2;
        const midY = (points[i - 1].y + points[i].y) / 2;
        d += ` Q ${points[i - 1].x} ${points[i - 1].y}, ${midX} ${midY}`;
        if (i === points.length - 1) d += ` T ${points[i].x} ${points[i].y}`;
    }
    return d;
};

const MiniChart = ({ data, color = "#00C853" }) => {
    if (!data || data.length < 2) return <View style={styles.chartContainer} />;
    const width = 100;
    const height = 40;
    const path = createPath(data, width, height);

    return (
        <View style={styles.chartContainer}>
            <Svg height={height} width={width} viewBox={`0 0 ${width} ${height}`}>
                <Defs>
                    <LinearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                        <Stop offset="0%" stopColor={color} stopOpacity="0.3" />
                        <Stop offset="100%" stopColor={color} stopOpacity="0" />
                    </LinearGradient>
                </Defs>
                <Path d={`${path} L ${width} ${height} L 0 ${height} Z`} fill="url(#gradient)" />
                <Path d={path} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <Circle cx={width} cy={height - ((data[data.length-1] - Math.min(...data))/(Math.max(...data)-Math.min(...data)||1))*height} r="3" fill={color} />
            </Svg>
        </View>
    );
};

export default function PageAcceuil({ navigation }) {
    const [fontsLoaded] = useFonts({
        'Rowdies-Regular': require('../../AssetsProjet/Font/Rowdies-Regular/rowdies/Rowdies-Regular.ttf'),
        'Rowdies-Bold': require('../../AssetsProjet/Font/Rowdies-Regular/rowdies/Rowdies-Bold.ttf'),
        'Rowdies-Light': require('../../AssetsProjet/Font/Rowdies-Regular/rowdies/Rowdies-Light.ttf'),
    });

    const [recentTransactions, setRecentTransactions] = useState([]);
    const [dailyCurrencies, setDailyCurrencies] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (fontsLoaded) {
            SplashScreen.hideAsync();
        }
    }, [fontsLoaded]);

    // Init Logic
    useEffect(() => {
        initDB();
        fetchDailyCurrencies();
    }, []);

    // Refresh History on Focus
    useFocusEffect(
        useCallback(() => {
            const all = getTransactions();
            setRecentTransactions(all.slice(0, 2)); // Top 2
        }, [])
    );

    const fetchDailyCurrencies = async () => {
        const codes = await fetchSupportedCodes();
        // Fallback for visual stability if cache/API totally empty for some reason
        if (!codes || codes.length === 0) return;

        // Shuffle and pick 3
        const shuffled = [...codes].sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 3);
        
        const enriched = [];
        for (const item of selected) {
            const rate = await fetchExchangeRate(item.code, 'USD'); // Baseline vs USD
            
            // Generate dummy history for graph if rate exists, else flat
            const history = [];
            let currentVal = rate || 1;
            for(let i=0; i<10; i++) {
                history.push(currentVal);
                currentVal = currentVal * (1 + (Math.random() * 0.02 - 0.01));
            }
            const changePercent = ((history[9] - history[0]) / history[0]) * 100;
            const changeSign = changePercent >= 0 ? "+" : "";

            enriched.push({
                id: item.code,
                code: item.code,
                rate: rate ? `$ ${rate.toFixed(4)}` : '...',
                change: `${changeSign}${changePercent.toFixed(2)}%`,
                history: history,
                isPositive: changePercent >= 0
            });
        }
        setDailyCurrencies(enriched);
    };

    const handleSearchSubmit = () => {
        if (!searchQuery.trim()) return;

        const isAmount = !isNaN(parseFloat(searchQuery)) && isFinite(searchQuery);

        if (isAmount) {
            // It's a number, go to Convert page
            navigation.navigate('PageConvert', { initialAmount: searchQuery });
        } else {
            // It's text (currency code or name), go to Rates page
            navigation.navigate('Recherchedevise', { initialSearch: searchQuery });
        }
        setSearchQuery('');
    };

    const renderCurrency = ({ item, index }) => {
        const isLast = index === dailyCurrencies.length - 1;
        const color = item.isPositive ? "#00C853" : "#FF3D00";

        return (
            <View style={[styles.currencyRow, isLast && { borderBottomWidth: 0 }]}>
                <View style={styles.iconContainer}>
                     <Text style={styles.currencySymbol}>{getCurrencySymbol(item.code)}</Text>
                </View>
                <Text style={styles.currencyCode}>{item.code}</Text>
                <MiniChart data={item.history} color={color} />
                <View style={styles.rateInfo}>
                    <Text style={[styles.percentageChange, { color }]}>{item.change}</Text>
                    <Text style={styles.rateText}>{item.rate}</Text>
                </View>
            </View>
        );
    };

    const renderHistory = ({ item }) => (
        <View style={styles.historyCard}>
            <Text style={styles.historyValue}>{item.fromAmount} {item.fromCurrency}</Text>
            <View style={styles.exchangeIconContainer}>
                <Ionicons name="swap-horizontal" size={16} color="white" />
            </View>
            <View style={styles.historyTarget}>
                <Text style={styles.historyAmount}>{item.toAmount}</Text>
                <Text style={styles.historyCurrency}>{item.toCurrency}</Text>
            </View>
        </View>
    );

    if (!fontsLoaded) return null;

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                {/* Back button logic: if this is main page, maybe it shouldn't go back, but following request */}
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Svg width="24" height="24" viewBox="0 0 20 20" fill="none">
                        <Path 
                            d="M17.3333 20V8.23529H5.1L9.9 12.4706L8.03333 14.1471L0 7.05882L8 0L9.9 1.67647L5.1 5.88235H20V20H17.3333Z" 
                            fill="#E1A246"
                        />
                    </Svg>
                </TouchableOpacity>
                <View style={styles.titleContainer}>
                    <Text style={styles.titleEasy}>Easy</Text>
                    <Text style={styles.titleChange}>Change</Text>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Search Bar - Visual only as per original design or functional if needed. Keeping visual for now */}
                <View style={styles.searchbarContainer}>
                    <TextInput
                        placeholder="Montant (ex: 100) ou Devise (ex: USD)"
                        placeholderTextColor="#51514f8d"
                        style={styles.searchbarInput}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        onSubmitEditing={handleSearchSubmit}
                        returnKeyType="search"
                    />
                    <TouchableOpacity onPress={handleSearchSubmit}>
                        <Ionicons name="search" size={20} color="#E1A247" style={styles.searchIcon} />
                    </TouchableOpacity>
                </View>

                {/* Feature Cards */}
                <View style={styles.featureCardsRow}>
                    <TouchableOpacity style={styles.featureCard} onPress={() => navigation.navigate('PageConvert')}>
                        <Image source={require('../../AssetsProjet/Image/coin2 Background Removed 1.png')} style={styles.featureIcon} resizeMode="contain" />
                        <Text style={styles.featureText}>Convertir</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.featureCard} onPress={() => navigation.navigate('HistoriqueTransaction')}>
                        <Image source={require('../../AssetsProjet/Image/k 1.png')} style={styles.featureIcon} resizeMode="contain" />
                        <Text style={styles.featureText}>Historique</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.featureCard} onPress={() => navigation.navigate('Recherchedevise')}>
                        <Image source={require('../../AssetsProjet/Image/images (4) Background Removed 1.png')} style={styles.featureIcon} resizeMode="contain" />
                        <Text style={styles.featureText}>Taux</Text>
                    </TouchableOpacity>
                </View>

                {/* Devise du jour */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Devise du jour</Text>
                </View>
                <View style={styles.currencyListCard}>
                    <FlatList
                        data={dailyCurrencies}
                        renderItem={renderCurrency}
                        keyExtractor={(item) => item.id}
                        scrollEnabled={false}
                    />
                </View>

                {/* Mini Historique */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Mini Historique</Text>
                </View>
                {recentTransactions.length > 0 ? (
                    <FlatList
                        data={recentTransactions}
                        renderItem={renderHistory}
                        keyExtractor={(item) => item.id && item.id.toString()}
                        scrollEnabled={false}
                        contentContainerStyle={{ width: '90%', alignSelf: 'center' }}
                    />
                ) : (
                    <Text style={{color:'#888', fontStyle:'italic'}}>Aucune transaction récente</Text>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        height: 60,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        backgroundColor: "transparent",
    },
    backButton: {
        padding: 5,
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    titleEasy: {
        fontSize: 24,
        fontFamily: 'Rowdies-Bold',
        color: '#000000',
    },
    titleChange: {
        fontSize: 24,
        fontFamily: 'Rowdies-Bold',
        color: '#E1A247',
    },
    scrollContent: {
        paddingBottom: 20,
        alignItems: 'center',
    },
    searchbarContainer: {
        width: '90%',
        height: 55,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderColor: '#ADADAD',
        borderWidth: 1,
        borderRadius: 30,
        paddingHorizontal: 20,
        marginVertical: 20,
    },
    searchbarInput: {
        flex: 1,
        fontSize: 16,
        color: '#000',
    },
    searchIcon: {
        marginLeft: 10,
    },
    featureCardsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '90%',
        marginBottom: 30,
    },
    featureCard: {
        width: '30%',
        aspectRatio: 0.9,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        padding: 12,
    },
    featureIcon: {
        width: '80%',
        height: '70%',
        marginBottom: 5,
    },
    featureText: {
        fontSize: 13,
        color: '#E1A247',
        fontFamily: 'Rowdies-Regular',
    },
    sectionHeader: {
        width: '90%',
        alignItems: 'flex-start',
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 20,
        fontFamily: 'Rowdies-Bold',
        color: '#000',
    },
    currencyListCard: {
        width: '90%',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 5,
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 15,
        marginBottom: 30,
    },
    currencyRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 20,
        minHeight: 70,
        borderBottomWidth: 1,
        borderBottomColor: '#E1A247',
    },
    iconContainer: {
        width: 45,
        height: 45,
        borderRadius: 22.5,
        backgroundColor: '#FFF8E1',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
        borderWidth: 1,
        borderColor: '#E1A247',
    },
    currencySymbol: {
        fontSize: 18,
        fontFamily: 'Rowdies-Bold',
        color: '#E1A247',
    },
    currencyCode: {
        fontSize: 20,
        fontFamily: 'Rowdies-Bold',
        color: '#000',
        width: 60,
    },
    chartContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 120,
    },
    rateInfo: {
        alignItems: 'flex-end',
    },
    percentageChange: {
        fontSize: 10,
        fontFamily: 'Rowdies-Regular',
        marginBottom: 4,
    },
    rateText: {
        fontSize: 18,
        fontFamily: 'Rowdies-Bold',
        color: '#000',
    },
    historyCard: {
        width: '100%',
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: '#E1A247',
        borderRadius: 15,
        paddingHorizontal: 20,
        marginBottom: 15,
    },
    historyValue: {
        fontSize: 18,
        fontFamily: 'Rowdies-Bold',
        color: '#000',
    },
    exchangeIconContainer: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#E1A247',
        alignItems: 'center',
        justifyContent: 'center',
    },
    historyTarget: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    historyAmount: {
        fontSize: 18,
        fontFamily: 'Rowdies-Bold',
        color: '#000',
        marginRight: 5,
    },
    historyCurrency: {
        fontSize: 18,
        fontFamily: 'Rowdies-Bold',
        color: '#E1A247',
    },
});