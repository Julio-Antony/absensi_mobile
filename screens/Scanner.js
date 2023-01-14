import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, Linking, Modal, TouchableHighlight, Image } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import axios from 'axios';
import Check from '../assets/img/check.png'
import Buffer from '../assets/img/loading.gif'
import { StackActions } from '@react-navigation/native';

export default function Scanner(props) {
    const { token } = props.route.params;
    const { navigation } = props;
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        (async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    const onAbsen = async (data) => {
        try {
            const res = await axios.post(data, null, {
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
            alert(error)
        }
    };

    const handleBarCodeScanned = ({ type, data }) => {
        setScanned(true);
        setModalVisible(true)
        setLoading(true)
        onAbsen(data)
    };

    const navigate = () => {
        navigation.dispatch(
            StackActions.replace('Home', {
                token: token,
            })
        );
    }

    if (hasPermission === null) {
        return <Text>Requesting for camera permission</Text>;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }

    return (
        <View
            style={{
                flex: 1,
                flexDirection: 'column'
            }}>
            <Modal
                animationType="slide"
                transparent={false}
                visible={modalVisible}
                onRequestClose={() => {
                    setScanned(false);
                }}>
                <View style={{ flex: 1, backgroundColor: "#7FB3D5", padding: "10%", justifyContent: "center" }}>
                    <View style={styles.successPanel}>
                        {loading ? (
                            <View style={styles.container}>
                                <Image
                                    style={{ width: 80, height: 80 }}
                                    source={Buffer} />
                            </View>
                        ) :
                            (
                                <>
                                    <Image source={Check} style={styles.logo}></Image>
                                    <Text style={styles.text}>{message}</Text>
                                    <TouchableHighlight
                                        style={styles.button}
                                        onPress={navigate}
                                        underlayColor='slategray'
                                    >
                                        <Text style={{ color: 'black', fontSize: 15, textAlign: "center" }}>OK</Text>
                                    </TouchableHighlight>
                                </>
                            )}
                    </View>
                </View>
            </Modal>

            <BarCodeScanner
                onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                <View style={{
                    marginBottom: 100, padding: 20, justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <View style={{ alignItems: 'center', marginBottom: 5 }}>
                        <Image
                            style={{
                                width: 100,
                                height: 100,
                                resizeMode: 'contain',
                                marginBottom: 20,
                            }}
                            source={{ uri: 'http://domain.biz/img/logo_dark.png' }}
                        />
                        <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold', paddingBottom: 10, textTransform: "uppercase", textAlign: "center" }}>
                            selamat datang di sistem absensi pegawai menggunakan qr code balai desa gandasari
                        </Text>
                    </View>
                    <View
                        style={{
                            alignItems: 'center',
                            borderColor: 'white',
                            borderWidth: 1,
                            borderRadius: 5,
                            paddingVertical: 80,
                            paddingHorizontal: 100,
                            width: 100,
                        }}
                    />

                    <View style={{ alignItems: 'center', marginTop: 15 }}>
                        <Text style={{ color: 'white', fontSize: 15, textAlign: 'center' }}>
                            Silahkan pindai QR Code yang sudah di tentukan untuk absen
                        </Text>
                    </View>
                </View>
            </BarCodeScanner>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
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
        marginBottom: 10
    },
    logo: {
        width: 60,
        height: 60,
        marginBottom: 20
    },
    text: {
        fontSize: 24,
        textAlign: "center",
        marginBottom: 20
    }
});