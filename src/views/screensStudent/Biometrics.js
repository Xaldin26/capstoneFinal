import React, { useEffect, useState } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const Biometrics = () => {
  const [biometricRegistered, setBiometricRegistered] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    checkBiometricAvailability();
    retrieveUserId(); // Retrieve the user ID when the component mounts
  }, []);

  const checkBiometricAvailability = async () => {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();

    if (hasHardware && supportedTypes.length > 0) {
      console.log('Biometric sensor is available');
    } else {
      Alert.alert('Biometric sensor is not available on this device');
    }
  };

  const retrieveUserId = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      const parsedUserData = JSON.parse(userData);
      setUserId(parsedUserData.id); // Store the user ID
    } catch (error) {
      console.error('Failed to retrieve user ID:', error);
    }
  };

  const handleRegisterBiometrics = async () => {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Register your biometrics',
      fallbackLabel: 'Enter Passcode',
    });

    if (result.success) {
      setBiometricRegistered(true);
      const uid = generateUID();
      sendBiometricDataToBackend(uid);
    } else {
      Alert.alert('Authentication failed', result.error);
    }
  };

  const generateUID = () => {
    return 'user-' + new Date().getTime();
  };

  const sendBiometricDataToBackend = async (uid) => {
    try {
      const response = await axios.post('https://lockup.pro/api/register-biometrics', {
        user_id: userId, // Use the retrieved user ID here
        biometric_data: uid,
      });

      if (response.status === 200) {
        Alert.alert('Success', 'Biometrics registered successfully!');
      } else {
        Alert.alert('Error', 'Failed to register biometrics.');
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Register Your Biometrics</Text>
      <Button
        title={biometricRegistered ? 'Biometrics Registered' : 'Register Biometrics'}
        onPress={handleRegisterBiometrics}
        disabled={biometricRegistered}
      />
    </View>
  );
};

export default Biometrics;
