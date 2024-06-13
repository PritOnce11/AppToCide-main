import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image } from "react-native";
import Fondo from "../Maquetas/Fondo";
import { borders, colors, fontSizes, sizes } from '../constantes/themes';
import Navbar from "../Maquetas/Navbar";
import { useNavigation } from '@react-navigation/native';
import { IP_MAIN } from '@env';

export default function ServiciosPage() {
    const navigation = useNavigation();
    const [searchText, setSearchText] = useState('');
    const [servicios, setServicios] = useState([]);
    const [cartCount, setCartCount] = useState(0);

    const addToCart = (servicios) => {
        setServicios(currentCart => [...currentCart, servicios]);

        fetch(IP_MAIN + '/serviciosPage', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(servicios),
            credentials: 'include'
        })
            .then(response => response.json())
            .then(data => {
                // Incrementa cartCount basado en la respuesta del servidor
                setCartCount(data.cartCount);
            })
            .catch(error => console.error('Error:', error));
    };

    useEffect(() => {
        fetch(IP_MAIN + '/serviciosPage', {
            method: 'GET',
            credentials: 'include'
        })
            .then(response => response.json())
            .then(data => {
                if (data.loggedIn) {
                    setServicios(data.servicios);
                    // Set cart count
                    setCartCount(data.cartCount);
                } else {
                    // handle the case when the user is not logged in
                }
            })
            .catch(error => console.error('Error:', error));
    }, []);

    const handleSearch = () => {
        console.log(searchText); // Reemplaza esto con tu función de búsqueda
    };

    return (
        <Fondo>
            <Navbar />
            <View style={styles.container}>
                <Text style={{ fontSize: fontSizes.buttonsLabels }}>SERVICIOS</Text>
                <View style={styles.groupLabel}>
                    <TouchableOpacity style={styles.menuButton}>
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
                    <TouchableOpacity onPress={() => navigation.navigate("CarritoPageServ")}>
                        <Text style={styles.menuButtonText}>🛒{cartCount}</Text>
                    </TouchableOpacity>
                </View>
                <ScrollView contentContainerStyle={styles.data}>
                    {servicios.map((servicios, index) => (
                        <View key={index} style={styles.itemInvoice}>
                            <View style={styles.plz}>
                                <Text style={{ fontSize: fontSizes.formSizes }}>{servicios.nombre}</Text>
                                <Text style={{ fontSize: fontSizes.formSizes, textAlign: 'center' }}>{servicios.precio}$</Text>
                            </View>
                            <TouchableOpacity onPress={() => addToCart(servicios)}>
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
    plz: {
        alignItems: 'center',
    }
});
