import { StyleSheet, Text, View, Pressable, Image } from 'react-native'
import React, { useContext } from 'react'
import { UserType } from '../UserContext'
import { useNavigation } from '@react-navigation/native'

// const API_URL = "http://localhost:8000"; // Add this line
const API_URL = "https://sportmatch-mobile-server.fly.dev"


const FriendRequest = ({ item, friendRequests, setFriendRequests }) => {
    const { userId, setUserId } = useContext(UserType)
    const navigation = useNavigation();

    const acceptRequest = async (friendRequestId) => {
        console.log("Accept Pressed")
        try {
            const response = await fetch(`${API_URL}/friend-request/accept`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    senderId: friendRequestId,
                    recipientId: userId
                })
            });
            if (response.ok) {
                setFriendRequests(friendRequests.filter((obj) => obj._id !== friendRequestId))
                navigation.navigate("Chats");
            }
        } catch (error) {
            console.log("error accepting frd request", error)
        }


    }
    return (
        <Pressable style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginVertical: 10

        }}>
            {/* <Text>FriendRequest</Text> */}
            <Image
                style={{
                    width: 50,
                    height: 50,
                    borderRadius: 25
                }}
                source={{ uri: item.image }}
            />
            <Text style={{ fontSize: 15, fontWeight: "bold", marginLeft: 10, flex: 1 }} >
                {item?.name} sent you a request
            </Text>
            <Pressable
                onPress={() => {
                    acceptRequest(item._id)
                }}
                style={{
                    backgroundColor: "#0066b2",
                    padding: 10,
                    borderRadius: 6
                }}>
                <Text style={{ textAlign: "center", color: "white" }}> Accept </Text>
            </Pressable>
        </Pressable>
    )
}

export default FriendRequest

const styles = StyleSheet.create({})