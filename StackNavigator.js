import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import FriendsScreen from './screens/FriendsScreen';
// import ChatsScreen from './screens/ChatsScreen';
import ChatsScreen2 from './screens/ChatsScreen2';
import ChatMessagesScreen from './screens/ChatMessagesScreen';

const StackNavigator = () => {

    const Stack = createNativeStackNavigator();

    return (
        <NavigationContainer>
            <Stack.Navigator>
                {/* <Stack.Screen name="Chats" component={ChatsScreen} /> */}
                <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="Friend Requests" component={FriendsScreen} />
                <Stack.Screen name="Chats" component={ChatsScreen2} />
                <Stack.Screen name="Messages" component={ChatMessagesScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default StackNavigator

const styles = StyleSheet.create({})