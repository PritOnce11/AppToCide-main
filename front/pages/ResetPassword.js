import { IP_MAIN } from '@env'

import React, { useEffect, useState } from "react";
import Fondo from "../Maquetas/Fondo";
import { Text, StyleSheet, TouchableOpacity, View, TextInput, Alert } from "react-native";
import { borders, colors, fontSizes, sizes } from '../constantes/themes';

import ErrorModal from '../Maquetas/ErrorModal';
import { useErrorStates } from '../states/index.js';

import { useNavigation } from "@react-navigation/native";

export default function ResetPassword() {
    const navigation = useNavigation();

    const [userText, setUserText] = useState("");
    const [passText, setPassText] = useState("");
    const [repitPassText, setRepitPassText] = useState("");

    const {
        errorModalVisible,
        setErrorModalVisible,
        errorMessage,
        setErrorMessage
    } = useErrorStates();

    const handleUpdate = () => {
        fetch(IP_MAIN + '/restartPassw', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userText, passText, repitPassText }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.message === "Contraseña actualizada correctamente") {
                    Alert.alert("Contraseña actualizada correctamente");
                    navigation.navigate('LoginPage');
                } else {
                    setErrorMessage(data.message);
                    setErrorModalVisible(true);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };

    return (
        <Fondo>
            <View style={styles.container}>

                <TextInput
                    style={styles.input}
                    placeholder="Usuario:"
                    onChangeText={text => setUserText(text)}

                />

                <TextInput
                    style={styles.input}
                    placeholder="Nueva Contraseña:"
                    secureTextEntry
                    onChangeText={text => setPassText(text)}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Repite Nueva Contraseña:"
                    secureTextEntry
                    onChangeText={text => setRepitPassText(text)}
                />

                <TouchableOpacity style={styles.button} onPress={handleUpdate}>
                    <Text style={styles.buttonText}>Actualizar</Text>
                </TouchableOpacity>

                <ErrorModal
                    visible={errorModalVisible}
                    message={errorMessage}
                    onClose={() => setErrorModalVisible(false)}
                />
            </View>
        </Fondo>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    input: {
        width: sizes.mainWith,
        height: sizes.mainHeight,
        fontSize: fontSizes.subLabels,
        backgroundColor: colors.primary,
        marginVertical: 10,
        borderWidth: borders.bigRadiousWith,
        borderRadius: borders.bigRadious,
        borderColor: colors.text,
        padding: 20
    },
    button: {
        width: 150,
        height: 51,
        backgroundColor: "white",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
        borderWidth: 3,
        borderColor: "black",
        marginVertical: 25,
    },
    buttonText: {
        color: colors.text,
        fontSize: fontSizes.subTitlesCamps,
    },
});