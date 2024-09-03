import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  Alert,
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Animated, 
  SafeAreaView,
  Image,
  TextInput,
  Modal,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreenStudent = ({ navigation }) => {
  const [userDetails, setUserDetails] = useState(null);
  const [selectedButton, setSelectedButton] = useState('Overview');
  const [subjects, setSubjects] = useState([]);
  const [matchedSubjects, setMatchedSubjects] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [subjectInstructorMap, setSubjectInstructorMap] = useState({});
  const [instructorSubjectMap, setInstructorSubjectMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [groupedSubjects, setGroupedSubjects] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [enrolmentKey, setEnrolmentKey] = useState('');

  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    getUserData();
    fetchData();
    const intervalId = setInterval(fetchData, 1000);

    const timeIntervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    return () => {
      clearInterval(intervalId);
      clearInterval(timeIntervalId);
    };
  }, []);

  useEffect(() => {
    if (matchedSubjects.length > 0) {
      saveCurrentSchedule(matchedSubjects[0]); // Save the first matching subject
    } else {
      saveCurrentSchedule(null); // Clear if no matching subject
    }
  }, [matchedSubjects]);

  const getUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        setUserDetails(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Failed to load user data', error);
    }
  };

  const saveCurrentSchedule = async (subject) => {
    try {
      if (subject) {
        const subjectWithInstructor = {
          ...subject,
          instructorName: subjectInstructorMap[subject.id]?.instructorName || 'Unknown Instructor',
        };
        await AsyncStorage.setItem('currentSchedule', JSON.stringify(subjectWithInstructor));
      } else {
        await AsyncStorage.removeItem('currentSchedule');
      }
    } catch (error) {
      console.error('Failed to save schedule data', error);
    }
  };

  const fetchData = async () => {
    try {
      const subjectsResponse = await axios.get('https://lockup.pro/api/subs');
      const fetchedSubjects = subjectsResponse.data.data || [];
      setSubjects(fetchedSubjects);

      const subjectIdResponse = await axios.get('https://lockup.pro/api/linkedSubjects');
      const subjectIds = subjectIdResponse.data.data?.map(item => item.subject_id) || [];

      const instructorsResponse = await axios.get('https://lockup.pro/api/instructors');
      const fetchedInstructors = instructorsResponse.data.data || [];
      setInstructors(fetchedInstructors);

      const instructorSubjectResponse = await axios.get('https://lockup.pro/api/linkedSubjects');
      const instructorSubjects = instructorSubjectResponse.data.data || [];

      const subjectInstructorMap = {};
      const instructorSubjectMap = {};

      instructorSubjects.forEach(instructorSubject => {
        const subject = fetchedSubjects.find(sub => sub.id === instructorSubject.subject_id);
        const instructor = fetchedInstructors.find(inst => inst.id === instructorSubject.user_id);
        if (subject && instructor) {
          subjectInstructorMap[subject.id] = subjectInstructorMap[subject.id] || {
            ...subject,
            instructorName: instructor.username,
          };
          instructorSubjectMap[instructor.id] = instructorSubjectMap[instructor.id] || [];
          instructorSubjectMap[instructor.id].push(subject);
        }
      });

      setSubjectInstructorMap(subjectInstructorMap);

      const filteredSubjects = fetchedSubjects.filter(subject => subjectIds.includes(subject.id));
      setMatchedSubjects(filteredSubjects);
      setInstructorSubjectMap(instructorSubjectMap);

      // Set grouped subjects for rendering
      const grouped = Object.keys(instructorSubjectMap).map(instructorId => ({
        instructorName: fetchedInstructors.find(inst => inst.id === parseInt(instructorId))?.username || 'Unknown Instructor',
        subjects: instructorSubjectMap[instructorId] || [],
      }));
      setGroupedSubjects(grouped);

      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  const formatTime = (time) => {
    if (!time) return 'Invalid Time';
    const [hours, minutes] = time.split(':');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    return `${formattedHours}:${minutes} ${ampm}`;
  };

  const getCurrentTimeFormatted = () => {
    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  };

  const getFormattedDate = () => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return currentTime.toLocaleDateString('en-US', options);
  };

  const getCurrentDay = () => {
    return currentTime.toLocaleDateString('en-US', { weekday: 'long' });
  };

  const isTimeWithinRange = (startTime, endTime, day) => {
    if (!startTime || !endTime || !day) return false;

    const [startHours, startMinutes] = startTime.split(':');
    const [endHours, endMinutes] = endTime.split(':');

    const start = new Date(currentTime);
    const end = new Date(currentTime);
    const now = new Date(currentTime);

    start.setHours(parseInt(startHours), parseInt(startMinutes), 0);
    end.setHours(parseInt(endHours), parseInt(endMinutes), 0);

    return now >= start && now <= end && day === getCurrentDay();
  };

  const renderContent = () => {
    switch (selectedButton) {
      case 'Overview':
        return (
          <ScrollView style={styles.scrollableContainer}>
            <Text style={styles.guidelinesText}>Laboratory Guidelines</Text>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScrollView}>
              <TouchableOpacity onPress={() => navigation.navigate('GeneralConductScreen')}>
                <View style={styles.scrollBox}>
                  <Image 
                    source={require('../imglogo/lab.png')}
                    style={styles.scrollBoxImage}
                  />
                  <Text style={styles.scrollBoxText}>General Conduct</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => navigation.navigate('EquipmentUsageScreen')}>
                <View style={styles.scrollBox}>
                  <Image 
                    source={require('../imglogo/equipment_usage.png')}
                    style={styles.scrollBoxImage}
                  />
                  <Text style={styles.scrollBoxText}>Equipment Usage</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => navigation.navigate('SoftwareUsageScreen')}>
                <View style={styles.scrollBox}>
                  <Image 
                    source={require('../imglogo/access.png')}
                    style={styles.scrollBoxImage}
                  />
                  <Text style={styles.scrollBoxText}>Usage & Licensing</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => navigation.navigate('SafetyProtocolsScreen')}>
                <View style={styles.scrollBox}>
                  <Image 
                    source={require('../imglogo/safety.png')}
                    style={styles.scrollBoxImage}
                  />
                  <Text style={styles.scrollBoxText}>Safety Protocols</Text>
                </View>
              </TouchableOpacity>
            </ScrollView>
          </ScrollView>
        );
      case 'People':
        const filteredGroupedSubjects = groupedSubjects
          .map(group => {
            const filteredSubjects = group.subjects.filter(subject =>
              subject.name?.toLowerCase().includes(searchQuery.toLowerCase())
            );
            if (group.instructorName?.toLowerCase().includes(searchQuery.toLowerCase())) {
              return {
                ...group,
                subjects: group.subjects,
              };
            }
            return filteredSubjects.length > 0
              ? { ...group, subjects: filteredSubjects }
              : null;
          })
          .filter(group => group !== null);

        return (
          <ScrollView style={styles.scrollableContainer}>
            <Text style={styles.scheduleText}>ENROLL A COURSE</Text>

            {/* Search Bar */}
            <TextInput
              style={styles.searchBar}
              placeholder="Search by Instructor or Subject Name"
              value={searchQuery}
              onChangeText={(text) => setSearchQuery(text)}
            />

            {/* Display filtered subjects */}
            {filteredGroupedSubjects.map(group => (
              <View key={group.instructorName} style={styles.group}>
                <Text style={styles.instructorHeader}>{group.instructorName}</Text>
                {group.subjects.length > 0 ? (
                  group.subjects.map(subject => (
                    <View key={subject.id} style={styles.subjectContainer}>
                      <Text style={styles.subjectTitle}>{subject.name || 'Unknown Subject'}</Text>
                      <Text style={styles.subjectCode}>Code: {subject.code || 'N/A'}</Text>
                      <Text style={styles.subjectDay}>Every: {subject.day || 'Unknown Day'}</Text>
                      <Text style={styles.subjectTime}>Time: {formatTime(subject.start_time)} - {formatTime(subject.end_time)}</Text>
                      <Text style={styles.subjectSection}>Section: {subject.section || 'N/A'}</Text>
                      <Text style={styles.subjectDescription}>
                        {subject.description || 'No description available'}
                        <TouchableOpacity>
                          <Text style={styles.readMore}> Read more →</Text>
                        </TouchableOpacity>
                      </Text>
                      <TouchableOpacity 
                        style={styles.enrollButton}
                        onPress={() => handleEnroll(subject)}
                      >
                        <Text style={styles.enrollButtonText}>Get Access</Text>
                      </TouchableOpacity>
                    </View>
                  ))
                ) : (
                  <Text style={styles.noDataText}>No subjects available</Text>
                )}
              </View>
            ))}
          </ScrollView>
        );
      default:
        return <Text style={styles.contentText}>Welcome to Home Screen</Text>;
    }
  };

  const handleEnroll = (subject) => {
    const subjectWithInstructor = {
      ...subject,
      instructorName: subjectInstructorMap[subject.id]?.instructorName || 'Unknown Instructor',
    };
    setSelectedSubject(subjectWithInstructor);
    setModalVisible(true);
  };

  const handleEnrollSubmit = async () => {
    if (!enrolmentKey) {
      Alert.alert('Error', 'Please enter an enrollment key.');
      return;
    }

    try {
      // Fetch all subjects data
      const response = await axios.get('https://lockup.pro/api/subs');
      const allSubjects = response.data.data;

      // Find the subject in the fetched data
      const matchedSubject = allSubjects.find(subject => subject.code === selectedSubject.code);

      if (!matchedSubject) {
        Alert.alert('Error', 'Subject not found.');
        return;
      }

      // Check if the enrolment key matches the QR code
      if (enrolmentKey !== matchedSubject.qr) {
        Alert.alert('Error', 'Invalid enrolment key.');
        return;
      }

      // Get logged-in user data from AsyncStorage
      const userData = await AsyncStorage.getItem('userData');
      const user = userData ? JSON.parse(userData) : null;

      if (!user) {
        Alert.alert('Error', 'User not found.');
        return;
      }

      // Prepare the data to be posted
      const postData = {
        student_id: user.id,
        subject_id: matchedSubject.id,
      };

      // Post the data to the server
      const postResponse = await axios.post('https://lockup.pro/api/student-subject', postData);

      if (postResponse.data.status === 'success') {
        Alert.alert('Success', 'Student successfully associated with the subject.');
      } else {
        Alert.alert('Error', 'Failed to enroll in the subject.');
      }

    } catch (error) {
      console.error('Enrollment error:', error);
      Alert.alert('Error', 'An error occurred while processing your request.');
    } finally {
      setModalVisible(false);
      setEnrolmentKey('');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.welcomeText}>Welcome, </Text>
        <Text style={styles.nameText}>{userDetails?.name || 'User'}</Text>
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
          <Text style={[styles.navButtonText, selectedButton === 'People' && styles.selectedButtonText]}>Add Course</Text>
        </TouchableOpacity>
      </View>
      {renderContent()}
      <Animated.View style={[styles.timeContainer, { opacity }]}>
        <Text style={styles.dateText}>{getFormattedDate()}</Text>
        <Text style={styles.timeText}>{getCurrentTimeFormatted()}</Text>
      </Animated.View>

      {/* Enrolment Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Enroll in {selectedSubject?.name}</Text>
            <Text style={styles.modalText}>Instructor: {selectedSubject?.instructorName}</Text>
            <Text style={styles.modalText}>Subject Code: {selectedSubject?.code}</Text>
            <Text style={styles.modalText}>Day: {selectedSubject?.day}</Text>
            <Text style={styles.modalText}>Time: {formatTime(selectedSubject?.start_time)} - {formatTime(selectedSubject?.end_time)}</Text>
            <Text style={styles.modalText}>Section: {selectedSubject?.section}</Text>

            <TextInput
              style={styles.input}
              placeholder="Enter Enrolment Key"
              value={enrolmentKey}
              onChangeText={setEnrolmentKey}
            />

            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleEnrollSubmit}
            >
              <Text style={styles.modalButtonText}>Enroll me</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: '#888' }]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    marginBottom: 10,
  },
  navButton: {
    backgroundColor: '#e0e0e0',
    height: 35,
    paddingHorizontal: 15,
    borderRadius: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    minWidth: 100,
  },
  selectedButton: {
    backgroundColor: '#1E293B',
  },
  navButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '500',
  },
  selectedButtonText: {
    color: '#fff',
  },
  scrollableContainer: {
    flex: 1,
  },
  guidelinesText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    textAlign: 'left',
    marginBottom: 10,
  },
  horizontalScrollView: {
    marginBottom: 20,
  },
  scrollBox: {
    width: 160,
    height: 140,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollBoxImage: {
    width: '100%',
    height: '70%',  // Adjusting height to make space for the text
    borderRadius: 10,
  },
  scrollBoxText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 5,
    textAlign: 'center',
  },
  scheduleText: {
    marginTop: 10,
    fontSize: 25,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  searchBar: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 20,
    paddingLeft: 15,
    marginBottom: 20,
  },
  group: {
    marginBottom: 20,
  },
  instructorHeader: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
    color: '#333',
  },
  subjectContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    elevation: 2,
    marginBottom: 10,
  },
  subjectTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  subjectCode: {
    fontSize: 14,
    color: '#666',
  },
  subjectDay: {
    fontSize: 14,
    color: '#666',
  },
  subjectTime: {
    fontSize: 14,
    color: '#666',
  },
  subjectSection: {
    fontSize: 14,
    color: '#666',
  },
  subjectDescription: {
    fontSize: 14,
    color: '#666',
  },
  readMore: {
    fontSize: 14,
    color: '#1E88E5',
  },
  noDataText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
    marginTop: 10,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    color: 'red',
    fontSize: 18,
  },
  timeContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  dateText: {
    fontSize: 18,
    color: '#666',
  },
  timeText: {
    fontSize: 18,
    color: '#333',
  },
  enrollButton: {
    backgroundColor: '#1E88E5',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  enrollButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
    color: '#333',
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#1E88E5',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default HomeScreenStudent;
