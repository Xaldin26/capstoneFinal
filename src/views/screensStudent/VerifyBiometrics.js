import React, { useState } from 'react';
import { View, Text, Button, Alert, TextInput, StyleSheet } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import axios from 'axios';

const VerifyBiometrics = () => {
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState('');

  const handleVerifyBiometrics = async () => {
    if (!userId) {
      Alert.alert('Error', 'Please enter a user ID.');
      return;
    }

    setLoading(true);

    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();

      if (hasHardware && supportedTypes.length > 0) {
        const result = await LocalAuthentication.authenticateAsync({
          promptMessage: 'Authenticate with biometrics',
          fallbackLabel: 'Enter Passcode',
        });

        if (result.success) {
          // Fetch user data from the backend using the provided user ID
          const userResponse = await axios.get `https://lockup.pro/api/students`;
          const userData = userResponse.data;

          if (userData.biometric_data) {
            if (userData.biometric_data === result.id) {
              Alert.alert('Success', 'Biometric authentication successful!');
            } else {
              Alert.alert('Error', 'Biometric data does not match.');
            }
          } else {
            // If biometric data is null, register the new biometric data
            const updateResponse = await axios.put(`https://lockup.pro/api/students/${userId}`, {
              biometric_data: result.id,
            });

            if (updateResponse.status === 200) {
              Alert.alert('Success', 'Biometric data has been registered.');
            } else {
              Alert.alert('Error', 'Failed to register biometric data.');
            }
          }
        } else {
          Alert.alert('Authentication failed', result.error);
        }
      } else {
        Alert.alert('Biometric sensor is not available on this device');
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        Alert.alert('Error', 'User not found.');
      } else {
        Alert.alert('Error', error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify Your Biometrics</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter User ID"
        value={userId}
        onChangeText={setUserId}
        keyboardType="numeric"
      />
      <Button
        title={loading ? 'Verifying...' : 'Verify Biometrics'}
        onPress={handleVerifyBiometrics}
        disabled={loading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 20,
  },
});

export default VerifyBiometrics;
