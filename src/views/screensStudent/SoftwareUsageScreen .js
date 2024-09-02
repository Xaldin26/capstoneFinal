import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  ScrollView 
} from 'react-native';

const SoftwareUsageScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Software Usage and Licensing</Text>
      </View>
      
      <Image 
        source={require('../imglogo/access.png')} // Replace with your image path
        style={styles.image}
      />
      
      <View style={styles.contentContainer}>
        <Text style={styles.contentTitle}>Guidelines:</Text>
        <Text style={styles.contentText}>
          1. Only use licensed software that is pre-installed or approved by the lab administrator. Unauthorized software installations are strictly prohibited.
        </Text>
        <Text style={styles.contentText}>
          2. Respect software licensing agreements. Avoid unauthorized duplication, sharing, or use of unlicensed software.
        </Text>
        <Text style={styles.contentText}>
          3. Do not alter system settings or configurations without permission from the lab administrator.
        </Text>
        <Text style={styles.contentText}>
          4. Report any software issues or license notifications to the lab supervisor immediately. Do not attempt to fix software problems yourself.
        </Text>
        <Text style={styles.contentText}>
          5. Keep software updated only through approved processes. Unauthorized updates or modifications can compromise system integrity.
        </Text>
        <Text style={styles.contentText}>
          6. Maintain the security of your login credentials. Do not share your passwords or allow unauthorized access to the lab's software resources.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  headerContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    borderRadius: 10,
    marginBottom: 20,
  },
  contentContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 2,
    marginHorizontal: 16,
    marginBottom: 20,
  },
  contentTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  contentText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 15,
    lineHeight: 24,
  },
});

export default SoftwareUsageScreen;
