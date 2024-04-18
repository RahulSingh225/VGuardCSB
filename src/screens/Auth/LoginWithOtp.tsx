import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {useTranslation} from 'react-i18next';

import arrowIcon from '../../assets/images/arrow.png';
import Constants, {Colors} from '../../utils/constants';
import {useAuth} from '../../components/AuthContext';
import Buttons from '../../components/Buttons';
import Loader from '../../components/Loader';
import Popup from '../../components/Popup';
import {
  generateOtpForLogin,
  validateLoginOtp,
  loginWithOtp,
  loginUser,
} from '../../utils/apiservice';
import {AppContext} from '../../services/ContextService';
import {VguardUser} from '../../types';

interface LoginWithOtpProps {
  navigation: any;
  route: {
    params: {
      usernumber: string;
      jobprofession: string;
      preferedLanguage: number;
    };
  };
}

const LoginWithOtp: React.FC<LoginWithOtpProps> = ({navigation, route}) => {
  const {usernumber, jobprofession, preferedLanguage} = route.params;
  const [otp, setOtp] = useState('');
  const [number, setnumber] = useState(usernumber);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [loader, showLoader] = useState(false);
  const appContext = useContext(AppContext);

  const placeholderColor = Colors.grey;

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown(prevCountdown => prevCountdown - 1);
      }, 1000); // The interval is set to 1000 milliseconds (1 second)
    }

    return () => {
      clearInterval(timer);
    };
  }, [countdown]);

  async function getOTP() {
    showLoader(true);
    if (countdown < 1) {
      try {
        const body = {
          mobile_no: number,
        };
        const validationResponse = await generateOtpForLogin(body);
        if (validationResponse.status === 200) {
          showLoader(false);
          const validationResponseData = validationResponse.data.data;
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
        setPopupMessage(error.message);
        console.error('Error during validation:', error);
      }
    } else {
      showLoader(false);
      setIsPopupVisible(true);
      setPopupMessage(`Wait for ${countdown} seconds to send OTP again!`);
    }
  }

  async function validateotp() {
    showLoader(true);
    if (!otp) {
      setIsPopupVisible(true);
      setPopupMessage('Please Enter the OTP to proceed');
      showLoader(false);
      return;
    }
    try {
      const body = {
        mobile_no: number,
        otp: otp,
        method: 'otp',
      };
      const verificationResponse = await loginUser(body);
      console.log(verificationResponse);
      if (verificationResponse.status === 200) {
        const verificationResponseData = verificationResponse.data;
        if (verificationResponseData.status) {
          showLoader(false);
          console.log('LOGGING');
          const vg: VguardUser = verificationResponseData.data;
          appContext.signIn(vg);
        } else {
          throw new Error(verificationResponseData.message);
        }
      } else {
        showLoader(false);
        setIsPopupVisible(true);
        const errorMessage = verificationResponse.data.message;
        setPopupMessage(errorMessage);
      }
    } catch (error: any) {
      showLoader(false);
      setIsPopupVisible(true);
      setPopupMessage(error.message);
      console.error('Error validating OTP:', error);
    }

    // validateLoginOtp(body)
    //   .then((verification) => {
    //     const verificationData = verification.data;
    //     if (
    //       successMessage ===
    //       'OTP verified successfully, please proceed with the registration.'
    //     ) {
    //       setPopupMessage(successMessage);
    //       setIsPopupVisible(true);

    //       loginWithOtp(number, otp)
    //         .then((response) => {
    //           if (response.status === 200) {
    //             return response.data;
    //           } else {
    //             throw new Error('Error logging in with OTP');
    //           }
    //         })
    //         .then((r) => {
    //           login(r);
    //           showLoader(false);
    //         })
    //         .catch((error) => {
    //           console.error('Error logging in with OTP:', error);
    //           showLoader(false);
    //         });
    //     } else {
    //       setIsPopupVisible(true);
    //       setPopupMessage(verification.data.message);
    //       showLoader(false);
    //     }
    //   })
    //   .catch((error) => {
    //     console.error('Error validating OTP:', error);
    //     showLoader(false);
    //   });
  }

  useEffect(() => {}, [otp, number]);

  const handleClose = async () => {
    setIsPopupVisible(false);
  };

  const {t} = useTranslation();

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {loader && <Loader isLoading={loader} />}

      {isPopupVisible && (
        <Popup isVisible={isPopupVisible} onClose={handleClose}>
          {popupMessage}
        </Popup>
      )}
      <View style={styles.registerUser}>
        {isLoading == true ? (
          <View style={{flex: 1}}>
            <Loader isLoading={isLoading} />
          </View>
        ) : null}
        <View style={styles.mainWrapper}>
          <Image
            source={require('../../assets/images/rishta_retailer_logo.webp')}
            style={styles.imageSaathi}
          />
          <Text style={styles.mainHeader}>
            {t('strings:lbl_otp_verification')}
          </Text>
          <View style={styles.formContainer}>
            <View style={styles.containter}>
              <Text style={styles.textHeader}>
                {t('strings:enter_otp_description')}
              </Text>
              <View style={styles.inputContainer}>
                <Image
                  style={styles.icon}
                  resizeMode="contain"
                  source={require('../../assets/images/mobile_icon.png')}
                />
                <TextInput
                  style={styles.input}
                  value={number}
                  editable={false}
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
                  placeholder={t('strings:enter_otp')}
                  placeholderTextColor={placeholderColor}
                  keyboardType="number-pad"
                  value={otp}
                  onChangeText={text => setOtp(text)}
                  maxLength={4}
                />
              </View>
            </View>
            <View>
              <Buttons
                label={t('strings:login_with_otp')}
                variant="filled"
                onPress={() => validateotp()}
                width="100%"
                iconHeight={10}
                iconWidth={30}
                iconGap={30}
                icon={arrowIcon}
              />
            </View>
            <View
              style={{
                flexDirection: 'column',
                alignItems: 'center',
                marginTop: 30,
              }}>
              <View style={{flexDirection: 'row', gap: 10}}>
                <Text style={styles.greyText}>
                  {t('strings:otp_not_received')}
                </Text>
                <TouchableOpacity onPress={() => getOTP()}>
                  <Text style={{color: Colors.yellow}}>
                    {t('strings:resend_otp')}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={{flexDirection: 'row', gap: 10}}>
                {countdown > 0 ? (
                  <Text style={styles.greyText}>in {countdown} seconds</Text>
                ) : null}
              </View>
            </View>
          </View>
        </View>
        <View>
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
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  registerUser: {
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
    textAlign: 'center',
    width: '80%',
    color: Colors.grey,
    fontSize: 14,
    fontWeight: 'bold',
  },
  mainHeader: {
    color: Colors.black,
    fontSize: 20,
    fontWeight: 'bold',
    // marginBottom: 10
  },
  imageSaathi: {
    width: 100,
    height: 98,
    marginBottom: 30,
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
  input: {
    color: Colors.black,
    height: 40,
    padding: 10,
  },
  inputContainer: {
    backgroundColor: Colors.white,
    marginBottom: 10,
    borderRadius: 5,
    shadowColor: 'rgba(0, 0, 0, 0.8)',
    elevation: 5,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  icon: {
    marginHorizontal: 10,
    width: 15,
    height: 15,
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
    alignItems: 'center',
    gap: 20,
    marginBottom: 50,
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
  },
});

export default LoginWithOtp;
