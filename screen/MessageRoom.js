import {
  View,
  Text,
  KeyboardAvoidingView,
  ScrollView,
  TextInput,
  Pressable,
  Image,
  Platform,
  ImageBackground,
} from "react-native";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Entypo } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import EmojiSelector from "react-native-emoji-selector";
import { useNavigation, useRoute } from "@react-navigation/native";
import { UserType } from "../context/userContext";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons } from "@expo/vector-icons";

const MessageRoom = () => {
  const [showEmoji, setshowEmoji] = useState(false);
  const [messages, setmessages] = useState("");
  const { userId, setUserId } = useContext(UserType);
  const route = useRoute();
  const { reciverId } = route.params;
  const [selectImage, setselectImage] = useState("");
  const navigation = useNavigation();
  const [userTarget, setuserTarget] = useState({});
  const [messageValue, setmessageValue] = useState([]);
  const [selectedMessage, setselectedMessage] = useState([]);

  const ScrollViewRef = useRef(null);

  const handleScrollToBuottom = () => {
    if (ScrollViewRef.current) {
      ScrollViewRef.current.scrollToEnd({ Animation: false });
    }
  };
  useEffect(() => {
    handleScrollToBuottom();
  }, []);

  useEffect(() => {
    const getUsetTarget = async () => {
      try {
        const { data } = await axios.get(
          `http://10.0.2.2:8080/user-target/${reciverId}`
        );
        if (data.success) {
          setuserTarget(data.user);
        }
      } catch (error) {
        console.log(error);
      }
    };

    getUsetTarget();
  }, []);

  const getMessage = async () => {
    try {
      const { data } = await axios.get(
        `http://10.0.2.2:8080/messages-send/${userId}/${reciverId}`
      );

      if (data.success) {
        setmessageValue(data.messages);
      }
    } catch (error) {
      console.log("error:", error);
    }
  };
  useEffect(() => {
    getMessage();
  }, []);

  const pickerImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      // console.log(result.assets);
      if (result.canceled === false) {
        handleSend("image", result.assets[0].uri);
      }
    } catch (error) {
      console.log("error :", error);
    }
  };

  const handleSend = async (messageType, imageUrl) => {
    try {
      const fromData = new FormData();
      fromData.append("senderId", userId);
      fromData.append("reciverId", reciverId);

      if (messageType == "image") {
        fromData.append("messageType", "image");
        fromData.append("imageFile", {
          uri: imageUrl,
          type: "image/jpeg", // Sesuaikan tipe gambar yang sesuai
          name: "image.jpg", // Sesuaikan nama file jika diperlukan
        });
        setselectImage(imageUrl);
      } else {
        fromData.append("messageType", "text");
        fromData.append("messageText", messages);
      }

      const { data } = await axios.post(
        "http://10.0.2.2:8080/messages",
        fromData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (data.success) {
        setselectImage("");
        setmessages("");
        getMessage();
      }

      // console.log(data);
    } catch (error) {
      console.log(error);
    }
  };
  const handleDeleteMessage = async (messageId) => {
    try {
      const { data } = await axios.post("http://10.0.2.2:8080/deleteMessage", {
        messageId,
      });

      if (data.success) {
        setselectedMessage((prevMessage) =>
          prevMessage.filter((selected) => !messageId.includes(selected))
        );
        getMessage();
      } else {
        console.log("is eroorr");
      }
    } catch (error) {
      console.log("error: ", error);
    }
  };

  useEffect(() => {
    navigation.setOptions({
      headerTitle: "",
      headerLeft: () => (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Ionicons
            name="arrow-back"
            size={24}
            color="black"
            onPress={() => navigation.goBack()}
          />
          {selectedMessage.length > 0 ? (
            <View>
              <Text
                style={{ fontSize: 22, fontWeight: "bold", marginLeft: 10 }}
              >
                {selectedMessage.length}
              </Text>
            </View>
          ) : (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginLeft: 10,
              }}
            >
              <Image
                source={{ uri: userTarget.image }}
                style={{ width: 42, height: 42, borderRadius: 50 }}
              />
              <Text style={{ marginLeft: 5, fontSize: 18, fontWeight: "bold" }}>
                {userTarget.name}
              </Text>
            </View>
          )}
        </View>
      ),
      headerRight: () =>
        selectedMessage.length > 0 && (
          <View
            style={{ flexDirection: "row", gap: 9, justifyContent: "center" }}
          >
            <FontAwesome name="star" size={26} color="black" />
            <Ionicons name="arrow-undo" size={26} color="black" />
            <Ionicons name="arrow-redo" size={26} color="black" />
            <MaterialIcons
              onPress={() => handleDeleteMessage(selectedMessage)}
              name="delete"
              size={26}
              color="black"
            />
          </View>
        ),
    });
  }, [userTarget, selectedMessage]);

  const timeFormat = (time) => {
    const option = { hour: "numeric", minute: "numeric" };
    return new Date(time).toLocaleString("en-US", option);
  };

  const handleSelectMessage = (message) => {
    const alreadySelect = selectedMessage.includes(message._id);

    if (alreadySelect) {
      setselectedMessage((prevMessage) =>
        prevMessage.filter((alreadyMessages) => alreadyMessages !== message._id)
      );
    } else {
      setselectedMessage((prevMessage) => [...prevMessage, message._id]);
    }
  };

  // console.log(selectedMessage);
  return (
    <KeyboardAvoidingView style={{ flex: 1 }}>
      <ScrollView
        ref={ScrollViewRef}
        contentContainerStyle={{ flexGrow: 1 }}
        onContentSizeChange={() => handleScrollToBuottom()}
      >
        {messageValue.length > 0 &&
          messageValue?.map((a, i) => {
            if (a.messageType == "text") {
              return (
                <Pressable
                  key={i}
                  onLongPress={() => handleSelectMessage(a)}
                  style={[
                    // selectedMessage.filter((selected) => selected == a._id)
                    selectedMessage.includes(a._id)
                      ? {
                          backgroundColor: "#ffa500",
                        }
                      : {
                          backgroundColor: "#dcf8c6",
                        },
                    {
                      maxWidth: "60%",
                      padding: 12,
                      margin: 10,
                      borderRadius: 6,
                    },
                    a.senderId._id == userId
                      ? {
                          alignSelf: "flex-end",
                        }
                      : { alignSelf: "flex-start" },
                  ]}
                >
                  <Text style={{ fontSize: 16, fontWeight: "500" }}>
                    {a.message}
                  </Text>
                  <Text
                    style={{
                      marginTop: 8,
                      textAlign: "right",
                      color: "gray",
                    }}
                  >
                    {timeFormat(a.timeStamp)}
                  </Text>
                </Pressable>
              );
            }
            if (a.messageType == "image") {
              const imageUrl = a.ImageUrl;
              const source = {
                uri: `http://10.0.2.2:8080/${imageUrl}`,
              };
              return (
                <Pressable
                  key={i}
                  style={[
                    {
                      maxWidth: "60%",
                      backgroundColor: "#dcf8c6",
                      paddingVertical: 8,
                      paddingHorizontal: 6,
                      margin: 10,
                      borderRadius: 6,
                    },
                    a.senderId._id == userId
                      ? {
                          alignSelf: "flex-end",
                        }
                      : { alignSelf: "flex-start" },
                  ]}
                >
                  <View>
                    <Image
                      source={source}
                      style={{
                        width: 200,
                        height: 200,
                        borderRadius: 10,
                        resizeMode: "cover",
                      }}
                    />
                    <Text
                      style={{
                        marginTop: 6,
                        textAlign: "right",
                        color: "gray",
                      }}
                    >
                      {timeFormat(a.timeStamp)}
                    </Text>
                  </View>
                </Pressable>
              );
            }
          })}
      </ScrollView>

      <View
        style={{
          paddingTop: 12,
          paddingBottom: 20,
          paddingHorizontal: 8,
          borderWidth: 0.75,
          flexDirection: "row",
          borderColor: "gray",
          alignItems: "center",
        }}
      >
        <Entypo
          onPress={() => setshowEmoji(!showEmoji)}
          name="emoji-happy"
          size={30}
          color="gray"
        />
        <TextInput
          onPressIn={() => setshowEmoji(false)}
          value={messages}
          onChangeText={(val) => setmessages(val)}
          style={{
            height: 40,
            borderWidth: 1,
            flex: 1,
            borderRadius: 20,
            borderColor: "gray",
            marginHorizontal: 6,
            paddingHorizontal: 14,
          }}
          placeholder="Type Your Message... "
        />
        <View style={{ flexDirection: "row", gap: 8, marginRight: 6 }}>
          <Entypo onPress={pickerImage} name="camera" size={30} color="gray" />
          <FontAwesome name="microphone" size={30} color="gray" />
        </View>
        <Pressable
          onPress={() => handleSend("text")}
          style={{
            backgroundColor: "#007aef",
            height: 32,
            width: 60,
            borderRadius: 14,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>
            Send
          </Text>
        </Pressable>
      </View>

      {showEmoji && (
        <EmojiSelector
          onEmojiSelected={(emoji) =>
            setmessages((prevMessage) => prevMessage + emoji)
          }
          style={{ height: 250 }}
        />
      )}
    </KeyboardAvoidingView>
  );
};

export default MessageRoom;
