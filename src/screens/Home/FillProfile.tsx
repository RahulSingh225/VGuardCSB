import {View, Text, StyleSheet, ScrollView} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {t, use} from 'i18next';
import InputField from '../../components/InputField';
import {useTranslation} from 'react-i18next';
import {
  getCities,
  getDetailsByPinCode,
  getPincodeList,
  getUserProfile,
  updateProfile,
} from '../../utils/apiservice';
import {Cities, VguardUser} from '../../types';
import DropDownPicker from 'react-native-dropdown-picker';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import PickerField from '../../components/PickerField';
import {AppContext} from '../../services/ContextService';
import {StorageItem, addItem} from '../../services/StorageService';
import {height, width} from '../../utils/dimensions';
import {
  responsiveFontSize,
  responsiveHeight,
} from 'react-native-responsive-dimensions';
import Buttons from '../../components/Buttons';
import Popup from '../../components/Popup';
import Loader from '../../components/Loader';

const FillProfile: React.FC<{navigation: any}> = ({navigation}) => {
  const appContext = useContext(AppContext);
  useEffect(() => {
    const user: VguardUser = appContext.getUserDetails();
    setUserData(user);
  }, []);
  const gender = ['Male', 'Female', 'Other'];

  const [loader, setLoader] = useState(false);
  const [userData, setUserData] = useState<VguardUser | any>();
  const [popup, setPopup] = useState({isVisible: false, content: null});
  const [pincode_suggestions, setPincode_Suggestions] = React.useState([]);
  const [cities, setCities] = useState<Cities | any>();
  const [uiSwitch, setUIswitch] = React.useState({
    currentpincode: false,
    pincode: false,
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
          const filteredSuggestions = suggestionData.filter(
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
      .then(data => {
        const pincodeid = data.data[0].pinCodeId;
        return getDetailsByPinCode(pincodeid);
      })
      .then(secondData => {
        secondData = secondData.data;
        console.log(secondData);
        setLoader(false);

        setUserData((prevData: VguardUser) => ({
          ...prevData,
          district: secondData.distName,
          district_id: secondData.distId,
          state: secondData.stateName,
          state_id: secondData.stateId,
          city: secondData.cityName,
          pinCode: pincode,
        }));

        setLoader(false);
        console.log(userData);
        return getCities(secondData.distId);
      })
      .then(cityData => {
        cityData = cityData.data;
        const cityDataWithOther = [...cityData, {cityName: 'Other', id: ''}];

        setCities(cityDataWithOther);

        setLoader(false);
      })
      .catch(error => {
        console.error('Error in Page 1:', error);
      })
      .finally(() => {
        setLoader(false);
      });
  }
  function checkValidation() {
    console.log(userData);
    if (!userData?.currentaddress1) {
      setPopup({isVisible: true, content: 'Please enter address details'});
      return;
    } else if (!userData?.currentaddress2) {
      setPopup({isVisible: true, content: 'Please enter address details'});

      return;
    } else if (!userData?.currentaddress3) {
      setPopup({isVisible: true, content: 'Please enter address details'});

      return;
    } else if (!userData?.pincode) {
      setPopup({isVisible: true, content: 'Please enter pincode'});
      return;
    } else {
      handleSubmit();
    }
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
          navigation.replace("UpdateBank")
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
        addItem(st);
        setUserData(vg);
      }
    } catch (error) {
      console.log(error);
    }
  }
  const handleInputChange = async (value: string, label: string) => {
    console.log(userData);
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
    <ScrollView
      contentContainerStyle={{alignContent: 'center', gap: 10}}
      style={{width: width * 0.9, alignSelf: 'center'}}>
      {loader && <Loader isLoading={loader} />}
      <InputField
        label={t('strings:alternate_contact_number')}
        value={userData?.alternate_contact}
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
        searchablePlaceholder="Search Pincode"
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
        items={pincode_suggestions.map(item => ({
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
