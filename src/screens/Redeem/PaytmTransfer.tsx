import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Image,
  TouchableOpacity,
} from 'react-native';
import React, {useState, useEffect} from 'react';

import {useTranslation} from 'react-i18next';
import {responsiveFontSize} from 'react-native-responsive-dimensions';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import Buttons from '../../components/Buttons';
import Popup from '../../components/Popup';

interface PaytmTransferData {
  points: string;
  mobileNo: string;
}

const PaytmTransfer = () => {
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [popupContent, setPopupContent] = useState('');
  const [pointData, setPointData] = useState({
    pointsBalance: '',
    redeemedPoints: '',
    numberOfScan: '',
  });

  const [mobileNumber, setMobileNumber] = useState('');
  const [points, setPoints] = useState('');
  const [paytmSelected, setPaytmSelected] = useState(true);
  const {t} = useTranslation();

  const validateMobileNumber = () => {
    return /^[0-9]{10}$/.test(mobileNumber);
  };

  const handleProceed = () => {
    if (!validateMobileNumber()) {
      setPopupContent('Enter Valid Mobile Number');
      setPopupVisible(true);
      return;
    }
    if (!paytmSelected) {
      setPopupContent('Select Wallet');
      setPopupVisible(true);
      return;
    }
    const transferData = {
      mobileNo: mobileNumber,
      points: points,
    };

    paytmTransfer(transferData)
      .then(response => {
        return response.data;
      })
      .then(jsonData => {
        setPopupContent(jsonData.message);
        setPopupVisible(true);
        setMobileNumber('');
        setPoints('');
      })
      .catch(error => {
        if (error.response && error.response.data) {
          console.error('API Error:', error.response.data.message);
          setPopupContent('Error making paytm transfer');
          setPopupVisible(true);
        } else {
          setPopupContent('Error making paytm transfer');
          setPopupVisible(true);
          console.error('API Error:', error.message);
        }
      });
  };

  const handlePaytmPress = () => {
    setPaytmSelected(!paytmSelected);
  };
  const handleMobileNumberChange = text => {
    setMobileNumber(text);
  };

  const handlePointsChange = text => {
    setPoints(text);
  };

  useEffect(() => {
    AsyncStorage.getItem('USER').then(r => {
      const user = JSON.parse(r as string);
      const data = {
        pointsBalance: user.pointsSummary.pointsBalance,
        redeemedPoints: user.pointsSummary.redeemedPoints,
        numberOfScan: user.pointsSummary.numberOfScan,
      };
      setPointData(data);
    });
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.mainWrapper}>
        <View style={styles.points}>
          <View style={styles.leftPoint}>
            <Text style={styles.greyText}>{t('strings:points_balance')}</Text>
            <Text style={styles.point}>
              {pointData.pointsBalance ? pointData.pointsBalance : 0}
            </Text>
          </View>
          <View style={styles.rightPoint}>
            <Text style={styles.greyText}>{t('strings:points_redeemed')}</Text>
            <Text style={styles.point}>
              {pointData.redeemedPoints ? pointData.redeemedPoints : 0}
            </Text>
          </View>
        </View>
        <View style={styles.rightTextView}>
          <Text style={styles.rightText}>* 1 Point = 1 INR</Text>
        </View>
        <View style={styles.enterCode}>
          <View style={styles.topContainer}>
            <Text style={styles.smallText}>
              {t('strings:enter_paytm_mobile_no_below')}
            </Text>
          </View>
          <View style={styles.bottomContainer}>
            <TextInput
              style={styles.input}
              placeholder={t('strings:mobile_number')}
              placeholderTextColor={Colors.grey}
              textAlign="center"
              onChangeText={handleMobileNumberChange}
              keyboardType={'numeric'}
              maxLength={10}
              value={mobileNumber}
            />
          </View>
        </View>
        <View style={styles.enterCode}>
          <View style={styles.topContainer}>
            <Text style={styles.smallText}>
              {t('strings:enter_points_to_be_redeemed')}
            </Text>
          </View>
          <View style={styles.bottomContainer}>
            <TextInput
              style={styles.input}
              placeholder={t('strings:enter_points')}
              placeholderTextColor={Colors.grey}
              textAlign="center"
              onChangeText={handlePointsChange}
              keyboardType={'numeric'}
              maxLength={19}
              value={points}
            />
          </View>
        </View>
        <Text style={styles.chooseWallet}>{t('strings:choose_wallet')}</Text>
        <TouchableOpacity onPress={handlePaytmPress} style={styles.wallet}>
          <Image
            resizeMode="contain"
            style={{flex: 1, width: '100%', height: '100%'}}
            source={require('../../../../../assets/images/ic_paytm_logo.webp')}
          />
          {paytmSelected == true && (
            <Image
              resizeMode="contain"
              style={{flex: 1, width: '100%', height: '100%'}}
              source={require('../../../../../assets/images/tick_1.png')}
            />
          )}
          {paytmSelected == false && (
            <Image
              resizeMode="contain"
              style={{flex: 1, width: '100%', height: '100%'}}
              source={require('../../../../../assets/images/tick_1_notSelected.png')}
            />
          )}
        </TouchableOpacity>
        <Buttons
          label={t('strings:proceed')}
          variant="filled"
          onPress={() => handleProceed()}
          width="100%"
          iconHeight={10}
          iconWidth={30}
          iconGap={30}
          icon={arrowIcon}
        />
      </View>
      {isPopupVisible && (
        <Popup
          isVisible={isPopupVisible}
          onClose={() => setPopupVisible(false)}>
          {popupContent}
        </Popup>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: Colors.white,
  },
  mainWrapper: {
    padding: 15,
  },
  points: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
    marginTop: 30,
  },
  leftPoint: {
    width: '50%',
    height: 100,
    backgroundColor: Colors.lightYellow,
    borderTopLeftRadius: 50,
    borderBottomLeftRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },

  rightPoint: {
    width: '50%',
    height: 100,
    backgroundColor: Colors.lightYellow,
    borderTopRightRadius: 50,
    borderBottomRightRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  greyText: {
    width: '80%',
    color: Colors.grey,
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: responsiveFontSize(1.7),
    marginBottom: 10,
  },
  point: {
    fontWeight: 'bold',
    color: Colors.black,
    fontSize: responsiveFontSize(1.7),
  },
  rightText: {
    color: Colors.black,
    fontWeight: 'bold',
    fontSize: responsiveFontSize(1.5),
  },
  rightTextView: {
    display: 'flex',
    width: '100%',
    alignItems: 'flex-end',
    marginTop: 5,
  },
  smallText: {
    textAlign: 'center',
    color: Colors.black,
    fontSize: responsiveFontSize(1.8),
    fontWeight: 'bold',
  },
  enterCode: {
    marginTop: 20,
    width: '100%',
    borderColor: Colors.lightGrey,
    borderWidth: 2,
    borderRadius: 10,
    height: 100,
    display: 'flex',
    flexDirection: 'column',
  },
  chooseWallet: {
    marginTop: 20,
    color: Colors.black,
    fontSize: responsiveFontSize(2),
    textAlign: 'center',
    fontWeight: 'bold',
  },
  wallet: {
    marginTop: 10,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: Colors.lightGrey,
    padding: 10,
    height: 50,
    borderRadius: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  topContainer: {
    borderBottomWidth: 2,
    borderColor: Colors.lightGrey,
    padding: 10,
    height: 50,
    flexGrow: 1,
  },
  bottomContainer: {
    flexGrow: 1,
    height: 50,
  },
  input: {
    padding: 10,
    fontSize: responsiveFontSize(2),
    textAlign: 'center',
    color: Colors.black,
    fontWeight: 'bold',
  },
});

export default PaytmTransfer;
