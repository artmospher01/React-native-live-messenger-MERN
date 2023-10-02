import { View, Text, ScrollView } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { UserType } from "../context/userContext";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import ShowAllFriends from "../components/ShowAllFriends";

export default function ChatScreen() {
  const { userId, setuserId } = useContext(UserType);
  const [allYourFriends, setAllYourFriends] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const getYourFriends = async () => {
      try {
        const { data } = await axios.get(
          `http://10.0.2.2:8080/your-friends/${userId}`
        );

        if (data.success) {
          setAllYourFriends(data.yourFriends);
        }
      } catch (error) {
        console.log("error", error);
      }
    };
    getYourFriends();
  }, []);
  return (
    <ScrollView>
      {allYourFriends.map((a, i) => (
        <ShowAllFriends key={i} item={a} />
      ))}
    </ScrollView>
  );
}
