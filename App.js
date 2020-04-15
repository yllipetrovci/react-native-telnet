/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  TextInput,
} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';
import TelnetClient from './TelnetClient';

const App = () => {
  const [command, setCommand] = useState('');
  const [response, setResponse] = useState([]);

  const config = {
    ipAddress: '209.73.216.51',
    port: '23',
    username: "gorjthatsmyrj",
    password: 'My3l@de.com'
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
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <View style={{ borderWidth: 1, borderColor: 'black', marginVertical: 10, marginHorizontal: 10, height: '85%' }}>
          {response.map(data => <Text style={{ paddingTop: 4 }}>{data}</Text>)}
        </View>
        <TouchableOpacity onPress={onPressSendCommand} style={{ backgroundColor: 'green', height: 50, flex: 1 }}>
          <TextInput
            onChangeText={setCommand}
            placeholder="Send command"
          />
        </TouchableOpacity>
        <View style={{ marginHorizontal: 10 }}>
          {/* Terminal */}
          <View style={{ borderWidth: 1, borderColor: 'green' }}>
            <Text>Here command line</Text>
          </View>
          {/* Buttons */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', textAlign: 'center' }}>
            <TouchableOpacity onPress={onPressConnect} style={{ borderColor: 'black', borderWidth: 1, height: 50, flex: 1 }}>
              <Text style={{ justifyContent: 'center', textAlign: 'center' }}>Connect</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onPressDisconnect} style={{ borderColor: 'black', borderWidth: 1, height: 50, flex: 1 }}>
              <Text>Disconnect</Text>
            </TouchableOpacity>
          </View>

        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;
