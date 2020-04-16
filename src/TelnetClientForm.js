import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, ScrollView, KeyboardAvoidingView } from 'react-native';
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
        ipAddress: '1.1.1.1.1',
        port: '1.1.1.1',
        username: "usr",
        password: 'pwd'
    }

    useEffect(() => {
        onPressConnect();
    }, [])

    const onSubmitEditing = (event) => {
        const target = event.nativeEvent;
        const value = target.text;
        console.log('SUBMITED')
        setResponse([...response, value]);
        setCommand('');
        onPressSendCommand(value);
    }

    const onPressConnect = () => {
        TelnetClient.connect(config, (_) => {
            setConnectionStateValue(CONNECTION_STATE.SUCCESS);
            TelnetClient.sendCommand("?", (success) => {
                console.log('===Success===')
                setResponse(success);
            }, (error) => {
                console.log('===Error===')
                console.log({ error });
            });
        }, (error) => {
            console.log('===Error===')
            console.log({ error })
        });
    }

    const onPressSendCommand = () => {
        console.log('Command button clicked')
        TelnetClient.sendCommand(command, (success) => {
            console.log('===Success===')
            setResponse([response, ...success]);
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
        <KeyboardAvoidingView style={styles.container}>
            <View style={styles.container}>
                <View style={styles.statusFlag}>
                    <Text style={styles.textProp}>{connectionStateValue}</Text>
                </View>
                <View style={styles.textPane}>
                    <ScrollView contentContainerStyle={styles.textPaneScrollView}>
                        {response.map((data, index) =>
                            <Text key={index} style={[styles.textResponse, styles.textProp]}>{data}</Text>
                        )}
                    </ScrollView>
                </View>
                <View style={styles.inputWrapper}>
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
        fontSize: 12,
        color: 'green'
    },
    textResponse: {
        paddingTop: 4
    },
    textPane: {
        borderWidth: 1,
        marginHorizontal: 2,
        height: '85%',
    },
    inputWrapper: {
        height: 40,
        marginHorizontal: 2
    },
    textPaneScrollView: {
        justifyContent: 'flex-end',
        paddingTop: 10
    }
})