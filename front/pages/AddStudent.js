import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { IP_MAIN } from "@env";

import FormStudent from "../Maquetas/FormStudent";
import { colors, fontSizes } from "../constantes/themes";
import { useRegisterState, useErrorStates } from '../states/index.js';
import { ManageErrorsStudent } from "../errors/ManageErrorsStudent";
import ErrorModal from "../Maquetas/ErrorModal";

import { useNavigation } from '@react-navigation/native';

export default function AddStudent() {
    const navigation = useNavigation();

    const { names, setNames, surnames, setSurnames,
        address, setAddress, birthDate, setBirthDate,
        dni, setDni, grade, setGrade, pastGrade, setPastGrade,
        seguro, setSeguro, cuotaCide, setCuotaCide,
        familiaNumerosa, setFamiliaNumerosa
    } = useRegisterState();

    const {
        errorModalVisible,
        setErrorModalVisible,
        errorMessage,
        setErrorMessage
    } = useErrorStates();

    const handleRegister = async () => {

        const validationError = ManageErrorsStudent({
            names, surnames, address, birthDate,
            dni, grade, pastGrade, seguro
        });

        if (validationError) {
            setErrorMessage(validationError);
            setErrorModalVisible(true);
            return; // Evita continuar con el envío de la solicitud al backend
        }

        try {
            const response = await fetch(IP_MAIN + "/addStudent", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    names, surnames, address, birthDate, dni, grade, pastGrade,
                    setPastGrade, seguro, cuotaCide, familiaNumerosa
                }),
            });
            const data = await response.json();
            if (response.ok) {
                navigation.navigate("PerfilPage");
            } else {
                setErrorMessage(
                    data.message
                );
                setErrorModalVisible(true);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    return (
        <View style={styles.container}>
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
                familiaNumerosa={familiaNumerosa}
            />
            <TouchableOpacity style={styles.button} onPress={handleRegister}>
                <Text style={styles.buttonText}>Registrar</Text>
            </TouchableOpacity>
            <ErrorModal
                visible={errorModalVisible}
                message={errorMessage}
                onClose={() => setErrorModalVisible(false)}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.secondary,
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
})