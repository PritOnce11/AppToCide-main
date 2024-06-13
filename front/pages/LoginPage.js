import React, { useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";
import Fondo from "../Maquetas/Fondo";
import { useNavigation } from "@react-navigation/native";
import ErrorModal from "../Maquetas/ErrorModal"; // Importar el compone ErrorModal
import { borders, colors, fontSizes, sizes } from "../constantes/themes";
import { useLoginStates, useErrorStates } from "../states/index.js";

import {IP_MAIN} from '@env';

export default function LoginPage() {
  const navigation = useNavigation();

  const {
    username,
    setUsername,
    password,
    setPassword
  } = useLoginStates();

  const { 
    errorModalVisible,
    setErrorModalVisible,
    errorMessage,
    setErrorMessage
  } = useErrorStates();
  
  const handleLogin = async () => {
    try {
      const response = await fetch(IP_MAIN + "/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (data.loggedIn) { // Verificar si el inicio de sesión fue exitoso
        if(username === 'admin' && password === 'admin') {
          navigation.navigate('MenuAdmin');
        } else {
          navigation.navigate('MenuPage');
        }
      } else {
        setErrorMessage(
          "Credenciales incorrectas. Por favor, inténtalo de nuevo."
        );
        setErrorModalVisible(true);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <Fondo>
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Usuario"
          onChangeText={(text) => setUsername(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          secureTextEntry
          onChangeText={(text) => setPassword(text)}
        />

        <TouchableOpacity onPress={() => navigation.navigate('ResetPassword')}>
          <Text>He olvidado la contraseña</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>
      </View>
      {/* Mostrar el modal de error si está visible */}
      <ErrorModal
        visible={errorModalVisible}
        message={errorMessage}
        onClose={() => setErrorModalVisible(false)}
      />
    </Fondo>
  );
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
    paddingLeft: 20,
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
