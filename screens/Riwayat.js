import moment from 'moment/moment';
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    Pressable,
} from 'react-native';
import Timeline from 'react-native-timeline-flatlist'
import ApiContext from '../api/ApiContext';
import back from '../assets/img/back.png'
moment.locale('id')
export default class Riwayat extends Component {

    constructor(props) {
        super(props)
        this.state = {
            data: []
        }
    }


    async componentDidMount() {
        const res = await ApiContext.get("/absensi/pribadi", {
            headers: {
                "x-auth-token": this.props.route.params.token,
            },
        })


        this.setState({
            data: res.data.map((item => {
                return {
                    time: moment(item.createdAt).format('L'),
                    title: moment(item.createdAt).format('dddd'),
                    description: `Jam Masuk : ${moment(item.jam_msk).format('HH:mm')} \n \nJam Keluar : ${item.jam_klr ? moment(item.jam_klr).format('HH:mm') : '-'}`
                }
            }
            ))
        })
    }

    render() {
        //'rgb(45,156,219)'
        return (
            <View style={styles.homeScreen}>
                <View style={styles.header}>
                    <Pressable style={styles.iconText} onPress={() => this.props.navigation.navigate('Home', { token: this.props.route.params.token })}>
                        <Image source={back} style={styles.icon} />
                    </Pressable>
                    <Text style={styles.headerText}>
                        Riwayat Absensi
                    </Text>
                </View>
                <View style={styles.container}>
                    <Timeline
                        style={styles.list}
                        data={this.state.data}
                        innerCircle={'dot'}
                    />
                </View>
            </View>
        );
    }
}

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
        paddingLeft: "15%",
        backgroundColor: 'white'
    },
    list: {
        flex: 1,
        marginVertical: 20,
    },
});