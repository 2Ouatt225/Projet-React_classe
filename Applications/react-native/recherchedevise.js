import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, TextInput, FlatList, Image } from "react-native";
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

export default function Recherchedevise() {
    const [fontsLoaded] = useFonts({
        'Rowdies-Regular': require('../../AssetsProjet/Font/Rowdies-Regular/rowdies/Rowdies-Regular.ttf'),
        'Rowdies-Bold': require('../../AssetsProjet/Font/Rowdies-Regular/rowdies/Rowdies-Bold.ttf'),
        'Rowdies-Light': require('../../AssetsProjet/Font/Rowdies-Regular/rowdies/Rowdies-Light.ttf'),
    });

    const [searchText, setSearchText] = useState("");

    useEffect(() => {
        if (fontsLoaded) {
            SplashScreen.hideAsync();
        }
    }, [fontsLoaded]);

    if (!fontsLoaded) {
        return null;
    }

    // Mock currency data
    const currencies = Array.from({ length: 7 }, (_, index) => ({
        id: `currency-${index}`,
        code: "XOF",
        rate: "$ 0.0018",
        change: "+0.07"
    }));

    const renderCurrency = ({ item }) => (
        <View style={styles.currencyRow}>
            <Image 
                source={require('../../AssetsProjet/Image/imagestartpage.png')} 
                style={styles.flagIcon} 
                resizeMode="contain" 
            />
            <Text style={styles.currencyCode}>{item.code}</Text>
            <MiniChart />
            <View style={styles.rateInfo}>
                <Text style={styles.percentageChange}>{item.change}</Text>
                <Text style={styles.rateText}>{item.rate}</Text>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            {/* AppBar */}
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

            {/* Search Bar */}
            <View style={styles.searchbarContainer}>
                <TextInput
                    placeholder="Rechercher"
                    placeholderTextColor="#51514f8d"
                    style={styles.searchbarInput}
                    value={searchText}
                    onChangeText={setSearchText}
                />
                <Ionicons name="search" size={20} color="#E1A247" style={styles.searchIcon} />
            </View>

            {/* Currency List */}
            <FlatList
                data={currencies}
                renderItem={renderCurrency}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.scrollContent}
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
});