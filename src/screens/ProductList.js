import { View, Text, TextInput, Button, StyleSheet, ScrollView, ImageBackground } from 'react-native';
import React, { useState } from 'react';
import axios from 'axios';

const API_APP_ID = '25bbdc51';
const API_APP_KEY = '37ba326e588ea8941910cf856f32cc4a';

const ProductInfoScreen = () => {
    const [productName, setProductName] = useState('');
    const [productInfo, setProductInfo] = useState(null);

    const getProductInfo = async () => {
        try {
            const response = await axios.get(
                `https://api.edamam.com/api/food-database/parser?ingr=${productName}&app_id=${API_APP_ID}&app_key=${API_APP_KEY}`
            );
            if (response.data.hints.length > 0) {
                setProductInfo(response.data.hints[0].food);
            } else {
                setProductInfo(null);
            }
        } catch (error) {
            console.error(error);
            setProductInfo(null);
        }
    };

    return (
        <ImageBackground source={require('../../assets/images/gluten1.jpg')} style={styles.backgroundImage}>
            <ScrollView contentContainerStyle={styles.container}>
                <TextInput
                    style={styles.input}
                    placeholder="Enter product name"
                    value={productName}
                    onChangeText={setProductName}
                />
                <Button title="Get Product Info" onPress={getProductInfo} style={styles.buttonText} />
                {productInfo && (
                    <View style={styles.productInfoContainer}>
                        <Text style={styles.infoLabel}>Product Name:</Text>
                        <Text style={styles.infoText}>{productInfo.label}</Text>
                        <Text style={styles.infoLabel}>Calories:</Text>
                        <Text style={styles.infoText}>{productInfo.nutrients.ENERC_KCAL} kcal</Text>
                        <Text style={styles.infoLabel}>Protein:</Text>
                        <Text style={styles.infoText}>{productInfo.nutrients.PROCNT} g</Text>
                        <Text style={styles.infoLabel}>Fat:</Text>
                        <Text style={styles.infoText}>{productInfo.nutrients.FAT} g</Text>
                        <Text style={styles.infoLabel}>Carbohydrates:</Text>
                        <Text style={styles.infoText}>{productInfo.nutrients.CHOCDF} g</Text>
                    </View>
                )}
            </ScrollView>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
    },
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: 'transparent',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#fff',
    },
    input: {
        width: '80%',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 15,
        marginBottom: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        padding:10,
        fontSize:16
    },
    productInfoContainer: {
        marginTop: 20,
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        padding: 10,
        borderRadius: 5,
    },
    infoLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    infoText: {
        fontSize: 16,
        marginBottom: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
      }
});

export default ProductInfoScreen;
