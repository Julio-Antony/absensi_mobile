import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useState } from 'react'
import back from '../assets/img/back.png'
import key from "../assets/img/key-white.png"
import profil from "../assets/img/profil-white.png"
import Shutdown from '../assets/img/shutdown.png'
import { useLogin } from '../api/LoginProvider'
import { StackActions } from '@react-navigation/native'
import { FancyAlert } from 'react-native-expo-fancy-alerts'

const Profil = (props) => {
    const { setIsLoggedIn } = useLogin();
    const { navigation } = props;
    const { token } = props.route.params;
    const { profile } = useLogin();
    const [visible, setVisible] = useState(false);

    console.log(profile.foto)

    const navigate = () => {
        navigation.dispatch(
            StackActions.replace('UserData', {
                token: token,
            })
        );
        setIsLoggedIn(true);
    }

    const toggleAlert = useCallback(() => {
        setVisible(!visible);
    }, [visible]);

    const ChangePassword = () => {
        navigation.dispatch(
            StackActions.replace('ChangePassword', {
                token: token,
            })
        );
    }

    const toHome = () => {
        navigation.dispatch(
            StackActions.replace('Home', {
                token: token,
            })
        );
    }

    const logout = () => {
        setVisible(false)
        navigation.dispatch(
            StackActions.replace('Auth')
        );
        setIsLoggedIn(false);
    }

    const cancel = () => {
        setVisible(false)
    }

    return (
        <View style={styles.homeScreen}>
            <FancyAlert
                visible={visible}
                icon={<View style={{
                    flex: 1,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'green',
                    borderRadius: 50,
                    width: '100%',
                }}><Image source={Shutdown} style={styles.logo}></Image></View>}
                style={{ backgroundColor: 'white' }}
            >
                <Text style={{ marginTop: -16, marginBottom: 32, textAlign: "center" }}>Apakah anda yakin ingin keluar aplikasi ?</Text>
                <View style={styles.buttonWrapper}>
                    <Pressable
                        style={styles.buttonNo}
                        onPress={cancel}
                        underlayColor='slategray'
                    >
                        <Text style={{ color: 'white', fontSize: 15, textAlign: "center" }}>Tidak</Text>
                    </Pressable>
                    <Pressable
                        style={styles.buttonYes}
                        onPress={logout}
                        underlayColor='slategray'
                    >
                        <Text style={{ color: 'white', fontSize: 15, textAlign: "center" }}>Ya</Text>
                    </Pressable>
                </View>
            </FancyAlert>
            <View style={styles.header}>
                <Pressable style={styles.iconText} onPress={toHome}>
                    <Image source={back} style={styles.icon} />
                </Pressable>
                <Text style={styles.headerText}>
                    Profil Saya
                </Text>
            </View>
            <View style={styles.container}>
                {profile.foto ? <Image source={{ uri: 'data:image/jpeg;base64,' + profile.foto }} style={styles.profileImg} />
                    : <Image source={profil} style={styles.profileImg} />
                }
                <Text style={styles.textName}>{profile.nama}</Text>
                <Text style={styles.textId}>{profile.nip}</Text>
                <Pressable style={styles.buttonProfile} onPress={navigate}>
                    <Image source={profil} style={styles.iconButton} />
                    <Text style={styles.buttonText}>Data Pribadi</Text>
                </Pressable>
                <Pressable style={styles.buttonProfile} onPress={ChangePassword}>
                    <Image source={key} style={styles.iconButton} />
                    <Text style={styles.buttonText}>Ubah Kata Sandi</Text>
                </Pressable>
                <View style={styles.separator} />
                <Pressable style={styles.buttonLogout} onPress={toggleAlert}>
                    <Text style={styles.buttonTextLogout}>LOGOUT</Text>
                </Pressable>
            </View>
        </View>
    )
}

export default Profil

const styles = StyleSheet.create({
    homeScreen: {
        padding: 15,
        backgroundColor: "#7FB3D5",
        justifyContent: "center",
        flex: 1
    },
    header: {
        flexDirection: "row",
        marginTop: 30
    },
    iconText: {
        flex: 1,
        paddingTop: 2
    },
    icon: {
        width: 36,
        height: 36,
    },
    headerText: {
        flex: 5,
        color: 'white',
        fontSize: 24,
        fontWeight: "bold",
        letterSpacing: 1,
        marginBottom: 20
    },
    container: {
        flex: 1,
        borderRadius: 30,
        padding: 20,
        paddingTop: 65,
        backgroundColor: 'white',
        alignItems: 'center'
    },
    profileImg: {
        marginLeft: 20,
        marginBottom: 20,
        width: 160,
        height: 160,
        backgroundColor: "#333",
        borderRadius: 5
    },
    textName: {
        fontSize: 24,
        color: "black"
    },
    textId: {
        fontSize: 16,
        marginBottom: 60
    },
    buttonProfile: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 10,
        padding: 4,
        width: "80%",
        letterSpacing: 5,
        borderRadius: 15,
        backgroundColor: "#034687",
        height: 38,
        marginBottom: 10
    },
    buttonText: {
        marginLeft: 8,
        textAlign: "center",
        fontSize: 18,
        fontWeight: "bold",
        color: "#FFFFFF"
    },
    iconButton: {
        marginLeft: 4,
        width: 30,
        height: 30,
    },
    separator: {
        marginTop: 20,
        marginBottom: 30,
        backgroundColor: "black",
        height: 2,
        width: "90%",
        borderRadius: 50
    },
    buttonLogout: {
        marginTop: 10,
        justifyContent: 'center',
        letterSpacing: 5,
        borderRadius: 30,
        width: "90%",
        backgroundColor: "#800000",
        height: 38,
        marginBottom: 10
    },
    buttonTextLogout: {
        textAlign: "center",
        letterSpacing: 4,
        fontSize: 18,
        fontWeight: "bold",
        color: "#FFFFFF"
    },
    logo: {
        marginTop: 20,
        width: 60,
        height: 60,
        marginBottom: 20
    },
    buttonWrapper: {
        flexDirection: "row",
        marginBottom: 40,
        alignContent: "space-between"
    },
    buttonYes: {
        borderRadius: 5,
        backgroundColor: "#33B786",
        width: 80,
        height: 30,
        justifyContent: "center"
    },
    buttonNo: {
        borderRadius: 5,
        backgroundColor: "#c21531",
        width: 80,
        height: 30,
        justifyContent: "center",
        marginRight: 10
    }
})