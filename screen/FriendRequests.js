import { View, Text } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { UserType } from "../context/userContext";
import ShowFriendRequests from "../components/ShowFriendRequests";

const FriendRequests = () => {
  const { userId, setuserId } = useContext(UserType);
  const [dataUsers, setdataUsers] = useState([]);
  useEffect(() => {
    const friendRequestCall = async () => {
      const { data } = await axios.get(
        `http://10.0.2.2:8080/friend-request/${userId}`
      );
      if (data.success) {
        const finalData = data.friendRequest.map((a) => {
          return {
            name: a.name,
            email: a.email,
            _id: a._id,
            image: a.image,
          };
        });

        const final = finalData.filter(
          (a, i, self) => self.findIndex((t) => t._id === a._id) === i
        );

        setdataUsers(final);
      }
    };

    friendRequestCall();
  }, []);

  return (
    <View>
      {dataUsers.length > 0 ? (
        dataUsers.map((a, i) => (
          <ShowFriendRequests
            key={i}
            item={a}
            listRequest={dataUsers}
            setListRequest={setdataUsers}
          />
        ))
      ) : (
        <Text>There are not friends request</Text>
      )}
    </View>
  );
};

export default FriendRequests;
