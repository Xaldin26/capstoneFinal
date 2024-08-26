import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";

const UnlockScreen = ({ navigation }) => {
  const handleAccept = () => {
    // Handle acceptance of terms and privacy policy
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Terms of Service</Text>
        <View style={styles.section}>
          <Text style={styles.text}>
            1. Introduction: This app enables control of a smart door lock. By using it, you agree to the terms.
          </Text>
          <Text style={styles.text}>
            2. User Responsibilities: Keep your login details confidential. Unauthorized access or tampering is prohibited.
          </Text>
          <Text style={styles.text}>
            3. Services: Details of functionality and update handling.
          </Text>
          <Text style={styles.text}>
            4. Data Usage: Includes data collection, storage, and purpose.
          </Text>
          <Text style={styles.text}>
            5. Security: Measures to protect data and the lock.
          </Text>
          <Text style={styles.text}>
            6. Liability: Limitations regarding malfunctions or data breaches.
          </Text>
          <Text style={styles.text}>
            7. Termination: Conditions for account termination.
          </Text>
          <Text style={styles.text}>
            8. Changes: Notification of changes to terms.
          </Text>
          <Text style={styles.text}>
            9. Governing Law: Governing law and jurisdiction.
          </Text>
        </View>
        <Text style={styles.title}>Privacy Policy</Text>
        <View style={styles.section}>
          <Text style={styles.text}>
            1. Introduction: Protecting user information and privacy.
          </Text>
          <Text style={styles.text}>
            2. Information Collection: Personal data types and collection methods.
          </Text>
          <Text style={styles.text}>
            3. Use of Information: Purpose of data use and sharing.
          </Text>
          <Text style={styles.text}>
            4. Data Security: Measures to protect user data.
          </Text>
          <Text style={styles.text}>
            5. User Rights: Access, correction, and deletion of data.
          </Text>
          <Text style={styles.text}>
            6. Cookies and Tracking: Usage of cookies and tracking technologies.
          </Text>
          <Text style={styles.text}>
            7. Data Retention: Duration and criteria for data retention.
          </Text>
          <Text style={styles.text}>
            8. Changes to the Policy: Notification of policy changes.
          </Text>
          <Text style={styles.text}>
            9. Contact Information: Contact details for questions.
          </Text>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleAccept}>
          <Text style={styles.buttonText}>Accept</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    backgroundColor: "#F5F5F5", // Light background color
    padding: 20,
  },
  content: {
    // Removed background color and shadow
    padding: 0,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333", // Dark color for titles
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
    color: "#555", // Slightly lighter color for text
  },
  section: {
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0", // Divider color
    paddingBottom: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#007BFF", // Blue button color
    borderRadius: 5,
    paddingVertical: 15,
    paddingHorizontal: 25,
    alignSelf: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#FFFFFF", // White text color
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default UnlockScreen;
