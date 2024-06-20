import {View, Text, StyleSheet, ScrollView, Modal, BackHandler, ToastAndroid} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {t, use} from 'i18next';
import InputField from '../../components/InputField';
import {useTranslation} from 'react-i18next';
import {
  checkTDS,
  getCities,
  getDetailsByPinCode,
  getPincodeList,
  getUserProfile,
  updateProfile,
} from '../../utils/apiservice';
import {Cities, VguardUser} from '../../types';
import DropDownPicker from 'react-native-dropdown-picker';
import PickerField from '../../components/PickerField';
import {AppContext} from '../../services/ContextService';
import {StorageItem, addItem} from '../../services/StorageService';
import {height, width} from '../../utils/dimensions';
import {
  responsiveFontSize,
  responsiveHeight,
} from 'react-native-responsive-dimensions';
import Buttons from '../../components/Buttons';
import {Colors, TDS_CONSENT_MESSAGE} from '../../utils/constants';

import Popup from '../../components/Popup';
import Loader from '../../components/Loader';
import {Avatar, TextInput} from 'react-native-paper';
import TDSPopup from '../../components/TDSPopup';
import { mailValidation, mobileNoValidation } from '../../utils/pattern';
import { AxiosResponse } from 'axios';
import Snackbar from 'react-native-snackbar';

const FillProfile: React.FC<{navigation: any}> = ({navigation}) => {

  interface PincodeResponseData {
    pinCodeId: string;
  }
  
  interface DetailsByPinCodeData {
    distName: string;
    distId: string;
    stateName: string;
    stateId: string;
    cityName: string;
  }
  
  interface CityData {
    cityName: string;
    id: string;
  }

  const appContext: any = useContext(AppContext);
  useEffect(() => {
    const user: VguardUser = appContext.getUserDetails();
    setUserData(user);
  }, []);
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => true,
    );
    return () => backHandler.remove();
  });
  const gender = ['Select Gender', 'Male', 'Female', 'Other'];

  const [loader, setLoader] = useState(false);
  const [userData, setUserData] = useState<VguardUser | any>();
  const [popup, setPopup] = useState<any>({isVisible: false, content: ""});
  const [pincode_suggestions, setPincode_Suggestions] = React.useState([]);
  const [tdsValue, setTDSValue] = useState('');
  const [cities, setCities] = useState<Cities | any>();
  const [uiSwitch, setUIswitch] = React.useState({
    currentpincode: false,
    pincode: false,
  });
  const [initialPopup, setInitialPopup] = useState({
    tdsPopup: false,
    tdsContent:
      'The TDS percentage cannot be changed during the financial year hence,\n I authorize and confirm.',
    tdschecked: false,
  });
  const {t} = useTranslation();

  function processPincode(pincode: string, type: string) {
    if (pincode.length <= 3) {
      return;
    }
    console.log(pincode);
    getPincodeList(pincode)
      .then(response => response.data)
      .then(suggestionData => {
        console.log(suggestionData);
        if (Array.isArray(suggestionData) && suggestionData.length > 0) {
          const filteredSuggestions: any = suggestionData.filter(
            item => item.pinCode !== null,
          );

          setPincode_Suggestions(filteredSuggestions);

          if (pincode.length == 6) {
            updateDistrictState(pincode, type);
          }
        }
      })
      .catch(error => {
        console.error('Error fetching pincode list:', error);
      });

    const updatedField = type === 'permanent' ? 'pincode' : 'currPinCode';
    setUserData((prevData: VguardUser) => ({
      ...prevData,
      [updatedField]: pincode,
    }));
  }

  function updateDistrictState(pincode: string, type: string) {
    setLoader(true);
  
    getPincodeList(pincode)
      .then((response: AxiosResponse<{ data: PincodeResponseData[] }>) => {
        const pincodeList = response.data.data;
        if (pincodeList.length === 0) {
          throw new Error('No pincode data found');
        }
        const pincodeid = pincodeList[0].pinCodeId;
        return getDetailsByPinCode(pincodeid);
      })
      .then((secondResponse: AxiosResponse<DetailsByPinCodeData>) => {
        const secondData = secondResponse.data;
        console.log(secondData);
  
        setUserData((prevData: VguardUser) => ({
          ...prevData,
          district: secondData.distName,
          district_id: secondData.distId,
          state: secondData.stateName,
          state_id: secondData.stateId,
          city: secondData.cityName,
          pinCode: pincode,
        }));
  
        return getCities(secondData.distId);
      })
      .then((cityResponse: AxiosResponse<{ data: CityData[] }>) => {
        const cityData = cityResponse.data.data;
        const cityDataWithOther = [...cityData, { cityName: 'Other', id: '' }];
  
        setCities(cityDataWithOther);
      })
      .catch(error => {
        console.error('Error in Page 1:', error);
      })
      .finally(() => {
        setLoader(false);
      });
  }
  
  function checkValidation() {
    // console.log(userData);

    if(userData.alternate_contact && !mobileNoValidation(userData.alternate_contact)){
      console.log(userData.alternate_contact)
      console.log(!mobileNoValidation(userData.alternate_contact))
      ToastAndroid.show("Please enter the valid alternate number",ToastAndroid.SHORT)
      return 
    }

    if(tdsValue!== '' && !initialPopup.tdschecked){
      ToastAndroid.show("Please verify TDS Value",ToastAndroid.SHORT)
      return 
    }

    if(userData.email && !mailValidation(userData.email)){
      ToastAndroid.show("Please enter the valid E-mail",ToastAndroid.SHORT)
      return 
    }
    
    if (!userData?.currentaddress1) {
      ToastAndroid.show("Please enter the house/ flat/ block no",ToastAndroid.SHORT)
      return;
    }
    if (!userData?.currentaddress2) {
      ToastAndroid.show("Please enter the street/ colony/ locality",ToastAndroid.SHORT)
      return;
    } 
    
    if (!userData?.pincode) {
      setPopup({isVisible: true, content: 'Please enter pincode'});
      return;
    }
    
    handleSubmit();
  }

  async function handleSubmit() {
    console.log('called');

    var data: VguardUser = userData;

    setLoader(true);
    updateProfile(data)
      .then(res => {
        setLoader(false);
        if (res.status == 200 && res.data.status) {
          setPopup({
            isVisible: true,
            content: () => <Text>{res.data.message}</Text>,
          });
          updateProfileData();
          navigation.replace('UpdateBank');
        } else {
          setPopup({
            isVisible: true,
            content: () => <Text>Please try again</Text>,
          });
        }
      })
      .catch(err => {
        setLoader(false);
        console.log(err);
      });
  }

  async function updateProfileData() {
    try {
      const data = await getUserProfile({user_id: userData?.user_id});
      console.log(data);
      setLoader(false);
      if (data.data.status) {
        const vg: VguardUser = data.data.data;
        const st: StorageItem = {key: 'USER', value: vg};
        appContext.updateUser(vg)
        addItem(st);
        setUserData(vg);
      }
    } catch (error) {
      console.log(error);
      setLoader(false);
      setPopup({isVisible: true, content: 'Something went wrong'});
    }
  }

  async function verifyTDS() {
    try {
      setLoader(true)
      const result = await checkTDS({unique_id: userData?.unique_id});
      setLoader(false)
      console.log(result.data);
      setInitialPopup({
        ...initialPopup,
        tdsContent: result.data.message,
        tdschecked: true,
      });
      setTDSValue(result.data.entity + '%');
    } catch (error) {
      setLoader(false)
      console.log(error);
    }
  }
  const handleInputChange = async (value: string, label: string) => {
    setUserData((prevData: VguardUser) => {
      let updatedValue: any = value;
      if (['annualBusinessPotential'].includes(label)) {
        updatedValue = parseFloat(value);
        if (isNaN(updatedValue)) {
          updatedValue = null;
        }
      }
      return {
        ...prevData,
        [label]: updatedValue,
      };
    });
    if (label == 'gender') {
      let genderNum = '';
      if (value == 'Male') {
        genderNum = '1';
      } else if (value == 'Female') {
        genderNum = '2';
      } else if (value == 'Other') {
        genderNum = '3';
      }
      setUserData((prevData: VguardUser) => {
        return {
          ...prevData,
          [label]: value,
          genderPos: genderNum,
        };
      });
    }
  };
  return (
    <View style={{backgroundColor:Colors.white,flex:1}}>
    <ScrollView

      contentContainerStyle={{alignContent: 'center', gap: 10,backgroundColor:Colors.white}}
      style={{width: width * 0.9, alignSelf: 'center',backgroundColor:Colors.white}}>

      {loader && <Loader isLoading={loader} />}
      <View
        style={{
          backgroundColor: 'transparent',
          height: height / 8,
          margin: 20,
          flexDirection: 'row',
          width: width / 2.1,
          justifyContent: 'space-evenly',
          alignItems: 'center',
          padding: 20,
        }}>
        <Avatar.Image
          size={84}
          source={require('../../assets/images/ac_icon.png')}
        />
        <View
          style={{
            margin: 20,
            flexDirection: 'column',
            padding: 10,
            height: height / 10,
          }}>
          <Text style={{color: 'grey'}}>Contact: {userData?.contact}</Text>
          <Text style={{color: 'grey'}}>Unique ID: {userData?.unique_id}</Text>
        </View>
      </View>
      <InputField
        label={t('strings:alternate_contact_number')}
        value={userData?.alternate_contact}
        numeric={true}
        maxLength={10}
        onChangeText={text => handleInputChange(text, 'alternate_contact')}
      />

      <InputField
        label={t('strings:email')}
        value={userData?.email}
        onChangeText={text => handleInputChange(text, 'email')}
      />
      <PickerField
        label={t('strings:lbl_gender_mandatory')}
        disabled={false}
        selectedValue={userData?.gender}
        onValueChange={(text: string) => handleInputChange(text, 'gender')}
        items={gender?.map((city: string) => ({
          label: city,
          value: city,
        }))}
      />
      {initialPopup.tdsPopup && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={initialPopup.tdsPopup}
          onDismiss={() => setInitialPopup({...initialPopup, tdsPopup: false})}>
          <View
            style={{
              width: width * 0.7,
              maxHeight: height * 0.4,
              alignSelf: 'center',
              backgroundColor: Colors.activity_bg_color,
              flex: 1,
              marginTop: 200,
              borderRadius: 10,
              elevation: 10,
              justifyContent: 'center',
              gap: 10,
              flexDirection: 'column',
            }}>
            <Text
              style={{
                color: 'black',
                fontWeight: 'bold',
                fontSize: 24,
                textAlign: 'center',
                marginBottom: 50,
              }}>
              TDS Consent
            </Text>
            <Text
              style={{
                fontWeight: '500',
                color: Colors.grey,
                textAlign: 'center',
              }}>
              {initialPopup.tdsContent}
            </Text>
            {!initialPopup.tdschecked && (
              <Buttons
                btnStyle={{width: '50%', alignSelf: 'center', marginTop: 50}}
                onPress={() => verifyTDS()}
                variant="filled"
                label="Agree"
              />
            )}
            <Buttons
              btnStyle={{width: '50%', alignSelf: 'center'}}
              onPress={() =>
                setInitialPopup({...initialPopup, tdsPopup: false})
              }
              variant="filled"
              label={initialPopup.tdschecked ? 'OK' : 'Cancel'}
            />
          </View>
        </Modal>
      )}
      <View
        style={{
          justifyContent: 'space-between',

          borderWidth: 2,
          borderColor: 'grey',
          borderRadius: 5,
        }}>
        <Text style={{marginLeft: 10, color: 'black', fontWeight: 'bold'}}>
          TDS Slab
        </Text>
        <View style={{flexDirection: 'row', marginTop: -20}}>
          <TextInput
            contentStyle={{textAlign: 'justify'}}
            style={{flex: 2, maxWidth: '70%', backgroundColor: 'transparent'}}
            textColor="black"
            value={tdsValue}
            disabled
            // onChangeText={(e)=>setTDSValue(e)}
          />
          {!initialPopup.tdschecked && (
            <Buttons
              btnStyle={{flex: 1,height:"70%",width:"100%",alignSelf:"center",right:10}}
              label="Verify"
              onPress={() =>
                {
                  setInitialPopup((prev: any) => ({...prev, tdsPopup: true}))
                }
              }
              variant="filled"
            />
          )}
        </View>
      </View>

      <Text style={styles.subHeading}>{t('strings:permanent_address')}</Text>
      <InputField
        label={t('strings:lbl_permanent_address_mandatory')}
        value={userData?.currentaddress1}
        onChangeText={text => handleInputChange(text, 'currentaddress1')}
      />
      <InputField
        label={t('strings:lbl_street_locality')}
        value={userData?.currentaddress2}
        onChangeText={text => handleInputChange(text, 'currentaddress2')}
      />
      <InputField
        label={t('strings:lbl_landmark')}
        value={userData?.currentaddress3}
        onChangeText={text => handleInputChange(text, 'currentaddress3')}
      />
      <Text style={{color: Colors.black, fontWeight: 'bold', marginBottom: 2}}>
        {'Pincode'}
      </Text>
      <DropDownPicker
        mode="BADGE"
        showBadgeDot={true}
        searchable={true}
        searchPlaceholder="Search Your Pincode"
        loading={loader}
        placeholder={
          userData?.pincode === null
            ? 'Search Pincode'
            : `${userData?.pincode || ''}`
        }
        searchTextInputProps={{
          maxLength: 6,
          keyboardType: 'number-pad',
        }}
        listMode="SCROLLVIEW"
        scrollViewProps={{
          nestedScrollEnabled: true,
          decelerationRate: 'fast',
        }}
        open={uiSwitch.pincode}
        items={pincode_suggestions.map((item: any) => ({
          label: item?.pinCode,
          value: item?.pinCode,
        }))}
        setOpen={() => setUIswitch({pincode: !uiSwitch?.pincode})}
        value={userData?.pinCode}
        onSelectItem={item => {
          processPincode(`${item.value}`, 'permanent');
        }}
        onChangeSearchText={text => processPincode(text, 'permanent')}
        dropDownContainerStyle={{
          height: height / 5,
          borderWidth: 2,
          borderColor: Colors.grey,
          elevation: 0,
          backgroundColor: 'white',
        }}
        style={{
          backgroundColor: 'white',
          elevation: 0,
          opacity: 0.9,
          borderWidth: 2,
          height: height / 15,
          borderColor: Colors.grey,
          marginBottom: 20,
          borderRadius: 5,
        }}
      />

      <InputField
        label={t('strings:lbl_state')}
        value={userData?.state}
        disabled={true}
      />
      <InputField
        label={t('strings:district')}
        value={userData?.district}
        disabled={true}
      />
      <InputField
        label={t('strings:city')}
        value={userData?.city}
        disabled={true}
      />
      <View style={styles.button}>
        <Buttons
          label={t('strings:submit')}
          variant="filled"
          onPress={() => checkValidation()}
          width="100%"
        />
      </View>
      {popup.isVisible && (
        <Popup
          isVisible={popup.isVisible}
          onClose={() => setPopup({isVisible: false, content: null})}>
          {popup.content}
        </Popup>
      )}
    </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  mainWrapper: {
    padding: 15,
    flex: 1,
    backgroundColor: Colors.white,
  },
  ImageProfile: {
    height: 50,
    width: 50,
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
  flexBox: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  detailsContainer: {
    flexDirection: 'column',
    marginVertical: 30,
  },
  subHeading: {
    color: Colors.grey,
    fontSize: responsiveFontSize(2.2),
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    marginBottom: 30,
  },
  container: {
    height: 50,
    marginBottom: 20,
    borderColor: Colors.lightGrey,
    borderWidth: 2,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  focusedContainer: {
    borderColor: Colors.grey,
  },
  label: {
    fontSize: responsiveFontSize(1.7),
    fontWeight: 'bold',
    color: Colors.black,
    backgroundColor: Colors.white,
    paddingHorizontal: 3,
  },
  focusedLabel: {
    position: 'absolute',
    top: -8,
    left: 10,
    fontSize: responsiveFontSize(1.5),
    color: Colors.black,
  },
  input: {
    color: Colors.black,
    paddingTop: 10,
  },
  disabledInput: {
    color: Colors.grey,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 5,
  },
  error: {
    color: 'red',
    marginTop: 5,
  },
});

export default FillProfile;
