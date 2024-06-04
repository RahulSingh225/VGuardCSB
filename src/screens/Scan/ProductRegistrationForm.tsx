/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  ToastAndroid,
} from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
} from 'react-native-responsive-dimensions';
import {useTranslation} from 'react-i18next';
import {Picker} from '@react-native-picker/picker';

import Snackbar from 'react-native-snackbar';

import AsyncStorage from '@react-native-async-storage/async-storage';
import arrowIcon from '../../assets/images/arrow.png';
import DropDownPicker from 'react-native-dropdown-picker';
import Buttons from '../../components/Buttons';
import Loader from '../../components/Loader';
import Popup from '../../components/Popup';
import {
  getPincodeList,
  getDetailsByPinCode,
  validateMobile,
  getCustDetByMobile,
} from '../../utils/apiservice';
import {height} from '../../utils/dimensions';
import {CustomerData, VguardUser} from '../../types';
import {Colors} from '../../utils/constants';
import getLocation from '../../utils/geolocation';
import {AppContext} from '../../services/ContextService';
import {useFocusEffect} from '@react-navigation/native';
import {getItem} from '../../services/StorageService';

var location: {};
const ProductRegistrationForm: React.FC<{navigation: any}> = ({navigation}) => {
  const {t} = useTranslation();
  const [contactNo, setContactNo] = useState('');
  const [addedBy, setAddedBy] = useState('');
  const [user, setUser] = useState(null);
  const [popupContent, setPopupContent] = useState('');
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [customerFormData, setCustomerFormData] = useState({
    name: '',
    email: '',
    altContactNo: '',
    landmark: '',
    pincode: '',
    state: '',
    district: '',
    city: '',
    address: '',
    category: '1',
    dealerName: '',
    dealerAddress: '',
    dealerPincode: '',
    dealerState: '',
    dealerDistrict: '',
    dealerCity: '',
    dealerContactNo: '',
  });
  const [pincode_suggestions, setPincode_Suggestions] = React.useState([]);
  const [uiSwitch, setUIswitch] = React.useState({
    pincode: false,
  });
  const context = useContext(AppContext);
  const [loader, showLoader] = React.useState(false);

  useFocusEffect(
    React.useCallback(() => {
      getItem('CUSTOMER_DETAILS').then(r => {
        console.log(r)
        if (r!=null) {console.log('succcess')
          setContactNo(r.contactNo)
          setCustomerFormData(prevData => ({
            ...prevData,
            
            name: r.name || '',
            email: r.email || '',
            altContactNo: r.alternateNo || '',
            landmark: r.landmark || '',
            pincode: r.pinCode || '',
            state: r.state || '',
            district: r.district || '',
            city: r.city || '',
            address: r.currAdd || '',
          }));
        }
      });
    }, []),
  );

  async function processPincode(pincode: string) {
    if (pincode.length > 3) {
      let suggestionData = await getPincodeList(pincode);
      suggestionData = suggestionData.data;

      if (Array.isArray(suggestionData) && suggestionData.length > 0) {
        const filteredSuggestions = suggestionData.filter(
          item => item.pinCode !== null,
        );
        setPincode_Suggestions(filteredSuggestions);
        if (pincode.length == 6) {
          updateDistrictState(pincode);
        }
      }
    }
    setCustomerFormData(prevData => ({...prevData, pincode: pincode}));
  }
  function updateDistrictState(pincode: string) {
    showLoader(true);

    getPincodeList(pincode)
      .then(data => {
        const pincodeid = data.data[0].pinCodeId;
        return getDetailsByPinCode(pincodeid);
      })
      .then(secondData => {
        secondData = secondData.data;

        setCustomerFormData(prevData => ({
          ...prevData,
          district: secondData?.distName,
          state: secondData?.stateName,
          city: secondData?.cityName,
          pinCode: pincode,
        }));

        showLoader(false);
      })

      .catch(error => {
        console.error('Error in Page 1:', error);
      })
      .finally(() => {
        showLoader(false);
      });
  }

  const handleProceed = async () => {
    try {
      if (customerFormData.email == '') {
        setPopupContent(
          'Please enter the customer email id to process the digital warranty',
        );
        setPopupVisible(true);
        return;
      }else {
        showLoader(true);
        const postData: CustomerData = {
          contactNo: contactNo,
          name: customerFormData.name,
          email: customerFormData.email,
          alternateNo: customerFormData.altContactNo,
          city: customerFormData.city,
          district: customerFormData.district,
          state: customerFormData.state,
          pinCode: customerFormData.pincode,
          landmark: customerFormData.landmark,
          dealerCategory: customerFormData.category,
          currAdd: customerFormData.address,
          dealerName: customerFormData.dealerName,
          dealerAdd: customerFormData.dealerAddress,
          dealerPinCode: customerFormData.dealerPincode,
          dealerState: customerFormData.dealerState,
          dealerDist: customerFormData.dealerDistrict,
          dealerCity: customerFormData.dealerCity,
          addedBy: addedBy,
          dealerNumber: customerFormData.dealerContactNo,
          transactId: '',
          billDetails: '',
          warrantyPhoto: '',
          sellingPrice: '',
          emptStr: '',
          cresp: {
            custIdForProdInstall: '',
            modelForProdInstall: '',
            errorCode: '',
            errorMsg: '',
            statusType: '',
            balance: '',
            currentPoints: '',
            couponPoints: '',
            promotionPoints: '',
            transactId: '',
            schemePoints: '',
            basePoints: '',
            clubPoints: '',
            scanDate: '',
            scanStatus: '',
            couponCode: '',
            bitEligibleScratchCard: '',
            pardId: '',
            partNumber: '',
            partName: '',
            skuDetail: '',
            purchaseDate: '',
            categoryId: '',
            category: '',
            anomaly: '',
            warranty: '',
          },
          selectedProd: {
            specs: '',
            pointsFormat: '',
            product: '',
            productName: '',
            productCategory: '',
            productCode: '',
            points: '',
            imageUrl: '',
            userId: '',
            productId: '',
            paytmMobileNo: '',
          },
          latitude: location?.latitude,
          longitude: location?.longitude,
          geolocation: '',
        };

        console.log(customerFormData.category);

        AsyncStorage.setItem('CUSTOMER_DETAILS', JSON.stringify(postData)).then(
          r => {
            navigation.navigate('Add Warranty');
          },
        );

        showLoader(false);
      }
    } catch (error) {
      showLoader(false);
      setPopupContent('Something went wrong!');
      setPopupVisible(true);
      console.error('Error sending customer details', error);
    }
  };

  async function ValidateContact(){
    showLoader(true)
    try{
    const result = await validateMobile(contactNo)
      handleProceed()
    }catch(err){
      showLoader(false);
      console.log(err);
      setPopupContent('Please use valid customer mobile number')
      setPopupVisible(true)
    }

  }

  
  const getDetails = async () => {
    showLoader(true);
    try {
      if (contactNo.length !== 10) {
        Snackbar.show({
          text: 'Contact number must be 10 digits',
          duration: Snackbar.LENGTH_SHORT,
        });
        return;
      }

      const response = await getCustDetByMobile(contactNo);

      const result = await response.data;

      showLoader(false);

      if (result.name) {
        const customerDetails = result;

        setCustomerFormData(prevData => ({
          ...prevData,
          name: customerDetails.name || '',
          email: customerDetails.email || '',
          altContactNo: customerDetails.alternateNo || '',
          landmark: customerDetails.landmark || '',
          pincode: customerDetails.pinCode || '',
          state: customerDetails.state || '',
          district: customerDetails.district || '',
          city: customerDetails.city || '',
          address: customerDetails.currAdd || '',
        }));
      } else {
        ToastAndroid.show(
          t('strings:cust_detail_not_found'),
          ToastAndroid.SHORT,
        );
      }

      return result;
    } catch (error) {
      showLoader(false);
      setPopupVisible(true);
      setPopupContent('Something went wrong!');
      console.error('Error Fetching Customer Details:', error);
    }
  };

  useEffect(() => {
    getLocation().then(r => (location = r));

    const user: VguardUser = context.getUserDetails();

    setAddedBy(user.user_id);
    setCustomerFormData({
      ...customerFormData,
      dealerName: user.name,
      dealerAddress: user.currentaddress1,
      dealerCity: user.city,
      dealerContactNo: user.contact,
      dealerDistrict: user.district,
      dealerPincode: user.pincode.toString(),
      dealerState: user.state,
    });
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Loader isLoading={loader} />
      <View style={styles.mainWrapper}>
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder={t('strings:contact_number')}
              value={contactNo}
              placeholderTextColor={Colors.grey}
              onChangeText={value => setContactNo(value)}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.buttonGetDetails}>
            <Buttons
              label={t('strings:get_details')}
              variant="filled"
              onPress={() => getDetails()}
              width="100%"
              iconHeight={10}
              iconWidth={30}
              iconGap={30}
              icon={arrowIcon}
            />
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder={t('strings:lbl_name_mandatory')}
              placeholderTextColor={Colors.grey}
              value={customerFormData.name}
              onChangeText={value =>
                setCustomerFormData(prevData => ({...prevData, name: value}))
              }
            />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder={t('strings:email')}
              value={customerFormData.email}
              placeholderTextColor={Colors.grey}
              onChangeText={value =>
                setCustomerFormData(prevData => ({...prevData, email: value}))
              }
            />
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder={t('strings:alternate_contact_number')}
              value={customerFormData.altContactNo}
              placeholderTextColor={Colors.grey}
              onChangeText={value =>
                setCustomerFormData(prevData => ({
                  ...prevData,
                  altContactNo: value,
                }))
              }
            />
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder={t('strings:lbl_landmark')}
              value={customerFormData.landmark}
              placeholderTextColor={Colors.grey}
              onChangeText={value =>
                setCustomerFormData(prevData => ({
                  ...prevData,
                  landmark: value,
                }))
              }
            />
          </View>

          <DropDownPicker
            mode="BADGE"
            showBadgeDot={true}
            searchable={true}
            loading={loader}
            placeholder={
              customerFormData?.pincode == ''
                ? 'Search Pincode'
                : `${customerFormData?.pincode}`
            }
            searchPlaceholder="Search Pincode"
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
            value={customerFormData?.pincode}
            onSelectItem={item => {
              processPincode(`${item.value}`);
            }}
            onChangeSearchText={text => processPincode(text)}
            dropDownContainerStyle={{
              height: height / 5,
              borderWidth: 2,
              borderColor: Colors.grey,
              elevation: 1,
              zIndex: 1000,
              backgroundColor: 'white',
            }}
            style={styles.inputContainer}
          />

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder={t('strings:lbl_state')}
              value={customerFormData.state}
              placeholderTextColor={Colors.grey}
              onChangeText={value =>
                setCustomerFormData(prevData => ({...prevData, state: value}))
              }
            />
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder={t('strings:district')}
              value={customerFormData.district}
              placeholderTextColor={Colors.grey}
              onChangeText={value =>
                setCustomerFormData(prevData => ({
                  ...prevData,
                  district: value,
                }))
              }
            />
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder={t('strings:lbl_city_mandatory')}
              value={customerFormData.city}
              placeholderTextColor={Colors.grey}
              onChangeText={value =>
                setCustomerFormData(prevData => ({...prevData, city: value}))
              }
            />
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder={t('strings:address_non_mandatory')}
              value={customerFormData.address}
              placeholderTextColor={Colors.grey}
              onChangeText={value =>
                setCustomerFormData(prevData => ({...prevData, address: value}))
              }
            />
          </View>
          
          <View style={styles.inputContainer}>
            <TextInput
              editable={false}
              style={styles.input}
              placeholder={t('strings:dealer_name')}
              value={customerFormData.dealerName}
              placeholderTextColor={Colors.grey}
              onChangeText={value =>
                setCustomerFormData(prevData => ({
                  ...prevData,
                  dealerName: value,
                }))
              }
            />
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              editable={false}
              style={styles.input}
              placeholder={t('strings:dealer_address')}
              value={customerFormData.dealerAddress}
              placeholderTextColor={Colors.grey}
              onChangeText={value =>
                setCustomerFormData(prevData => ({
                  ...prevData,
                  
                  dealerAddress: value,
                }))
              }
            />
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              editable={false}
              style={styles.input}
              placeholder={t('strings:dealer_pincode')}
              value={customerFormData.dealerPincode}
              placeholderTextColor={Colors.grey}
              onChangeText={value =>
                setCustomerFormData(prevData => ({
                  ...prevData,
                  dealerPincode: value,
                }))
              }
            />
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              editable={false}
              style={styles.input}
              placeholder={t('strings:dealer_state')}
              value={customerFormData.dealerState}
              placeholderTextColor={Colors.grey}
              onChangeText={value =>
                setCustomerFormData(prevData => ({
                  ...prevData,
                  dealerState: value,
                }))
              }
            />
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              editable={false}
              style={styles.input}
              placeholder={t('strings:dealer_district')}
              value={customerFormData.dealerDistrict}
              placeholderTextColor={Colors.grey}
              onChangeText={value =>
                setCustomerFormData(prevData => ({
                  ...prevData,
                  dealerDistrict: value,
                }))
              }
            />
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              editable={false}
              style={styles.input}
              placeholder={t('strings:dealer_city')}
              value={customerFormData.dealerCity}
              placeholderTextColor={Colors.grey}
              onChangeText={value =>
                setCustomerFormData(prevData => ({
                  ...prevData,
                  dealerCity: value,
                }))
              }
            />
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              editable={false}
              style={styles.input}
              placeholder={t('strings:dealer_contact_no')}
              value={customerFormData.dealerContactNo}
              placeholderTextColor={Colors.grey}
              onChangeText={value =>
                setCustomerFormData(prevData => ({
                  ...prevData,
                  dealerContactNo: value,
                }))
              }
            />
          </View>
        </View>
        <View style={styles.button}>
          <Buttons
            label={t('strings:submit')}
            variant="filled"
            onPress={() => ValidateContact()}
            width="100%"
            iconHeight={10}
            iconWidth={30}
            iconGap={30}
            icon={arrowIcon}
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
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: Colors.white,
  },
  mainWrapper: {
    padding: 15,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  inputImage: {
    height: responsiveHeight(2),
    width: responsiveHeight(2),
    marginRight: 5,
  },
  textHeader: {
    fontSize: responsiveFontSize(2.5),
    color: Colors.black,
    fontWeight: 'bold',
  },
  textSubHeader: {
    fontSize: responsiveFontSize(1.8),
    color: Colors.black,
    fontWeight: 'bold',
  },
  container: {
    height: responsiveHeight(8),
  },
  selectedImage: {
    width: 200,
    height: 200,
    marginVertical: 20,
  },
  buttonText: {
    color: Colors.white,
    width: '100%',
    textAlign: 'center',
  },
  inputContainer: {
    borderColor: Colors.lightGrey,
    borderWidth: 2,
    borderRadius: 10,
    height: responsiveHeight(5),
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: responsiveHeight(1),
  },
  input: {
    width: '90%',
    padding: 10,
    fontSize: responsiveFontSize(1.8),
    color: Colors.black,
    // fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    gap: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  button: {
    marginTop: 20,
    alignItems: 'center',
  },
  buttonGetDetails: {
    alignItems: 'center',
  },
  picker: {
    width: '100%',
    color: Colors.grey,
  },
  labelPicker: {
    color: Colors.grey,
    fontWeight: 'bold',
  },
  modalcontainer: {alignSelf: 'center', backgroundColor: 'rgba(0,0,0,0.7)'},
});

export default ProductRegistrationForm;
