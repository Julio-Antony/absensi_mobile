import {
    StyleSheet,
    Text,
    Image,
    View,
    TextInput,
    Pressable,
    ScrollView,
} from 'react-native'
import React, { useState } from 'react'
import logo from '../assets/img/logo.png'
import { useLogin } from '../api/LoginProvider'
import { isValidObjField, updateError } from '../utils/Methods'
import ApiContext from '../api/ApiContext'
import { StackActions } from '@react-navigation/native'

const Register = ({ navigation }) => {
    const { setIsLoggedIn, setProfile } = useLogin();
    const [userInfo, setUserInfo] = useState({
        nip: '',
        nama: '',
        email: '',
        password: '',
        confirm: '',
    });

    const [error, setError] = useState('');

    const { nip, nama, email, password, confirm } = userInfo;

    const handleOnChangeText = (value, fieldName) => {
        setUserInfo({ ...userInfo, [fieldName]: value });
    };

    const isValidForm = () => {
        if (!isValidObjField(userInfo))
            return updateError('Form tidak boleh kosong!', setError);

        return true;
    };

    const submitForm = async () => {
        console.log({ ...userInfo })
        if (isValidForm()) {
            try {
                const res = await ApiContext.post('/users', { ...userInfo });

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
        <ScrollView>
            <View style={styles.loginScreen}>
                <View style={styles.loginPanel}>
                    {error ? (
                        <Text style={{ color: 'red', fontSize: 18, textAlign: 'center' }}>
                            {error}
                        </Text>
                    ) : null}
                    <View style={styles.logo}>
                        <Image source={logo} />
                        <Text style={styles.loginText}>SISTEM ABSENSI PEGAWAI</Text>
                        <Text style={styles.loginSubtext}>Silahkan isi data dibawah ini dengan lengkap</Text>
                    </View>
                    <Text style={styles.labelInput}>Nomor Induk Pegawai</Text>
                    <TextInput
                        style={styles.inputLogin}
                        placeholder='31181xxxx'
                        value={nip}
                        onChangeText={value => handleOnChangeText(value, 'nip')}
                    />
                    <Text style={styles.labelInput}>Nama Lengkap</Text>
                    <TextInput
                        style={styles.inputLogin}
                        placeholder='Nama Lengkap'
                        value={nama}
                        onChangeText={value => handleOnChangeText(value, 'nama')}
                    />
                    <Text style={styles.labelInput}>Email</Text>
                    <TextInput
                        style={styles.inputLogin}
                        placeholder='example@mail.com'
                        value={email}
                        onChangeText={value => handleOnChangeText(value, 'email')}
                    />
                    <Text style={styles.labelInput}>Password</Text>
                    <TextInput
                        style={styles.inputLogin}
                        placeholder='**********'
                        secureTextEntry
                        value={password}
                        onChangeText={value => handleOnChangeText(value, 'password')}
                    />
                    <Text style={styles.labelInput}>Konfirmasi Password</Text>
                    <TextInput
                        style={styles.inputLogin}
                        placeholder='**********'
                        secureTextEntry
                        value={confirm}
                        onChangeText={value => handleOnChangeText(value, 'confirm')}
                    />
                    <Pressable style={styles.buttonLogin} onPress={submitForm}>
                        <Text style={styles.buttonText}>DAFTAR</Text>
                    </Pressable>
                    <Text style={{ textAlign: "center" }}>Sudah meiliki akun ? <Text style={{ color: "blue" }} onPress={() =>
                        navigation.navigate('Auth')}>masuk disini.</Text></Text>
                </View>
            </View>
        </ScrollView>
    )
}

export default Register

const styles = StyleSheet.create({
    loginScreen: {
        flex: 1,
        backgroundColor: "#7FB3D5",
        justifyContent: "center",
        padding: "10%"
    },
    loginText: {
        fontSize: 14,
        color: "#333",
        letterSpacing: 2,
        marginBottom: 10,
        fontWeight: "bold"
    },
    loginSubtext: {
        fontSize: 12,
        fontWeight: "bold",
        textAlign: "center"
    },
    loginPanel: {
        minHeight: 840,
        width: "100%",
        backgroundColor: "#FFFFFF",
        borderRadius: 30,
        marginTop: 30,
        padding: 30
    },
    logo: {
        justifyContent: "center",
        alignItems: "center",
        marginTop: 10,
        marginBottom: 30,
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
    forgotText: {
        color: "red",
        textAlign: "right"
    },
    buttonLogin: {
        marginTop: 10,
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