import * as React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from "@react-native-async-storage/async-storage";

import HomeScreen from "./src/views/screens/HomeScreen";
import RegistrationScreen from "./src/views/screens/RegistrationScreen";
import LoginScreen from "./src/views/screensStudent/LoginScreen";
import MainLog from "./src/views/screens/MainLog";
import UnlockScreen from "./src/views/screens/UnlockScreen";
import MailScreen from "./src/views/screens/MailScreen";
import AddSchedule from "./src/views/screens/AddSchedule";
import ProfileScreen from "./src/views/screens/ProfileScreen";
import LoginScreenInstructor from "./src/views/screens/LoginScreenInstructor";
import HomeScreenStudent from "./src/views/screensStudent/HomeScreenStudent";
import QrScanner from "./src/views/screensStudent/qrscanner";
import MailScreenStudent from "./src/views/screensStudent/MailScreenStudent";
import Biometrics from "./src/views/screensStudent/Biometrics";
import VerifyBiometrics from "./src/views/screensStudent/VerifyBiometrics";



const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

function InstructorTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBarStyle,
        headerShown: false,
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.iconContainer}>
              <Icon name="home" size={30} color={focused ? '#000' : '#666'} />
              <Text style={focused ? styles.iconTextFocused : styles.iconText}>HOME</Text>
            </View>
          ),
        }}
      />
      <Tab.Screen 
        name="Unlock" 
        component={UnlockScreen} 
        options={{
          tabBarIcon: () => (
            <View style={styles.iconContainer}>
              <View style={styles.circleButton}>
                <Icon name="unlock-alt" size={30} color="#ffffff" />
              </View>
            </View>
          ),
        }}
      />
      <Tab.Screen 
        name="Mail" 
        component={MailScreen} 
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.iconContainer}>
              <Icon name="envelope" size={30} color={focused ? '#000' : '#666'} />
              <Text style={focused ? styles.iconTextFocused : styles.iconText}>MAIL</Text>
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// Student's Tab Navigator
function StudentTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBarStyle,
        headerShown: false,
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreenStudent} 
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.iconContainer}>
              <Icon name="home" size={30} color={focused ? '#000' : '#666'} />
              <Text style={focused ? styles.iconTextFocused : styles.iconText}>HOME</Text>
            </View>
          ),
        }}
      />
      <Tab.Screen 
        name="Qrscanner" 
        component={QrScanner} 
        options={{
          tabBarIcon: () => (
            <View style={styles.iconContainer}>
              <View style={styles.circleButton}>
                <Icon name="qrcode" size={40} color="#ffffff" />
              </View>
            </View>
          ),
        }}
      />
      <Tab.Screen 
        name="Mail" 
        component={MailScreenStudent} 
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.iconContainer}>
              <Icon name="envelope" size={30} color={focused ? '#000' : '#666'} />
              <Text style={focused ? styles.iconTextFocused : styles.iconText}>MAIL</Text>
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function CustomDrawerContent(props) {
  const [userName, setUserName] = React.useState('User');
  const [userEmail, setUserEmail] = React.useState('');

  React.useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem('userData');
        if (userData) {
          const parsedData = JSON.parse(userData);
          if (parsedData.loggedIn) {
            setUserName(parsedData.fullname || 'User');
            setUserEmail(parsedData.email || '');
          }
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };
    fetchUserData();
  }, []);

  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.drawerHeader}>
        <Image source={{ uri: 'https://via.placeholder.com/100' }} style={{ width: 100, height: 100, borderRadius: 50 }} />
        <Text style={styles.drawerHeaderText}>{userName}</Text>
        <Text style={styles.drawerEmailText}>{userEmail}</Text>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => props.navigation.navigate('ProfileScreen')}
        >
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>
      <DrawerItemList {...props} />
      <DrawerItem
        label="Log out"
        icon={({ color, size }) => (
          <Icon name="sign-out" color={color} size={size} />
        )}
        onPress={() => props.navigation.navigate('MainLog')}
      />
    </DrawerContentScrollView>
  );
}

function DrawerNavigator() {
  return (
    <Drawer.Navigator drawerContent={props => <CustomDrawerContent {...props} />}>
      <Drawer.Screen 
        name="HomeTabs" 
        component={InstructorTabNavigator} 
        options={{ 
          title: 'Home',
          drawerIcon: ({ color, size }) => (
            <Icon name="home" color={color} size={size} />
          ),
        }} 
      />
      
      <Drawer.Screen 
        name="MailScreen" 
        component={MailScreen} 
        options={{ 
          title: 'Mail',
          drawerIcon: ({ color, size }) => (
            <Icon name="envelope" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen 
        name="AddSchedule" 
        component={AddSchedule} 
        options={{ 
          title: 'Add Schedule',
          drawerIcon: ({ color, size }) => (
            <Icon name="calendar-plus-o" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen 
        name="ProfileScreen" 
        component={ProfileScreen} 
        options={{ 
          title: 'Profile',
          drawerIcon: ({ color, size }) => (
            <Icon name="user" color={color} size={size} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}

function DrawerNavigatorStudent() {
  return (
    <Drawer.Navigator drawerContent={props => <CustomDrawerContent {...props} />}>
      <Drawer.Screen 
        name="HomeTabs" 
        component={StudentTabNavigator} 
        options={{ 
          title: 'Home',
          drawerIcon: ({ color, size }) => (
            <Icon name="home" color={color} size={size} />
          ),
        }} 
      />
      <Drawer.Screen 
        name="Qrscanner" 
        component={QrScanner} 
        options={{ 
          title: 'Scanner',
          drawerIcon: ({ color, size }) => (
            <Icon name="unlock-alt" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen 
        name="MailScreen" 
        component={MailScreen} 
        options={{ 
          title: 'Mail',
          drawerIcon: ({ color, size }) => (
            <Icon name="envelope" color={color} size={size} />
          ),
        }}
      />
    
      <Drawer.Screen 
        name="ProfileScreen" 
        component={ProfileScreen} 
        options={{ 
          title: 'Profile',
          drawerIcon: ({ color, size }) => (
            <Icon name="user" color={color} size={size} />
          ),
        }}
      />

<Drawer.Screen 
        name="Biometrics" 
        component={Biometrics} 
        options={{ 
          title: 'Profile',
          drawerIcon: ({ color, size }) => (
            <Icon name="user" color={color} size={size} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}

function App() {
  return (
    
      <NavigationContainer>
        <Stack.Navigator initialRouteName="MainLog" screenOptions={{ headerShown: false }}>
          <Stack.Screen
            name="DrawerNavigator"
            component={DrawerNavigator}
          />
          <Stack.Screen
            name="DrawerNavigatorStudent"
            component={DrawerNavigatorStudent}
          />
          
          <Stack.Screen
            name="MainLog"
            component={MainLog}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="LoginScreen"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="RegistrationScreen"
            component={RegistrationScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="AddSchedule"
            component={AddSchedule}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ProfileScreen"
            component={ProfileScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="LoginScreenInstructor"
            component={LoginScreenInstructor}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Biometrics"
            component={Biometrics}
            options={{ headerShown: false }}
          />

<Stack.Screen
            name="VerifyBiometrics"
            component={VerifyBiometrics}
            options={{ headerShown: false }}
          />
          
          
        </Stack.Navigator>
      </NavigationContainer>
    
  );
}

const styles = StyleSheet.create({
  tabBarStyle: {
    position: 'absolute',
    elevation: 0,
    backgroundColor: '#ffffff',
    borderRadius: 15,
    height: 65,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleButton: {
    width: 70,
    height: 70,
    borderRadius: 40,
    backgroundColor: '#0000ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 50,
  },
  iconText: {
    color: '#666',
  },
  iconTextFocused: {
    color: '#000',
  },
  circleIconText: {
    color: '#ffffff',
  },
  drawerHeader: {
    padding: 20,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  drawerHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  drawerEmailText: {
    fontSize: 14,
    color: '#555',
    marginTop: 5,
  },
  editButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 5,
  },
  editButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default App;
