import {
    StyleSheet,
    Text,
    Image,
    View,
    TextInput,
    Pressable,
} from 'react-native'
import React, { useState } from 'react'
import logo from '../assets/img/logo.png'
import ApiContext from '../api/ApiContext'
import { useLogin } from '../api/LoginProvider'
import { isValidObjField, updateError } from '../utils/Methods';
import { StackActions } from '@react-navigation/native';

const Auth = ({ navigation }) => {
    const { setIsLoggedIn, setProfile } = useLogin();
    const [userInfo, setUserInfo] = useState({
        email: '',
        password: '',
    });
    const [loading, setLoading] = useState(false)

    const [error, setError] = useState('');

    const { email, password } = userInfo;

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
        setLoading(true)
        if (isValidForm()) {
            try {
                const res = await ApiContext.post('/auth', { ...userInfo });

                if (res.data) {
                    setUserInfo({ email: '', password: '' });
                    setProfile(res.data.user);
                    navigation.dispatch(
                        StackActions.replace('Home', {
                            token: res.data.token,
                        })
                    );
                    setIsLoggedIn(true);
                    setLoading(false)
                }
            } catch (error) {
                console.log(setError('Email / Password Salah !'));
                setLoading(false)
            }
        }
    };

    return (
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
                    <Text style={styles.loginSubtext}>BALAI DESA GANDASARI</Text>
                </View>
                <Text style={styles.labelInput}>Email</Text>
                <TextInput
                    style={styles.inputLogin}
                    placeholder='contoh@gmail.com'
                    value={email}
                    onChangeText={value => handleOnChangeText(value, 'email')}
                />
                <Text style={styles.labelInput}>Password</Text>
                <TextInput
                    style={styles.inputLogin}
                    placeholder='Ketikkan Password'
                    secureTextEntry
                    value={password}
                    onChangeText={value => handleOnChangeText(value, 'password')}
                />
                <Text style={styles.forgotText} onPress={() => navigation.navigate('ForgotPassword')}>lupa password ?</Text>
                <Pressable style={loading ? styles.buttonLoading : styles.buttonLogin} onPress={submitForm} disabled={loading}>
                    <Text style={styles.buttonText}>{loading ? 'LOADING' : 'LOGIN'}</Text>
                </Pressable>
                <Text style={{ textAlign: "center" }}>Belum meiliki akun ? <Text style={{ color: "blue" }} onPress={() => navigation.navigate('Register')}>
                    daftar disini.
                </Text></Text>
            </View>
        </View>
    )
}

export default Auth

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
        fontWeight: "bold"
    },
    loginSubtext: {
        fontSize: 14,
        fontWeight: "bold"
    },
    loginPanel: {
        minHeight: 600,
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
        marginBottom: 8
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
    buttonLoading: {
        marginTop: 10,
        justifyContent: 'center',
        letterSpacing: 5,
        borderRadius: 30,
        backgroundColor: "#333",
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