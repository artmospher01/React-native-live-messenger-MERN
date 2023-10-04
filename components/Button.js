import { View, Text, Pressable, StyleSheet } from "react-native";
import React from "react";

const ButtonLogin = ({ name, handler }) => {
  return (
    <Pressable
      onPress={handler}
      style={({ pressed }) => [
        {
          backgroundColor: pressed ? "#646396" : "#201e94",
        },
        styles.containerButtonLogin,
      ]}
    >
      <Text style={styles.textButtonLogin}>{name}</Text>
    </Pressable>
  );
};

const ButtonHaveAccount = ({ name, handler }) => {
  return (
    <Pressable onPress={handler} style={styles.containerHaveAccount}>
      <Text style={styles.textHaveAccount}>{name}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  containerButtonLogin: {
    width: 160,
    height: 46,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  textButtonLogin: {
    fontSize: 20,
    fontWeight: "500",
    color: "white",
  },
  containerHaveAccount: {
    marginTop: 14,
  },
  textHaveAccount: {
    fontSize: 17,
    fontWeight: "400",
  },
});

export { ButtonLogin, ButtonHaveAccount };
