import { Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useCallback, useState } from 'react'
import back from '../assets/img/back.png'
import { isValidObjField, updateError } from '../utils/Methods'
import { useLogin } from '../api/LoginProvider'
import ApiContext from '../api/ApiContext'
import Check from '../assets/img/check.png'
import Buffer from '../assets/img/loading.gif'
import { StackActions } from '@react-navigation/native'
import { FancyAlert } from 'react-native-expo-fancy-alerts';

const ChangePassword = (props) => {
    const { navigation } = props;
    const { profile } = useLogin();
    const [userInfo, setUserInfo] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const { token } = props.route.params;
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [visible, setVisible] = useState(false);

    const [error, setError] = useState('');

    const { oldPassword, newPassword, confirmPassword } = userInfo;

    const handleOnChangeText = (value, fieldName) => {
        setUserInfo({ ...userInfo, [fieldName]: value });
    };

    const isValidForm = () => {
        if (!isValidObjField(userInfo))
            return updateError('Form tidak boleh kosong!', setError);
        // password and confirm password must be the same
        if (newPassword !== confirmPassword)
            return updateError('Password tidak sama!', setError);
        return true;
    };

    const toggleAlert = useCallback(() => {
        setVisible(!visible);
        setLoading(true)
    }, [visible]);

    const submitForm = async () => {
        console.log({ ...userInfo })
        toggleAlert()
        if (isValidForm()) {
            try {
                const res = await ApiContext.put(`/users/changePassword/${profile._id}`, { ...userInfo }, {
                    headers: {
                        "x-auth-token": token,
                    },
                });
                console.log(res.data)
                if (res.data) {
                    setLoading(false);
                    setMessage(res.data.msg);
                }
            } catch (error) {
                console.log(error)
            }
        }
    };

    const navigate = () => {
        navigation.dispatch(
            StackActions.replace('Home', {
                token: token,
            })
        );
    }

    const toProfile = () => {
        navigation.dispatch(
            StackActions.replace('Profil', {
                token: token,
            })
        );
    }

    return (
        <View style={styles.homeScreen}>
            <FancyAlert
                visible={visible}
                icon={loading ? false : <View style={{
                    flex: 1,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'green',
                    borderRadius: 50,
                    width: '100%',
                }}><Image source={Check} style={styles.logo}></Image></View>}
                style={{ backgroundColor: 'white' }}
            >
                {loading ? (
                    <Image
                        style={{ width: 80, height: 80, marginBottom: 60 }}
                        source={Buffer} />
                ) : (
                    <>
                        <Text style={{ marginTop: -16, marginBottom: 32 }}>{message}</Text>
                        <Pressable
                            style={styles.button}
                            onPress={navigate}
                            underlayColor='slategray'
                        >
                            <Text style={{ color: 'black', fontSize: 15, textAlign: "center" }}>OK</Text>
                        </Pressable>
                    </>
                )}
            </FancyAlert>

            <View style={styles.header}>
                <Pressable style={styles.iconText} onPress={toProfile}>
                    <Image source={back} style={styles.icon} />
                </Pressable>
                <Text style={styles.headerText}>
                    Ganti Password
                </Text>
            </View>
            <View style={styles.container}>
                <View style={styles.desc}>
                    <Text>Masukkan kata sandi baru.</Text>
                    <Text>Gunakan gabungan dari beberapa huruf,</Text>
                    <Text>angka, dan simbol</Text>
                </View>
                {error ? (
                    <Text style={{ color: 'red', fontSize: 18, textAlign: 'center', marginBottom: 16 }}>
                        {error}
                    </Text>
                ) : null}
                <Text style={styles.labelInput}>Password Lama</Text>
                <TextInput style={styles.inputPassword}
                    placeholder='**********'
                    secureTextEntry
                    value={oldPassword}
                    onChangeText={value => handleOnChangeText(value, 'oldPassword')}
                />
                <Text style={styles.labelInput}>Password Baru</Text>
                <TextInput
                    style={styles.inputPassword}
                    placeholder='**********'
                    secureTextEntry
                    value={newPassword}
                    onChangeText={value => handleOnChangeText(value, 'newPassword')} />
                <Text style={styles.labelInput}>Konfirmasi Password Baru</Text>
                <TextInput
                    style={styles.inputPassword}
                    placeholder='**********'
                    secureTextEntry
                    value={confirmPassword}
                    onChangeText={value => handleOnChangeText(value, 'confirmPassword')} />
                <Pressable style={styles.buttonSubmit} onPress={submitForm}>
                    <Text style={styles.buttonText}>UBAH</Text>
                </Pressable>
            </View>
        </View>
    )
}

export default ChangePassword

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
        minHeight: 600,
        padding: 20,
        paddingTop: 65,
        backgroundColor: 'white',
        alignItems: 'center'
    },
    desc: {
        alignItems: "center",
        marginBottom: 60
    },
    labelInput: {
        width: "80%",
        fontSize: 18,
        fontWeight: "bold",
    },
    inputPassword: {
        width: "80%",
        padding: 10,
        marginBottom: 16,
        backgroundColor: "#ffffff",
        borderWidth: 1,
        borderTopColor: "#ffffff",
        borderLeftColor: "#ffffff",
        borderRightColor: "#ffffff",
        borderBottomColor: "#333"
    },
    buttonSubmit: {
        marginTop: 80,
        width: "80%",
        justifyContent: 'center',
        letterSpacing: 5,
        borderRadius: 30,
        backgroundColor: "#7FB3D5",
        height: 38,
        marginBottom: 10
    },
    buttonText: {
        textAlign: "center",
        letterSpacing: 4,
        fontSize: 18,
        fontWeight: "bold",
        color: "#FFFFFF"
    },
    successPanel: {
        minHeight: 400,
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        borderRadius: 30,
        marginTop: 30,
        padding: 30
    },
    button: {
        marginTop: 10,
        width: 150,
        justifyContent: 'center',
        letterSpacing: 5,
        borderRadius: 30,
        backgroundColor: "#7FB3D5",
        height: 38,
        marginBottom: 30
    },
    logo: {
        marginTop: 20,
        width: 60,
        height: 60,
        marginBottom: 20
    },
    text: {
        fontSize: 24,
        textAlign: "center",
        marginBottom: 20
    }
})