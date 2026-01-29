import React, { useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from "react-native";
import { Svg, Path } from "react-native-svg";
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

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
            <View style={styles.container}>
                <Text style={styles.placeholderText}>PageAcceuil</Text>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: 'transparent',
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
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    placeholderText: {
        fontFamily: 'Rowdies-Regular',
        fontSize: 18,
    }
});