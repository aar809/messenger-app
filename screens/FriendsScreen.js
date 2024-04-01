import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useContext } from 'react'
import axios from 'axios'
import { UserType } from '../UserContext'

const FriendsScreen = () => {
    const { userId, setUserId } = useContext(UserType)
    useEffect(() => {
        fetchFriendRequests();
    }, [])

    const fetchFriendRequests = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/friend-request/${userId}`)
            if (response.status === 200) {
                // const friendRequestsData=response.data.map((friendRequest) => ({
                //     _id: friendRequest._id,
                //     name: friendRequest.name,
                //     email: 
                // }))}
                console.log("Friend requests", response.data)
            }
        } catch (error) {
            console.log("Error fetching friend requests", error)
        }
    }
    return (
        <View>
            <Text>FriendsScreen</Text>
        </View>
    )
}

export default FriendsScreen

const styles = StyleSheet.create({})