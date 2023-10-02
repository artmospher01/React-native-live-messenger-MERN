import { View, Text, Pressable, Image } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { UserType } from "../context/userContext";
import axios from "axios";

const ShowAllFriends = ({ item }) => {
  const navigation = useNavigation();
  const [messageValue, setmessageValue] = useState([]);
  const { userId, setuserId } = useContext(UserType);

  useEffect(() => {
    const getMessage = async () => {
      try {
        const { data } = await axios.get(
          `http://10.0.2.2:8080/messages-send/${userId}/${item._id}`
        );

        if (data.success) {
          setmessageValue(data.messages);
        }
      } catch (error) {
        console.log("error:", error);
      }
    };

    getMessage();
  }, [lastMessage]);
  // console.log(messageValue);

  const handleLastMessage = () => {
    const textMessage = messageValue.filter((a) => a.messageType == "text");
    const n = textMessage.length;

    return textMessage[n - 1];
  };
  const lastMessage = handleLastMessage();

  const timeFormat = (time) => {
    const option = { hour: "numeric", minute: "numeric" };
    return new Date(time).toLocaleString("en-US", option);
  };
  return (
    <Pressable
      onPress={() =>
        navigation.navigate("Message", {
          reciverId: item._id,
        })
      }
      style={{
        flexDirection: "row",
        padding: 8,
        borderBottomWidth: 0.75,
        borderColor: "gray",
      }}
    >
      <View>
        <Image
          style={{ width: 60, height: 60, borderRadius: 50 }}
          source={{ uri: `http://10.0.2.2:8080/${item.image}` }}
        />
      </View>
      <View style={{ flex: 1, marginLeft: 10 }}>
        <Text style={{ fontSize: 17, fontWeight: "bold" }}>{item.name}</Text>

        <Text style={{ fontSize: 14, color: "gray" }}>
          {lastMessage ? lastMessage.message : null}
        </Text>
      </View>
      <Text style={{ alignSelf: "center" }}>
        {lastMessage ? timeFormat(lastMessage.timeStamp) : null}
      </Text>
    </Pressable>
  );
};

export default ShowAllFriends;
