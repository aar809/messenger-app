import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useContext, useState } from 'react'
import axios from 'axios'
import { UserType } from '../UserContext'
import FriendRequest from '../components/FriendRequest'

// const API_URL = "https://sportmatch-mobile-server.fly.dev"
const API_URL = process.env.EXPO_PUBLIC_API_URL;

const FriendsScreen = () => {
    const { userId, setUserId } = useContext(UserType)
    const [friendRequests, setFriendRequests] = useState([])
    useEffect(() => {
        fetchFriendRequests();
    }, [])


    console.log("Friend requests (friends screen)", friendRequests)

    // write the fetchFriendRequests function here and populate friendRequestsData array with response.data (_id, name, email, image)
    const fetchFriendRequests = async () => {
        const url = `${API_URL}/friend-request/${userId}`
        try {
            const response = await axios.get(url)
            if (response.status === 200) {
                const friendRequestsData = response.data.map((obj) => ({
                    _id: obj._id,
                    name: obj.name,
                    email: obj.email,
                    image: obj.image
                })
                )
                setFriendRequests(friendRequestsData)
            }
        } catch (error) {
            console.log("error", error)
        }
    }

    return (
        <View style={{ padding: 10, marginHorizontal: 12 }}>
            {friendRequests.length > 0 ? <Text>Friend Requests</Text> : <Text>You don't have any new friend requests!😀</Text>}
            {friendRequests.map((item, index) => (
                <FriendRequest
                    key={index}
                    item={item}
                    friendRequests={friendRequests}
                    setFriendRequests={setFriendRequests}
                />
            ))}
        </View>
    )
}

export default FriendsScreen

const styles = StyleSheet.create({})