import { View, Text, Pressable, Image } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { UserType } from "../context/userContext";
import axios from "axios";

const ShowUser = ({ item }) => {
  const { userId, setUserId } = useContext(UserType);
  const [successRequest, setsuccessRequest] = useState(false);
  const [sendReqData, setsendReqData] = useState([]);
  const [allFriendsId, setallFriendsId] = useState([]);

  useEffect(() => {
    const getAllSendReq = async () => {
      try {
        const { data } = await axios.get(
          `http://10.0.2.2:8080/all-send-request-id/${userId}`
        );
        if (data.success) {
          setsendReqData(data.sendFriendRequests);
        }
      } catch (error) {
        console.log("error:", error);
      }
    };
    getAllSendReq();
  }, []);

  useEffect(() => {
    const getAllfriendsId = async () => {
      try {
        const { data } = await axios.get(
          `http://10.0.2.2:8080/all-friends-id/${userId}`
        );
        // console.log(data);
        if (data.success) {
          setallFriendsId(data.friendsId);
        }
      } catch (error) {
        console.log("error:", error);
      }
    };
    getAllfriendsId();
  }, []);

  // console.log("sent req: ", sendReqData._id);
  // console.log("all friends id: ", allFriendsId);

  const friendRequest = async (curentlyUserId, selectedUserId) => {
    try {
      const data = await fetch(`http://10.0.2.2:8080/friend-request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ curentlyUserId, selectedUserId }),
      });
      if (data.ok) {
        setsuccessRequest(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Pressable style={{ flexDirection: "row", margin: 16 }}>
      <View>
        <Image
          style={{
            height: 60,
            width: 60,
            borderRadius: 100,
            resizeMode: "cover",
          }}
          source={{
            uri: `http://10.0.2.2:8080/${item.image}`,
          }}
        />
      </View>

      <View style={{ marginLeft: 20, flex: 1 }}>
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>{item.name}</Text>
        <Text style={{ fontSize: 18 }}>{item.email}</Text>
      </View>
      {allFriendsId.includes(item._id) ? (
        <Pressable
          // onPress={() => friendRequest(userId, item._id)}
          style={{
            backgroundColor: "#32cd32",
            height: 48,
            borderRadius: 10,
            justifyContent: "center",
            padding: 8,
            width: 120,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "white", fontSize: 16, fontWeight: "500" }}>
            Friend
          </Text>
        </Pressable>
      ) : successRequest ||
        sendReqData.some((sendReq) => sendReq._id === item._id) ? (
        <Pressable
          // onPress={() => friendRequest(userId, item._id)}
          style={{
            backgroundColor: "#778899",
            height: 48,
            borderRadius: 10,
            justifyContent: "center",
            padding: 8,
            width: 120,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "white", fontSize: 16, fontWeight: "500" }}>
            Request Send
          </Text>
        </Pressable>
      ) : (
        <Pressable
          onPress={() => friendRequest(userId, item._id)}
          style={{
            backgroundColor: "#201e94",
            height: 48,
            borderRadius: 10,
            justifyContent: "center",
            padding: 8,
            width: 120,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "white", fontSize: 16, fontWeight: "500" }}>
            Add Friends
          </Text>
        </Pressable>
      )}
    </Pressable>
  );
};

export default ShowUser;
