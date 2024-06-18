import {
  View,
  Text,
  Image,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Button,
  TextInput,
  ToastAndroid,
} from 'react-native';
import React, {useState, useEffect, useTransition} from 'react';

import {responsiveFontSize} from 'react-native-responsive-dimensions';
import {useTranslation} from 'react-i18next';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

import Buttons from '../../components/Buttons';
import Loader from '../../components/Loader';
import Popup from '../../components/Popup';
import RewardBox from '../../components/ScratchCard';
import {sendFile, sendCustomerData} from '../../utils/apiservice';
import Constants, {Colors} from '../../utils/constants';
import {height} from '../../utils/dimensions';
import {CustomerData} from '../../types';
import getLocation from '../../utils/geolocation';
import arrowIcon from '../../assets/images/arrow.png';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {removeItem} from '../../services/StorageService';

const AddWarranty = ({navigation}) => {
  const {t} = useTranslation();
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [qrcode, setQrcode] = useState('');
  const [skuDetails, setSkuDetails] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [showImagePickerModal, setShowImagePickerModal] = useState(false);
  const [loader, showLoader] = useState(false);
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
      buttonText: '',
      buttonAction: () => {},
      fontWeight: '400',
    },
    textInput: false,
  });
  const [popupContent, setPopupContent] = useState('');

  const [scratchCard, setScratchCard] = useState(false);
  const [scratchable, setScratchable] = useState(false);
  const [sellingPrice, setSellingPrice] = useState(null);
  const [selectedBillImage, setSelectedBillImage] = useState(null);
  const [selectedBillImageName, setSelectedBillImageName] = useState('');
  const [selectedWarrantyImage, setSelectedWarrantyImage] = useState(null);
  const [selectedWarrantyImageName, setSelectedWarrantyImageName] =
    useState('');
  const [couponResponse, setCouponResponse] = useState(null);
  const [customerDetails, setCustomerDetails] = useState<CustomerData>();
  const [imageType, setImageType] = useState('');

  useEffect(() => {
    const initializeData = async () => {
      try {
        const today = new Date();
        const formattedDate = today.toLocaleDateString('en-US');
        setPurchaseDate(formattedDate);

        const couponResponse = await AsyncStorage.getItem('COUPON_RESPONSE');
        if (couponResponse) {
          const parsedCouponResponse = JSON.parse(couponResponse);
          console.log(parsedCouponResponse);
          setCouponResponse(parsedCouponResponse);
          setQrcode(parsedCouponResponse.couponCode);
          setSkuDetails(parsedCouponResponse.skuDetail);
        }

        const customerDetails = await AsyncStorage.getItem('CUSTOMER_DETAILS');
        if (customerDetails) {
          setCustomerDetails(JSON.parse(customerDetails));
        }

        getUserLocation();
      } catch (error) {
        console.error('Error initializing data:', error);
      }
    };

    initializeData();
  }, []);

  const getUserLocation = () => {
    getLocation()
      .then(position => {
        if (position != null) {
          setLatitude(position.latitude.toString());
          setLongitude(position.longitude.toString());
          showLoader(false);
        } else {
        }
      })
      .catch(error => {
        console.error('Error getting location:', error);
      });
  };

  const handleImagePickerPress = (type: React.SetStateAction<string>) => {
    setImageType(type);
    setShowImagePickerModal(true);
  };

  const handleCameraUpload = () => {
    setShowImagePickerModal(false);
    launchCamera(
      {
        mediaType: 'photo',
        includeBase64: false,
      },
      response => {
        if (response.didCancel) {
          console.error('Camera was canceled');
        } else if (response.error) {
          console.error('Camera error: ', response.error);
        } else {
          const fileData = {
            uri: response.assets[0].uri,
            type: response.assets[0].type,
            name: response.assets[0].fileName,
          };
          if (imageType == 'bill') {
            setSelectedBillImage(response.assets[0]);
            setSelectedBillImageName(response.assets[0].fileName);
          } else if (imageType == 'warranty') {
            setSelectedWarrantyImage(response.assets[0]);
            setSelectedWarrantyImageName(response.assets[0].fileName);
          }
          //triggerApiWithImage(fileData);
        }
      },
    );
  };
  const handleGalleryUpload = () => {
    setShowImagePickerModal(false);
    launchImageLibrary(
      {
        mediaType: 'photo',
        includeBase64: false,
      },
      response => {
        if (response.didCancel) {
          console.error('Image picker was canceled');
        } else if (response.error) {
          console.error('Image picker error: ', response.error);
        } else {
          const fileData = {
            uri: response.assets[0].uri,
            type: response.assets[0].type,
            name: response.assets[0].fileName,
          };
          if (imageType == 'bill') {
            setSelectedBillImage(response.assets[0]);
            setSelectedBillImageName(response.assets[0].fileName);
          } else if (imageType == 'warranty') {
            setSelectedWarrantyImage(response.assets[0]);
            setSelectedWarrantyImageName(response.assets[0].fileName);
          }
          //triggerApiWithImage(fileData);
        }
      },
    );
  };
  const triggerApiWithImage = async (
    fileData: {uri: any; type: any; fileName: any} | null,
    documentType: string,
  ) => {
    const formData = new FormData();
    formData.append('userRole', 2);

    formData.append('file', {
      uri: fileData.uri,
      type: fileData.type,
      name: fileData.fileName,
    });

    if (documentType == 'bill') {
      formData.append('imageRelated', Constants.Bill);
    } else if (documentType == 'warranty') {
      formData.append('imageRelated', Constants.Warranty);
    }

    try {
      const response = await sendFile(formData);
      if (imageType == 'bill') {
        setSelectedBillImageName(response.data.entityUid);
        return response.data.entityUid;
      }
      if (imageType == 'warranty') {
        setSelectedWarrantyImageName(response.data.entityUid);
        return response.data.entityUid;
      }
    } catch (error) {
      console.error('API Error:', error);
    }
  };

  async function saveData() {
    try {


      if (!customerDetails?.contactNo  ) {

        ToastAndroid.show(
          t('strings:enter_mandatory_fields'),
          ToastAndroid.SHORT,
        );
        showLoader(false)
        return;
      }
      if (
        selectedBillImage == null &&
        couponResponse?.anomaly == 1 &&
        customerDetails.dealerCategory != 'Sub-Dealer'
      ) {
        ToastAndroid.show(
          t('strings:enter_mandatory_fields'),
          ToastAndroid.SHORT,
        );
        showLoader(false)
        return;
      }
      showLoader(true);

      let bill, warranty;
      if (selectedBillImage) {
        bill = await triggerApiWithImage(selectedBillImage, 'bill');
      }

      if (selectedWarrantyImage) {
        warranty = await triggerApiWithImage(selectedWarrantyImage, 'warranty');
      }
      const postData = {
        contactNo: customerDetails.contactNo,
        name: customerDetails.name,
        email: customerDetails.email,
        alternateNo: customerDetails.alternateNo,
        city: customerDetails.city,
        district: customerDetails.district,
        state: customerDetails.state,
        pinCode: customerDetails.pinCode,
        landmark: customerDetails.landmark,
        dealerCategory: customerDetails.dealerCategory,
        currAdd: customerDetails.currAdd,
        dealerName: customerDetails.dealerName,
        dealerAdd: customerDetails.dealerAdd,
        dealerPinCode: customerDetails.dealerPinCode,
        dealerState: customerDetails.dealerState,
        dealerDist: customerDetails.dealerDist,
        dealerCity: customerDetails.dealerCity,
        addedBy: customerDetails.addedBy,
        dealerNumber: customerDetails.dealerNumber,
        transactId: '',
        billDetails: bill?.entityUid || null,
        warrantyPhoto: warranty?.entityUid || null,
        sellingPrice: sellingPrice,
        emptStr: '',
        cresp: {
          custIdForProdInstall: '',
          modelForProdInstall: '',
          errorCode: couponResponse?.errorCode,
          errorMsg: couponResponse?.errorMsg,
          statusType: '',
          balance: '',
          currentPoints: '',
          couponPoints: couponResponse?.couponPoints,
          promotionPoints: '',
          transactId: '',
          schemePoints: '',
          basePoints: couponResponse?.basePoints,
          clubPoints: '',
          scanDate: new Date(),
          scanStatus: '',
          couponCode: qrcode,
          bitEligibleScratchCard: '',
          pardId: couponResponse?.partId,
          partNumber: couponResponse?.partNumber,
          partName: couponResponse?.partName,
          skuDetail: couponResponse?.skuDetail,
          purchaseDate: couponResponse?.purchaseDate,
          categoryId: couponResponse?.categoryId,
          category: couponResponse?.category,
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
        latitude: latitude,
        longitude: longitude,
        geolocation: '',
      };
      console.log('SSSS')
      console.log(postData)
      const response = await sendCustomerData(postData);
      showLoader(false);
      console.log(response);
      const result = await response.data;

      if (result.errorCode == 1) {
        var couponPoints = result.couponPoints;
        var basePoints = result.basePoints;
        // var couponPoints = "100";
        // var basePoints = "200";
        basePoints ? (basePoints = `Base Points: ${basePoints}`) : null;
        setScratchCardProps({
          rewardImage: {
            width: 100,
            height: 100,
            resourceLocation: require('../../assets/images/ic_rewards_gift.png'),
          },
          rewardResultText: {
            color: Colors.black,
            fontSize: 16,
            textContent: 'YOU WON',
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
          
          button: {
            buttonColor: Colors.yellow,
            buttonTextColor: Colors.black,
            buttonText: 'Scan Again for same Customer',
            buttonAction: () =>
              navigation.reset({index: 0, routes: [{name: 'Scan Code'}]}),
            fontWeight: '400',
          },
          textInput: false,
        });
        setScratchCard(true);
      } else {
        console.log(result);
        setPopupVisible(true);
        setPopupContent(result.errorMe);
      }
    } catch (error) {
      console.log(error);
      showLoader(false);
      setPopupVisible(true);
      setPopupContent(t('strings:something_wrong'));
    }
  }
  return (
    <ScrollView style={styles.mainWrapper}>
      {loader && <Loader isLoading={loader} />}
      <Text style={styles.heading}>Register Product</Text>
      {scratchCard && (
        <RewardBox
          scratchCardProps={scratchCardProps}
          visible={scratchCard}
          scratchable={scratchable}
          onClose={() => {
            removeItem('CUSTOMER_DETAILS').then(r => {
              navigation.reset({index: 0, routes: [{name: 'Home'}]});
            });
          }}
        />
      )}
      {isPopupVisible && (
        <Popup
          isVisible={isPopupVisible}
          onClose={() => setPopupVisible(false)}>
          {popupContent}
        </Popup>
      )}
      <View style={styles.form}>
        <View style={styles.inputRow}>
          <Text style={styles.label}>{t('strings:qr_code')}</Text>
          <View style={styles.inputArea}>
            <TextInput editable={false} value={qrcode} style={styles.input} />
          </View>
        </View>
        <View style={styles.inputRow}>
          <Text style={styles.label}>{t('strings:squ_details')}</Text>
          <View style={styles.inputArea}>
            <TextInput
              editable={false}
              value={skuDetails}
              style={styles.input}
            />
          </View>
        </View>
        <View style={styles.inputRow}>
          <Text style={styles.label}>{t('strings:bill_details')}</Text>
          <TouchableOpacity
            style={styles.inputArea}
            onPress={() => handleImagePickerPress('bill')}>
            {selectedBillImage ? (
              <TextInput
                style={styles.input}
                placeholder={selectedBillImageName}
                placeholderTextColor={Colors.grey}
                editable={false}
              />
            ) : (
              <TextInput
                style={styles.input}
                placeholder={t('strings:capture_bill_details')}
                placeholderTextColor={Colors.grey}
                editable={false}
              />
            )}
            <View style={styles.inputImage}>
              {selectedBillImage ? (
                <Image
                  source={{uri: selectedBillImage.uri}}
                  style={{width: 30, height: 30}}
                  resizeMode="cover"
                />
              ) : (
                <Image
                  source={require('../../assets/images/ic_attatchment_pin.png')}
                  style={{width: 20, height: 20}}
                  resizeMode="contain"
                />
              )}
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.inputRow}>
          <Text style={styles.label}>
            {t('strings:warranty_photo_mandatory')}
          </Text>
          <TouchableOpacity
            style={styles.inputArea}
            onPress={() => handleImagePickerPress('warranty')}>
            {selectedWarrantyImage ? (
              <TextInput
                style={styles.input}
                placeholder={selectedWarrantyImageName}
                placeholderTextColor={Colors.grey}
                editable={false}
              />
            ) : (
              <TextInput
                style={styles.input}
                placeholder={t('strings:capture_warranty_details')}
                placeholderTextColor={Colors.grey}
                editable={false}
              />
            )}
            <View style={styles.inputImage}>
              {selectedWarrantyImage ? (
                <Image
                  source={{uri: selectedWarrantyImage.uri}}
                  style={{width: 30, height: 30}}
                  resizeMode="cover"
                />
              ) : (
                <Image
                  source={require('../../assets/images/ic_attatchment_pin.png')}
                  style={{width: 20, height: 20}}
                  resizeMode="contain"
                />
              )}
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.inputRow}>
          <Text style={styles.label}>{t('strings:selling_price')}</Text>
          <View style={styles.inputArea}>
            <TextInput
              editable
              onChangeText={text => setSellingPrice(text)}
              value={sellingPrice}
              keyboardType='decimal-pad'
              style={styles.input}
              placeholder={t('strings:enter_selling_price')}
              placeholderTextColor={Colors.grey}
            />
          </View>
        </View>
        <View style={styles.inputRow}>
          <Text style={styles.label}>
            {t('strings:purchase_date_mandatory')}
          </Text>
          <View style={styles.inputArea}>
            <TextInput
              editable={false}
              value={purchaseDate}
              style={styles.input}
            />
            <Image
              style={{width: 20, height: 20}}
              source={require('../../assets/images/calendar.png')}
              resizeMode="contain"
            />
          </View>
        </View>
        <View style={styles.inputRow}>
          <Buttons
            style={styles.button}
            label={t('strings:add_customer_details')}
            variant="filled"
            onPress={() => saveData()}
            width="100%"
            iconHeight={10}
            iconWidth={30}
            iconGap={30}
            icon={arrowIcon}
          />
        </View>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={showImagePickerModal}
        hardwareAccelerated={true}
        opacity={0.3}>
        <TouchableOpacity
          style={styles.modalContainer}
          onPressOut={() => setShowImagePickerModal(false)}
          activeOpacity={1}>
          <View style={styles.modalContent}>
            <View style={{flexDirection: 'column', gap: 15, width: '90%'}}>
              <Text style={styles.blackHeading}>Select Action</Text>
              <TouchableOpacity onPress={() => handleCameraUpload()}>
                <Text style={styles.blackText}>Capture photo from camera</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleGalleryUpload()}>
                <Text style={styles.blackText}>Select photo from gallery</Text>
              </TouchableOpacity>
            </View>
            {/* <Button mode="text" onPress={() => setShowImagePickerModal(false)}>
                            Close
                        </Button> */}
          </View>
        </TouchableOpacity>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  mainWrapper: {
    padding: 15,
    backgroundColor: Colors.white,
  },
  heading: {
    color: Colors.black,
    fontSize: responsiveFontSize(2.2),
    fontWeight: 'bold',
    marginBottom: 10,
  },
  label: {
    fontWeight: 'bold',
    color: Colors.black,
  },
  inputArea: {
    borderColor: Colors.lightGrey,
    borderRadius: 5,
    borderWidth: 1,
    width: '100%',
    color: Colors.black,
    paddingHorizontal: 10,

    marginTop: 10,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inputRow: {
    marginTop: 15,
  },
  input: {
    color: 'black',
    width: '90%',
  },
  modalContainer: {
    flex: 1,
  },
  modalContent: {
    width: '80%',
    alignSelf: 'center',
    // height: height / 6,
    top: height / 2.8,
    margin: 20,
    backgroundColor: Colors.white,
    borderRadius: 5,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 100,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    alignItems: 'center',
  },
  blackText: {
    color: Colors.black,
    fontSize: responsiveFontSize(2.2),
    width: '100%',
  },
  blackHeading: {
    color: Colors.black,
    fontSize: responsiveFontSize(2.3),
    fontWeight: 'bold',
  },
});

export default AddWarranty;
