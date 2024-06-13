import React from 'react';
import { Text, View, StyleSheet, TextInput, Switch } from "react-native";
import { colors, fontSizes, sizes, borders } from "../constantes/themes";
export default function FormStudent({
    setNames, setSurnames, setAddress, setBirthDate,
    setDni, setGrade, setPastGrade,
    setSeguro, seguro, setCuotaCide, cuotaCide, familiaNumerosa,
    setFamiliaNumerosa
}) {

    const toggleSwitch = () =>
        setSeguro((previousState) => !previousState);

    const toggleSwitchCuota = () =>
        setCuotaCide((previousState) => !previousState);
    const toggleSwitchFamilia = () =>
        setFamiliaNumerosa((previousState) => !previousState);

    return (
        <View style={styles.data}>
            <Text style={styles.label}>DATOS ESTUDIANTE</Text>
            <TextInput style={styles.input} placeholder="Nombres:" onChangeText={(text) => setNames(text)} />
            <TextInput style={styles.input} placeholder="Apellidos:" onChangeText={(text) => setSurnames(text)} />
            <TextInput style={styles.input} placeholder="Dirrección:" onChangeText={(text) => setAddress(text)} />
            <View style={styles.hugs}>
                <TextInput style={{ width: 160, height: 40, borderWidth: 3, borderColor: 'black', borderRadius: 10, paddingLeft: 10 }} placeholder="Birthdate(DD/MM/YYYY):" onChangeText={(text) => setBirthDate(text)} />
                <TextInput style={{ width: 160, height: 40, borderWidth: 3, borderColor: 'black', borderRadius: 10, marginLeft: 30, paddingLeft: 10 }} placeholder="DNI:" onChangeText={(text) => setDni(text)} />
            </View>
            <TextInput style={styles.input} placeholder="Curso a Cursar:" onChangeText={(text) => setGrade(text)} />
            <TextInput style={styles.input} placeholder="Colegio Anterior:" onChangeText={(text) => setPastGrade(text)} />
            <View style={styles.switch}>
                <View style={styles.switchData}>
                    <Text>Cuota{"\n"}Cide</Text>
                    <Switch
                        trackColor={{ false: "grey", true: "black" }}
                        onValueChange={toggleSwitchCuota}
                        value={cuotaCide}
                        thumbColor={cuotaCide ? "green" : "black"}
                    />
                </View>
                <View style={styles.switchData}>
                    <Text>Seguro{"\n"}Médico</Text>
                    <Switch
                        trackColor={{ false: "grey", true: "black" }}
                        onValueChange={toggleSwitch}
                        value={seguro}
                        thumbColor={seguro ? "green" : "black"}
                    />
                </View>

                <View style={styles.switchData}>
                    <Text>Familia{"\n"}Numerosa</Text>
                    <Switch
                        trackColor={{ false: "grey", true: "black" }}
                        onValueChange={toggleSwitchFamilia}
                        value={familiaNumerosa}
                        thumbColor={familiaNumerosa ? "green" : "black"}
                    />
                </View>

            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    scrollViewContent: {
        flexGrow: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#2C8344",
    },
    container: {
        backgroundColor: colors.secondary,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 50,
    },
    data: {
        backgroundColor: "white",
        padding: 20,
        borderRadius: 10,
        borderWidth: 3,
        borderColor: "black",
        display: "flex",
        marginBottom: 20,
    },
    input: {
        width: sizes.inputFromWith,
        height: sizes.inputFormHeight,
        color: "black",
        fontSize: 16,
        borderColor: "black",
        borderRadius: 10,
        borderWidth: 3,
        marginVertical: 10,
        padding: 10,
    },
    label: {
        color: "black",
        fontSize: 16,
        textAlign: "center",
    },
    hugs: {
        flexDirection: 'row'
    },
    switch: {
        flexDirection: 'row',
        justifyContent: 'center'
    },
    switchData: {
        borderWidth: borders.bigRadiousWith,
        borderColor: colors.text,
        borderRadius: borders.bigRadious,
        flexDirection: 'column',
        padding: 5,
        marginHorizontal: 10,
        width: 90,
        height: 100,
        alignItems: 'center',
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