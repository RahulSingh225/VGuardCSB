/* eslint-disable react/no-unstable-nested-components */
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import * as React from 'react';
import {useState, useEffect} from 'react';

import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from 'react-native';
import {responsiveFontSize} from 'react-native-responsive-dimensions';
import {useTranslation} from 'react-i18next';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {Colors} from '../utils/constants';
import HomeStack from './HomeStack';
import Notification from '../screens/BottomTab/Notification';
import Profile from '../screens/BottomTab/Profile';
import LogoutConfirmationPopup from '../components/LogoutConfirmationPopup';
import LanguagePicker from '../components/LanguagePicker';
import BottomTabBar from '../components/BottomTabBar';
import ProfileStack from './ProfileStack';
import ContactPage from '../screens/BottomTab/ContactPage';
import HomeScreen from '../screens/Home/HomeScreen';
import {removeItem} from '../services/StorageService';
import {AppContext} from '../services/ContextService';

const CustomTabHeader: React.FC<{
  route: any;
  handleLanguageButtonPress: () => void;
}> = ({route}) => {
  const {t, i18n} = useTranslation();

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '97%',
      }}>
      <View style={{flexDirection: 'row', gap: 10}}>
        <Text
          style={{
            color: Colors.black,
            fontSize: responsiveFontSize(2.5),
            fontWeight: 'bold',
          }}>
          {route.name}
        </Text>
        {/* <TouchableOpacity style={styles.languageContainer} onPress={handleLanguageButtonPress}>
            <Text style={{ color: Colors.black }}>{t('strings:language')}</Text>
            <Image style={{ width: 15, height: 15, marginLeft: 5 }} source={require('../../../assets/images/down_yellow_arrow.png')} />
          </TouchableOpacity> */}
      </View>
      <Image
        source={require('../assets/images/group_910.png')}
        style={{width: 83, height: 30, marginLeft: 10}}
      />
    </View>
  );
};

const BottomTab: React.FC = () => {
  const {i18n} = useTranslation();
  const [showLanguagePicker, setShowLanguagePicker] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);
  const appContext = React.useContext(AppContext);
  const handleLanguageButtonPress = () => {
    setShowLanguagePicker(true);
  };

  const handleCloseLanguagePicker = () => {
    setShowLanguagePicker(false);
  };

  useEffect(() => {
    const fetchStoredLanguage = async () => {
      try {
        const storedLanguage =
          (await AsyncStorage.getItem('language')) || i18n.language;
        setSelectedLanguage(storedLanguage);
        i18n.changeLanguage(storedLanguage);
      } catch (error) {
        console.error('Error fetching language from AsyncStorage:', error);
      }
    };

    fetchStoredLanguage();
  }, []);

  const Tab = createBottomTabNavigator();
  const [isLogoutPopupVisible, setLogoutPopupVisible] = useState(false);

  const showLogoutPopup = () => {
    setLogoutPopupVisible(true);
  };

  const navigation = useNavigation();

  const hideLogoutPopup = () => {
    setLogoutPopupVisible(false);
    navigation.goBack();
  };

  const confirmLogout = () => {
   
    appContext.signOut();
    hideLogoutPopup();
  };

  return (
    <>
      <Tab.Navigator
        initialRouteName="Home"
        tabBar={props => <BottomTabBar {...props} />}
        screenOptions={{
          headerStyle: {
            backgroundColor: Colors.yellow,
          },
          headerTitleStyle: {
            color: Colors.black,
          },
          headerShown: false,
        }}>
        <Tab.Screen
          name="Home"
          component={HomeStack}
          options={{headerShown: false}}
        />
        <Tab.Screen
          name="Notifications"
          component={Notification}
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
        <Tab.Screen
          name="Profile"
          component={ProfileStack}
          options={({route}) => ({
            headerTitle: () => (
              <CustomTabHeader
                handleLanguageButtonPress={handleLanguageButtonPress}
                route={route}
              />
            ),
            headerShown: false,
          })}
        />
        <Tab.Screen
          name="Contact Us"
          component={ContactPage}
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
        <Tab.Screen
          name="Logout"
          listeners={{tabPress: showLogoutPopup}}
          component={({route}) => {
            return route.state
              ? route.state.routes[
                  route.state.index
                ].route.params.getComponent()
              : null;
          }}
        />
      </Tab.Navigator>

      <LogoutConfirmationPopup
        isVisible={isLogoutPopupVisible}
        onConfirm={confirmLogout}
        onClose={hideLogoutPopup}
      />
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

export {CustomTabHeader};
export default BottomTab;
