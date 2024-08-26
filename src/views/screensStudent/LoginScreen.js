import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { ALERT_TYPE, Dialog, AlertNotificationRoot } from "react-native-alert-notification";
import Input from "../components/Input";
import Button from "../components/Button";
import Loader from "../components/Loader";
import ccsLogo from "../../img/lck.png";
import { CommonActions } from "@react-navigation/native";

const LoginScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const userData = await AsyncStorage.getItem("user");
      if (userData) {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: "DrawerNavigatorStudent" }],
          })
        );
      }
    };

    checkLoginStatus();
  }, [navigation]);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await axios.post("https://lockup.pro/api/student", {
        name,
        password,
      });

      if (response.status === 200) {
        const userData = response.data;
        const userId = userData.id; // Extract the user's ID

        // Store user data in AsyncStorage, including the ID
        await AsyncStorage.setItem("user", JSON.stringify(userData));

        // Pass the user ID to the DrawerNavigatorStudent and navigate
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: "DrawerNavigatorStudent", params: { userId } }],
          })
        );
      }
    } catch (error) {
      if (error.response && error.response.status === 422) {
        const validationErrors = error.response.data.errors;
        const errorMessage = Object.values(validationErrors).flat().join("\n");
        setError(errorMessage);
        Dialog.show({
          type: ALERT_TYPE.DANGER,
          title: "Validation Error",
          textBody: errorMessage,
          button: "Close",
        });
      } else {
        setError("Failed to connect to the server");
        Dialog.show({
          type: ALERT_TYPE.DANGER,
          title: "Error",
          textBody: "Failed to connect to the server",
          button: "Close",
        });
      }
      console.error("Network request failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertNotificationRoot style={styles.container}>
      <SafeAreaView style={styles.container}>
        <Loader visible={loading} />
        <ScrollView style={styles.svContainer}>
          <View style={styles.spacer} />
          <Image style={styles.image} source={ccsLogo} />
          <Text style={styles.textTitle}>LOGIN AS STUDENT</Text>
          <View style={styles.viewContainer}>
            <Input
              label="Username"
              iconName="user"
              placeholder="Enter your Username"
              onChangeText={setName}
              onFocus={() => setError(null)}
              error={error}
            />
            <Input
              label="Password"
              iconName="lock"
              password
              placeholder="Enter your Password"
              onChangeText={setPassword}
              onFocus={() => setError(null)}
              error={error}
            />
            <Button title="Login" onPress={handleLogin} />
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
          </View>
        </ScrollView>
      </SafeAreaView>
    </AlertNotificationRoot>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  svContainer: {
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  spacer: {
    height: 50,
  },
  image: {
    width: 255,
    height: 200,
    alignSelf: "center",
    marginBottom: 40,
  },
  textTitle: {
    fontSize: 25,
    textAlign: "center",
    fontWeight: "bold",
    color: "white",
  },
  viewContainer: {
    paddingVertical: 20,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 10,
  },
});

export default LoginScreen;
