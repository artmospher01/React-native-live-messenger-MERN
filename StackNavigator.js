import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import react from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import Login from "./screen/Login";
import Register from "./screen/Register";
import Home from "./screen/Home";
import FriendRequests from "./screen/FriendRequests";
import ChatScreen from "./screen/Chat";

const Stack = createNativeStackNavigator();
export default function StackNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={Register}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="FriendRequests" component={FriendRequests} />
        <Stack.Screen name="Chat" component={ChatScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
