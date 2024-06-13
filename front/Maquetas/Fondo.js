import { View, Image, StyleSheet, ScrollView } from "react-native";

import { colors, sizes } from "../constantes/themes";

export default function Fondo({ children }) {
  return (

    <View style={styles.container}>
      <Image source={require("../assets/logoCide.png")} style={styles.logo} />
      <View style={styles.square}>
        {children}
      </View>
    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    marginTop: 90,
    aspectRatio: 1,
    position: 'absolute',
    top: 0,
    width: sizes.logoWidth,
    height: sizes.logoHeigt
  },
  square: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#2C8344',
    position: 'absolute',
    bottom: 0,
    borderTopLeftRadius: 100,
  }
});