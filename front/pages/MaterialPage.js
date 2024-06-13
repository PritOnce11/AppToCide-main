import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image } from "react-native";
import Fondo from "../Maquetas/Fondo";
import { borders, colors, fontSizes, sizes } from '../constantes/themes';
import Navbar from "../Maquetas/Navbar";
import { useNavigation } from '@react-navigation/native';
import { IP_MAIN } from '@env';

export default function MaterialPage() {
    const navigation = useNavigation();
    const [menuVisible, setMenuVisible] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [products, setProducts] = useState([]);
    const [cartCount, setCartCount] = useState(0);

    const addToCart = (material) => {
        setProducts(currentCart => [...currentCart, material]);

        fetch(IP_MAIN + '/materialPage', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(material),
            credentials: 'include'
        })
            .then(response => response.json())
            .then(data => {
                // Maneja la respuesta del servidor
                setCartCount(data.cartCount);
            })
            .catch(error => console.error('Error:', error));
    };

    useEffect(() => {
        fetch(IP_MAIN + '/materialPage', {
            method: 'GET',
            credentials: 'include'
        })
            .then(response => response.json())
            .then(data => {
                if (data.loggedIn) {
                    setProducts(data.products);
                    // Set cart count
                    setCartCount(data.cartCount);
                } else {
                    // handle the case when the user is not logged in
                }
            })
            .catch(error => console.error('Error:', error));
    }, []);

    const toggleMenu = () => {
        setMenuVisible(!menuVisible);
    };

    const handleSearch = () => {
        console.log(searchText); // Reemplaza esto con tu función de búsqueda
    };

    return (
        <Fondo>
            <Navbar />
            <View style={styles.container}>
                <Text style={{ fontSize: fontSizes.buttonsLabels }}>MATERIAL</Text>
                <View style={styles.groupLabel}>
                    <TouchableOpacity onPress={toggleMenu} style={styles.menuButton}>
                        <Text style={styles.menuButtonText}>☰</Text>
                    </TouchableOpacity>
                    <View style={{
                        flexDirection: 'row', borderWidth: borders.smallRadiousWith,
                        borderRadius: borders.smallRadious, paddingHorizontal: 5
                    }}>
                        <TextInput
                            style={styles.buttons}
                            placeholder="BUSCAR"
                            onChangeText={text => setSearchText(text)} // Actualiza el estado cuando el texto cambia
                        />
                        <TouchableOpacity onPress={handleSearch} style={styles.enterButton}>
                            <Text style={{ padding: 5 }}>🔎</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity onPress={() => navigation.navigate("CarritoPage")}>
                        <Text style={styles.menuButtonText}>🛒{cartCount}</Text>
                    </TouchableOpacity>
                </View>
                <ScrollView contentContainerStyle={styles.data}>
                    {products.map((product, index) => (
                        <View key={index} style={styles.itemInvoice}>
                            <Image source={require("../assets/cuaderno.png")} style={styles.productImage} />
                            <View style={styles.plz}>
                                <Text style={{ fontSize: fontSizes.formSizes }}>{product.nombre}</Text>
                                <Text style={{ fontSize: fontSizes.formSizes, textAlign: 'center' }}>{product.precio}$</Text>
                            </View>
                            <TouchableOpacity onPress={() => addToCart(product)}>
                                <Text style={{ fontSize: fontSizes.subTitlesCamps, borderWidth: borders.smallRadiousWith, padding: 3, marginTop: 3 }}>AÑADIR</Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                </ScrollView>
            </View>
        </Fondo>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        marginTop: -600,
    },
    groupLabel: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        width: sizes.navbarWidth,
        height: sizes.navbarHeight,
        marginTop: 20,
        borderRadius: borders.mediumRadious,
        borderWidth: borders.smallRadiousWith,
        borderColor: borders.borderColor,
        backgroundColor: colors.primary,
    },
    menuButton: {
        padding: 1,
        borderRadius: borders.smallRadious,
        borderWidth: borders.smallRadiousWith,
        marginBottom: 5,
        marginRight: 10,
    },
    menuButtonText: {
        fontSize: 20,
    },
    buttons: {
        padding: 5,
    },
    enterButton: {
        padding: 5,
    },
    labels: {
        fontSize: fontSizes.subLabels,
        padding: 5,
    },
    data: {
        flexDirection: "row",
        flexWrap: "wrap",
        width: sizes.navbarWidth,
        borderRadius: borders.mediumRadious,
        borderWidth: borders.smallRadiousWith,
        borderColor: borders.borderColor,
        backgroundColor: colors.primary,
        padding: 10,
        flexGrow: 1,
        marginHorizontal: 10,
    },
    itemInvoice: {
        width: 130,
        height: 220,
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 16,
        borderRadius: borders.mediumRadious,
        borderWidth: borders.smallRadiousWith,
        borderColor: borders.borderColor,
        marginHorizontal: 14,
        marginVertical: 10,
    },
    productImage: {
        width: 100,
        height: 100,
        resizeMode: 'contain',
    },
    plz: {
        alignItems: 'center',
    }
});
