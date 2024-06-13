import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from "react-native";
import Fondo from "../Maquetas/Fondo";
import { borders, colors, fontSizes, sizes } from '../constantes/themes';
import Navbar from "../Maquetas/Navbar";
import { IP_MAIN } from '@env';

export default function CarritoServPage() {

    const [servicios, setServicios] = useState([]);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        fetch(IP_MAIN + '/carritoServ', {
            method: 'GET',
            credentials: 'include'
        })
            .then(response => response.json())
            .then(data => {
                if (data.loggedIn) {
                    setServicios(data.servicios);
                    setTotal(data.total);
                } else {
                    // handle the case when the user is not logged in
                }
            })
            .catch(error => console.error('Error:', error));
    }, []);

    const handlePayment = () => {
        fetch(IP_MAIN + '/payServicios', {
            method: 'POST',
            credentials: 'include'
        })
            .then(response => response.json())
            .then(data => {
                if (data.loggedIn) {
                    setServicios([]);
                    setTotal(0);
                    alert('Pago realizado y carrito vaciado correctamente');
                } else {
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
                        <TouchableOpacity style={styles.enterButton} onPress={handlePayment}>
                            <Text style={{ padding: 5 }}>PAGAR</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity>
                        <Text style={styles.menuButtonText}>{total}$</Text>
                    </TouchableOpacity>
                </View>
                <ScrollView contentContainerStyle={styles.data}>
                    {servicios && servicios.map((servicio, index) => (
                        <View key={index} style={styles.itemInvoice}>
                            <TouchableOpacity>
                                <Image source={require("../assets/cuaderno.png")} />
                            </TouchableOpacity>
                            <View style={styles.plz}>
                                <Text style={{ fontSize: fontSizes.subLabels }}>{servicio.nombre}</Text>
                                {servicio.descripcion.split(',').map((line, index) => (
                                    <Text key={index} style={{ fontSize: 10 }}>{line}</Text>
                                ))}
                                <Text style={{ fontSize: fontSizes.subLabels, textAlign: 'center' }}>{servicio.precio}$</Text>
                                <Text style={{ fontSize: fontSizes.subLabels, textAlign: 'center' }}>Cantidad: {servicio.cantidad}</Text>
                            </View>
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
        justifyContent: 'center',
        alignItems: 'center',
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
    },
    plz: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
});
