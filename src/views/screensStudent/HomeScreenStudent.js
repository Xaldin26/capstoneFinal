import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const HomeScreenStudent = ({ navigation }) => {
  const [userDetails, setUserDetails] = React.useState(null); // Initialize as null
  const [selectedButton, setSelectedButton] = React.useState('Overview'); // Default to 'Overview'

  React.useEffect(() => {
    getUserData();
  }, []);

  const getUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem("userData");

      if (userData) {
        const parsedData = JSON.parse(userData);
        if (parsedData.loggedIn) {
          console.log("Home Screen");
          console.log(parsedData);
        }
        setUserDetails(parsedData);
      }
    } catch (error) {
      console.error("Failed to load user data", error);
    }
  };

  const renderContent = () => {
    switch (selectedButton) {
      case 'Overview':
        return (
          <View style={styles.overviewContainer}>
            <Image
              source={require('../imglogo/ccslogo.png')} // Replace with the path to your local image
              style={styles.image}
            />
            <View style={styles.textContainer}>
              <Text style={styles.mainText}>Mac Laboratory</Text>
              <Text style={styles.subText}>COLLEGE OF COMPUTER STUDIES</Text>
            </View>
            <View style={styles.boxContainer}>
              <View style={styles.box}>
                <Text style={styles.boxText}>Centered Box</Text>
              </View>
            </View>
          </View>
        );
      case 'People':
        return <Text style={styles.contentText}>People Screen Content</Text>;
      default:
        return <Text style={styles.contentText}>Welcome to Home Screen</Text>;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.welcomeText}>Welcome, </Text>
        <Text style={styles.nameText}>{userDetails?.fullname || 'User'}</Text>
      </View>
      <View style={styles.navbar}>
        <TouchableOpacity
          style={[styles.navButton, selectedButton === 'Overview' && styles.selectedButton]}
          onPress={() => setSelectedButton('Overview')}
        >
          <Text style={[styles.navButtonText, selectedButton === 'Overview' && styles.selectedButtonText]}>Overview</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.navButton, selectedButton === 'People' && styles.selectedButton]}
          onPress={() => setSelectedButton('People')}
        >
          <Text style={[styles.navButtonText, selectedButton === 'People' && styles.selectedButtonText]}>People</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.contentContainer}>
        {renderContent()}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 16,
  },
  headerContainer: {
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 22,
    color: "#333",
  },
  nameText: {
    fontSize: 35,
    fontWeight: "700",
    color: "#333",
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'flex-start', // Align buttons to the left
    marginBottom: 20,
  },
  navButton: {
    backgroundColor: '#e0e0e0', // Default button color
    height: 35, // Set fixed height for buttons
    paddingHorizontal: 15,
    borderRadius: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    alignItems: 'center',
    justifyContent: 'center', // Center text vertically
    marginRight: 10, // Space between buttons
    minWidth: 100, // Minimum width of button
  },
  selectedButton: {
    backgroundColor: '#6200ea', // Color when selected
  },
  navButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '500',
  },
  selectedButtonText: {
    color: '#fff', // Text color when button is selected
  },
  contentContainer: {
    flex: 1,
    marginTop: 20,
  },
  contentText: {
    fontSize: 18,
    color: "#333",
  },
  overviewContainer: {
    position: 'relative', // Enable absolute positioning of child elements
    flex: 1,
    alignItems: 'flex-start', // Align content to the start
    justifyContent: 'center', // Center content vertically if needed
  },
  image: {
    position: 'absolute',
    left: -110, // Align to the left
    top: -20, // Align to the top
    width: 280, // Set a small width for the logo
    height: 65, // Set a small height for the logo
    resizeMode: 'contain', // Ensure the image scales to fit within the dimensions
  },
  textContainer: {
    position: 'absolute',
    left: 50, // Align text to the right of the image
    top: -15, // Adjust top position as needed
    paddingLeft: 20, // Space between image and text
  },
  mainText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    fontFamily: 'Roboto',
  },
  subText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontFamily: 'Roboto',
  },
  boxContainer: {
    marginTop: -250, // Reduced margin to move the box up
    alignItems: 'center', // Center the box horizontally
    width: '100%', // Ensure the box takes the full width available
  },
  box: {
    backgroundColor: '#e0e0e0', // Background color of the box
    padding: 60,
    borderRadius: 10,
    width: '95%', // Width of the box
    alignItems: 'center', // Center content inside the box
  },
  boxText: {
    fontSize: 18,
    color: '#333',
  },
});

export default HomeScreenStudent;