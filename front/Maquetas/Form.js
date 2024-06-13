import { Text, View, StyleSheet, TextInput, Switch, ScrollView, TouchableOpacity } from "react-native";

import { borders, colors, fontSizes, sizes } from "../constantes/themes";
import FormStudent from "./FormStudent";
export default function Form({
    setUsername, setPassword, setNames, setSurnames, setAddress, setBirthDate,
    setDni, setGrade, setPastGrade, setContactNames, setContactSurnames, setContactDni,
    setContactEmail, setSeguro, seguro, setCuotaCide, cuotaCide, familiaNumerosa,
    setFamiliaNumerosa, setIBAN, handleRegister
}) {



    return (

        <ScrollView contentContainerStyle={styles.scrollViewContent}>
            <View style={styles.container}>
                <View style={styles.data}>
                    <Text style={styles.label}>DATOS CUENTA</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Usuario:"
                        onChangeText={(text) => setUsername(text)}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Contraseña:"
                        secureTextEntry
                        onChangeText={(text) => setPassword(text)}
                    />
                </View>


                <FormStudent
                    setNames={setNames}
                    setSurnames={setSurnames}
                    setAddress={setAddress}
                    setBirthDate={setBirthDate}
                    setDni={setDni}
                    setGrade={setGrade}
                    setPastGrade={setPastGrade}
                    setSeguro={setSeguro}
                    seguro={seguro}
                    setCuotaCide={setCuotaCide}
                    cuotaCide={cuotaCide}
                    setFamiliaNumerosa={setFamiliaNumerosa}
                    familiaNumerosa={familiaNumerosa}/>

                <View style={styles.data}>
                    <Text>DATOS CONTACTO</Text>
                    <TextInput style={styles.input} placeholder="Nombres:"
                        onChangeText={(text) => setContactNames(text)} />
                    <TextInput style={styles.input} placeholder="Apellidos:"
                        onChangeText={(text) => setContactSurnames(text)} />
                    <TextInput style={styles.input} placeholder="DNI:"
                        onChangeText={(text) => setContactDni(text)} />
                    <TextInput style={styles.input} placeholder="Email:"
                        onChangeText={(text) => setContactEmail(text)} />
                </View>

                <View style={styles.data}>
                    <Text>DATOS BANCARIOS</Text>
                    <TextInput style={styles.input} placeholder="NUMERO CUENTA BANCARIA"
                        onChangeText={(text) => setIBAN(text)} />
                </View>

                <TouchableOpacity style={styles.button} onPress={handleRegister}>
                    <Text style={styles.buttonText}>Registrar</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>

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