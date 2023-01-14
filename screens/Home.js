import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import absensi from "../assets/img/absensi.png"
import riwayat from "../assets/img/riwayat.png"
import profile from "../assets/img/profil.png"
import ApiContext from '../api/ApiContext'
import { StackActions } from '@react-navigation/native'
import { useLogin } from '../api/LoginProvider'

const Home = (props) => {
    const { setIsLoggedIn } = useLogin();
    const { navigation } = props;
    const [profil, setProfil] = useState({});
    const { token } = props.route.params;

    const fetchData = useCallback(async () => {
        const res = await ApiContext.get("/users/single", {
            headers: {
                "x-auth-token": token,
            },
        })

        setProfil(res.data)
    }, [])

    useEffect(() => {
        fetchData()
            .catch(console.error);
    }, [fetchData])

    const navigate = () => {
        navigation.dispatch(
            StackActions.replace('Profil', {
                token: token,
            })
        );
        setIsLoggedIn(true);
    }

    const toRiwayat = () => {
        navigation.dispatch(
            StackActions.replace('Riwayat', {
                token: token,
            })
        );
    }

    const toScanner = () => {
        navigation.dispatch(
            StackActions.replace('Scanner', {
                token: token,
            })
        );
    }


    return (
        <View style={styles.homeScreen}>
            <View style={styles.welcomePanel}>
                <View style={styles.textWrapper}>
                    <Text style={styles.welcomeText}>Hi, {profil.nama}</Text>
                    <Text style={styles.nip}>{profil.nip}</Text>
                </View>
                <Pressable style={styles.imgWrapper}>
                    <Image source={{ uri: 'data:image/jpeg;base64,' + profil.foto }} style={styles.welcomeImg} />
                </Pressable>
            </View>
            <View style={styles.menuPanel}>
                <Pressable style={styles.menu} onPress={toScanner}>
                    <View style={styles.iconWrapper}>
                        <Image source={absensi} />
                    </View>
                    <Text style={styles.iconTitle}>Absensi</Text>
                </Pressable>
                <Pressable style={styles.menu} onPress={toRiwayat}>
                    <View style={styles.iconWrapper}>
                        <Image source={riwayat} />
                    </View>
                    <Text style={styles.iconTitle}>Daftar Hadir</Text>
                </Pressable>
                <Pressable style={styles.menu} onPress={navigate}>
                    <View style={styles.iconWrapper}>
                        <Image source={profile} />
                    </View>
                    <Text style={styles.iconTitle}>Profil</Text>
                </Pressable>
            </View>
        </View>
    )
}

export default Home

const styles = StyleSheet.create({
    homeScreen: {
        padding: 15,
        backgroundColor: "#7FB3D5",
        justifyContent: "center",
        flex: 1
    },

    textWrapper: {
        flex: 4
    },

    imgWrapper: {
        flex: 2
    },

    welcomePanel: {
        flexDirection: "row",
        padding: 20,
        backgroundColor: "#FFFFFF",
        borderRadius: 30,
        width: "100%",
        height: 120,
        marginBottom: 15
    },

    welcomeText: {
        fontSize: 20,
        color: "#333"
    },

    welcomeImg: {
        marginLeft: 20,
        width: 80,
        height: "100%",
        backgroundColor: "#333",
        borderRadius: 5
    },
    nip: {
        fontSize: 16,
        color: "#3F4A90"
    },
    profilImg: {
        height: 150,
        width: 150,
        borderRadius: 30
    },

    menuPanel: {
        height: 550,
        width: "100%",
        padding: 15,
        backgroundColor: "#FFFFFF",
        borderRadius: 30,
        flexDirection: "row",
        flexWrap: "wrap"
    },

    menu: {
        width: "100%",
        height: 110,
        borderRadius: 15,
        flex: 2,
        marginHorizontal: "2%",
        marginVertical: "2%"
    },

    iconWrapper: {
        height: 95,
        backgroundColor: "#D3D3D3",
        borderRadius: 15,
        marginBottom: 10,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },

    iconTitle: {
        textAlign: "center"
    }
})