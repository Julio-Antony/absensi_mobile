import { Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useState } from 'react'
import back from '../assets/img/back.png'
import { useLogin } from '../api/LoginProvider';
import { isValidObjField, updateError } from '../utils/Methods'
import { StackActions } from '@react-navigation/native';
import ApiContext from '../api/ApiContext';

const ForgotPassword = ({ navigation }) => {
    const { setIsLoggedIn, setProfile } = useLogin();
    const [userInfo, setUserInfo] = useState({
        email: '',
        password: '',
        confirm: '',
    });

    const [error, setError] = useState('');

    const { email, password, confirm } = userInfo;

    const handleOnChangeText = (value, fieldName) => {
        setUserInfo({ ...userInfo, [fieldName]: value });
    };

    const isValidForm = () => {
        if (!isValidObjField(userInfo))
            return updateError('Form tidak boleh kosong!', setError);
        // password and confirm password must be the same
        if (password !== confirm)
            return updateError('Password tidak sama!', setError);
        return true;
    };

    const submitForm = async () => {
        console.log({ ...userInfo })
        if (isValidForm()) {
            try {
                const res = await ApiContext.post('/users/resetPassword', { ...userInfo });

                console.log(res.data)
                if (res.data) {
                    const signInRes = await ApiContext.post('/auth', {
                        email: email,
                        password: password,
                    });
                    if (signInRes.data) {
                        setProfile(res.data.user);
                        navigation.dispatch(
                            StackActions.replace('Home', {
                                token: signInRes.data.token
                            })
                        );
                        setIsLoggedIn(true);
                    }
                }
            } catch (error) {
                console.log(error);
            }
        }
    };

    return (
        <View style={styles.forgotScreen}>
            <View style={styles.header}>
                <Pressable style={styles.iconText} onPress={() => { navigation.goBack() }}>
                    <Image source={back} style={styles.icon} />
                </Pressable>
                <Text style={styles.headerText}>
                    Reset Password
                </Text>
            </View>
            <View style={styles.container}>
                <View style={styles.desc}>
                    <Text>Masukkan kata sandi baru.</Text>
                    <Text>Gunakan gabungan dari beberapa huruf,</Text>
                    <Text>angka, dan simbol</Text>
                </View>
                {error ? (
                    <Text style={{ color: 'red', fontSize: 18, textAlign: 'center', marginBottom: 12 }}>
                        {error}
                    </Text>
                ) : null}
                <Text style={styles.labelInput}>Email</Text>
                <TextInput
                    style={styles.inputLogin}
                    placeholder='example@mail.com'
                    value={email}
                    onChangeText={value => handleOnChangeText(value, 'email')}
                />
                <Text style={styles.labelInput}>Password Baru</Text>
                <TextInput
                    style={styles.inputLogin}
                    placeholder='**********'
                    secureTextEntry
                    value={password}
                    onChangeText={value => handleOnChangeText(value, 'password')}
                />
                <Text style={styles.labelInput}>Konfirmasi Password Baru</Text>
                <TextInput
                    style={styles.inputLogin}
                    placeholder='**********'
                    secureTextEntry
                    value={confirm}
                    onChangeText={value => handleOnChangeText(value, 'confirm')}
                />
                <View style={{ alignItems: "center" }}>
                    <Pressable style={styles.buttonSubmit} onPress={submitForm}>
                        <Text style={styles.buttonText}>RESET PASSWORD</Text>
                    </Pressable>
                </View>
            </View>
        </View>
    )
}

export default ForgotPassword

const styles = StyleSheet.create({
    forgotScreen: {
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
        borderRadius: 30,
        padding: 20,
        paddingTop: 65,
        backgroundColor: 'white',
        padding: 30
    },
    desc: {
        alignItems: "center",
        marginBottom: 80
    },
    labelInput: {
        fontSize: 18,
        fontWeight: "bold",
    },
    inputLogin: {
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
        width: "90%",
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
    }
})