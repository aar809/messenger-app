import { StyleSheet, Text, View, ScrollView, KeyboardAvoidingView, TextInput, Pressable, Image } from 'react-native'
import React, { useState, useContext, useLayoutEffect, useEffect } from 'react'
import { Entypo } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import EmojiSelector from "react-native-emoji-selector";
import { UserType } from '../UserContext';
import { useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const ChatMessagesScreen = () => {
    const [showEmojiSelector, setShowEmojiSelector] = useState(false);
    const [recipientData, setRecipientData] = useState()
    const navigation = useNavigation();
    const [selectedImage, setSelectedImage] = useState("");
    const [message, setMessage] = useState("")
    const { userId, setUserId } = useContext(UserType)
    const route = useRoute();
    const { recipientId } = route.params;
    const [messages, setMessages] = useState([]);

    const fetchMessages = async () => {
        try {
            // console.log("yo", userId, recipientId)
            const response = await fetch(`http://localhost:8000/messages/${userId}/${recipientId}`);
            const data = await response.json();
            if (response.ok) {
                console.log("messages", data)
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

    useEffect(() => {
        const fetchRecipientData = async () => {
            try {
                const response = await fetch(`http://localhost:8000/user/${recipientId}`);
                const data = await response.json();
                setRecipientData(data);
                // console.log("recipientData", data);
            } catch (error) {
                console.log("Error fetching recipient data", error)
            }
        }
        fetchRecipientData();
    }, [])

    const handleEmojiPress = () => {
        setShowEmojiSelector(!showEmojiSelector);
    }
    const handleSend = async (messageType, imageUri) => {
        try {
            const formData = new FormData();
            formData.append("senderId", userId);
            formData.append("recipientId", recipientId);
            // formData.append("messageType", messageType);

            // if the message type is image or a normal text message
            if (messageType === "image") {
                formData.append("messageType", "image");
                formData.append("imageFile", {
                    uri: imageUri,
                    name: "image.jpg",
                    type: "image/jpeg"
                })
            } else {
                formData.append("messageType", "text")
                formData.append("messageText", message)
            }
            const response = await fetch("http://localhost:8000/messages", {
                method: "POST",
                body: formData
            })
            if (response.ok) {
                setMessage("");
                setSelectedImage("");
                fetchMessages();
            }
        } catch (error) {
            console.log("Error sending message", error)
        }
    }

    console.log("messages:", messages);
    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: "",
            headerLeft: () => (
                <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                    <Ionicons onPress={() => navigation.goBack()} name="arrow-back" size={24} color="black" />
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Image style={{ width: 30, height: 30, borderRadius: 15, resizeMode: "cover" }} source={{ uri: recipientData?.image }} />
                        <Text style={{ marginLeft: 5, fontSize: 15, fontWeight: "bold" }}>{recipientData?.name}</Text>
                    </View>

                </View>
            ),
        })
    }, [recipientData])

    const formatTime = (timeStamp) => {
        const options = { hour: "numeric", minute: "numeric" }
        return new Date(timeStamp).toLocaleTimeString("en-US", options)
    }

    return (
        <KeyboardAvoidingView style={{ flex: 1, backgroundColor: "#F0F0F0" }}>
            <ScrollView>
                {/* All the chat messages go here */}
                {messages.map((item, index) => {
                    if (item.messageType === "text") {
                        return (
                            <Pressable
                                key={index}
                                style={[
                                    item?.senderId?._id === userId ? { alignSelf: "flex-end", backgroundColor: "#DCF8C6", padding: 6, maxWidth: "60%", borderRadius: 7, margin: 10 }
                                        : {
                                            alignSelf: "flex-start",
                                            backgroundColor: "white",
                                            padding: 8,
                                            margin: 10,
                                            borderRadius: 7,
                                            maxWidth: "60%"
                                        }
                                ]}>
                                <Text style={{ fontSize: 13, textAlign: "left" }}>{item?.message}</Text>
                                <Text style={{
                                    textAlign: "right",
                                    fontSize: 9,
                                    color: "grey",
                                    marginTop: 5
                                }}>
                                    {formatTime(item.timeStamp)} </Text>
                            </Pressable>
                        )
                    }
                })}
            </ScrollView>
            <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 10, paddingVertical: 10, borderTopWidth: 1, borderTopColor: '#dddddd', marginBottom: showEmojiSelector ? 0 : 25 }}>

                <Entypo onPress={handleEmojiPress} style={{ marginRight: 5 }} name="emoji-happy" size={24} color="grey" />

                <TextInput value={message} onChangeText={(text) => setMessage(text)} style={{ flex: 1, height: 40, borderWidth: 1, borderColor: '#dddddd', borderRadius: 20, paddingHorizontal: 10 }} placeholder="Type your message..." />

                <View style={{ flexDirection: "row", alignItems: "center", gap: 7, marginHorizontal: 8 }}>

                    <Entypo name="camera" size={24} color="gray" />
                    <Feather name="mic" size={24} color="gray" />
                </View>
                <Pressable onPress={() => handleSend("text")}
                    style={{ backgroundColor: '#007bff', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 20 }}>
                    <Text style={{ color: "white", fontWeight: "bold" }}> Send </Text>
                </Pressable>
            </View>
            {showEmojiSelector && <EmojiSelector onEmojiSelected={(emoji) => {
                setMessage((prevMessage) => prevMessage + emoji)
            }} style={{ height: 250 }} />}

        </KeyboardAvoidingView>
    )
}

export default ChatMessagesScreen

const styles = StyleSheet.create({})