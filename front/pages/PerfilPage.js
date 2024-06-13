import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { IP_MAIN } from '@env'

import Fondo from "../Maquetas/Fondo";
import { borders, colors, fontSizes, sizes } from '../constantes/themes';

import Navbar from "../Maquetas/Navbar";
import { useEffect, useState } from "react";
import { useNavigation } from '@react-navigation/native';
export default function PerfilPage() {

    const navigation = useNavigation();

    const [contacto, setContacto] = useState(null);

    useEffect(() => {
        fetch(IP_MAIN + '/perfilPage', {
            method: 'GET',
            credentials: 'include', // Para enviar y recibir cookies
        })
            .then(response => response.json())
            .then(data => {
                if (data.loggedIn && data.contacto) {
                    setContacto(data.contacto);
                }
            })
            .catch(error => console.error(error));
    }, []);

    return (
        <Fondo>
            <Navbar />

            <View style={styles.container}>
                <Text style={{ fontSize: fontSizes.buttonsLabels }}>Perfil</Text>

                <View style={styles.groupLabel}>
                    <TouchableOpacity style={styles.buttons} onPress={() =>navigation.navigate("AddStudent")}>
                        <Text style={styles.labels}>AÑADIR HIJO</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.buttons}>
                        <Text style={styles.labels}>EDITAR</Text>
                    </TouchableOpacity>
                </View>
                <ScrollView contentContainerStyle={styles.data}>
                    {contacto ? (
                        <>
                            <View style={styles.itemData}>
                                <Text style={{ fontSize: fontSizes.buttonsLabels, textDecorationLine: 'underline'}}>NOMBRE:</Text>
                                <Text style={{ fontSize: fontSizes.subTitlesCamps }}>{contacto.nombr1} {contacto.nombre2}</Text>
                            </View>
                            <View style={styles.itemData}>
                                <Text style={{ fontSize: fontSizes.buttonsLabels, textDecorationLine: 'underline'}}>APELLIDO:</Text>
                                <Text style={{ fontSize: fontSizes.subTitlesCamps }}>{contacto.apellido1} {contacto.apellido2}</Text>
                            </View>
                            <View style={styles.itemData}>
                                <Text style={{ fontSize: fontSizes.buttonsLabels, textDecorationLine: 'underline'}}>DNI:</Text>
                                <Text style={{ fontSize: fontSizes.subTitlesCamps }}>{contacto.dni}</Text>
                            </View>
                            <View style={styles.itemData}>
                                <Text style={{ fontSize: fontSizes.buttonsLabels, textDecorationLine: 'underline'}}>NOMBRE:</Text>
                                <Text style={{ fontSize: fontSizes.subTitlesCamps }}>{contacto.email}</Text>
                            </View>
                        </>
                    ) : (
                        <Text style={styles.labels}>Cargando datos...</Text>
                    )}
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
    buttons: {
        borderRadius: 5,
        borderWidth: borders.smallRadiousWith,
    },
    labels: {
        fontSize: fontSizes.subLabels,
        padding: 5,
    },
    data: {
        width: sizes.navbarWidth,
        marginTop: 20,
        borderRadius: borders.mediumRadious,
        borderWidth: borders.smallRadiousWith,
        borderColor: borders.borderColor,
        backgroundColor: colors.primary,
        flexGrow: 1,
        alignItems: "flex-start",
        paddingLeft: 70,
    },
    itemData: {
        marginLeft: -40,
        flexDirection: "column",
        justifyContent: "space-between",
        paddingVertical: 15,
    }
})