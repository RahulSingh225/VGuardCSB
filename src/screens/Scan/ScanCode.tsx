import React, {useContext, useEffect, useState} from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  ScrollView,
} from 'react-native';
import {useTranslation} from 'react-i18next';

import {
  responsiveFontSize,
  responsiveHeight,
} from 'react-native-responsive-dimensions';

import {useNavigation} from '@react-navigation/native';
import cameraIcon from '../../assets/images/ic_scan_code_camera.webp';
import arrowIcon from '../../assets/images/arrow.png';

import AsyncStorage from '@react-native-async-storage/async-storage';

import {scanQR} from 'react-native-simple-qr-reader';
import Buttons from '../../components/Buttons';
import Loader from '../../components/Loader';
import NeedHelp from '../../components/NeedHelp';
import Popup from '../../components/Popup';
import PopupWithOkAndCancel from '../../components/PopupWithOkAndCancel';
import PopupWithPin from '../../components/PopupWithPin';
import RewardBox from '../../components/ScratchCard';
import {
 
  sendCouponPin,
  getBonusPoints,
  validateCoupon,
  validateCouponPin,
} from '../../utils/apiservice';
import {Colors} from '../../utils/constants';
import getLocation from '../../utils/geolocation';
import { AppContext } from '../../services/ContextService';
import { CouponData, VguardUser } from '../../types';

interface ScanCodeProps {
  navigation: any;
  route: any;
}

interface OkPopupContent {
  text: string;
  okAction: (() => void) | null;
}

const ScanCode: React.FC<ScanCodeProps> = ({navigation, route}) => {
  const {t} = useTranslation();

  const context = useContext(AppContext)
  const [qrCode, setQrcode] = useState<string>('');
  const [scratchCard, showScratchCard] = useState<boolean>(false);
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [isOkPopupVisible, setOkPopupVisible] = useState(false);
  const [isPinPopupVisible, setPinPopupVisible] = useState(false);
  const [popupContent, setPopupContent] = useState('');
  const [loader, showLoader] = useState(true);
  const [okPopupContent, setOkPopupContent] = useState<OkPopupContent>({
    text: '',
    okAction: null,
  });
  const [scratchable, setScratchable] = useState(false);
  const [scratchCardProps, setScratchCardProps] = useState({
    rewardImage: {
      width: 100,
      height: 100,
      resourceLocation: require('../../assets/images/ic_rewards_gift.png') /*resourceUrl:"https://www.leavesofgrassnewyork.com/cdn/shop/products/gift-card_612x.jpg?v=1614324792"*/,
    },
    rewardResultText: {
      color: 'black',
      fontSize: 16,
      textContent: 'YOU WON',
      fontWeight: '700',
    },
    text1: {color: 'black', fontSize: 16, textContent: '', fontWeight: '700'},
    text2: {
      color: 'black',
      fontSize: 16,
      textContent: 'POINTS',
      fontWeight: '700',
    },
    text3: {
      color: '#9c9c9c',
      fontSize: 12,
      textContent: ' ',
      fontWeight: '700',
    },
    button: {
      buttonColor: '#F0C300',
      buttonTextColor: 'black',
      buttonText: 'Register Warranty',
      buttonAction: () => {},
      fontWeight: '400',
    },
    textInput: false,
  });

  const [UserData, setUserData] = useState({
    mobileNo: '',
  });
  const [pinData, setPinData] = useState('');
  const [couponData, setCouponData] = useState(new CouponData());

  var USER: any = null;
  var CouponResponse: any;

  useEffect(() => {
  var user:VguardUser = context.getUserDetails()
      //setUserData(user);
      setCouponData(prevData => ({
        ...prevData,
        from: 'APP',
        userMobileNumber: user?.contact,
        rishtaId:user?.rishta_id,
        userId:user?.user_id
  
    }))
    showLoader(false);
  }, []);

  const getUserLocation = () => {
    showLoader(true);
    getLocation()
      .then(position => {
        if (position != null) {
          setCouponData(prevData => ({
            ...prevData,
            latitude: position.latitude.toString(),
            longitude: position.longitude.toString(),
          }));
          showLoader(false);
        } else {
          console.error('Position is undefined or null');
          showLoader(false);
        }
      })
      .catch(error => {
        console.error('Error getting location:', error);
        showLoader(false);
      });
  };

  const handleQrText = (coupon: string) => {
    setQrcode(coupon);
    setCouponData(prevCouponData => ({
      ...prevCouponData,
      couponCode: coupon,
    }));
  };

  async function sendBarcode() {

    console.log(couponData)
    console.log('shuru');
    getUserLocation();
    if (qrCode && qrCode != '') {
      if (qrCode.length < 16) {
        setPopupContent('Please enter valid 16 character barcode');
        setPopupVisible(true);
        return;
      }
      var apiResponse;
      apiResponse = await isValidBarcode(couponData, 0, '', 0, null);
      const r = await apiResponse.data;
      console.log(r, '<><');
      const result = await AsyncStorage.setItem(
        'COUPON_RESPONSE',
        JSON.stringify(r),
      );
      CouponResponse = r;
      if (r.errorCode == 1) {
        showLoader(false);
        setQrcode('');
        setOkPopupVisible(true);
        setOkPopupContent({
          text: t('strings:valid_coupon_please_proceed_to_prod_regi'),
          okAction: () => navigation.navigate('Product Registration Form'),
        });
      } else if (r.errorCode == 2) {
        setPinPopupVisible(true);
        showLoader(false);
      } else if (r.errorMsg && r.errorMsg != '') {
        setPopupVisible(true);
        setPopupContent(r.errorMsg);
        showLoader(false);
        // setPinPopupVisible(true);
      } else {
        setPopupVisible(true);
        setPopupContent(t('strings:something_wrong'));
        showLoader(false);
      }
    } else {
      setPopupVisible(true);
      setPopupContent('Please enter Coupon Code or Scan a QR');
    }
  }

  const scan = async () => {
    scanQR()
      .then(result => {
        setQrcode(result.toString());
        const data = result.toString();
        setCouponData(prevCouponData => ({
          ...prevCouponData,
          couponCode: data,
        }));
        return result;
      })
      .catch(error => {
        console.error('API Error:', error);
      });
  };

  const handlePinChange = (pin: string) => {
    setCouponData(prevCouponData => ({
      ...prevCouponData,
      pin: pin,
    }));
  };

  const sendPin = () => {
    validateCouponPin(couponData)
      .then(result => result.data)
      .then(jsonResult => {
        setPinPopupVisible(false);
        setPopupVisible(true);
        setPopupContent(jsonResult.errorMsg);
      })
      .catch(error => {
        setPinPopupVisible(false);
        setPopupVisible(true);
        setPopupContent(t('strings:something_wrong'));
        console.error('Send Coupon PIN API Error:', error);
      });
  };
  function checkBonusPoints() {
    showScratchCard(false);
    if (CouponResponse?.transactId && CouponResponse?.bitEligibleScratchCard) {
      getBonusPoints(CouponResponse.transactId).then(response =>
        response.data.then(result => {
          var couponPoints = result.promotionPoints;
          setScratchCardProps({
            rewardImage: {
              width: 100,
              height: 100,
              resourceLocation: require('../../assets/images/ic_rewards_gift.png'),
            },
            rewardResultText: {
              color: Colors.black,
              fontSize: 16,
              textContent: result.errorMsg,
              fontWeight: '700',
            },
            text1: {
              color: Colors.black,
              fontSize: 16,
              textContent: couponPoints,
              fontWeight: '700',
            },
            text2: {
              color: Colors.black,
              fontSize: 16,
              textContent: 'POINTS',
              fontWeight: '700',
            },
            text3: {
              color: Colors.grey,
              fontSize: 12,
              textContent: '',
              fontWeight: '700',
            },
            button: {
              buttonColor: Colors.yellow,
              buttonTextColor: Colors.black,
              buttonText: '',
              buttonAction: '',
              fontWeight: '400',
            },
            textInput: false,
          });
          setScratchable(false);
        }),
      );
      showScratchCard(true);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
      {loader && <Loader />}
      <View style={styles.mainWrapper}>
        {scratchCard && (
          <RewardBox
            scratchCardProps={scratchCardProps}
            visible={scratchCard}
            scratchable={scratchable}
            onClose={checkBonusPoints}
          />
        )}
        <TouchableOpacity style={styles.imageContainer} onPress={() => scan()}>
          <Image
            source={require('../../assets/images/ic_scan_code_2.png')}
            style={{width: '100%', height: '100%'}}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <View style={[{height: responsiveHeight(5), width: '100%'}]}>
          <Buttons
            label={t('strings:click_here_to_scan_a_unique_code')}
            variant="blackButton"
            onPress={() => scan()}
            width="100%"
            iconHeight={30}
            iconWidth={30}
            iconGap={30}
            icon={cameraIcon}
          />
        </View>
        <Text style={styles.text}>{t('strings:or')}</Text>
        <View style={styles.enterCode}>
          <View style={styles.topContainer}>
            <Text style={styles.smallText}>{t('strings:enter_code')}</Text>
          </View>
          <View style={styles.bottomContainer}>
            <TextInput
              value={qrCode}
              style={styles.input}
              placeholder={t('strings:enter_code_here')}
              placeholderTextColor={Colors.grey}
              textAlign="center"
              onChangeText={text => handleQrText(text)}
              keyboardType="numeric"
              maxLength={16}
            />
          </View>
        </View>
        <Buttons
          label={t('strings:proceed')}
          variant="filled"
          onPress={() => sendBarcode()}
          width="100%"
          iconHeight={10}
          iconWidth={30}
          iconGap={30}
          icon={arrowIcon}
        />
        <View style={styles.rightText}>
          <TouchableOpacity
            onPress={() => navigation.navigate('Unique Code History')}
            style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
            <Text style={styles.smallText}>
              {t('strings:go_to_unique_code_history')}
            </Text>
            <Image
              style={{width: 30, height: 30}}
              source={require('../../assets/images/ic_circle_right_arrow_yellow.webp')}
            />
          </TouchableOpacity>
        </View>
        <NeedHelp />
      </View>
      {isPopupVisible && (
        <Popup
          isVisible={isPopupVisible}
          onClose={() => setPopupVisible(false)}>
          {popupContent}
        </Popup>
      )}
      <PopupWithOkAndCancel
        isVisible={isOkPopupVisible}
        onClose={() => {
          setOkPopupVisible(false);
        }}
        onOk={() => {
          setOkPopupVisible(false);
          okPopupContent.okAction();
        }}>
        {okPopupContent.text}
      </PopupWithOkAndCancel>
      {isPinPopupVisible && (
        <PopupWithPin
          isVisible={isPinPopupVisible}
          onClose={() => setPinPopupVisible(false)}
          onOk={() => sendPin()}
          onTextChange={text => handlePinChange(text)}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollViewContainer: {
    flexGrow: 1,
    backgroundColor: Colors.white,
  },
  mainWrapper: {
    padding: 15,
    alignItems: 'center',
    backgroundColor: Colors.white,
    height: '100%',
    gap: 10,
  },
  header: {
    color: Colors.black,
    fontWeight: 'bold',
    fontSize: responsiveFontSize(2),
  },
  imageContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
    height: responsiveHeight(20),
  },
  text: {
    color: Colors.black,
    fontSize: responsiveFontSize(2),
    fontWeight: 'bold',
  },
  smallText: {
    textAlign: 'center',
    color: Colors.black,
    fontSize: responsiveFontSize(1.8),
    fontWeight: 'bold',
  },
  enterCode: {
    width: '100%',
    borderColor: Colors.lightGrey,
    borderWidth: 2,
    borderRadius: 10,
    height: responsiveHeight(10),
    display: 'flex',
    flexDirection: 'column',
  },
  topContainer: {
    borderBottomWidth: 2,
    borderColor: Colors.lightGrey,
    padding: 10,
    height: responsiveHeight(5),
    flexGrow: 1,
  },
  bottomContainer: {
    flexGrow: 1,
    height: responsiveHeight(5),
  },
  input: {
    padding: 10,
    fontSize: responsiveFontSize(2),
    textAlign: 'center',
    color: Colors.black,
    fontWeight: 'bold',
  },
  rightText: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});

async function isValidBarcode(
  CouponData: any,
  isAirCooler: number,
  pinFourDigit: string,
  isPinRequired: number,
  dealerCategory: any,
) {
  try {
    var result = null;
    CouponData.isAirCooler = isAirCooler;
    if (dealerCategory) {
      CouponData.dealerCategory = dealerCategory;
    }
    console.log('its there');
    if (pinFourDigit == '') {
      // result = await captureSale(CouponData);
      console.log('its inside');
      result = await validateCoupon(CouponData);
      console.log(result);
      return result;
    } else {
      CouponData.pin = pinFourDigit;
      result = await validateCouponPin(CouponData);
      return result;
    }
  } catch (r) {
    console.log(r);
  }
}

export default ScanCode;

// var couponPoints = r.couponPoints;
//           var basePoints = r.basePoints;
//           // var couponPoints = "100";
//           // var basePoints = "200";
//           basePoints ? (basePoints = `Base Points: ${basePoints}`) : null;

//           setScratchCardProps({
//             rewardImage: {
//               width: 100,
//               height: 100,
//               resourceLocation: require('../../assets/images/ic_rewards_gift.png'),
//             },
//             rewardResultText: {
//               color: Colors.black,
//               fontSize: 16,
//               textContent: 'YOU WON',
//               fontWeight: '700',
//             },
//             text1: {
//               color: Colors.black,
//               fontSize: 16,
//               textContent: couponPoints,
//               fontWeight: '700',
//             },
//             text2: {
//               color: Colors.black,
//               fontSize: 16,
//               textContent: 'POINTS',
//               fontWeight: '700',
//             },
//             text3: {
//               color: Colors.grey,
//               fontSize: 12,
//               textContent: basePoints,
//               fontWeight: '700',
//             },
//             button: {
//               buttonColor: Colors.yellow,
//               buttonTextColor: Colors.black,
//               buttonText: 'Register Warranty',
//               buttonAction: () => navigation.navigate('AddWarranty'),
//               fontWeight: '400',
//             },
//             textInput: false,
//           });
//           setScratchable(true);
//           showScratchCard(true);
