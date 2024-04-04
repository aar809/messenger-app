import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useContext, useState } from 'react'
import axios from 'axios'
import { UserType } from '../UserContext'
import FriendRequest from '../components/FriendRequest'

const FriendsScreen = () => {
    const { userId, setUserId } = useContext(UserType)
    const [friendRequests, setFriendRequests] = useState([])
    useEffect(() => {
        fetchFriendRequests();
    }, [])


    console.log("Friend requests3", friendRequests)

    // write the fetchFriendRequests function here and populate friendRequestsData array with response.data (_id, name, email, image)
    const fetchFriendRequests = async () => {
        const url = `http://localhost:8000/friend-request/${userId}`
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
            {friendRequests.length > 0 && <Text>Friend Requestsss</Text>}
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