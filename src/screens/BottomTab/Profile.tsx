import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  Linking,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';

import {useTranslation} from 'react-i18next';

import {Colors} from '../../utils/constants';
import {VguardUser} from '../../types';
import {StorageItem, addItem, getItem} from '../../services/StorageService';
import EntypoIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {getUserProfile, verifyVPA} from '../../utils/apiservice';
import Loader from '../../components/Loader';

const Profile: React.FC<{navigation: any}> = ({navigation}) => {
  const {t} = useTranslation();

  const baseURL = 'https://www.vguardrishta.com/img/appImages/Profile/';
  const ecardURL = 'https://www.vguardrishta.com/img/appImages/eCard/';
  const [showBankDetails, setShowBankDetails] = useState(false);
  const [showPanDetails, setShowPanDetails] = useState(false);
  const [showId, setShowId] = useState(false);
  const [loader, setLoader] = useState(false);
  const [userData, setUserData] = useState<VguardUser | any>();
  const [profileImage, setProfileImage] = useState('');

  useEffect(() => {
    getItem('USER').then(res => {
      const vg: VguardUser = res;
      setUserData(vg);
    });
  }, []);
  async function updateProfileData() {
    try {
      const data = await getUserProfile({user_id: userData?.user_id});
      console.log(data);
      setLoader(false);
      if (data.data.status) {
        const vg: VguardUser = data.data.data;
        const st: StorageItem = {key: 'USER', value: vg};
        addItem(st);
        setUserData(vg);
      }
    } catch (error) {
      console.log(error);
    }
  }
  async function VerifyUpi() {
    setLoader(true);
    const body = {mobile_no: userData.contact};
    await verifyVPA(body);
    updateProfileData();
  }
  async function VerifyBank() {
    setLoader(true);
    //TODO make the api call
    updateProfileData();
  }
  const labels = [
    'Preferred Language',
    'Gender',
    'Date of Birth',
    'Contact',
    'WhatsApp',
    'Email',
    'Address',
    'Selfie',
    'ID Document',
    'Pan Card',
    'Bank Details',
    'UPI Id',
  ];
  const renderField = fieldName => {
    const fieldMap = {
      'Date of Birth': 'dob',
      Contact: 'contact',
      WhatsApp: 'alternate_contact',
      Address: 'currentaddress1',

      'Preferred Language': 'preferred_language',
      Gender: 'gender',
      Email: 'email',
    };

    if (fieldName in fieldMap) {
      const mappedField = fieldMap[fieldName];
      if (userData && mappedField in userData) {
        const fieldValue = userData[mappedField];
        return fieldValue === true
          ? 'Yes'
          : fieldValue === false
          ? 'No'
          : fieldValue;
      } else {
        return '';
      }
    } else if (fieldName === 'Selfie') {
      if (userData && userData.selfie) {
        return 'Yes';
      } else {
        return 'No';
      }
    } else if (fieldName === 'ID Document') {
      const hasAdhaar = userData && userData?.aadhar;
      return (
        <>
          <View>
            <View style={styles.databox}>
              <Text style={styles.yesorno}>{hasAdhaar ? 'Yes' : 'No'}</Text>
              {hasAdhaar && (
                <TouchableOpacity
                  style={{marginLeft: 5}}
                  onPress={() => setShowId(!showId)}>
                  <Image
                    source={require('../../assets/images/ic_ticket_drop_down2.png')}
                    style={{width: 20, height: 20}}
                  />
                </TouchableOpacity>
              )}
            </View>
            {showId && (
              <View style={styles.smallDataBox}>
                <View style={styles.smallDataRow}>
                  <Text style={styles.dataSmallLabel}>ID Card No: </Text>
                  <Text style={styles.dataSmall}>{userData.aadhar}</Text>
                </View>
              </View>
            )}
          </View>
        </>
      );
    } else if (fieldName === 'Pan Card') {
      const hasPanDetails = userData && userData.pan;
      return (
        <>
          <View>
            <View style={styles.databox}>
              <Text style={styles.yesorno}>{hasPanDetails ? 'Yes' : 'No'}</Text>
              {hasPanDetails && (
                <TouchableOpacity
                  style={{marginLeft: 5}}
                  onPress={() => setShowPanDetails(!showPanDetails)}>
                  <Image
                    source={require('../../assets/images/ic_ticket_drop_down2.png')}
                    style={{width: 20, height: 20}}
                  />
                </TouchableOpacity>
              )}
            </View>
            {showPanDetails && (
              <View style={styles.smallDataBox}>
                <View style={styles.smallDataRow}>
                  <Text style={styles.dataSmallLabel}>Pan Card No: </Text>
                  <Text style={styles.dataSmall}>{userData.pan}</Text>
                </View>
              </View>
            )}
          </View>
        </>
      );
    } else if (fieldName === 'Bank Details') {
      console.log(fieldName);
      const hasBankDetails =
        userData?.bank_details && userData?.bank_details?.bank_account_number;
      return (
        <>
          <View>
            <View style={styles.databox}>
              <EntypoIcon
                name={'close-circle-outline'}
                size={24}
                color={Colors.red}
              />
              <Text style={styles.yesorno}>
                {hasBankDetails ? 'Yes' : 'No'}
              </Text>
              {hasBankDetails && (
                <TouchableOpacity
                  style={{marginLeft: 5}}
                  onPress={() => setShowBankDetails(!showBankDetails)}>
                  <Image
                    source={require('../../assets/images/ic_ticket_drop_down2.png')}
                    style={{width: 20, height: 20}}
                  />
                </TouchableOpacity>
              )}
            </View>
            {showBankDetails && (
              <View style={styles.smallDataBox}>
                <View style={styles.smallDataRow}>
                  <Text style={styles.dataSmallLabel}>Bank Acc No: </Text>
                  <Text style={styles.dataSmall}>
                    {userData.bank_details.bank_account_number}
                  </Text>
                </View>
                <View style={styles.smallDataRow}>
                  <Text style={styles.dataSmallLabel}>
                    Bank Acc Holder Name:{' '}
                  </Text>
                  <Text style={styles.dataSmall}>
                    {userData.bank_details.bank_account_name}
                  </Text>
                </View>
                <View style={styles.smallDataRow}>
                  <Text style={styles.dataSmallLabel}>Bank Acc Type: </Text>
                  <Text style={styles.dataSmall}>
                    {userData.bank_details.bank_account_type}
                  </Text>
                </View>

                <View style={styles.smallDataRow}>
                  <Text style={styles.dataSmallLabel}>IFSC code: </Text>
                  <Text style={styles.dataSmall}>
                    {userData.bank_details.bank_account_ifsc}
                  </Text>
                </View>
                {userData.bank_verified ? (
                  <>
                    <EntypoIcon
                      name={'check-circle'}
                      size={24}
                      color={'green'}
                    />
                  </>
                ) : (
                  <>
                    <TouchableOpacity
                      onPress={() => VerifyBank()}
                      style={{
                        width: 80,
                        height: 40,
                        backgroundColor: Colors.yellow,
                        justifyContent: 'center',
                        borderRadius: 5,
                      }}>
                      <Text
                        style={{
                          fontWeight: 'bold',
                          color: 'black',
                          textAlign: 'center',
                        }}>
                        Verify
                      </Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            )}
          </View>
        </>
      );
    } else if (fieldName === 'UPI Id') {
      console.log(fieldName);
      return (
        <>
          {userData?.vpa_verified ? (
            <EntypoIcon name={'check-circle'} size={24} color={'green'} />
          ) : (
            <TouchableOpacity
              onPress={() => VerifyUpi()}
              style={{
                width: 80,
                height: 40,
                backgroundColor: Colors.yellow,
                justifyContent: 'center',
                borderRadius: 5,
              }}>
              <Text
                style={{
                  fontWeight: 'bold',
                  color: 'black',
                  textAlign: 'center',
                }}>
                Verify
              </Text>
            </TouchableOpacity>
          )}
        </>
      );
    } else if (fieldName in userData) {
      const fieldValue = userData[fieldName];
      return fieldValue === true
        ? 'Yes'
        : fieldValue === false
        ? 'No'
        : fieldValue;
    } else {
      return 'N/A';
    }
  };

  const openEVisitingCard = () => {
    Linking.openURL(ecardURL);
  };

  return (
    <ScrollView style={styles.mainWrapper}>
      <View style={styles.flexBox}>
        {loader && <Loader isLoading={loader} />}
        <View style={styles.ImageProfile}>
          <ImageBackground
            source={require('../../assets/images/ic_v_guards_user.png')}
            style={{width: '100%', height: '100%', borderRadius: 100}}
            resizeMode="contain">
            <Image
              source={{uri: profileImage}}
              style={{width: '100%', height: '100%', borderRadius: 100}}
              resizeMode="cover"
            />
          </ImageBackground>
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Edit Profile')}>
          <Text style={styles.buttonText}>{t('strings:edit_profile')}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.profileText}>
        <Text style={styles.textDetail}>{userData?.name}</Text>
        <Text style={styles.textDetail}>{userData?.rishta_id}</Text>
        <TouchableOpacity onPress={openEVisitingCard}>
          <Text style={styles.viewProfile}>{t('strings:view_e_card')}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.detailsContainer}>
        {labels.map((label, index) => (
          <View style={styles.labelDataContainer}>
            <Text style={styles.label}>{label}:</Text>
            <Text style={styles.data}>{renderField(label)}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  mainWrapper: {
    padding: 15,
    flex: 1,
    backgroundColor: Colors.white,
  },
  ImageProfile: {
    height: 80,
    width: 80,
    borderRadius: 100,
  },
  textName: {
    color: Colors.black,
    fontWeight: 'bold',
    fontSize: responsiveFontSize(3),
    marginTop: responsiveHeight(2),
  },
  label: {
    color: Colors.grey,
    fontSize: responsiveFontSize(1.7),
    marginTop: responsiveHeight(3),
    fontWeight: 'bold',
  },
  textDetail: {
    color: Colors.black,
    fontSize: responsiveFontSize(1.7),
    fontWeight: 'bold',
  },
  viewProfile: {
    color: Colors.yellow,
    fontWeight: 'bold',
    fontSize: responsiveFontSize(1.7),
  },
  data: {
    color: Colors.black,
    fontSize: responsiveFontSize(1.7),
    marginTop: responsiveHeight(3),
    textAlign: 'right',
    fontWeight: 'bold',
  },
  dataSmall: {
    color: Colors.black,
    fontSize: responsiveFontSize(1.5),
    textAlign: 'right',
    fontWeight: 'bold',
    maxWidth: responsiveWidth(50),
  },
  dataSmallLabel: {
    color: Colors.grey,
    fontSize: responsiveFontSize(1.5),
    textAlign: 'right',
    fontWeight: 'bold',
  },
  smallDataBox: {
    backgroundColor: Colors.yellow,
    padding: 5,
    borderRadius: 5,
    marginTop: 5,
  },
  smallDataRow: {
    flexDirection: 'row',
    textAlign: 'right',
    justifyContent: 'flex-end',
    width: responsiveWidth(50),
    flexWrap: 'wrap',
  },
  yesorno: {
    color: Colors.black,
    fontSize: responsiveFontSize(1.7),
    textAlign: 'right',
    alignSelf: 'center',
    fontWeight: 'bold',
  },
  databox: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  profileText: {
    marginTop: responsiveHeight(2),
  },
  button: {
    backgroundColor: Colors.yellow,
    paddingHorizontal: responsiveWidth(5),
    paddingVertical: responsiveHeight(1),
    shadowColor: 'rgba(0, 0, 0, 0.8)',
    elevation: 5,
    borderRadius: 5,
  },
  flexBox: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttonText: {
    color: Colors.black,
    fontWeight: 'bold',
    fontSize: responsiveFontSize(1.5),
  },
  detailsContainer: {
    flexDirection: 'column',
    marginBottom: 50,
  },
  labelDataContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
});

export default Profile;
