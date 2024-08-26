import React from "react";
import { View, Text, StyleSheet } from "react-native";

const UnlockScreen = ({ navigation }) => {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text style={styles.text}>Unlock Screen Content Here</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    textAlign: "center",
    fontSize: 20,
    color: "black",
  },
});

export default UnlockScreen;
