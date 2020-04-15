import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView } from 'react-native';
import TelnetClient from '../TelnetClient';

const TelnetClientForm = () => {
    const [command, setCommand] = useState('');
    const [response, setResponse] = useState([
        'Hello world',
        "heeee",
        "heeee",
        "heeee",
        "heeee",
        "heeee",
        "heeee",
        "heeee",
        "heeee",
        "heeee",
        "heeee",
        "heeee",
        "heeee",
        "heeee",
        "heeee",
        "heeee",
        
    ]);

    const config = {
        ipAddress: '209.73.216.51',
        port: '23',
        username: "gorjthatsmyrj",
        password: 'My3l@de.com'
    }

    useEffect(() => {
        // onPressConnect();
    }, [])

    const onSubmitEditing = () => {
        console.log('SUBMITED')
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
                <View style={{ marginVertical: 2, alignItems: 'center' }}>
                    <Text style={{ color: 'green' }}>Connected</Text>
                </View>
                <View style={styles.textPane}>
                    <ScrollView >
                        {response.map(data => <Text style={{ paddingTop: 4, color: 'green' }}>{data}</Text>)}
                    </ScrollView>
                </View>

                <View style={{ borderWidth: 1, borderColor: '#fff', height: 35, marginHorizontal: 2 }}>
                    <TextInput
                        style={{ color: 'green', fontSize: 10 }}
                        onChangeText={setCommand}
                        placeholder="Send command"
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
    textPane: {
        borderWidth: 1,
        borderColor: 'green',
        marginVertical: 5,
        marginHorizontal: 2,
        height: '80%'
    }
})