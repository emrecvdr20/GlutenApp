import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ImageBackground,
} from 'react-native';

const ProductsSearch = () => {
  const [barcode, setBarcode] = useState('');
  const [product, setProduct] = useState(null);

  const fetchProduct = () => {
    // Barkod numarasının 13 haneli olup olmadığını kontrol et
    if (barcode.length !== 13) {
      Alert.alert('Warning', 'Barcode number must be 13 digits.');
      return;
    }

    fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`)
      .then((response) => response.json())
      .then((data) => setProduct(data.product))
      .catch((error) => console.error(error));
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../assets/images/gluten.jpg')}
        style={styles.backgroundImage}
      >
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.innerContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter Barcode Number"
              value={barcode}
              onChangeText={setBarcode}
              keyboardType="numeric"
            />
            <TouchableOpacity style={styles.button} onPress={fetchProduct}>
              <Text style={styles.buttonText}>Find Product</Text>
            </TouchableOpacity>
            {product && (
              <View style={styles.productContainer}>
                <Text style={styles.productName}>{product.product_name}</Text>
                <Text style={styles.brand}>Brand: {product.brands}</Text>
                <ScrollView style={styles.ingredientsContainer}>
                  <Text style={styles.ingredients}>{product.ingredients_text}</Text>
                </ScrollView>
              </View>
            )}
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 15,
    marginBottom: 20,
    width: '80%',
    fontSize: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  button: {
    backgroundColor: '#007aff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  productContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 20,
    borderRadius: 15,
    marginTop: 20,
    width: '80%',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  productName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  brand: {
    fontSize: 16,
    marginBottom: 5,
  },
  ingredientsContainer: {
    maxHeight: 150,
    fontSize: 16,
  },
});

export default ProductsSearch;
