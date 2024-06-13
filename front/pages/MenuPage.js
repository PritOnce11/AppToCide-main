import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

import Fondo from "../Maquetas/Fondo";
import { borders, colors, fontSizes, sizes } from '../constantes/themes';

import { useNavigation } from '@react-navigation/native';

import Navbar from "../Maquetas/Navbar";
export default function MenuPage() {
    const navigation = useNavigation();

    return (
        <Fondo>
            <View style={styles.container}>
                <Navbar />

                <View style={styles.btnGroup}>
                    <TouchableOpacity onPress={() => navigation.navigate('FacturasPage')}
                        style={styles.menuBtn}>
                        <Text style={styles.txtBtn}>Facturas</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('PerfilPage')}
                        style={styles.menuBtn}>
                        <Text style={styles.txtBtn}>Perfil</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('ServiciosPage')}
                        style={styles.menuBtn}>
                        <Text style={styles.txtBtn}>Servicios / Extraescolares</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('MaterialPage')}
                        style={styles.menuBtn}>
                        <Text style={styles.txtBtn}>Material</Text>
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
    btnGroup: {
        justifyContent: "space-around",
        marginTop: -100,
    },
    menuBtn: {
        width: sizes.menuBtnWidth,
        height: sizes.menuBtnHeight,
        backgroundColor: colors.primary,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: borders.bigRadious,
        borderWidth: borders.bigRadiousWith,
        marginVertical: 10,
    },
    txtBtn: {
        fontSize: fontSizes.buttonsLabels,
    },
})