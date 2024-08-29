import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native';

const UnlockScreen = () => {
  const serverIp = '192.168.1.24'; // Replace with the actual IP of your Flask server

  const sendCommand = async (command) => {
    try {
      const response = await fetch(`http://${serverIp}:5000/control_relay`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ command }),
      });

      const result = await response.json();
      if (response.ok) {
        Alert.alert('Success', `System is ${result.status}`);
      } else {
        Alert.alert('Error', 'Failed to send command');
      }
    } catch (error) {
      Alert.alert('Error', 'Network error, please try again later.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lock Control App</Text>
      <TouchableOpacity
        style={[styles.button, styles.lockButton]}
        onPress={() => sendCommand('lock')}
      >
        <Text style={styles.buttonText}>Lock</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, styles.unlockButton]}
        onPress={() => sendCommand('unlock')}
      >
        <Text style={styles.buttonText}>Unlock</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  button: {
    padding: 15,
    borderRadius: 5,
    margin: 10,
    width: '80%',
    alignItems: 'center',
  },
  lockButton: {
    backgroundColor: '#e74c3c',
  },
  unlockButton: {
    backgroundColor: '#2ecc71',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default UnlockScreen;
