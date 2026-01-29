import React, { useEffect, useState, useCallback } from "react";
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, TextInput, FlatList } from "react-native";
import { Svg, Path } from "react-native-svg";
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from '@react-navigation/native';
import { getTransactions, initDB } from './database';

SplashScreen.preventAutoHideAsync();

export default function HistoriqueTransaction({ navigation }) {
    const [fontsLoaded] = useFonts({
        'Rowdies-Regular': require('../../AssetsProjet/Font/Rowdies-Regular/rowdies/Rowdies-Regular.ttf'),
        'Rowdies-Bold': require('../../AssetsProjet/Font/Rowdies-Regular/rowdies/Rowdies-Bold.ttf'),
        'Rowdies-Light': require('../../AssetsProjet/Font/Rowdies-Regular/rowdies/Rowdies-Light.ttf'),
    });

    const [searchText, setSearchText] = useState("");
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        initDB(); // Ensure DB is ready
        if (fontsLoaded) {
            SplashScreen.hideAsync();
        }
    }, [fontsLoaded]);

    useFocusEffect(
        useCallback(() => {
            const data = getTransactions();
            setTransactions(data);
        }, [])
    );

    if (!fontsLoaded) {
        return null;
    }

    // Filter transactions
    const filteredTransactions = transactions.filter(t => 
        t.fromCurrency.toLowerCase().includes(searchText.toLowerCase()) || 
        t.toCurrency.toLowerCase().includes(searchText.toLowerCase()) ||
        t.date.includes(searchText)
    );

    const renderTransaction = ({ item }) => (
        <View style={styles.transactionContainer}>
            <Text style={styles.dateTime}>{item.date}  {item.time}</Text>
            <View style={styles.transactionCard}>
                <Text style={styles.transactionValue}>
                    {item.fromAmount}  
                    <Text style={styles.currencyCode}>{item.fromCurrency}</Text>
                </Text>
                <View style={styles.exchangeIconContainer}>
                    <Ionicons name="swap-horizontal" size={16} color="white" />
                </View>
                <View style={styles.transactionTarget}>
                    <Text style={styles.transactionAmount}>{item.toAmount}</Text>
                    <Text style={styles.transactionCurrency}>{item.toCurrency}</Text>
                </View>
            </View>
        </View>
    );

    const renderEmptyComponent = () => (
        <View style={styles.emptyContainer}>
            <Ionicons name="time-outline" size={60} color="#ccc" />
            <Text style={styles.emptyText}>Aucune transaction trouvée</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            {/* AppBar */}
            <View style={styles.header}>
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

            {/* Search Bar */}
            <View style={styles.searchbarContainer}>
                <TextInput
                    placeholder="Rechercher par devise ou date"
                    placeholderTextColor="#51514f8d"
                    style={styles.searchbarInput}
                    value={searchText}
                    onChangeText={setSearchText}
                />
                <Ionicons name="search" size={20} color="#E1A247" style={styles.searchIcon} />
            </View>

            {/* Transaction List */}
            <FlatList
                data={filteredTransactions}
                renderItem={renderTransaction}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={[
                    styles.scrollContent,
                    filteredTransactions.length === 0 && styles.emptyListContent
                ]}
                ListEmptyComponent={renderEmptyComponent}
            />
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
        alignSelf: 'center',
    },
    searchbarInput: {
        flex: 1,
        fontSize: 16,
        color: '#000',
        fontFamily: 'Rowdies-Regular',
    },
    searchIcon: {
        marginLeft: 10,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 20,
        flexGrow: 1,
    },
    transactionContainer: {
        marginBottom: 15,
    },
    dateTime: {
        fontSize: 14,
        fontFamily: 'Rowdies-Bold',
        color: '#000',
        marginBottom: 8,
    },
    transactionCard: {
        width: '100%',
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: '#E1A247',
        borderRadius: 15,
        paddingHorizontal: 20,
        backgroundColor: '#FFFFFF',
    },
    transactionValue: {
        fontSize: 18,
        fontFamily: 'Rowdies-Bold',
        color: '#000',
    },
    currencyCode: {
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
    transactionTarget: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    transactionAmount: {
        fontSize: 18,
        fontFamily: 'Rowdies-Bold',
        color: '#000',
        marginRight: 5,
    },
    transactionCurrency: {
        fontSize: 18,
        fontFamily: 'Rowdies-Bold',
        color: '#E1A247',
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 50,
    },
    emptyText: {
        marginTop: 10,
        fontSize: 16,
        fontFamily: 'Rowdies-Regular',
        color: '#888',
    },
    emptyListContent: {
        flexGrow: 1,
    }
});