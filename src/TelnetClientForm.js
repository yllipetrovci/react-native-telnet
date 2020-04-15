import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView } from 'react-native';
import TelnetClient from '../TelnetClient';

const TelnetClientForm = () => {
    const CONNECTION_STATE = {
        ON_LOAD: 'Connecting...',
        SUCCESS: 'Connected',
        FAILED: 'Disconnected'
    };
    const [command, setCommand] = useState('');
    const [response, setResponse] = useState([]);
    const [connectionStateValue, setConnectionStateValue] = useState(CONNECTION_STATE.ON_LOAD);

    const config = {
        ipAddress: '209.73.216.51',
        port: '23',
        username: "gorjthatsmyrj",
        password: 'My3l@de.com'
    }

    useEffect(() => {
        setTimeout(() => {
            setConnectionStateValue(CONNECTION_STATE.SUCCESS);
        }, 2000)
        // onPressConnect();
    }, [])

    const onSubmitEditing = (event) => {
        const target = event.nativeEvent;
        const value = target.text;
        console.log('SUBMITED')
        setResponse([...response, value]);
        setCommand('');
    }

    const onPressConnect = () => {
        console.log('Connect Button CLICKED')
        TelnetClient.connect(config, (success) => {
            console.log('===Success===')
            console.log({ success })
        }, (error) => {
            console.log('===Error===')
            console.log({ error })
        });
    }

    const onPressSendCommand = () => {
        console.log('Command button clicked')
        TelnetClient.sendCommand(command, (success) => {
            console.log('===Success===')
            setResponse(success);
            // success.map(data => console.log(data))
        }, (error) => {
            console.log('===Error===')
            console.log({ error });
        });
    }

    const onPressDisconnect = () => {
        console.log('Disconnect Button clicked')
        TelnetClient.disconnect((success) => {
            console.log('===Success===')
            console.log({ success })
        }, (error) => {
            console.log('===Error===')
            console.log({ error });
        });
    }
    return (
        <KeyboardAvoidingView
            style={styles.container}
        >
            <View style={styles.container}>
                {/* status flag */}
                <View style={styles.statusFlag}>
                    <Text style={styles.textProp}>{connectionStateValue}</Text>
                </View>
                <View style={styles.textPane}>
                    <ScrollView contentContainerStyle={{ flex: 1, justifyContent: 'flex-end' }}>
                        {response.map((data, index) => <Text key={index} style={{ paddingTop: 4, ...styles.textProp }}>{data}</Text>)}
                    </ScrollView>
                </View>

                <View style={{ borderWidth: 1, borderColor: '#fff', height: 40, marginHorizontal: 2 }}>
                    <TextInput
                        style={styles.textProp}
                        onChangeText={setCommand}
                        placeholder="Send command"
                        value={command}
                        onSubmitEditing={onSubmitEditing}
                    />
                </View>
            </View>
        </KeyboardAvoidingView>
    )
}

export default TelnetClientForm;

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#000',
        height: '100%'
    },
    statusFlag: {
        marginVertical: 2,
        alignItems: 'center'
    },
    textProp: {
        fontSize: 16,
        color: 'green'
    },
    textPane: {
        borderWidth: 1,
        borderColor: 'green',
        marginVertical: 5,
        marginHorizontal: 2,
        height: '80%',

    }
})