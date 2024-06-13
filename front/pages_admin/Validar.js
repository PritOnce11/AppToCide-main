import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { RadioButton } from 'react-native-paper';
import { IP_MAIN } from '@env'

import Fondo from "../Maquetas/Fondo";
import { borders, colors, fontSizes, sizes } from '../constantes/themes';

import NavbarAdmin from "../Maquetas/NavbarAdmin";

export default function Validar() {
    const [checked, setChecked] = useState([]); // Cambia el estado inicial a un array vacío

    const handlePress = (index) => {
        setChecked(prev => prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]); // Agrega o elimina el índice del array
    }

    const [facturas, setFacturas] = useState([]);

    useEffect(() => {
        fetch(IP_MAIN + '/facturasAdmin', {
            method: 'GET',
            credentials: 'include'
        })
            .then(response => response.json())
            .then(data => {
                if (data.loggedIn) {
                    setFacturas(data.facturas);
                } else {
                    // handle the case when the user is not logged in
                }
            })
            .catch(error => console.error('Error:', error));
    }, []);

    const handleSend = async () => {
        if (checked.length > 0) {
            for (const index of checked) {
                const factura = facturas[index];
                try {
                    const response = await fetch(IP_MAIN + "/facturasAdmin", {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            facturaId: factura.id,
                            estado: 'completado'
                        })
                    });
                    const data = await response.json();
                    if (response.ok) {
                        console.log('Éxito:', data.message);
                    } else {
                        console.error('Error:', data.message);
                    }
                } catch (err) {
                    console.error('Error:', err);
                }
            }
        } else {
            alert('Por favor, seleccione al menos una factura para validar.');
        }
    };

    return (
        <Fondo>
            <NavbarAdmin />

            <View style={styles.container}>
                <Text style={{ fontSize: fontSizes.buttonsLabels }}>FACTURAS</Text>

                <View style={styles.groupLabel}>
                    <Text style={styles.labels}>FECHA</Text>
                    <Text style={styles.labels}>VALIDAR</Text>
                </View>
                <ScrollView style={styles.invoices}>
                    {facturas && facturas.map((factura, index) => (
                        <View key={index} style={styles.itemInvoice}>
                            <Text>{factura.fecha_creacion}</Text>
                            <RadioButton
                                status={checked.includes(index) ? 'checked' : 'unchecked'} // Comprueba si el array contiene el índice actual
                                onPress={() => handlePress(index)} // Pasa el índice actual
                            />
                        </View>
                    ))}
                </ScrollView>
                <TouchableOpacity style={styles.button} onPress={handleSend}>
                    <Text style={styles.buttonText}>Enviar</Text>
                </TouchableOpacity>
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
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 30,
        width: sizes.navbarWidth,
        height: sizes.navbarHeight,
        marginTop: 20,
        borderRadius: borders.mediumRadious,
        borderWidth: borders.smallRadiousWith,
        borderColor: borders.borderColor,
        backgroundColor: colors.primary,
    },
    labels: {
        fontSize: fontSizes.subLabels,
        padding: 5,
    },
    invoices: {
        width: sizes.navbarWidth,
        borderRadius: borders.mediumRadious,
        borderWidth: borders.smallRadiousWith,
        borderColor: borders.borderColor,
        backgroundColor: colors.primary,
        paddingEnd: 10,
        paddingStart: 10,
        paddingBottom: 10,
        flexGrow: 1
    },
    itemInvoice: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 15,
        borderTopWidth: borders.smallRadiousWith,
        borderBottomWidth: borders.smallRadiousWith,
    },
    button: {
        width: 150,
        height: 50,
        backgroundColor: "white",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 5,
        marginVertical: 10,
        borderColor: "black",
        borderWidth: 3,
        borderRadius: 10,
    },
    buttonText: {
        color: colors.text,
        fontSize: fontSizes.subTitlesCamps,
    },
});
