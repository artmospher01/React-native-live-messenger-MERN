import { View, Text, Image, Pressable } from "react-native";
import React, { useContext } from "react";
import axios from "axios";
import { UserType } from "../context/userContext";
import { useNavigation } from "@react-navigation/native";

export default function ShowFriendRequests({
  item,
  listRequest,
  setListRequest,
}) {
  const { userId, setuserId } = useContext(UserType);

  const naviagation = useNavigation();
  const acceptedFriend = async (senderID) => {
    try {
      const { data } = await axios.post(
        "http://10.0.2.2:8080/friend-request-accepted",
        {
          senderID: senderID,
          reciverID: userId,
        }
      );

      if (data.success) {
        setListRequest(
          listRequest.filter((a) => a._id.toString() !== senderID.toString())
        );

        naviagation.navigate("Chat");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Pressable
      style={{
        flexDirection: "row",
        marginHorizontal: 10,
        marginVertical: 12,
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <View>
        <Image
          source={{ uri: `http://10.0.2.2:8080/${item.image}` }}
          style={{
            width: 60,
            height: 60,
            borderRadius: 50,
          }}
        />
      </View>

      <View>
        <Text
          style={{
            textTransform: "capitalize",
            fontWeight: "bold",
            fontSize: 16,
            flex: 1,
            textAlignVertical: "center",
          }}
        >
          {item.name}{" "}
          <Text style={{ fontWeight: 400 }}>Send you a friend request</Text>
        </Text>
      </View>

      <Pressable
        onPress={() => acceptedFriend(item._id)}
        style={{
          backgroundColor: "#201e94",
          width: 68,
          height: 36,
          justifyContent: "center",
          borderRadius: 8,
        }}
      >
        <Text
          style={{
            color: "white",
            fontSize: 16,
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          Accept
        </Text>
      </Pressable>
    </Pressable>
  );
}
