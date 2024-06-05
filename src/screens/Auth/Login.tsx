import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
  Modal,
} from 'react-native';
import {useTranslation} from 'react-i18next';

import Snackbar from 'react-native-snackbar';

import {Linking} from 'react-native';

import {responsiveFontSize} from 'react-native-responsive-dimensions';
import DeviceInfo from 'react-native-device-info';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Buttons from '../../components/Buttons';
import {Colors} from '../../utils/constants';
import LanguagePicker from '../../components/LanguagePicker';
import Loader from '../../components/Loader';
import language from '../../assets/images/language.png';
import arrowIcon from '../../assets/images/arrow.png';
import selectedTickImage from '../../assets/images/tick_1.png';
import notSelectedTickImage from '../../assets/images/tick_1_notSelected.png';
import Popup from '../../components/Popup';
import {loginUser} from '../../utils/apiservice';
import {VguardUser} from '../../types';
import {AppContext} from '../../services/ContextService';
import { mobileNoValidation } from '../../utils/pattern';

const Login: React.FC<{navigation: any}> = ({navigation}) => {
  const {t, i18n} = useTranslation();
  const [showLanguagePicker, setShowLanguagePicker] = useState(false);
  const [loader, showLoader] = useState(false);
  const yellow = Colors.yellow;
  const placeholderColor = Colors.lightGrey;
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [popupContent, setPopupContent] = useState('');
  const [selectedOption, setSelectedOption] = useState(true);
  const appContext = useContext(AppContext);
  const handleLanguageButtonPress = () => {
    setShowLanguagePicker(true);
  };

  const version = DeviceInfo.getVersion();

  const handleCloseLanguagePicker = () => {
    setShowLanguagePicker(false);
  };

  useEffect(() => {
    const clearAsyncStorage = async () => {
      try {
        await AsyncStorage.removeItem('USER');
        await AsyncStorage.removeItem('diffAcc');
      } catch (error) {
        console.error('Error clearing AsyncStorage:', error);
      }
    };
    clearAsyncStorage();
  }, [i18n.language]);

  const showSnackbar = (message: string) => {
    Snackbar.show({
      text: message,
      duration: Snackbar.LENGTH_SHORT,
    });
  };

  const handleTermsPress = () => {
    setSelectedOption(!selectedOption);
  };

  const openTermsAndConditions = () => {
    const url = 'https://vguardrishta.com/tnc_retailer.html';

    Linking.openURL(url).catch(error =>
      console.error('Error opening URL:', error),
    );
  };

  // const togglePopup = () => {
  //   setIsPopupVisible(!isPopupVisible);
  // };

  const handleLogin = async () => {
    if (!username.trim().length) {
      showSnackbar('Please enter a mobile number.');
      return;
    }

    if(!mobileNoValidation(username.trim())){
      showSnackbar('Please enter the valid mobile number');
      return;
    }

    if (!password) {
      showSnackbar('Please enter the password.');
      return;
    }

    if (selectedOption === false) {
      showSnackbar(t('strings:please_accept_terms'));
      return;
    }

    showLoader(true);

    try {
      const body = {
        mobile_no: username,
        password: password,
        method: 'password',
      };
      const response = await loginUser(body);
      showLoader(false);
      if (response.status === 200) {
        const responseData = response.data;
        console.log(responseData);
        if (responseData.status) {
          const vg: VguardUser = responseData.data;
          appContext.signIn(vg);
        } else {
          setIsPopupVisible(!isPopupVisible);
          setPopupContent(responseData.message);
        }
      } else {
        setIsPopupVisible(!isPopupVisible);
        setPopupContent('Something went wrong!');
      }
    } catch (error: any) {
      showLoader(false);
      setIsPopupVisible(!isPopupVisible);
      setPopupContent(error.message);
      console.error('Login error:', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.loginScreen}>
        <View style={styles.mainWrapper}>
          <View style={styles.buttonLanguageContainer}>
            <Buttons
              label=""
              variant="outlined"
              onPress={handleLanguageButtonPress}
              iconHeight={30}
              iconWidth={30}
              iconGap={0}
              icon={language}
            />
          </View>
          {loader && <Loader isLoading={loader} />}
          <Image
            source={require('../../assets/images/cs_logo.png')}
            style={styles.imageSaathi}
          />
          <Text style={styles.mainHeader}>{t('strings:lbl_welcome')}</Text>

          <Text style={styles.textHeader}>
            {t('strings:lbl_login_or_register')}
          </Text>

          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <Image
                style={styles.icon}
                resizeMode="contain"
                source={require('../../assets/images/mobile_icon.png')}
              />
              <TextInput
                style={styles.input}
                placeholder={t('strings:registered_mobile_no')}
                placeholderTextColor={placeholderColor}
                value={username}
                keyboardType='number-pad'
                maxLength={10}
                onChangeText={text => setUsername(text)}
              />
            </View>
            <View style={styles.inputContainer}>
              <Image
                style={styles.icon}
                resizeMode="contain"
                source={require('../../assets/images/lock_icon.png')}
              />
              <TextInput
                style={styles.input}
                placeholder={t('strings:password')}
                placeholderTextColor={placeholderColor}
                secureTextEntry={true}
                value={password}
                maxLength={8}
                onChangeText={text => setPassword(text)}
              />
            </View>

            <View style={styles.updateAndForgot}>
              <TouchableOpacity
                onPress={() => navigation.navigate('forgotPassword')}
                style={styles.forgotPasswordContainer}>
                <Text style={[styles.forgotPassword]}>
                  {t('strings:forgot_password_question')}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.buttonContainer}>
              <Buttons
                label={t('strings:log_in')}
                variant="filled"
                onPress={handleLogin}
                width="100%"
                iconHeight={10}
                iconWidth={30}
                iconGap={30}
                icon={arrowIcon}
              />
              <Buttons
                label={t('strings:login_with_otp')}
                variant="filled"
                onPress={() => navigation.navigate('loginWithNumber')}
                width="100%"
              />
            </View>
          </View>
        </View>
        <View style={styles.footer}>
          <TouchableOpacity
            onPress={() => handleTermsPress()}
            style={styles.footerTextContainer}>
            <Image
              source={
                selectedOption === true
                  ? selectedTickImage
                  : notSelectedTickImage
              }
              style={styles.tick}
            />

            <TouchableOpacity onPress={() => openTermsAndConditions()}>
              <Text style={styles.footerText}>
                {t('strings:lbl_accept_terms')}
              </Text>
            </TouchableOpacity>
          </TouchableOpacity>
          <Text style={styles.versionText}>V {version}</Text>
          <View style={styles.footerContainer}>
            <Text style={styles.footergreyText}>
              {t('strings:powered_by_v_guard')}
            </Text>

            <Image
              source={require('../../assets/images/group_910.png')}
              style={styles.imageVguard}
            />
          </View>
        </View>
        {isPopupVisible && (
          <Popup
            isVisible={isPopupVisible}
            onClose={() => setIsPopupVisible(!isPopupVisible)}>
            <Text style={{fontWeight: 'bold'}}>{popupContent}</Text>
          </Popup>
        )}
        {showPopup && (
          <Popup isVisible={showPopup} onClose={() => setShowPopup(false)}>
            <Text style={{fontWeight: 'bold'}}>{'Hello'}</Text>
          </Popup>
        )}

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
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  loginScreen: {
    height: '100%',
    backgroundColor: Colors.white,
    display: 'flex',
  },
  mainWrapper: {
    padding: 30,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flexGrow: 1,
  },
  textHeader: {
    color: Colors.grey,
    fontSize: 14,
    fontWeight: 'bold',
  },
  mainHeader: {
    color: Colors.black,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  imageSaathi: {
    width: 150,
    height: 130,
    marginBottom: 30,
  },
  imageVguard: {
    width: 100,
    height: 36,
  },
  formContainer: {
    width: '100%',
    justifyContent: 'center',
    padding: 16,
    flex: 2,
  },
  input: {
    color: Colors.black,
    height: 40,
    padding: 10,
    flex: 1,
  },
  inputContainer: {
    backgroundColor: Colors.white,
    marginBottom: 20,
    borderRadius: 5,
    shadowColor: 'rgba(0, 0, 0, 0.8)',
    elevation: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginHorizontal: 10,
    width: 15,
    height: 15,
  },
  forgotPasswordContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  forgotPassword: {
    color: Colors.grey,
    fontWeight: 'bold',
    fontSize: 12,
    textAlign: 'right',
  },
  or: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.black,
    marginBottom: 20,
  },
  buttonContainer: {
    gap: 20,
  },
  footer: {},
  footerText: {
    textAlign: 'left',
    fontSize: 10,
    color: Colors.black,
  },
  footerTextContainer: {
    paddingBottom: 5,
    paddingHorizontal: 80,
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tick: {
    height: 15,
    width: 15,
  },
  footergreyText: {
    textAlign: 'center',
    fontSize: 12,
    color: Colors.grey,
    paddingBottom: 5,
  },
  footerContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
    justifyContent: 'center',
    backgroundColor: Colors.lightGrey,
    width: '100%',
    paddingVertical: 10,
  },
  updateAndForgot: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    alignItems: 'center',
  },
  button: {
    backgroundColor: Colors.yellow,
    padding: 10,
    borderRadius: 5,
    width: '50%',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 12,
    color: Colors.black,
    fontWeight: 'bold',
  },
  buttonLanguageContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
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
  versionText: {
    textAlign: 'center',
    color: Colors.black,
    fontSize: responsiveFontSize(1.3),
    marginVertical: 30,
  },
});

export default Login;
