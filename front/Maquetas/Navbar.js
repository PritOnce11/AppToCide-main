import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { IP_MAIN } from '@env'

import { borders, colors, fontSizes, sizes } from '../constantes/themes';

import { useNavigation, CommonActions } from '@react-navigation/native';
import BurgerMenu from "../Maquetas/BurgerBtn";
import { useEffect, useState } from "react";

export default function Navbar() {
    const navigation = useNavigation();

    const [contactName, setContactName] = useState('');

    useEffect(() => {
        const getMenuPageData = async () => {
            try {
                const response = await fetch(IP_MAIN + '/menuPage', { credentials: 'include' });
                const data = await response.json();

                if (data.loggedIn) {
                    const firstLetterName = data.contactName.nombr1.charAt(0);
                    const firstLetterSurname = data.contactName.apellido1.charAt(0);
                    setContactName(firstLetterName + firstLetterSurname);
                } else {
                    console.log('No estás logueado');
                }
            } catch (error) {
                console.error('Error al hacer la solicitud:', error);
            }
        };

        getMenuPageData();
    }, []);

    function open() {
        pickerRef.current.focus();
    }

    function close() {
        pickerRef.current.blur();
    }

    const handleSignOut = async () => {
        try {
            const response = await fetch(IP_MAIN + '/logout', { method: 'GET' });
            const data = await response.json();

            if (data.logout) {
                navigation.dispatch(
                    CommonActions.reset({
                        index: 0,
                        routes: [
                            { name: 'LoginPage' },
                        ],
                    })
                );
            } else {
                console.error('Error al cerrar la sesión');
            }
        } catch (error) {
            console.error('Error al hacer la solicitud:', error);
        }
    }


    return (
        <View style={styles.container}>
            <View style={styles.navbarStyle}>
                <BurgerMenu />
                <View style={styles.username}>
                    <Text>{contactName}</Text>
                </View>
                <TouchableOpacity onPress={handleSignOut} style={styles.buttonLeave}>
                    <Text>SALIR</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "center",
    },
    buttonLeave: {
        width: sizes.leaveBtnWidth,
        height: sizes.leaveBtnHeight,
        backgroundColor: colors.primary,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: borders.bigRadious,
        borderWidth: borders.bigRadiousWith,
    },
    navbarStyle: {
        width: sizes.navbarWidth,
        height: sizes.navbarHeight,
        flexDirection: "row",
        justifyContent: "flex-end",
        marginTop: -150,
        marginRight: -20,
        zIndex: 1,
    },
    username: {
        marginRight: 10,
        borderRadius: 50, // Esto hará que el fondo sea un círculo
        borderWidth: borders.bigRadiousWith,
        padding: 5,
        textAlign: 'center', // Esto centrará el texto en el círculo
        width: 50, // Establece el ancho del círculo
        height: 50, // Establece la altura del círculo
        lineHeight: 50, // Esto centrará verticalmente el texto en el círculo
        backgroundColor: 'white', // Esto establece el color de fondo del círculo
        marginTop: -8, // Esto subirá el círculo
        justifyContent: 'center', // Esto centrará el texto en el círculo
        alignItems: 'center', // Esto centrará el texto en el círculo
    },
})