import {
  View,
  Text,
  KeyboardAvoidingView,
  TextInput,
  Alert,
  Pressable,
} from "react-native";
import React, { useState } from "react";
import { ButtonHaveAccount, ButtonLogin } from "../components/Button";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { REACT_APP_URL_PORT } from "@env";

const Register = () => {
  const [name, setname] = useState("");
  const [image, setimage] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const navigation = useNavigation();
  console.log(REACT_APP_URL_PORT);

  const pickerImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (result.canceled === false) {
        setimage(result.assets[0].uri);
      }
    } catch (error) {
      console.log("error :", error);
    }
  };
  const handlerRegister = async () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("image", {
      uri: image,
      type: "image/jpeg",
      name: "image.jpg",
    });
    console.log(formData);
    axios
      .post("http://10.0.2.2:8080/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log(response);
        Alert.alert(
          "registration successfull",
          "you have been registred successfull"
        );
        setemail("");
        setimage("");
        setpassword("");
        setname("");
      })
      .catch((error) => {
        console.log("register error", error);
        Alert.alert(
          "registration Failed",
          "an error occured ehile registrating"
        );
      });
  };

  const handlerHaveAccount = () => {
    navigation.navigate("Login");
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
            Register
          </Text>
          <Text style={{ fontSize: 22, fontWeight: 500 }}>
            Sign Up Your Account
          </Text>
        </View>

        <View style={{ marginTop: 50, marginHorizontal: 30 }}>
          <Text style={{ fontSize: 20, color: `#2e2a2a` }}>Name</Text>
          <TextInput
            value={name}
            onChangeText={(value) => setname(value)}
            placeholder="Enter your name"
            placeholderTextColor={"#6e6665"}
            style={{
              borderBottomColor: "gray",
              borderBottomWidth: 1,
              marginTop: 8,
              fontSize: 18,
            }}
          />

          <Text style={{ marginTop: 20, fontSize: 20, color: `#2e2a2a` }}>
            Email
          </Text>
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
          <Pressable
            onPress={pickerImage}
            style={{
              marginTop: 20,
              borderBottomColor: "gray",
              borderBottomWidth: 1,
            }}
          >
            <Text style={{ fontSize: 20 }}>Profile Picture</Text>
            <MaterialCommunityIcons
              style={{
                alignSelf: "center",
                marginTop: 10,
              }}
              name="camera"
              size={60}
              color="black"
            />
          </Pressable>
        </View>
        <View style={{ marginTop: 40, alignItems: "center" }}>
          <ButtonLogin name={"Register"} handler={handlerRegister} />
          <ButtonHaveAccount
            name={"Don't have an acoount? Sign up"}
            handler={handlerHaveAccount}
          />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default Register;
