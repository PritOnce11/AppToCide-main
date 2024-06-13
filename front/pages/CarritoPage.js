import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from "react-native";
import Fondo from "../Maquetas/Fondo";
import { borders, colors, fontSizes, sizes } from '../constantes/themes';
import Navbar from "../Maquetas/Navbar";
import { IP_MAIN } from '@env';
export default function CarritoPage() {

    const [products, setProducts] = useState([]);
    const [total, setTotal] = useState(0);


    useEffect(() => {
        fetch(IP_MAIN + '/carrito', {
            method: 'GET',
            credentials: 'include'
        })
            .then(response => response.json())
            .then(data => {
                if (data.loggedIn) {
                    setProducts(data.products);
                    setTotal(data.total);
                } else {
                    // handle the case when the user is not logged in
                }
            })
            .catch(error => console.error('Error:', error));
    }, []);

    const handlePayment = () => {
        fetch(IP_MAIN + '/payMaterial', {
            method: 'POST',
            credentials: 'include'
        })
            .then(response => response.json())
            .then(data => {
                if (data.loggedIn) {
                    // Si el pago se realizó correctamente, vaciar los servicios del carrito y establecer el total a 0
                    setProducts([]);
                    setTotal(0);
                    alert('Pago realizado y carrito vaciado correctamente');
                } else {
                    // Manejar el caso cuando el usuario no está logueado
                    alert('Por favor, inicie sesión para realizar el pago');
                }
            })
            .catch(error => console.error('Error:', error));
    };

    return (
        <Fondo>
            <Navbar />

            <View style={styles.container}>
                <Text style={{ fontSize: fontSizes.buttonsLabels }}>CARRITO</Text>

                <View style={styles.groupLabel}>
                    <View style={{
                        flexDirection: 'row', borderWidth: borders.smallRadiousWith,
                        borderRadius: borders.smallRadious, paddingHorizontal: 5
                    }}>
                        <TouchableOpacity style={styles.enterButton}>
                            <Text style={{ padding: 5 }} onPress={handlePayment}>PAGAR</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity>
                        <Text style={styles.menuButtonText}>{total}$</Text>
                    </TouchableOpacity>
                </View>
                <ScrollView contentContainerStyle={styles.data}>
                    {products && products.map((product, index) => (
                        <View key={index} style={styles.itemInvoice}>
                            <TouchableOpacity>
                                <Image source={require("../assets/mochila.png")} />
                            </TouchableOpacity>
                            <View style={styles.plz}>
                                <Text style={{ fontSize: fontSizes.subLabels }}>{product.nombre}</Text>
                                {product.descripcion.split(',').map((line, index) => (
                                    <Text key={index} style={{ fontSize: 10 }}>{line}</Text>
                                ))}
                                <Text style={{ fontSize: fontSizes.subLabels, textAlign: 'center' }}>{product.precio}$</Text>
                                <Text style={{ fontSize: fontSizes.subLabels, textAlign: 'center' }}>Cantidad: {product.cantidad}</Text>
                            </View>
                        </View>
                    ))}
                </ScrollView>
            </View>
        </Fondo>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        marginTop: -600,
    },
    groupLabel: {
        flexDirection: "row",
        justifyContent: "space-around", // Cambia esto
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
        marginRight: 10, // Reducir este valor para acercar los botones
    },
    menuButtonText: {
        fontSize: 20,
    },

    labels: {
        fontSize: fontSizes.subLabels,
        padding: 5,
    },
    data: {
        flexDirection: "column",
        width: sizes.navbarWidth,
        borderRadius: borders.mediumRadious,
        borderWidth: borders.smallRadiousWith,
        borderColor: borders.borderColor,
        backgroundColor: colors.primary,
        padding: 10,
        flexGrow: 1,
        marginHorizontal: 10,
        justifyContent: 'center', // Añade esto
        alignItems: 'center', // Añade esto
    },
    itemInvoice: {
        width: 220,
        height: 130,
        flexDirection: "row",
        alignItems: "center",
        borderRadius: borders.mediumRadious,
        borderWidth: borders.smallRadiousWith,
        borderColor: borders.borderColor,
        marginHorizontal: 14,
        marginVertical: 10,
    }
})