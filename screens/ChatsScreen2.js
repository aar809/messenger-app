// ChatsScreen2.js
import React, { useState, useContext, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { UserType } from '../UserContext';
import { useNavigation } from '@react-navigation/native';
import UserChat from '../components/UserChat';

const API_URL = "https://sportmatch-mobile-server.fly.dev"

const ChatsScreen2 = () => {
    const [acceptedFriends, setAcceptedFriends] = useState([])
    const { userId, setUserId } = useContext(UserType)
    const navigation = useNavigation()

    useEffect(() => {
        const FetchAcceptedFriendsList = async () => {
            try {
                const response = await fetch(`${API_URL}/accepted-friends/${userId}`)
                const data = await response.json();
                if (response.ok) {
                    setAcceptedFriends(data)
                }
            } catch (error) {
                console.log("error ChatsScreen2", error)
            }
        }
        FetchAcceptedFriendsList();
    }, [])
    console.log("friends", acceptedFriends)
    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <Pressable>
                {acceptedFriends.map((item, index) =>
                    <UserChat key={index} item={item} />
                )}
            </Pressable>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default ChatsScreen2;