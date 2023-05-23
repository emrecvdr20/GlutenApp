import React, { useState, useEffect, useRef } from 'react';
import { Text, View, StyleSheet, Button, TouchableOpacity, LogBox } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Camera } from 'expo-camera';
import axios from 'axios';

LogBox.ignoreAllLogs(); // Tüm uyarı ve hataları görmezden gelmek için

const App = () => {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [result, setResult] = useState(null);
    const [cameraOpen, setCameraOpen] = useState(false);
    const cameraRef = useRef(null);

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    const handleBarCodeScanned = ({ data }) => {
        if (!scanned) {
            setScanned(true);
            fetchProductInfo(data);
        }
    };

    const fetchProductInfo = async (barcode) => {
        try {
            const response = await axios.get(
                `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`
            );
            const product = response.data.product;

            if (product) {
                const ingredients = product.ingredients_text;
                const isGlutenFree = !ingredients.toLowerCase().includes('gluten');
                setResult({
                    name: product.product_name,
                    isGlutenFree: isGlutenFree ? 'Gluten İçermiyor' : 'Gluten İçeriyor',
                });
            } else {
                setResult({
                    name: 'Ürün Bulunamadı',
                    isGlutenFree: 'Bilinmiyor',
                });
            }
        } catch (error) {
            console.error('Ürün bilgileri alınırken hata oluştu:', error);
            setScanned(false);
        }
    };



    const toggleCamera = () => {
        setCameraOpen((prevCameraOpen) => !prevCameraOpen);
    };

    const resetScan = () => {
        setResult(null);
        setScanned(false);
    };

    const handleCameraReady = () => {
        cameraRef.current?.getSupportedRatiosAsync().then((ratios) => {
            const ratio = ratios.find((r) => r === '4:3') || ratios[0];
            cameraRef.current?.setRatioAsync(ratio);
        });
    };

    if (hasPermission === null) {
        return <View />;
    }
    if (hasPermission === false) {
        return <Text>Kameraya erişim yok</Text>;
    }

    return (
        <View style={styles.container}>
            {cameraOpen ? (
                <Camera
                    style={styles.camera}
                    type={Camera.Constants.Type.back}
                    autoFocus={Camera.Constants.AutoFocus.on}
                    onBarCodeScanned={handleBarCodeScanned}
                    ref={cameraRef}
                    onCameraReady={handleCameraReady}
                />
            ) : (
                <View style={styles.placeholder}>
                    <Text style={styles.placeholderText}>Kamerayı açmak için dokunun</Text>
                </View>
            )}
            <TouchableOpacity style={styles.cameraToggle} onPress={toggleCamera}>
                <Feather name={cameraOpen ? 'camera-off' : 'camera'} size={24} color="white" />
            </TouchableOpacity>
            {result && (
                <View style={styles.resultContainer}>
                    <Text style={styles.resultText}>Ürün: {result.name}</Text>
                    <Text style={styles.resultText}>Gluten Durumu: {result.isGlutenFree}</Text>
                    <Button title="Yeniden Tarayın" onPress={resetScan} />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    camera: {
        flex: 1,
        width: '100%',
    },
    cameraToggle: {
        position: 'absolute',
        top: 20,
        right: 20,
        zIndex: 1,
        padding: 10,
    },
    placeholder: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
        width: '100%',
    },
    placeholderText: {
        color: 'white',
        fontSize: 16,
    },
    resultContainer: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        padding: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        borderRadius: 10,
    },
    resultText: {
        fontSize: 16,
        marginBottom: 5,
        textAlign: 'center',
    },
});

export default App;
