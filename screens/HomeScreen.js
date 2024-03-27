import { StyleSheet, Text, View } from 'react-native'
import React, { useContext, useLayoutEffect, useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { UserType } from '../UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode from 'jwt-decode';
// import jwt from "jsonwebtoken"
import User from '../components/User';
import axios from 'axios';

const HomeScreen = () => {
    const navigation = useNavigation()
    const { userId, setUserId } = useContext(UserType)
    const [users, setUsers] = useState([]);
    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: "",
            headerLeft: () => (
                <Text style={{ fontSize: 16, fontWeight: "bold" }}>Swift Chat</Text>
            ),
            headerRight: () => (
                <Text style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                    <Ionicons name="chatbox-ellipses-outline" size={24} color="black" />
                    <MaterialIcons name="people-outline" size={24} color="black" />
                </Text>
            )
        })
    }, [])
    console.log("Testsssss");

    useEffect(() => {
        const fetchUsers = async () => {
            const token = await AsyncStorage.getItem("authToken");
            const decodedToken = jwt_decode(token);
            // const decodedToken = jwt.decode(token);
            const userId = decodedToken.userId;
            setUserId(userId);
            axios.get(`http://localhost:8000/users/${userId}`).then((response) => {
                setUsers(response.data)
            })
                .catch((error) => {
                    console.log("Error fetching users", error)
                })
        }
        fetchUsers();
    }, []
    )
    console.log("users", users);
    return (
        <View>
            <View>
                {users.map((item, index) => (
                    <User key={index} item={item} />
                ))}
            </View>
            <Text>HomeScreen</Text>
            {users && <Text>here</Text>}
            <Text>blah blah {userId}</Text>
        </View>
    )
}

export default HomeScreen

const styles = StyleSheet.create({})