import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { IP_MAIN } from '@env'

import Fondo from "../Maquetas/Fondo";
import { borders, colors, fontSizes, sizes } from '../constantes/themes';

import { useNavigation, CommonActions } from '@react-navigation/native';
export default function MenuAdmin() {
    const navigation = useNavigation();

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
        <Fondo>
            <View style={styles.container}>
                <View style={styles.navbarStyle}>
                    <Image source={require("../assets/icono.png")} />
                    <TouchableOpacity onPress={handleSignOut} style={styles.buttonLeave}>
                        <Text>SALIR</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.btnGroup}>
                    <TouchableOpacity onPress={() => navigation.navigate('AlumnosAdmin')}
                    style={styles.menuBtn}>
                        <Text style={styles.txtBtn}>ALUMNOS</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('Validar')}
                    style={styles.menuBtn}>
                        <Text style={styles.txtBtn}>VALIDAR</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Fondo>
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
        marginRight: -30,
    },
    btnGroup: {
        justifyContent: "space-around",
    },
    menuBtn: {
        width: sizes.menuBtnWidth,
        height: sizes.menuBtnHeight,
        backgroundColor: colors.primary,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: borders.bigRadious,
        borderWidth: borders.bigRadiousWith,
        marginVertical: 60,
    },
    txtBtn: {
        fontSize: fontSizes.buttonsLabels,
    }
})