import { StyleSheet, Text, View } from 'react-native'
import React, { useContext, useLayoutEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { UserType } from '../UserContext';

const HomeScreen = () => {
    const navigation = useNavigation()
    const { userId, setUserId } = useContext(UserType)
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

    // useEffect(() => {


    // }, []
    // )

    return (
        <View>
            <Text>HomeScreen</Text>
        </View>
    )
}

export default HomeScreen

const styles = StyleSheet.create({})