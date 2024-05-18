/* eslint-disable react/no-unstable-nested-components */
import React, {Profiler, useState} from 'react';

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
import {CustomTabHeader} from './BottomTab';
import RedeemStack from './RedeemStack';
import DashboardStack from './DashboardStack';
import SchemesStack from './SchemesStack';
import InfoStack from './InfoStack';
import TicketStack from './TicketStack';
import RedemptionHistory from '../screens/Redeem/RedemptionHistory';
import ProfileStack from './ProfileStack';
import LanguagePicker from '../components/LanguagePicker';
import HomeScreen from '../screens/Home/HomeScreen';
import Profile from '../screens/BottomTab/Profile';
import EditProfile from '../screens/BottomTab/EditProfile';
import UpdatePassword from '../screens/Home/UpdatePassword';
import Bank from '../screens/Home/Bank';
import ScanStack from './ScanStack';
import ClaimsStack from './ClaimsStack';
import UniqueCodeHistory from '../screens/Scan/UniqueCodeHistory';
import NewStack from './NewStack';

const HomeStack: React.FC = () => {
  type HomeStackParams = {
    Home: undefined;
    'Scan QR': undefined;
    Dashboard: undefined;
    'Redeem Products': undefined;
    'Update KYC': undefined;
    schemes: undefined;
    info: undefined;
    new: undefined;
    ticket: undefined;
    'Update Bank': undefined;
    'TDS Certificate': undefined;
    'TDS Statement': undefined;
    'Update PAN': undefined;
    'Air Cooler': undefined;
    Engagement: undefined;
    Profile: undefined;
    'Unique Code History': undefined;
    'Redemption History': undefined;
    'Product Registration Form': undefined;
    'Scan In': undefined;
  };

  const [showLanguagePicker, setShowLanguagePicker] = useState(false);

  const handleLanguageButtonPress = () => {
    setShowLanguagePicker(true);
  };

  const handleCloseLanguagePicker = () => {
    setShowLanguagePicker(false);
  };

  const Stack = createNativeStackNavigator<HomeStackParams>();

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
          name="Home"
          component={HomeScreen}
          options={({route}) => ({
            headerTitle: () => (
              <CustomTabHeader
                handleLanguageButtonPress={handleLanguageButtonPress}
                route={route}
              />
            ),
            headerShown: true,
          })}
        />
        <Stack.Screen
          name="UpdatePassword"
          component={UpdatePassword}
          options={({route}) => ({
            headerBackVisible: false,
            headerTitle: () => (
              <CustomTabHeader
                handleLanguageButtonPress={handleLanguageButtonPress}
                route={route}
              />
            ),
            headerShown: true,
          })}
        />

        <Stack.Screen
          name="UpdateBank"
          component={Bank}
          options={({route}) => ({
            headerBackVisible: false,
            headerTitle: () => (
              <CustomTabHeader
                handleLanguageButtonPress={handleLanguageButtonPress}
                route={route}
              />
            ),
            headerShown: true,
          })}
        />
        <Stack.Screen name="schemes" component={SchemesStack} />
        <Stack.Screen name="Scan QR" component={ScanStack} />
        <Stack.Screen name="Claims" component={ClaimsStack} />
        <Stack.Screen name="Redeem Products" component={RedeemStack} />
        <Stack.Screen name="Dashboard" component={DashboardStack} />

        <Stack.Screen name="info" component={InfoStack} />
        <Stack.Screen name="new" component={NewStack} />
        <Stack.Screen name="ticket" component={TicketStack} />

        {/* <Stack.Screen
          name="Product Registration Form"
          component={ProductRegistrationForm}
          options={{
            headerShown: true,
          }}
        /> */}
        {/* <Stack.Screen
          name="Redemption History"
          component={RedemptionHistory}
          options={{
            headerShown: true,
          }}
        /> */}
        <Stack.Screen
          name="Unique Code History"
          component={UniqueCodeHistory}
          options={{
            headerShown: true,
          }}
        />
        {/* <Stack.Screen
          name="Scan In"
          component={ScanCodeReg}
          options={{
            headerShown: true,
          }}
        /> */}
        {/*
        <Stack.Screen
          name="TDS Certificate"
          component={TDS}
          options={{
            headerShown: true,
            headerRight: () => (
              <Image
                style={{width: 70, height: 50}}
                resizeMode="contain"
                source={require('../assets/images/group_910.png')}
              />
            ),
          }}
        /> */}

        {/* <Stack.Screen
          name="TDS Statement"
          component={TDSStatement}
          options={{
            headerShown: true,
            headerRight: () => (
              <Image
                style={{width: 70, height: 50}}
                resizeMode="contain"
                source={require('../assets/images/group_910.png')}
              />
            ),
          }}
        /> */}
        <Stack.Screen
          name="Profile"
          component={ProfileStack}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
      <Modal
        animationType="slide"
        transparent={true}
        visible={showLanguagePicker}
        onRequestClose={handleCloseLanguagePicker}>
        <View style={styles.languagePickerContainer}>
          <LanguagePicker onCloseModal={handleCloseLanguagePicker} />
          <TouchableOpacity onPress={handleCloseLanguagePicker}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
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

export default HomeStack;
