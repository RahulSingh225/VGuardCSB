import { t } from 'i18next';
import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import Buttons from '../../components/Buttons';
import DatePickerField from '../../components/DatePickerField';
import ImagePickerField from '../../components/ImagePickerField';
import InputField from '../../components/InputField';
import Loader from '../../components/Loader';
import MultiSelectField from '../../components/MultiSelectField';
import PickerField from '../../components/PickerField';
import Popup from '../../components/Popup';
import Constants, { Colors } from '../../utils/constants';
import { height } from '../../utils/dimensions';
import {
  responsiveFontSize,
  responsiveHeight,
} from 'react-native-responsive-dimensions';
import { BankDetail, Cities, VguardUser } from '../../types';
import {
  getCities,
  getDetailsByPinCode,
  getPincodeList,
  getUserProfile,
  updateProfile,
} from '../../utils/apiservice';
import { AppContext } from '../../services/ContextService';
import { StorageItem, addItem } from '../../services/StorageService';

const EditProfile: React.FC<{ navigation: any }> = ({ navigation }) => {
  const appContext = useContext(AppContext);
  useEffect(() => {
    showLoader(true);
    const user: VguardUser = appContext.getUserDetails();
    getUserProfile({ user_id: user.user_id }).then(res => {
      showLoader(false);
      if (res.data.status) {
        const vg: VguardUser = res.data.data;
        console.log(vg);
        setUserData(vg);
        setBankDetail(vg.bank_details);
      } else {
        setPopupVisible(true);
        setPopupContent(() => (
          <Text>Something went wrong please try again</Text>
        ));
      }
    });
  }, []);

  const gender = ['Male', 'Female', 'Other'];

  const ecardURL = 'https://www.vguardrishta.com/img/appImages/eCard/';

  const [profileImage, setProfileImage] = useState('');
  const [userData, setUserData] = useState<VguardUser | any>();
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [loader, showLoader] = useState(false);
  const [uiSwitch, setUIswitch] = React.useState({
    currentpincode: false,
    pincode: false,
  });
  const [selfieFileData, setSelfieFileData] = useState({
    uri: '',
    name: '',
    type: '',
  });
  const [bankDetails, setBankDetail] = useState<BankDetail | any>();
  const [popupContent, setPopupContent] = useState<any>();
  const [isFieldAvailable, showField] = useState(false);
  const [cities, setCities] = useState<Cities | any>();
  const [pincode_suggestions, setPincode_Suggestions] = React.useState([]);
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
    showLoader(true);
    getPincodeList(pincode)
      .then(data => {
        const pincodeid = data.data[0].pinCodeId;
        return getDetailsByPinCode(pincodeid);
      })
      .then(secondData => {
        secondData = secondData.data;
        console.log(secondData);
        showLoader(false);

        setUserData((prevData: VguardUser) => ({
          ...prevData,
          district: secondData.distName,
          district_id: secondData.distId,
          state: secondData.stateName,
          state_id: secondData.stateId,
          city: secondData.cityName,
          pinCode: pincode,
        }));

        showLoader(false);
        console.log(userData);
        return getCities(secondData.distId);
      })
      .then(cityData => {
        cityData = cityData.data;
        const cityDataWithOther = [...cityData, { cityName: 'Other', id: '' }];

        setCities(cityDataWithOther);

        showLoader(false);
      })
      .catch(error => {
        console.error('Error in Page 1:', error);
      })
      .finally(() => {
        showLoader(false);
      });
  }
  const handleCitySelect = async (text: string, type: string) => {
    let selectedCategory: any;
    if (text == 'Other') {
      showField(true);
    }

    setUserData((prevData: VguardUser) => ({
      ...prevData,
      city: text,
    }));
  };
  const handleImageChange = async (
    image: string,
    type: string,
    imageName: string,
    label: string,
  ) => {
    try {
      let fileData = {
        uri: image,
        name: imageName,
        type: type,
      };

      setSelfieFileData(fileData);
    } catch (error) {
      console.error('Error handling image change in EditProfile:', error);
    }
  };

  const openEVisitingCard = () => {
    Linking.openURL(ecardURL + userData.ecardPath);
  };
  async function updateProfileData() {
    try {
      const data = await getUserProfile({ user_id: userData?.user_id });
      console.log(data);
      showLoader(false);
      if (data.data.status) {
        const vg: VguardUser = data.data.data;
        const st: StorageItem = { key: 'USER', value: vg };
        addItem(st);
        setUserData(vg);
      }
    } catch (error) {
      console.log(error);
    }
  }

  function checkValidation() {
    console.log(userData);
    if (!userData?.currentaddress1) {
      showError('Please enter address details');
      return;
    } else if (!userData?.currentaddress2) {
      showError('Please enter address details');
      return;
    } else if (!userData?.pincode) {
      showError('Please enter pincode');
      return;
    } else if (!bankDetails?.bank_account_number) {
      showError('Please enter Bank details');
      return;
    } else if (!bankDetails?.bank_account_ifsc) {
      showError('Please enter Bank details');
      return;
    } else {
      handleSubmit();
    }
  }
  function showError(msg: string) {
    setPopupContent(msg);
    setPopupVisible(true);
  }

  async function handleSubmit() {
    console.log('called');

    var data: VguardUser = userData;
    data.bank_details = bankDetails;
    showLoader(true);
    updateProfile(data)
      .then(res => {
        showLoader(false);
        if (res.status == 200 && res.data.status) {
          setPopupContent(() => <Text>{res.data.message}</Text>);
          setPopupVisible(true);
          updateProfileData();
        } else {
          setPopupContent(() => <Text>Please try again</Text>);
          setPopupVisible(true);
        }
      })
      .catch(err => {
        showLoader(false);
        setPopupContent(() => <Text>{err.response.data.message}</Text>);
        setPopupVisible(true);
        console.log(err);
      });
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
    <ScrollView style={styles.mainWrapper}>
      {loader && <Loader isLoading={loader} />}
      <View style={styles.flexBox}>
        <View style={styles.ImageProfile}>
          <ImageBackground
            source={require('../../assets/images/ic_v_guards_user.png')}
            style={{ width: '100%', height: '100%', borderRadius: 100 }}
            resizeMode="contain">
            <Image
              source={{ uri: profileImage }}
              style={{ width: '100%', height: '100%', borderRadius: 100 }}
              resizeMode="contain"
            />
          </ImageBackground>
        </View>
        <View style={styles.profileText}>
          <Text style={styles.textDetail}>{userData?.name}</Text>
          <Text style={styles.textDetail}>{userData?.rishta_id}</Text>
          <TouchableOpacity onPress={() => openEVisitingCard()}>
            <Text style={styles.viewProfile}>{t('strings:view_e_card')}</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.detailsContainer}>
        <InputField
          label={t('strings:preferred_language')}
          value={userData?.preferredLanguage}
          disabled={true}
        />
        <InputField
          label={t('strings:retailer_name')}
          value={userData?.name}
          disabled={true}
          onChangeText={text => handleInputChange(text, 'name')}
        />
        <InputField
          label={t('strings:contact_number')}
          value={userData?.contact}
          disabled={true}
        />
        <InputField
          label={t('strings:alternate_contact_number')}
          value={userData?.alternate_contact}
          onChangeText={text => handleInputChange(text, 'alternate_contact')}
        />

        <DatePickerField
          label={t('strings:lbl_date_of_birth_mandatory')}
          date={userData?.dob}
          
          onDateChange={date => handleInputChange(date, 'dob')}
        />
        <InputField
          label={t('strings:id_proof_no')}
          value={userData?.aadhar}
          // onChangeText={(text) => handleInputChange(text, 'kycDetails.aadharOrVoterOrDlNo')}
          disabled={true}
        />

        <InputField
          label={t('strings:pan_card')}
          value={userData?.pan}
          // onChangeText={(text) => handleInputChange(text, 'kycDetails.aadharOrVoterOrDlNo')}
          disabled={true}
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
        <Text
          style={{ color: Colors.black, fontWeight: 'bold', marginBottom: 2 }}>
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
          setOpen={() => setUIswitch({ pincode: !uiSwitch?.pincode })}
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
        {userData?.selfie?.length > 1 && (
          <ImagePickerField
            label="Selfie"
            onImageChange={handleImageChange}
            imageRelated={Constants.Profile}
            initialImage={userData?.selfie}
            getImageRelated={Constants.Profile}
            editable={false}
          />
        )}
        <Text style={styles.subHeading}>{t('strings:lbl_bank_details')}</Text>
        <InputField
          label={t('strings:lbl_account_number')}
          value={bankDetails?.bank_account_number}
          numeric={true}
          onChangeText={text => {
            setBankDetail((prevState: BankDetail) => ({
              ...prevState,
              bank_account_number: text,
            }));
          }}
        />
        <InputField
          label={t('strings:lbl_ifsc_code')}
          maxLength={11}
          value={bankDetails?.bank_account_ifsc}
          onChangeText={text =>
            setBankDetail((prevState: BankDetail) => ({
              ...prevState,
              bank_account_ifsc: text,
            }))
          }
        />

        <View style={styles.button}>
          <Buttons
            label={t('strings:submit')}
            variant="filled"
            onPress={() => checkValidation()}
            width="100%"
          />
        </View>
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

export default EditProfile;
