import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { IP_MAIN } from '@env'

import { borders, colors, sizes } from '../constantes/themes';

import { useNavigation, CommonActions } from '@react-navigation/native';
import BurgerMenuAdmin from "../Maquetas/BurgerBtnAdmin";

export default function NavbarAdmin() {
    const navigation = useNavigation();

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
                <BurgerMenuAdmin />
                <Image source={require("../assets/icono.png")} />
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
    }
})