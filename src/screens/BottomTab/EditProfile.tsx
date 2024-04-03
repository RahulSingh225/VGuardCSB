import React, {useState, useEffect} from 'react';
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
} from 'react-native-responsive-dimensions';
import DropDownPicker from 'react-native-dropdown-picker';
import {useTranslation} from 'react-i18next';
import { Cities, VguardRishtaUser } from '../../types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getImageUrl } from '../../utils/fileutils';
import moment from 'moment';
import InputField from '../../components/InputField';
import Loader from '../../components/Loader';
import PickerField from '../../components/PickerField';
import DatePickerField from '../../components/DatePickerField';
import ImagePickerField from '../../components/ImagePickerField';
import Popup from '../../components/Popup';
import Constants, { Colors } from '../../utils/constants';

const EditProfile: React.FC<{navigation: any}> = ({navigation}) => {
  const {t} = useTranslation();

  const ecardURL = 'https://www.vguardrishta.com/img/appImages/eCard/';

  const [userData, setUserData] = useState<VguardRishtaUser | any>();
  const [postData, setPostData] = useState<VguardRishtaUser | any>();
  const [profileImage, setProfileImage] = useState('');
  const [isShopAddressDifferent, setIsShopAddressDifferent] = useState('');
  const [enrolledOtherSchemeYesNo, setEnrolledOtherSchemeYesNo] = useState('');
  const [additionalFieldsCount, setAdditionalFieldsCount] = useState(1);
  const [retailerCategoryDealIn, setRetailerCategoryDealIn] = useState([]);
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [popupContent, setPopupContent] = useState('');
  const [selfie, setSelfie] = useState('');
  // const [states, setStates] = useState<State | any>();
  // const [districts, setDistricts] = useState<District | any>();
  const [cities, setCities] = useState<Cities | any>();
  // const [currStates, setCurrStates] = useState<State | any>();
  // const [currDistricts, setCurrDistricts] = useState<District | any>();
  const [currCities, setCurrCities] = useState<Cities | any>();
  const [stateId, setStateId] = useState('');
  const [currStateId, setCurrStateId] = useState('');
  const [loader, showLoader] = useState(true);
  const [uiSwitch, setUIswitch] = React.useState({
    currentpincode: false,
    pincode: false,
  });
  const [userName, setUserName] = useState('');

  useEffect(() => {
    AsyncStorage.getItem('USER').then(r => {
      const user = JSON.parse(r as string);
      setUserName(user.name);
    });
    getUser()
      .then(response => response.data)
      .then(res => {
        const trimmedGender = res.gender.trim();
        res.gender = trimmedGender;
        setUserData(res);
        setPostData(res);
        setStateId(res.stateId);
        setCurrStateId(res.currStateId);
        setSelfie(res.kycDetails.selfie);
        setEnrolledOtherSchemeYesNo(res.enrolledOtherSchemeYesNo);
        if (
          res.currLandmark == res.landmark &&
          res.currentAddress == res.permanentAddress &&
          res.currStreetAndLocality == res.streetAndLocality &&
          res.currPinCode == res.pinCode
        ) {
          setIsShopAddressDifferent('Yes');
        } else {
          setIsShopAddressDifferent('No');
          processPincode(res.currPinCode.toString(), 'current');
        }
        const countNonEmptyStrings = (fields: any[]) => {
          return fields.filter(
            field => typeof field === 'string' && field.trim() !== '',
          ).length;
        };

        const fieldsToCheck = [
          res.otherSchemeBrand,
          res.otherSchemeBrand2,
          res.otherSchemeBrand3,
          res.otherSchemeBrand4,
          res.otherSchemeBrand5,
        ];

        setAdditionalFieldsCount(countNonEmptyStrings(fieldsToCheck));
        const image = selfie;
        showLoader(false);
      })
      .catch(error => {
        setPopupContent('Something Went Wrong!');
        setPopupVisible(true);
        showLoader(false);
      });

    getRetailerCategoryDealIn()
      .then(response => response.data)
      .then(responseData => {
        setRetailerCategoryDealIn(responseData);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  useEffect(() => {
    if (stateId) {
      processPincode(postData.pinCode.toString(), 'permanent');
    }
  }, [stateId, postData?.pinCode]);

  useEffect(() => {
    const getImage = async () => {
      try {
        const profileImageUrl = getImageUrl(
          userData.kycDetails.selfie,
          'Profile',
        );
        setProfileImage(profileImageUrl);
      } catch (error) {
        console.error('Error while fetching profile image:', error);
      }
    };

    getImage();
  }, [userData?.kycDetails?.selfie]);

  const openEVisitingCard = () => {
    Linking.openURL(ecardURL + userData.ecardPath);
  };

  const handleSendImage = async () => {
    try {
      const selfiePromise =
        selfieFileData.uri !== ''
          ? triggerApiWithImage(selfieFileData, 'Profile')
          : Promise.resolve(null);
      const idFrontPromise =
        idFrontFileData.uri !== ''
          ? triggerApiWithImage(idFrontFileData, 'IdCard')
          : Promise.resolve(null);
      const idBackPromise =
        idBackFileData.uri !== ''
          ? triggerApiWithImage(idBackFileData, 'IdCard')
          : Promise.resolve(null);
      const gstPromise =
        GstFileData.uri !== ''
          ? triggerApiWithImage(GstFileData, 'GST')
          : Promise.resolve(null);

      const [selfieUid, idFrontUid, idBackUid, gstUid] = await Promise.all([
        selfiePromise,
        idFrontPromise,
        idBackPromise,
        gstPromise,
      ]);

      const updatedPostData = {...postData};

      if (selfieFileData.uri !== '' && selfieUid !== null) {
        setPostDataOfImage('selfie', selfieUid);
        updatedPostData.kycDetails.selfie = selfieUid;
      }

      if (idFrontFileData.uri !== '' && idFrontUid !== null) {
        setPostDataOfImage('aadharOrVoterOrDLFront', idFrontUid);
        updatedPostData.kycDetails.aadharOrVoterOrDLFront = idFrontUid;
      }

      if (idBackFileData.uri !== '' && idBackUid !== null) {
        setPostDataOfImage('aadharOrVoterOrDlBack', idBackUid);
        updatedPostData.kycDetails.aadharOrVoterOrDlBack = idBackUid;
      }

      if (GstFileData.uri !== '' && gstUid !== null) {
        setPostDataOfImage('gstPic', gstUid);
        updatedPostData.gstPic = gstUid;
      }

      return Promise.resolve(updatedPostData);
    } catch (error) {
      console.error('Error in handleSendImage:', error);
      return Promise.reject('Error in handleSendImage.');
    }
  };

  const handleSubmit = async () => {
    showLoader(true);
    try {
      const currentDate = new Date();
      const dobDate = moment(postData?.dob, 'DD MMM YYYY').toDate();
      const minAllowedDate = new Date(currentDate);
      minAllowedDate.setFullYear(currentDate.getFullYear() - 18);

      if (dobDate < minAllowedDate) {
        handleSendImage()
          .then(updatedPostData => {
            updateProfile(updatedPostData)
              .then(response => response.data)
              .then(responseData => {
                setPopupVisible(true);
                setPopupContent(responseData?.message);
                if (responseData.code == 200) {
                  fetchAndSetData();
                }
                showLoader(false);
              })
              .catch(error => {
                setPopupContent('Error Updating Profile');
                setPopupVisible(true);
                showLoader(false);
              });
          })
          .catch(error => {
            console.error('Error in handleSubmit:', error);
          });
      } else {
        showLoader(false);
        setPopupContent('The age should be at least 18 years.');
        setPopupVisible(true);
      }
    } catch (error) {
      console.error('Error in handleSubmit:', error);
    }
  };

  const fetchAndSetData = async () => {
    getUser().then(response => {
      const user = response.data;
      if (user.userCode != '' && user.userCode != null) {
        AsyncStorage.setItem('USER', JSON.stringify(user));
      } else {
        console.error('Error getting details');
      }
    });
  };

  const handleChange = (label: string, value: string) => {
    if (label == 'isShopDifferent') {
      setIsShopAddressDifferent(value);
      if (value == 'Yes') {
        setPostData((prevData: VguardRishtaUser) => ({
          ...prevData,
          currLandmark: postData.landmark,
          currCity: postData.city,
          currDist: postData.dist,
          currState: postData.state,
          currPinCode: postData.pinCode,
          currStateId: postData.stateId,
          currCityId: postData.cityId,
          currDistId: postData.distId,
          currStreetAndLocality: postData.streetAndLocality,
          currentAddress: postData.permanentAddress,
        }));
      }
      if (value == 'No') {
        processPincode(postData.currPinCode.toString(), 'current');
      }
    } else if (label == 'enrolledOtherSchemeYesNo') {
      setEnrolledOtherSchemeYesNo(value);
      let enrolledOtherSchemeNum = 0;
      if (value == 'Yes') {
        enrolledOtherSchemeNum = 1;
      }
      if (value == 'No') {
        setPostData((prevData: VguardRishtaUser) => ({
          ...prevData,
          [label]: value,
          abtOtherSchemeLiked: '',
          otherSchemeBrand: '',
        }));
      }
      setPostData((prevData: VguardRishtaUser) => ({
        ...prevData,
        [label]: value,
        enrolledOtherScheme: enrolledOtherSchemeNum,
      }));
    } else if (label == 'maritalStatus') {
      setPostData((prevData: VguardRishtaUser) => ({
        ...prevData,
        [label]: value,
      }));
    } else if (label == 'gstYesNo') {
      setPostData((prevData: VguardRishtaUser) => ({
        ...prevData,
        [label]: value,
      }));
    }
  };

  const handleInputChange = async (value: string, label: string) => {
    setPostData((prevData: VguardRishtaUser) => {
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
      setPostData((prevData: VguardRishtaUser) => {
        return {
          ...prevData,
          [label]: value,
          genderPos: genderNum,
        };
      });
    }
    if (label == 'maritalStatus') {
      let maritalStatusNum = '';
      if (value == 'Married') {
        maritalStatusNum = '1';
      } else if (value == 'UnMarried') {
        maritalStatusNum = '2';
      }
      setPostData((prevData: VguardRishtaUser) => {
        return {
          ...prevData,
          [label]: value,
          maritalStatusId: maritalStatusNum,
        };
      });
    }
  };

  const genderpickerItems = [
    {label: 'Select Gender', value: ''},
    {label: 'Male', value: 'Male'},
    {label: 'Female', value: 'Female'},
    {label: 'Others', value: 'Others'},
  ];
  const selectYesorNo = [
    {label: 'Select Option', value: ''},
    {label: 'Yes', value: 'Yes'},
    {label: 'No', value: 'No'},
  ];
  const maritalStatusItems = [
    {label: 'Select Marital Status', value: ''},
    {label: 'Married', value: 'Married'},
    {label: 'UnMarried', value: 'UnMarried'},
  ];

  const [idFrontFileData, setIdFrontFileData] = useState({
    uri: '',
    name: '',
    type: '',
  });
  const [idBackFileData, setIdBackFileData] = useState({
    uri: '',
    name: '',
    type: '',
  });
  const [selfieFileData, setSelfieFileData] = useState({
    uri: '',
    name: '',
    type: '',
  });
  const [GstFileData, setGstFileData] = useState({
    uri: '',
    name: '',
    type: '',
  });

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

      if (label === 'Id Proof* (Front)') {
        setIdFrontFileData(fileData);
      } else if (label === 'Id Proof* (Back)') {
        setIdBackFileData(fileData);
      } else if (label === 'Selfie') {
        setSelfieFileData(fileData);
      } else if (label === 'GST Photo') {
        setGstFileData(fileData);
      }
    } catch (error) {
      console.error('Error handling image change in EditProfile:', error);
    }
  };

  const triggerApiWithImage = async (
    fileData: {uri: string; type: string; name: string},
    imageRelated: string,
  ) => {
    try {
      const formData = new FormData();
      formData.append('userRole', '2');
      formData.append('imageRelated', imageRelated);
      formData.append('file', {
        uri: fileData.uri,
        name: fileData.name,
        type: fileData.type,
      });

      const response = await sendFile(formData);
      return response.data.entityUid;
    } catch (error) {
      setPopupContent('Error uploading image');
      setPopupVisible(true);
      console.error('API Error:', error);
      throw error; // rethrow the error to propagate it further
    }
  };

  const setPostDataOfImage = (label: string, value: string) => {
    if (label == 'gstPic') {
      setPostData((prevData: VguardRishtaUser) => ({
        ...prevData,
        [label]: value,
      }));
    } else {
      setPostData((prevData: VguardRishtaUser) => ({
        ...prevData,
        kycDetails: {
          ...prevData.kycDetails,
          [label]: value,
        },
      }));
    }
  };
  const [isFieldAvailable, showField] = useState(false);
  const [isCurrFieldAvailable, showCurrField] = useState(false);
  const handleCitySelect = async (text: string, type: string) => {
    let selectedCategory: any;
    if (text == 'Other' && type == 'permanent') {
      showField(true);
    }
    if (text == 'Other' && type == 'current') {
      showCurrField(true);
    }

    if (type == 'permanent') {
      selectedCategory = cities.find(
        (category: {cityName: string}) => category.cityName === text,
      );
      setPostData((prevData: VguardRishtaUser) => ({
        ...prevData,
        city: text,
        cityId: selectedCategory?.id || null,
      }));
    } else if (type == 'current') {
      selectedCategory = currCities.find(
        (category: {cityName: string}) => category.cityName === text,
      );
      setPostData((prevData: VguardRishtaUser) => ({
        ...prevData,
        currCity: text,
        currCityId: selectedCategory?.id || null,
      }));
    }
  };

  const renderAdditionalFields = () => {
    const additionalFields = [];

    for (let i = 2; i <= additionalFieldsCount; i++) {
      if (i <= 5) {
        const brandKey = `otherSchemeBrand${i}`;
        const likedKey = `abtOtherSchemeLiked${i}`;

        additionalFields.push(
          <View key={i}>
            <InputField
              label={t('strings:if_yes_please_mention_scheme_and_brand_name')}
              value={postData?.[brandKey]}
              onChangeText={text => handleInputChange(text, brandKey)}
            />
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 5}}>
              <View style={{flex: 1}}>
                <InputField
                  label={t('strings:if_yes_what_you_liked_about_the_program')}
                  value={postData?.[likedKey]}
                  onChangeText={text => handleInputChange(text, likedKey)}
                />
              </View>
              {i < 5 && (
                <TouchableOpacity
                  onPress={() => setAdditionalFieldsCount(prev => prev + 1)}>
                  <Image
                    source={require('../../assets/images/ic_add_yellow.webp')}
                    style={{width: 30, height: 30, marginBottom: 15}}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>,
        );
      }
    }

    return additionalFields;
  };

  const [pincode_suggestions, setPincode_Suggestions] = React.useState([]);
  const [curr_pincode_suggestions, setCurr_Pincode_Suggestions] =
    React.useState([]);

  function updateDistrictState(pincode: string, type: string) {
    showLoader(true);
    getPincodeList(pincode)
      .then(data => {
        const pincodeid = data.data[0].pinCodeId;
        return getDetailsByPinCode(pincodeid);
      })
      .then(secondData => {
        secondData = secondData.data;
        showLoader(false);
        if (type == 'permanent') {
          setPostData((prevData: VguardRishtaUser) => ({
            ...prevData,
            dist: secondData.distName,
            distId: secondData.distId,
            state: secondData.stateName,
            stateId: secondData.stateId,
            cityId: secondData.cityId,
            city: secondData.cityName,
            pinCode: pincode,
          }));
        }
        if (type == 'current') {
          setPostData((prevData: VguardRishtaUser) => ({
            ...prevData,
            currDist: secondData.distName,
            currDistId: secondData.distId,
            currState: secondData.stateName,
            currStateId: secondData.stateId,
            currCityId: secondData.cityId,
            currCity: secondData.cityName,
            currPinCode: pincode,
          }));
        }
        showLoader(false);
        return getCities(secondData.distId);
      })
      .then(cityData => {
        cityData = cityData.data;
        const cityDataWithOther = [...cityData, {cityName: 'Other', id: ''}];
        if (type == 'permanent') {
          setCities(cityDataWithOther);
        }
        if (type == 'current') {
          setCurrCities(cityDataWithOther);
        }
        showLoader(false);
      })
      .catch(error => {
        console.error('Error in Page 1:', error);
      })
      .finally(() => {
        showLoader(false);
      });
  }

  function processPincode(pincode: string, type: string) {
    if (pincode.length <= 3) {
      return;
    }

    getPincodeList(pincode)
      .then(response => response.data)
      .then(suggestionData => {
        if (Array.isArray(suggestionData) && suggestionData.length > 0) {
          const filteredSuggestions = suggestionData.filter(
            item => item.pinCode !== null,
          );

          if (type === 'permanent') {
            setPincode_Suggestions(filteredSuggestions);
          }

          if (type === 'current') {
            setCurr_Pincode_Suggestions(filteredSuggestions);
          }

          if (pincode.length == 6) {
            updateDistrictState(pincode, type);
          }
        }
      })
      .catch(error => {
        console.error('Error fetching pincode list:', error);
      });

    const updatedField = type === 'permanent' ? 'pinCode' : 'currPinCode';
    setPostData((prevData: VguardRishtaUser) => ({
      ...prevData,
      [updatedField]: pincode,
    }));
  }

  return (
    <ScrollView style={styles.mainWrapper}>
      {loader && <Loader isLoading={loader} />}
      <View style={styles.flexBox}>
        <View style={styles.ImageProfile}>
          <ImageBackground
            source={require('../../assets/images/ic_v_guards_user.png')}
            style={{width: '100%', height: '100%', borderRadius: 100}}
            resizeMode="contain">
            <Image
              source={{uri: profileImage}}
              style={{width: '100%', height: '100%', borderRadius: 100}}
              resizeMode="contain"
            />
          </ImageBackground>
        </View>
        <View style={styles.profileText}>
          <Text style={styles.textDetail}>{userName}</Text>
          <Text style={styles.textDetail}>{userData?.userCode}</Text>
          <TouchableOpacity onPress={openEVisitingCard}>
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
          value={postData?.name}
          onChangeText={text => handleInputChange(text, 'name')}
        />
        <InputField
          label={t('strings:contact_number')}
          value={userData?.contactNo}
          disabled={true}
        />
        <InputField
          label={t('strings:store_firm_name')}
          value={postData?.firmName}
          onChangeText={text => handleInputChange(text, 'firmName')}
        />
        <PickerField
          label={t('strings:lbl_gender_mandatory')}
          disabled={false} // Optional
          selectedValue={postData?.gender}
          onValueChange={text => handleInputChange(text, 'gender')}
          items={genderpickerItems}
        />
        <DatePickerField
          label={t('strings:lbl_date_of_birth_mandatory')}
          date={postData?.dob}
          onDateChange={date => handleInputChange(date, 'dob')}
        />
        <InputField
          label={t('strings:email')}
          value={postData?.emailId}
          onChangeText={text => handleInputChange(text, 'emailId')}
        />
        <Text style={styles.subHeading}>{t('strings:permanent_address')}</Text>
        <InputField
          label={t('strings:lbl_permanent_address_mandatory')}
          value={postData?.permanentAddress}
          onChangeText={text => handleInputChange(text, 'permanentAddress')}
        />
        <InputField
          label={t('strings:lbl_street_locality')}
          value={postData?.streetAndLocality}
          onChangeText={text => handleInputChange(text, 'streetAndLocality')}
        />
        <InputField
          label={t('strings:lbl_landmark')}
          value={postData?.landmark}
          onChangeText={text => handleInputChange(text, 'landmark')}
        />
        <Text
          style={{color: colors.black, fontWeight: 'bold', marginBottom: 2}}>
          {'Pincode'}
        </Text>
        <DropDownPicker
          mode="BADGE"
          showBadgeDot={true}
          searchable={true}
          searchPlaceholder="Search Your Pincode"
          loading={loader}
          placeholder={
            postData?.pinCode === null
              ? 'Search Pincode'
              : `${postData?.pinCode || ''}`
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
            label: item.pinCode,
            value: item.pinCode,
          }))}
          setOpen={() => setUIswitch({pincode: !uiSwitch.pincode})}
          value={postData?.pinCode}
          onSelectItem={item => {
            processPincode(`${item.value}`, 'permanent');
          }}
          onChangeSearchText={text => processPincode(text, 'permanent')}
          dropDownContainerStyle={{
            height: height / 5,
            borderWidth: 2,
            borderColor: colors.grey,
            elevation: 0,
            backgroundColor: 'white',
          }}
          style={{
            backgroundColor: 'white',
            elevation: 0,
            opacity: 0.9,
            borderWidth: 2,
            height: height / 15,
            borderColor: colors.grey,
            marginBottom: 20,
            borderRadius: 5,
          }}
        />

        <InputField
          label={t('strings:lbl_state')}
          value={postData?.state}
          disabled={true}
        />
        <InputField
          label={t('strings:district')}
          value={postData?.dist}
          disabled={true}
        />

        {/* <PickerField
          label={t('strings:lbl_state')}
          disabled={false}
          selectedValue={postData?.state}
          onValueChange={(text: string) => handleStateSelect(text, 'permanent')}
          items={states?.map(state => ({ label: state.stateName, value: state.stateName }))}
        />
        <PickerField
          label={t('strings:district')}
          disabled={false}
          selectedValue={postData?.dist}
          onValueChange={(text: string) => handleDistrictSelect(text, 'permanent')}
          items={districts?.map(district => ({ label: district.districtName, value: district.districtName }))}
        /> */}
        <PickerField
          label={t('strings:city')}
          disabled={false}
          selectedValue={postData?.city}
          onValueChange={(text: string) => handleCitySelect(text, 'permanent')}
          items={cities?.map(city => ({
            label: city.cityName,
            value: city.cityName,
          }))}
        />
        {isFieldAvailable ? (
          <InputField
            label={t('strings:city')}
            value={postData?.otherCity}
            onChangeText={text => handleInputChange(text, 'otherCity')}
          />
        ) : null}

        <PickerField
          label={t('strings:is_shop_address_different')}
          selectedValue={isShopAddressDifferent}
          onValueChange={(text: string) =>
            handleChange('isShopDifferent', text)
          }
          items={selectYesorNo}
        />
        {isShopAddressDifferent == 'No' ? (
          <>
            <Text style={styles.subHeading}>
              {t('strings:current_address')}
            </Text>

            <InputField
              label={t('strings:lbl_current_address_mandatory')}
              value={postData?.currentAddress}
              onChangeText={text => handleInputChange(text, 'currentAddress')}
            />
            <InputField
              label={t('strings:lbl_street_locality')}
              value={postData?.currStreetAndLocality}
              onChangeText={text =>
                handleInputChange(text, 'currStreetAndLocality')
              }
            />
            <InputField
              label={t('strings:lbl_landmark')}
              value={postData?.currLandmark}
              onChangeText={text => handleInputChange(text, 'currLandmark')}
            />
            <Text
              style={{
                color: colors.black,
                fontWeight: 'bold',
                marginBottom: 2,
              }}>
              {'Pincode'}
            </Text>
            <DropDownPicker
              mode="BADGE"
              showBadgeDot={true}
              searchable={true}
              searchPlaceholder="Search Your Pincode"
              loading={loader}
              placeholder={
                postData?.currPinCode === null
                  ? 'Search Pincode'
                  : `${postData?.currPinCode || ''}`
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
              open={uiSwitch.currentpincode}
              items={curr_pincode_suggestions.map(item => ({
                label: item.pinCode,
                value: item.pinCode,
              }))}
              setOpen={() =>
                setUIswitch({currentpincode: !uiSwitch.currentpincode})
              }
              value={postData?.currPinCode}
              onSelectItem={item => {
                processPincode(`${item.value}`, 'current');
              }}
              onChangeSearchText={text => processPincode(text, 'current')}
              dropDownContainerStyle={{
                height: height / 5,
                borderWidth: 2,
                borderColor: colors.grey,
                elevation: 0,
                backgroundColor: 'white',
              }}
              style={{
                backgroundColor: 'white',
                elevation: 0,
                opacity: 0.9,
                borderWidth: 2,
                height: height / 15,
                borderColor: colors.grey,
                marginBottom: 20,
                borderRadius: 5,
              }}
            />
            <InputField
              label={t('strings:lbl_state')}
              value={postData?.currState}
              disabled={true}
            />
            <InputField
              label={t('strings:district')}
              value={postData?.currDist}
              disabled={true}
            />
            <PickerField
              label={t('strings:city')}
              disabled={false}
              selectedValue={postData?.currCity}
              onValueChange={(text: string) =>
                handleCitySelect(text, 'current')
              }
              items={currCities?.map(city => ({
                label: city.cityName,
                value: city.cityName,
              }))}
            />
            {isCurrFieldAvailable ? (
              <InputField
                label={t('strings:city')}
                value={postData?.otherCurrCity}
                onChangeText={text => handleInputChange(text, 'otherCurrCity')}
              />
            ) : null}
          </>
        ) : null}
        
       
        <ImagePickerField
          label="Selfie"
          onImageChange={handleImageChange}
          imageRelated={Constants.Profile}
          initialImage={userData?.kycDetails?.selfie}
          getImageRelated={Constants.Profile}
          editable={false}
        />
       
        <View style={styles.button}>
          <Buttons
            label={t('strings:submit')}
            variant="filled"
            onPress={() => handleSubmit()}
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
