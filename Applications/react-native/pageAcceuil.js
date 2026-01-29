import React, { useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, TextInput, ScrollView, Image, FlatList } from "react-native";
import { Svg, Path, Circle, Defs, LinearGradient, Stop } from "react-native-svg";
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { Ionicons } from "@expo/vector-icons";

SplashScreen.preventAutoHideAsync();

const MiniChart = ({ color = "#00C853" }) => (
    <View style={styles.chartContainer}>
        <Svg height="40" width="100" viewBox="0 0 100 40">
            <Defs>
                <LinearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                    <Stop offset="0%" stopColor={color} stopOpacity="0.3" />
                    <Stop offset="100%" stopColor={color} stopOpacity="0" />
                </LinearGradient>
            </Defs>
            {/* Area Fill */}
            <Path
                d="M0 30 Q 15 15, 30 25 T 60 10 T 90 20 L 100 20 L 100 40 L 0 40 Z"
                fill="url(#gradient)"
            />
            {/* Trend Line */}
            <Path
                d="M0 30 Q 15 15, 30 25 T 60 10 T 90 20"
                fill="none"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
            />
            {/* End Point */}
            <Circle cx="90" cy="20" r="3" fill={color} />
        </Svg>
    </View>
);

export default function PageAcceuil() {
    const [fontsLoaded] = useFonts({
        'Rowdies-Regular': require('../../AssetsProjet/Font/Rowdies-Regular/rowdies/Rowdies-Regular.ttf'),
        'Rowdies-Bold': require('../../AssetsProjet/Font/Rowdies-Regular/rowdies/Rowdies-Bold.ttf'),
        'Rowdies-Light': require('../../AssetsProjet/Font/Rowdies-Regular/rowdies/Rowdies-Light.ttf'),
    });

    useEffect(() => {
        if (fontsLoaded) {
            SplashScreen.hideAsync();
        }
    }, [fontsLoaded]);

    if (!fontsLoaded) {
        return null;
    }

    // Mock data
    const currencies = Array.from({ length: 3 }, (_, index) => ({
        id: `currency-${index}`,
        code: "XOF",
        change: "+0.07",
        rate: "$ 0.0018",
        isLast: index === 2
    }));

    const historyItems = Array.from({ length: 2 }, (_, index) => ({
        id: `history-${index}`,
        fromAmount: "1000",
        fromCurrency: "XOF",
        toAmount: "1.52",
        toCurrency: "EURO"
    }));

    const renderCurrency = ({ item }) => (
        <View style={[styles.currencyRow, item.isLast && { borderBottomWidth: 0 }]}>
            <Image source={require('../../AssetsProjet/Image/imagestartpage.png')} style={styles.flagIcon} resizeMode="contain" />
            <Text style={styles.currencyCode}>{item.code}</Text>
            <MiniChart />
            <View style={styles.rateInfo}>
                <Text style={styles.percentageChange}>{item.change}</Text>
                <Text style={styles.rateText}>{item.rate}</Text>
            </View>
        </View>
    );

    const renderHistory = ({ item }) => (
        <View style={styles.historyCard}>
            <Text style={styles.historyValue}>{item.fromAmount}  {item.fromCurrency}</Text>
            <View style={styles.exchangeIconContainer}>
                <Ionicons name="swap-horizontal" size={16} color="white" />
            </View>
            <View style={styles.historyTarget}>
                <Text style={styles.historyAmount}>{item.toAmount}</Text>
                <Text style={styles.historyCurrency}>{item.toCurrency}</Text>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => { /* Action retour */ }} style={styles.backButton}>
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
                {/* Search Bar */}
                <View style={styles.searchbarContainer}>
                    <TextInput
                        placeholder="Rechercher"
                        placeholderTextColor="#51514f8d"
                        style={styles.searchbarInput}
                    />
                    <Ionicons name="search" size={20} color="#E1A247" style={styles.searchIcon} />
                </View>

                {/* Feature Cards */}
                <View style={styles.featureCardsRow}>
                    <View style={styles.featureCard}>
                        <Image source={require('../../AssetsProjet/Image/coin2 Background Removed 1.png')} style={styles.featureIcon} resizeMode="contain" />
                        <Text style={styles.featureText}>Convertir</Text>
                    </View>
                    <View style={styles.featureCard}>
                        <Image source={require('../../AssetsProjet/Image/k 1.png')} style={styles.featureIcon} resizeMode="contain" />
                        <Text style={styles.featureText}>Historique</Text>
                    </View>
                    <View style={styles.featureCard}>
                        <Image source={require('../../AssetsProjet/Image/images (4) Background Removed 1.png')} style={styles.featureIcon} resizeMode="contain" />
                        <Text style={styles.featureText}>Taux</Text>
                    </View>
                </View>

                {/* Devise du jour */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>devise du jour</Text>
                </View>
                <View style={styles.currencyListCard}>
                    <FlatList
                        data={currencies}
                        renderItem={renderCurrency}
                        keyExtractor={(item) => item.id}
                        scrollEnabled={false}
                    />
                </View>

                {/* Mini Historique */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Mini Historique</Text>
                </View>
                <FlatList
                    data={historyItems}
                    renderItem={renderHistory}
                    keyExtractor={(item) => item.id}
                    scrollEnabled={false}
                    contentContainerStyle={{ width: '90%', alignSelf: 'center' }}
                />
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
        width: '70%',
        height: '60%',
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
    flagIcon: {
        width: 40,
        height: 25,
        marginRight: 10,
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
        color: '#00C853',
        fontFamily: 'Rowdies-Regular',
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