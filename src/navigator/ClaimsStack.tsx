import React, {useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Colors} from '../utils/constants';
import Profile from '../screens/BottomTab/Profile';
import {CustomTabHeader} from './BottomTab';
import EditProfile from '../screens/BottomTab/EditProfile';
import LanguagePicker from '../components/LanguagePicker';
import RaiseClaim from '../screens/Claims/RaiseClaim';
import ClaimList from '../screens/Claims/ClaimList';
import ClaimDetails from '../screens/Claims/ClaimDetails';
import ClaimDetailTest from '../screens/Claims/ClaimDetailTest';

const ClaimsStack = () => {
  const Stack = createNativeStackNavigator();

  return (
    <>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: Colors.yellow,
          },
          headerShown: false,
        }}>
        <Stack.Screen
          name="AddClaims"
          component={RaiseClaim}
          options={{
            headerShown: true,
            headerRight: () => (
              <Image
                style={{width: 70, height: 50}} // Adjust width and height as needed
                resizeMode="contain"
                source={require('../assets/images/group_910.png')}
              />
            ),
          }}
        />
        <Stack.Screen
          name="ClaimsList"
          component={ClaimList}
          options={{
            headerShown: true,
            headerRight: () => (
              <Image
                style={{width: 70, height: 50}} // Adjust width and height as needed
                resizeMode="contain"
                source={require('../assets/images/group_910.png')}
              />
            ),
          }}
        />
        <Stack.Screen
          name="ClaimsDetail"
          component={ClaimDetailTest}
          options={{
            headerShown: true,
            headerRight: () => (
              <Image
                style={{width: 70, height: 50}} // Adjust width and height as needed
                resizeMode="contain"
                source={require('../assets/images/group_910.png')}
              />
            ),
          }}
        />
      </Stack.Navigator>
    </>
  );
};

const styles = StyleSheet.create({
  languageContainer: {
    borderWidth: 1,
    borderColor: Colors.black,
    paddingVertical: 2,
    paddingHorizontal: 5,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  languagePickerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  closeText: {
    marginTop: 20,
    color: Colors.black,
    backgroundColor: Colors.yellow,
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 5,
    fontWeight: 'bold',
  },
});

export default ClaimsStack;
