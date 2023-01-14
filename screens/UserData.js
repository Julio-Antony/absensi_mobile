import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useState } from 'react'
import back from '../assets/img/back.png'
import { useLogin } from '../api/LoginProvider'
import { isValidObjField, updateError } from '../utils/Methods'
import ApiContext from '../api/ApiContext'
import * as ImagePicker from 'expo-image-picker';
import { StackActions } from '@react-navigation/native'
import Check from '../assets/img/check.png'
import Buffer from '../assets/img/loading.gif'
import { FancyAlert } from 'react-native-expo-fancy-alerts';

const UserData = (props) => {
    const { navigation } = props;
    const { setProfile } = useLogin();
    const { token } = props.route.params
    const { profile } = useLogin();
    const [userInfo, setUserInfo] = useState({
        foto: profile.foto,
        nip: profile.nip,
        nama: profile.nama,
        tmpt_lhr: profile.tmpt_lhr || '',
        tgl_lhr: profile.tgl_lhr || '',
        jns_klmn: profile.jns_klmn || '',
        telp: profile.telp || '',
        alamat: profile.alamat || '',
    });
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [visible, setVisible] = useState(false);

    const [error, setError] = useState('');

    const { foto, nip, nama, tmpt_lhr, tgl_lhr, jns_klmn, telp, alamat } = userInfo;

    const handleOnChangeText = (value, fieldName) => {
        setUserInfo({ ...userInfo, [fieldName]: value });
    };

    const isValidForm = () => {
        if (!isValidObjField(userInfo))
            return updateError('Form tidak boleh kosong!', setError);

        return true;
    };

    const openImageLibrary = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== 'granted') {
            alert('Sorry, we need camera roll permissions to make this work!');
        }

        if (status === 'granted') {
            const response = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                base64: true
            });

            if (!response.canceled) {
                setUserInfo({ ...userInfo, foto: response.assets[0].base64 });
            }
        }
    };

    const toggleAlert = useCallback(() => {
        setVisible(!visible);
        setLoading(true)
    }, [visible]);

    const submitForm = async () => {
        toggleAlert()
        if (isValidForm()) {
            try {
                const res = await ApiContext.put(`/users/${profile._id}`, { ...userInfo }, {
                    headers: {
                        "x-auth-token": token,
                    },
                });

                if (res.data) {
                    setProfile(res.data.user);
                    setLoading(false);
                    setMessage(res.data.msg);
                }
            } catch (error) {
                console.log(error);
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

    const previous = () => {
        navigation.dispatch(
            StackActions.replace('Profil', {
                token: token,
            })
        );
    }

    return (
        <ScrollView>
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
                    <Pressable style={styles.iconText} onPress={previous}>
                        <Image source={back} style={styles.icon} />
                    </Pressable>
                    <Text style={styles.headerText}>
                        Data Pribadi
                    </Text>
                </View>
                <View style={styles.container}>
                    <TouchableOpacity
                        onPress={openImageLibrary}
                    >
                        <Image source={{ uri: 'data:image/jpeg;base64,' + foto }} style={styles.profileImg} />
                    </TouchableOpacity>
                    {error ? (
                        <Text style={{ color: 'red', fontSize: 18, textAlign: 'center' }}>
                            {error}
                        </Text>
                    ) : null}
                    <Text style={styles.labelInput}>Nomor Induk Pegawai</Text>
                    <TextInput
                        style={styles.inputUserData}
                        placeholder='Nomor Induk Pegawai'
                        value={nip}
                        editable={false}
                    />
                    <Text style={styles.labelInput}>Nama Lengkap</Text>
                    <TextInput
                        style={styles.inputUserData}
                        placeholder='Nama Lengkap'
                        value={nama}
                        onChangeText={value => handleOnChangeText(value, 'nama')}
                    />
                    <Text style={styles.labelInput}>Tempat Lahir</Text>
                    <TextInput
                        style={styles.inputUserData}
                        placeholder='Tempat Lahir'
                        value={tmpt_lhr}
                        onChangeText={value => handleOnChangeText(value, 'tmpt_lhr')}
                    />
                    <Text style={styles.labelInput}>Tanggal Lahir</Text>
                    <TextInput
                        style={styles.inputUserData}
                        placeholder='Tanggal Lahir'
                        value={tgl_lhr}
                        onChangeText={value => handleOnChangeText(value, 'tgl_lhr')}
                    />
                    <Text style={styles.labelInput}>Jenis Kelamin</Text>
                    <TextInput
                        style={styles.inputUserData}
                        placeholder='Jenis Kelamin'
                        value={jns_klmn}
                        onChangeText={value => handleOnChangeText(value, 'jns_klmn')}
                    />
                    <Text style={styles.labelInput}>Nomor Telp.</Text>
                    <TextInput
                        style={styles.inputUserData}
                        placeholder='Nomor Telp.'
                        value={telp}
                        onChangeText={value => handleOnChangeText(value, 'telp')}
                    />
                    <Text style={styles.labelInput}>Alamat</Text>
                    <TextInput
                        style={styles.inputUserData}
                        multiline={true}
                        numberOfLines={4}
                        placeholder='Alamat'
                        value={alamat}
                        onChangeText={value => handleOnChangeText(value, 'alamat')}
                    />
                    <Pressable style={styles.buttonSubmit} onPress={submitForm}>
                        <Text style={styles.buttonText}>PERBARUI</Text>
                    </Pressable>
                </View>
            </View>
        </ScrollView>
    )
}

export default UserData

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
        marginBottom: 60,
        width: 160,
        height: 160,
        backgroundColor: "#333",
        borderRadius: 5
    },
    labelInput: {
        width: "80%",
        fontSize: 18,
        fontWeight: "bold",
    },
    inputUserData: {
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
        marginTop: 20,
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
    }
})