import React, { useState, useEffect } from 'react';
import { IP_MAIN } from '@env'

import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from "react-native";

import Fondo from "../Maquetas/Fondo";
import { borders, colors, fontSizes, sizes } from '../constantes/themes';

import NavbarAdmin from "../Maquetas/NavbarAdmin";
export default function AlumnosAdmin() {

    const [searchText, setSearchText] = useState(''); // Nuevo estado para almacenar el texto de búsqueda
    const [students, setStudent] = useState(null);

    useEffect(() => {
        fetch(IP_MAIN + '/studentPage') // Asegúrate de que esta URL es correcta
            .then(response => response.json())
            .then(data => {
                if (data.loggedIn) {
                    setStudent(data.students);
                } else {
                    // Maneja el caso en que el usuario no está conectado o no se encontró el contacto
                }
            });
    }, []);

    const handleSearch = () => {
        fetch(IP_MAIN + '/studentPage', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ dni: searchText }),
        })
            .then(response => response.json())
            .then(data => {
                console.log(searchText)
                if (data.loggedIn) {
                    setStudent(data.students);
                } else {
                    // Maneja el caso en que el usuario no está conectado o no se encontró el contacto
                }
            });
    };
    return (
        <Fondo>
            <NavbarAdmin />

            <View style={styles.container}>
                <Text style={{ fontSize: fontSizes.buttonsLabels }}>ALUMNOS</Text>

                <View style={styles.groupLabel}>
                    <View style={{
                        flexDirection: 'row', borderWidth: borders.smallRadiousWith,
                        borderRadius: borders.smallRadious, paddingHorizontal: 5
                    }}>
                        <TextInput
                            style={styles.buttons}
                            placeholder="DNI"
                            onChangeText={text => setSearchText(text)} // Actualiza el estado cuando el texto cambia
                        />
                        <TouchableOpacity onPress={handleSearch} style={styles.enterButton}>
                            <Text style={{ padding: 5 }}>🔎</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                {students && (
                    <ScrollView contentContainerStyle={styles.data} key={students.key}>

                        <View style={styles.menuBtn}>
                            <Text style={styles.txtBtn}>NOMBRE:</Text>
                            <Text style={styles.txtBtn}>{students.nombr1} {students.nombre2}</Text>
                        </View>
                        <View style={styles.menuBtn}>
                            <Text style={styles.txtBtn}>APELLIDO:</Text>
                            <Text style={styles.txtBtn}>{students.apellido1} {students.apellido2}</Text>
                        </View>
                        <View style={styles.menuBtn}>
                            <Text style={styles.txtBtn}>DIRRECION:</Text>
                            <Text style={styles.txtBtn}>{students.dirreccion}</Text>
                        </View>
                        <View style={styles.menuBtn}>
                            <Text style={styles.txtBtn}>FECHA NACIMIENTO:</Text>
                            <Text style={styles.txtBtn}>{students.fecha_nacimiento}</Text>
                        </View>
                        <View style={styles.menuBtn}>
                            <Text style={styles.txtBtn}>DNI:</Text>
                            <Text style={styles.txtBtn}>{students.dni}</Text>
                        </View>
                        <View style={styles.menuBtn}>
                            <Text style={styles.txtBtn}>CURSO:</Text>
                            <Text style={styles.txtBtn}>{students.curso}</Text>
                        </View>
                        <View style={styles.menuBtn}>
                            <Text style={styles.txtBtn}>IBAN:</Text>
                            <Text style={styles.txtBtn}>{students.iban}</Text>
                        </View>
                        <View style={styles.menuBtn}>
                            <Text style={styles.txtBtn}>DNI CONTACTO:</Text>
                            <Text style={styles.txtBtn}>{students.dni_contacto}</Text>
                        </View>
                    </ScrollView>
                )}
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
        justifyContent: "space-around", // Cambia esto
        alignItems: "center",
        width: sizes.navbarWidth,
        height: sizes.navbarHeight,
        marginTop: 20,
        borderRadius: borders.mediumRadious,
        borderWidth: borders.smallRadiousWith,
        borderColor: borders.borderColor,
        backgroundColor: colors.primary,
    },
    txtBtn: {
        fontSize: fontSizes.subLabels
    },
    data: {
        width: sizes.navbarWidth,
        borderRadius: borders.mediumRadious,
        borderWidth: borders.smallRadiousWith,
        borderColor: borders.borderColor,
        backgroundColor: colors.primary,
        paddingEnd: 10,
        paddingStart: 10,
        paddingBottom: 10,
        flexGrow: 1,
        justifyContent: 'center', // Añade esto
        alignItems: 'center', // Añade esto
    },
    menuBtn: {
        width: 224,
        height: 82,
        backgroundColor: colors.primary,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: borders.bigRadious,
        borderWidth: borders.bigRadiousWith,
        marginVertical: 10, // Ajusta esto a la cantidad de espacio que desees
    }
})