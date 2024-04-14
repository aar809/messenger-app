import { StyleSheet, Text, View, Pressable, Image } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import { useContext, useEffect, useState } from 'react'
import { UserType } from '../UserContext'

const API_URL = "https://sportmatch-mobile-server.fly.dev"

const UserChat = ({ item }) => {
    const navigation = useNavigation()
    const { userId, setUserId } = useContext(UserType)
    const [messages, setMessages] = useState([]);

    const fetchMessages = async () => {
        try {
            // console.log("yo", userId, recipientId)
            const response = await fetch(`${API_URL}/messages/${userId}/${item._id}`);
            const data = await response.json();
            if (response.ok) {
                // console.log("messages", data)
                setMessages(data)
            } else {
                console.log("Error fetching messages", response.status.message)
            }
        } catch (error) {
            console.log("Error fetching messages", error)
        }
    };

    useEffect(() => {
        fetchMessages();
    }, [])

    // console.log("messages", messages)
    const getLastMessage = () => {
        const userMessages = messages.filter((message) => message.messageType === "text");
        const n = userMessages.length;
        return userMessages[n - 1];
    }
    const lastMessage = getLastMessage(messages);
    console.log(lastMessage)

    // messages[messages.length - 1]
    const formatTime = (timeStamp) => {
        const options = { hour: "numeric", minute: "numeric" }
        return new Date(timeStamp).toLocaleTimeString("en-US", options)
    }
    return (
        <Pressable
            onPress={() => navigation.navigate("Messages", {
                recipientId: item._id
            })}
            style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                borderWidth: 0.7,
                borderColor: "#D0D0D0",
                borderTopWidth: 0,
                borderLeftWidth: 0,
                borderRightWidth: 0,
                padding: 10
            }}
        >
            <Image
                style={{
                    width: 50,
                    height: 50,
                    borderRadius: 25,
                    resizeMode: "cover"
                }}
                source={{ uri: item?.image }}
            />

            <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 15, fontWeight: "500" }}>{item?.name}</Text>
                {lastMessage && <Text style={{ marginTop: 3, color: "gray", fontWeight: "500" }}>{lastMessage.message}</Text>}
                {/* <Text style={{ marginTop: 3, color: "gray", fontWeight: "500" }}> Last message comes here.</Text> */}
            </View>
            <View>
                <Text style={{ fontSize: 11, fontWeight: "400", color: "#585858" }}>
                    {lastMessage && formatTime(lastMessage?.timeStamp)}
                </Text>
            </View>
        </Pressable>
    )
}

export default UserChat

const styles = StyleSheet.create({})