import {
  View,
  Text,
  KeyboardAvoidingView,
  TextInput,
  Alert,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { ButtonHaveAccount, ButtonLogin } from "../components/Button";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserType } from "../context/userContext";

const Login = () => {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const navigation = useNavigation();
  const { userId, setUserId } = useContext(UserType);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const token = await AsyncStorage.getItem("auth-token");
        if (token) {
          navigation.replace("Home");
        } else {
          return;
        }
      } catch (error) {
        console.log(error);
      }
    };

    checkLogin();
  }, []);

  const handlerLogin = async () => {
    try {
      const { data } = await axios.post("http://10.0.2.2:8080/login", {
        email,
        password,
      });

      if (data.success) {
        await AsyncStorage.setItem("auth-token", JSON.stringify(data.token));
        // await AsyncStorage.setItem("full-user", JSON.stringify(data.user));
        // console.log(await AsyncStorage.getItem("full-user"));
        navigation.replace("Home");
      }
    } catch (error) {
      console.log("someting is error", error);
      Alert.alert(
        "Login Failed",
        "there are wrong with your email or password"
      );
    }
  };

  const handlerHaveAccount = () => {
    navigation.navigate("Register");
  };

  return (
    <View style={{ padding: 10, flex: 1 }}>
      <KeyboardAvoidingView>
        <View style={{ marginTop: 80, alignItems: "center" }}>
          <Text
            style={{
              fontSize: 23,
              fontWeight: 500,
              color: "#4A55A2",
              marginBottom: 14,
            }}
          >
            Sign In
          </Text>
          <Text style={{ fontSize: 22, fontWeight: 500 }}>
            Sign In to Your Account
          </Text>
        </View>

        <View style={{ marginTop: 50, marginHorizontal: 30 }}>
          <Text style={{ fontSize: 20, color: `#2e2a2a` }}>Email</Text>
          <TextInput
            value={email}
            onChangeText={(value) => setemail(value)}
            placeholder="Enter your email"
            placeholderTextColor={"#6e6665"}
            style={{
              borderBottomColor: "gray",
              borderBottomWidth: 1,
              marginTop: 8,
              fontSize: 18,
            }}
          />

          <Text style={{ fontSize: 20, color: `#2e2a2a`, marginTop: 20 }}>
            Password
          </Text>
          <TextInput
            value={password}
            onChangeText={(value) => setpassword(value)}
            placeholder="Enter your password"
            placeholderTextColor={"#6e6665"}
            secureTextEntry
            style={{
              borderBottomColor: "gray",
              borderBottomWidth: 1,
              marginTop: 8,
              fontSize: 18,
            }}
          />
        </View>
        <View style={{ marginTop: 60, alignItems: "center" }}>
          <ButtonLogin name={"Login"} handler={handlerLogin} />
          <ButtonHaveAccount
            name={"Don't have an acoount? Sign up"}
            handler={handlerHaveAccount}
          />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default Login;
