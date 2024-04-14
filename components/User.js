import { StyleSheet, Text, View, Pressable, Image } from 'react-native'
import React, { useContext, useState, useEffect } from 'react'
import { UserType } from '../UserContext';

const API_URL = "https://sportmatch-mobile-server.fly.dev"

const User = ({ item }) => {
    const { userId, setUserId } = useContext(UserType)
    const [requestSent, setRequestSent] = useState(false)
    const [friendRequests, setFriendRequests] = useState([]);
    const [userFriends, setUserFriends] = useState([])

    useEffect(() => {
        const fetchFriendRequests = async () => {
            try {
                const response = await fetch(`${API_URL}/friend-requests/sent/${userId}`);
                const data = await response.json();
                if (response.ok) {
                    console.log("Friend requests", data)
                    setFriendRequests(data)
                } else {
                    console.log("Error fetching friend requests1", response.status)
                }
            } catch (error) {
                console.log("Error fetching friend requests", error)
            }
        }
        fetchFriendRequests();
    }, [])

    useEffect(() => {
        const fetchUserFriends = async () => {
            try {
                const response = await fetch(`${API_URL}/friends/${userId}`);
                const data = await response.json();
                if (response.ok) {
                    console.log("User friends", data)
                    setUserFriends(data)
                } else {
                    console.log("Error fetching user friends1", response.status)
                }
            } catch (error) {
                console.log("Error fetching user friends", error)
            }
        }
        fetchUserFriends();
    }, [])

    const sendFriendRequest = async (currentUserId, selectedUserId) => {
        console.log("pressed")
        try {
            const response = await fetch(`${API_URL}/friend-request`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ currentUserId, selectedUserId })
            })
            if (response.ok) {
                setRequestSent(true)
            }
        } catch (error) {
            console.log("Error sending friend request", error)
        }
    }
    console.log("User friendsss:", userFriends)
    console.log("Friend requestssss:", friendRequests)
    return (
        <Pressable style={{ flexDirection: "row", alignItems: "center", marginVertical: 10 }}>
            {/* <Text>User here</Text> */}
            <View>
                <Image style={{ width: 50, height: 50, borderRadius: 25, resizeMode: "cover" }}
                    source={{ uri: item.image }} />
            </View>
            <View style={{ marginLeft: 12, flex: 1 }}>
                <Text style={{ fontWeight: "bold" }}> {item?.name}</Text>
                <Text> {item?.email}</Text>

            </View>

            {userFriends.includes(item._id) ? (
                <Pressable style={{ backgroundColor: "green", padding: 10, borderRadius: 6, width: 105 }}>
                    <Text style={{ textAlign: "center", color: "white", fontSize: 13 }}> Friends</Text>
                </Pressable>
            ) : requestSent || friendRequests.some((obj) => obj.senderId === item._id) ? (
                <Pressable
                    onPress={() => sendFriendRequest(userId, item._id)}
                    style={{ backgroundColor: "gray", padding: 10, borderRadius: 6, width: 105 }}>
                    <Text style={{ textAlign: "center", color: "white", fontSize: 13 }}> Request Sent</Text>
                </Pressable>) :
                <Pressable
                    onPress={() => sendFriendRequest(userId, item._id)}
                    style={{ backgroundColor: "#567189", padding: 10, borderRadius: 6, width: 105 }}>
                    <Text style={{ textAlign: "center", color: "white", fontSize: 13 }}> Add Friend</Text>
                </Pressable>
            }

        </Pressable>

    )
}

export default User

const styles = StyleSheet.create({})