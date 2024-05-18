import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {Picker} from '@react-native-picker/picker';
import {getDailyWinner, getDailyWinnerDates} from '../../utils/apiservice';
import { Colors } from '../../utils/constants';

const BackgroundImage = () => {
  const backgroundImageSource = require('../../assets/images/ic_winner_bg.jpg');

  return (
    <Image source={backgroundImageSource} style={styles.backgroundImage} />
  );
};

const DailyWinner = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [dates, setDates] = useState([]);
  const [isDatesLoading, setIsDatesLoading] = useState(true);
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    // Use the actual API call to fetch dates
    getDailyWinnerDates()
      .then(response => response)
      .then(data => {
        const dateList = data.map(item => item.date);
        setDates(dateList);
        setIsDatesLoading(false);
      })
      .catch(error => {
        console.error('Error fetching dates:', error);
        setIsDatesLoading(false);
      });
  }, []);

  const handleDateChange = date => {
    setSelectedDate(date);
    sendDate(date);
  };

  const sendDate = selectedDate => {
    getDailyWinner(selectedDate)
      .then(response => response)
      .then(data => {
        const updatedProfiles = data.map(item => {
          if (item.profile) {
            item.profile = `https://www.vguardrishta.com/img/appImages/Profile/${item.profile}`;
          }
          return item;
        });
        setProfiles(updatedProfiles);
        console.log('POST request response:', updatedProfiles);
      })
      .catch(error => {
        console.error('Error making POST request:', error);
      });
  };

  const groupedProfiles = [];
  for (let i = 0; i < profiles.length; i += 2) {
    groupedProfiles.push(profiles.slice(i, i + 2));
  }

  return (
    <View style={styles.container}>
      <BackgroundImage />
      <Text style={styles.title}>Daily Winner</Text>
      <ScrollView style={styles.contentContainer}>
        <View style={styles.pickerContainer}>
          <View style={styles.inputContainer}>
            {isDatesLoading ? (
              <Text style={styles.blackText}>Loading dates...</Text>
            ) : dates.length === 0 ? (
              <Text style={styles.blackText}>No dates available.</Text>
            ) : (
              <Picker
                selectedValue={selectedDate}
                onValueChange={handleDateChange}
                style={styles.picker}>
                {dates.map(date => (
                  <Picker.Item key={date} label={date} value={date} />
                ))}
              </Picker>
            )}
          </View>
        </View>
        <View style={styles.profilesContainer}>
          {groupedProfiles.map((profilePair, index) => (
            <View key={index} style={styles.profileRow}>
              {profilePair.map((profile, subIndex) => (
                <ProfileCard key={subIndex} profile={profile} />
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const ProfileCard = ({profile}) => {
  return (
    <TouchableOpacity style={styles.profileCard}>
      <View style={styles.crownImage}>
        <Image
          style={{flex: 1, width: '100%', height: '100%'}}
          resizeMode="contain"
          source={require('../../assets/images/ic_winner_.png')}
        />
      </View>
      <Image source={{uri: profile.profile}} style={styles.profileImage} />
      <Text style={styles.profileName}>{profile.name}</Text>
      <Text style={styles.profileBranch}>{profile.branch}</Text>
      <Text style={styles.profileDistrict}>{profile.district}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: responsiveFontSize(2.5),
    fontWeight: 'bold',
    color: Colors.black,
    textAlign: 'center',
    marginBottom: 10,
    marginTop: responsiveHeight(10),
  },
  contentContainer: {
    padding: 15,
  },
  inputContainer: {
    borderColor: Colors.black,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    color: Colors.black,
    width: responsiveWidth(50),
    backgroundColor: Colors.lightGrey,
  },
  picker: {
    color: Colors.black,
    width: '100%',
    fontSize: responsiveFontSize(1.5),
  },
  blackText: {
    fontSize: responsiveFontSize(2),
    color: Colors.black,
  },
  pickerContainer: {
    width: '100%',
    justifyContent: 'flex-end',
    flexDirection: 'row',
  },
  profilesContainer: {
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  profileRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    alignItems: 'center',
    marginVertical: 10,
  },
  profileCard: {
    flex: 1,
    padding: 15,
    // backgroundColor: Colors.white,
    borderRadius: 10,
    // elevation: 5,
    alignItems: 'center',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
    borderWidth: 5,
    borderColor: Colors.white,
  },
  crownImage: {
    width: 50,
    height: 50,
  },
  profileName: {
    fontSize: responsiveFontSize(2),
    color: Colors.black,
    fontWeight: 'bold',
  },
  profileBranch: {
    fontSize: responsiveFontSize(1.5),
    color: Colors.black,
  },
  profileDistrict: {
    fontSize: responsiveFontSize(1.5),
    color: Colors.black,
  },
});

export default DailyWinner;
