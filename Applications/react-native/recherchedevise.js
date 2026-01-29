import React, { useEffect, useState, useCallback, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, TextInput, FlatList, Image, ActivityIndicator } from "react-native";
import { Svg, Path, Circle, Defs, LinearGradient, Stop } from "react-native-svg";
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { Ionicons } from "@expo/vector-icons";
import { fetchSupportedCodes, fetchExchangeRate } from './api';
import { useNavigation, useRoute } from '@react-navigation/native';

SplashScreen.preventAutoHideAsync();

// Helper to get currency symbol
const getCurrencySymbol = (code) => {
    const symbols = {
        USD: "$", EUR: "€", GBP: "£", JPY: "¥", CNY: "¥", KRW: "₩", INR: "₹",
        RUB: "₽", BRL: "R$", TRY: "₺", ZAR: "R", XOF: "CFA", XAF: "CFA",
        NGN: "₦", GHS: "₵", KES: "KSh", EGP: "E£", AUD: "A$", CAD: "C$",
        CHF: "Fr", HKD: "HK$", SGD: "S$", MXN: "Mex$", 
    };
    return symbols[code] || code.substring(0, 2); // Fallback to first 2 letters
};

// Helper to generate a smooth curve path from data points
const createPath = (data, width, height) => {
    if (!data || data.length === 0) return "";
    
    // Normalize data
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    
    const points = data.map((val, index) => {
        const x = (index / (data.length - 1)) * width;
        const y = height - ((val - min) / range) * height; // Invert Y for SVG
        return { x, y };
    });

    // Create curved path (simple quadratic bezier)
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
        const midX = (points[i - 1].x + points[i].x) / 2;
        const midY = (points[i - 1].y + points[i].y) / 2;
        d += ` Q ${points[i - 1].x} ${points[i - 1].y}, ${midX} ${midY}`;
        if (i === points.length - 1) {
            d += ` T ${points[i].x} ${points[i].y}`;
        }
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
                <Path
                    d={`${path} L ${width} ${height} L 0 ${height} Z`}
                    fill="url(#gradient)"
                />
                <Path
                    d={path}
                    fill="none"
                    stroke={color}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <Circle cx={width} cy={height - ((data[data.length-1] - Math.min(...data))/(Math.max(...data)-Math.min(...data)||1))*height} r="3" fill={color} />
            </Svg>
        </View>
    );
};

export default function Recherchedevise({ navigation }) { // Ensure this matches existing function name
    const route = useRoute();
    const { initialSearch } = route.params || {};

    const [fontsLoaded] = useFonts({
        // ...
    });

    const [searchText, setSearchText] = useState(initialSearch || "");
    const [allCurrencies, setAllCurrencies] = useState([]);
    const [filteredCurrencies, setFilteredCurrencies] = useState([]);
    const [ratesData, setRatesData] = useState({}); 
    const [loading, setLoading] = useState(true);
    
    // Pagination state
    const [page, setPage] = useState(1);
    const ITEMS_PER_PAGE = 10;
    const fetchingRef = useRef(false);

    useEffect(() => {
        if (fontsLoaded) {
            SplashScreen.hideAsync();
        }
    }, [fontsLoaded]);

    // Initial Load: Fetch codes
    useEffect(() => {
        const loadCurrencies = async () => {
            const codes = await fetchSupportedCodes();
            const formatted = codes.map((c, i) => ({ id: c.code, ...c }));
            setAllCurrencies(formatted);
            setFilteredCurrencies(formatted);
            setLoading(false);
        };
        loadCurrencies();
    }, []);

    // Search Filter
    useEffect(() => {
        if (searchText.trim() === "") {
            setFilteredCurrencies(allCurrencies);
        } else {
            const lower = searchText.toLowerCase();
            const filtered = allCurrencies.filter(c => 
                c.code.toLowerCase().includes(lower) || 
                c.name.toLowerCase().includes(lower)
            );
            setFilteredCurrencies(filtered);
        }
        setPage(1); // Reset page on search
    }, [searchText, allCurrencies]);

    // Fetch rates logic
    const fetchRatesBatch = useCallback(async (items) => {
        if (fetchingRef.current) return;
        fetchingRef.current = true;

        const newRates = { ...ratesData };
        let hasUpdate = false;

        for (const item of items) {
            if (!newRates[item.code]) {
                try {
                    const rate = await fetchExchangeRate(item.code, 'USD');
                    
                    // Simulate history
                    const history = [];
                    let currentVal = rate;
                    for(let i=0; i<10; i++) {
                        history.push(currentVal);
                        currentVal = currentVal * (1 + (Math.random() * 0.02 - 0.01)); 
                    }
                    
                    const changePercent = ((history[9] - history[0]) / history[0]) * 100;
                    const changeSign = changePercent >= 0 ? "+" : "";
                    
                    newRates[item.code] = {
                        rate: rate,
                        history: history,
                        change: `${changeSign}${changePercent.toFixed(2)}%`,
                        displayRate: `$ ${rate.toFixed(4)}`
                    };
                    hasUpdate = true;
                } catch (e) {
                    console.log("Error fetching rate for", item.code);
                }
            }
        }

        if (hasUpdate) {
            setRatesData(prev => ({ ...prev, ...newRates }));
        }
        fetchingRef.current = false;
    }, [ratesData]);

    // Fetch on page change or list change
    useEffect(() => {
        if (filteredCurrencies.length > 0) {
            // Determine items to fetch based on current page
            // We fetch up to page * ITEMS_PER_PAGE
            const limit = page * ITEMS_PER_PAGE;
            const itemsToFetch = filteredCurrencies.slice(0, limit);
            fetchRatesBatch(itemsToFetch);
        }
    }, [filteredCurrencies, page, fetchRatesBatch]);

    const handleLoadMore = () => {
        if (filteredCurrencies.length > page * ITEMS_PER_PAGE) {
            setPage(prev => prev + 1);
        }
    };

    const renderCurrency = ({ item }) => {
        const data = ratesData[item.code];
        const rate = data ? data.displayRate : "...";
        const change = data ? data.change : "...";
        const history = data ? data.history : [1, 1];
        const isPositive = change.includes("+");
        const color = isPositive ? "#00C853" : "#FF3D00";

        return (
            <View style={styles.currencyRow}>
                <View style={styles.iconContainer}>
                     <Text style={styles.currencySymbol}>{getCurrencySymbol(item.code)}</Text>
                </View>
                <View>
                    <Text style={styles.currencyCode}>{item.code}</Text>
                    <Text style={styles.currencyName} numberOfLines={1}>{item.name}</Text>
                </View>
                
                <MiniChart data={history} color={color} />
                
                <View style={styles.rateInfo}>
                    <Text style={[styles.percentageChange, { color }]}>{change}</Text>
                    <Text style={styles.rateText}>{rate}</Text>
                </View>
            </View>
        );
    };

    if (!fontsLoaded) return null;

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
                    placeholder="Rechercher"
                    placeholderTextColor="#51514f8d"
                    style={styles.searchbarInput}
                    value={searchText}
                    onChangeText={setSearchText}
                />
                <Ionicons name="search" size={20} color="#E1A247" style={styles.searchIcon} />
            </View>

            {/* Currency List */}
            {loading ? (
                <ActivityIndicator size="large" color="#E1A247" style={{ marginTop: 20 }} />
            ) : (
                <FlatList
                    data={filteredCurrencies}
                    renderItem={renderCurrency}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.scrollContent}
                    initialNumToRender={10}
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0.5}
                />
            )}
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
    iconContainer: {
        width: 45,
        height: 45,
        borderRadius: 22.5,
        backgroundColor: '#FFF8E1', // lighter shade of #E1A247 for background
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
    currencyName: {
        fontSize: 12,
        fontFamily: 'Rowdies-Regular',
        color: '#888',
        width: 80,
    },
    chartContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 100,
    },
    rateInfo: {
        alignItems: 'flex-end',
        minWidth: 70,
    },
    percentageChange: {
        fontSize: 10,
        fontFamily: 'Rowdies-Regular',
        marginBottom: 4,
    },
    rateText: {
        fontSize: 16,
        fontFamily: 'Rowdies-Bold',
        color: '#000',
    },
});