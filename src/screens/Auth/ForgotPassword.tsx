import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Modal,
  Linking,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import Snackbar from 'react-native-snackbar';
import {responsiveFontSize} from 'react-native-responsive-dimensions';
import Buttons from '../../components/Buttons';
import Loader from '../../components/Loader';
import Popup from '../../components/Popup';
import {forgotPassword} from '../../utils/apiservice';
import { mobileNoValidation } from '../../utils/pattern';
import {Colors} from '../../utils/constants';
import LanguagePicker from '../../components/LanguagePicker';
import DeviceInfo from 'react-native-device-info';


const ForgotPassword: React.FC<{navigation: any}> = ({navigation}) => {
  const [number, setNumber] = useState('');
  const [showLanguagePicker, setShowLanguagePicker] = useState(false);
  const [selectedOption, setSelectedOption] = useState(true);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [responseCode, setResponseCode] = useState(0);
  const [loader, showLoader] = useState(false);

  const showSnackbar = (message: string) => {
    Snackbar.show({
      text: message,
      duration: Snackbar.LENGTH_SHORT,
    });
  };

  async function proceedForgotPassword() {
    showLoader(true);


    if (!mobileNoValidation(number)) {
      showLoader(false);
      showSnackbar('Please enter your valid mobile number');
      return
    }

    try {
      const validationResponse = await forgotPassword(number);
      console.log(validationResponse)
      if (validationResponse.status === 200) {
        showLoader(false);
        const validationResponseData = validationResponse.data.data;
        setResponseCode(validationResponseData.ErrorCode);
        if (validationResponseData.code === 1) {
          const successMessage = validationResponseData.ErrorMessage;
          setIsPopupVisible(true);
          setPopupMessage(successMessage);
        } else {
          const errorMessage = validationResponseData.ErrorMessage;
          setIsPopupVisible(true);
          setPopupMessage(errorMessage);
        }
      } else {
        throw new Error('Something went wrong!');
      }
    } catch (error: any) {
      showLoader(false);
      setIsPopupVisible(true);
      setPopupMessage(error.response.data);
      console.error('Error during validation:', error);
    }
  }

  const placeholderColor = Colors.grey;
  const version = DeviceInfo.getVersion();
  const {t} = useTranslation();

  const handleClose = () => {
    if (responseCode === 1) {
      navigation.navigate('loginwithotp', {usernumber: number});
    }
    setIsPopupVisible(false);
  };
  const handleLanguageButtonPress = () => {
    setShowLanguagePicker(true);
  };
  const handleCloseLanguagePicker = () => {
    setShowLanguagePicker(false);
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

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {isPopupVisible && (
        <Popup isVisible={isPopupVisible} onClose={handleClose}>
          <Text>{popupMessage}</Text>
        </Popup>
      )}
      <View style={styles.registerUser}>
        <Loader isLoading={loader} />
        <View style={styles.mainWrapper}>
          <View style={styles.buttonLanguageContainer}>
            <Buttons
              label=""
              variant="outlined"
              onPress={handleLanguageButtonPress}
              iconHeight={30}
              iconWidth={30}
              iconGap={0}
              icon={require('../../assets/images/language.png')}
            />
          </View>
          <Image
            source={require('../../assets/images/rishta_retailer_logo.webp')}
            style={styles.imageSaathi}
          />
          <Text style={styles.mainHeader}>{t('strings:lbl_forgot_password')}</Text>
          <View style={styles.formContainer}>
            <View style={styles.containter}>
              <Text style={styles.textHeader}>
                {t('strings:enter_registered_mobile_no_to_continue')}
              </Text>
              <View style={styles.inputContainer}>
                <Image
                  style={styles.icon}
                  resizeMode="contain"
                  source={require('../../assets/images/mobile_icon.png')}
                />
                <TextInput
                  style={styles.input}
                  placeholder={t('strings:enter_your_mobile_number')}
                  placeholderTextColor={placeholderColor}
                  value={number}
                  keyboardType="number-pad"
                  onChangeText={text => setNumber(text)}
                  maxLength={10}
                />
              </View>
              <View style={styles.updateAndForgot}>
                
              </View>
            </View>
            <View>
              <Buttons
                label={t('strings:proceed')}
                variant="filled"
                onPress={() => proceedForgotPassword()}
                width="100%"
                iconHeight={10}
                iconWidth={30}
                iconGap={30}
                icon={require('../../assets/images/arrow.png')}
              />
            </View>
            <View style={{flexDirection: 'row'}}>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('login')}
                    style={styles.forgotPasswordContainer}>
                    <Text
                      style={[
                        styles.forgotPassword,
                        {color: Colors.colorPrimary,
                        marginTop: 10
                        },
                      ]}>
                      Sign In
                    </Text>
                  </TouchableOpacity>
                </View>
          </View>
        </View>
        <View>
          <TouchableOpacity
            onPress={() => handleTermsPress()}
            style={styles.footerTextContainer}>
            <Image
              source={
                selectedOption === true
                  ? require('../../assets/images/tick_1.png')
                  : require('../../assets/images/tick_1_notSelected.png')
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
  footerTextContainer: {
    paddingBottom: 5,
    paddingHorizontal: 80,
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  forgotPassword: {
    color: Colors.grey,
    fontWeight: 'bold',
    fontSize: 12,
    textAlign: 'right',
  },
  forgotPasswordContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  updateAndForgot: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  registerUser: {
    height: '100%',
    backgroundColor: Colors.white,
    display: 'flex',
  },
  buttonLanguageContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
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
  },
  imageVguard: {
    width: 100,
    height: 36,
  },
  formContainer: {
    width: '100%',
    padding: 16,
    flex: 2,
  },
  tick: {
    height: 15,
    width: 15,
  },
  input: {
    color: Colors.black,
    height: 40,
    padding: 10,
  },
  inputContainer: {
    backgroundColor: Colors.white,

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
  footerText: {
    textAlign: 'left',
    fontSize: 10,
    color: Colors.black,
  },
  or: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.black,
    marginBottom: 20,
    marginTop: 20,
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
    alignItems: 'center',
    gap: 10,
    justifyContent: 'center',
    backgroundColor: Colors.lightGrey,
    width: '100%',
    paddingVertical: 10,
  },
  option: {
    display: 'flex',
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
  },
  radioButtons: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 30,
    alignItems: 'center',
  },
  containter: {
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
    marginBottom: 30,
  },
  phone: {
    height: 50,
    width: 50,
  },
  greyText: {
    fontSize: 14,
    color: Colors.grey,
  },
  otpPhone: {
    display: 'flex',
    flexDirection: 'row',
    paddingHorizontal: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  versionText: {
    textAlign: 'center',
    color: Colors.black,
    fontSize: responsiveFontSize(1.3),
    marginVertical: 30,
  },
});

export default ForgotPassword;
