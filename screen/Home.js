import { View, Text, ScrollView } from "react-native";
import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwtDecode from "jwt-decode";
import axios from "axios";
import { UserType } from "../context/userContext";
import ShowUser from "../components/showUser";

export default function Home() {
  const navigation = useNavigation();
  const { userId, setuserId } = useContext(UserType);
  const [users, setusers] = useState(null);

  const logOut = async () => {
    try {
      await AsyncStorage.removeItem("auth-token");
      const token = await AsyncStorage.getItem("auth-token");
      if (!token) {
        navigation.replace("Login");
      } else {
        return;
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "",
      headerLeft: () => (
        <Text style={{ fontSize: 16, fontWeight: "bold" }}>Live Chat</Text>
      ),
      headerRight: () => (
        <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
          <Ionicons
            name="ios-chatbubble-ellipses-outline"
            size={24}
            color="black"
            onPress={() => navigation.navigate("Chat")}
          />

          <Ionicons
            name="people-outline"
            size={24}
            color="black"
            onPress={() => navigation.navigate("FriendRequests")}
          />

          <Ionicons
            onPress={logOut}
            name="log-out-outline"
            size={24}
            color="black"
          />
        </View>
      ),
    });
  }, []);

  useEffect(() => {
    const showUsers = async () => {
      try {
        const token = await AsyncStorage.getItem("auth-token");
        if (token) {
          const decode = jwtDecode(token);
          setuserId(decode.id);

          const { data } = await axios.get(
            `http://10.0.2.2:8080/user/${decode.id}`
          );

          if (data) {
            setusers(data.users);
          }
        } else {
          console.log("your not login yet");
        }
      } catch (error) {
        console.log("error", error);
      }
    };
    showUsers();
  }, []);

  return (
    <ScrollView>
      {users ? users.map((a, i) => <ShowUser key={i} item={a} />) : <></>}
      {/* {console.log(users)} */}
    </ScrollView>
  );
}
