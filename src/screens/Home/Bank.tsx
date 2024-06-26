import {View, Text, StyleSheet, ScrollView, ToastAndroid} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import InputField from '../../components/InputField';
import {BankDetail, VguardUser} from '../../types';
import {useTranslation} from 'react-i18next';
import {AppContext} from '../../services/ContextService';
import {
  responsiveFontSize,
  responsiveHeight,
} from 'react-native-responsive-dimensions';
import {Colors} from '../../utils/constants';
import {StorageItem, addItem} from '../../services/StorageService';
import {
  getUserProfile,
  updateProfile,
  verifyBank,
  verifyVPA,
} from '../../utils/apiservice';
import Buttons from '../../components/Buttons';
import Popup from '../../components/Popup';
import {width} from '../../utils/dimensions';
import {useFocusEffect} from '@react-navigation/native';
import { ifscValidation } from '../../utils/pattern';

const Bank = ({navigation}) => {
  const {t} = useTranslation();
  const context = useContext(AppContext);

  useFocusEffect(
    React.useCallback(() => {
      const user: VguardUser = context.getUserDetails();
      console.log(user);
      setBankDetail(user?.bank_details);
      setUserData(user);
    }, [navigation]),
  );

  const [loader, setLoader] = useState(false);
  const [popup, setPopup] = useState<any>({isVisible: false, content: null});

  const [bankDetails, setBankDetail] = useState<BankDetail | any>();
  const [userData, setUserData] = useState<VguardUser | any>();

  function checkValidation() {
    console.log(userData);
    console.log(bankDetails);
    if (!bankDetails?.bank_account_number) {
      ToastAndroid.show("Please enter the account number",ToastAndroid.SHORT)
      return;
    } 
    if (!bankDetails?.bank_account_ifsc  || !ifscValidation(bankDetails?.bank_account_ifsc)) {
      ToastAndroid.show("Please enter the valid IFSC code",ToastAndroid.SHORT)
      return;
    } 
    handleSubmit();
  }
  async function handleSubmit() {
    console.log('called');

    var data: VguardUser = userData;
    data.bank_details = bankDetails;
    setLoader(true);
    updateProfile(data)
      .then(res => {
        console.log(res);
        setLoader(false);
        if (res.status == 200 && res.data.status) {
          setPopup({
            isVisible: true,
            content: res.data.message,
          });

          updateProfileData();
        } else {
          setPopup({
            isVisible: true,
            content: 'Please try again',
          });
        }
      })
      .catch(err => {
        setPopup({isVisible: true, content: 'Unable to verify bank details'});
        setLoader(false);
        console.log(err);
      });
  }
  async function verfiyUPI() {
    try {
      const result = await verifyVPA({mobile_no: userData?.contact});
      console.log(result);
      updateProfileData();
      setPopup({isVisible: true, content: 'UPI verified'});
    } catch (error) {
      console.log(error);
      setPopup({isVisible: true, content: 'Unable to verify UPI'});
    }
  }
  async function verifyBankDetails() {
    try {
      var postData: VguardUser = userData;
      postData.bank_details = bankDetails;
      const result = await verifyBank(postData);
      setPopup({isVisible: true, content: result?.data?.message});
      updateProfileData();
    } catch (error) {
      console.log(error);
      setPopup({isVisible: true, content: 'Unable to verify Bank Details'});
    }
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
        context.updateUser(vg);
        setUserData(vg);
        setBankDetail(vg.bank_details);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <View style={{backgroundColor:Colors.white,flex:1}}>
    <ScrollView

      contentContainerStyle={{alignContent: 'center', gap: 10}}
      // style={{width: width * 0.9, alignSelf: 'center'}}
      style={styles.mainWrapper}
      >

      {popup.isVisible && (
        <Popup
          isVisible={popup.isVisible}
          onClose={() => setPopup({isVisible: false, content: null})}
          children={popup.content}
        />
      )}
      <Text style={styles.subHeading}>{t('strings:lbl_bank_details')}</Text>
      <View style={{marginLeft: width * 0.6, width: width}}>
        <Buttons
          variant="outlined"
          label={'Skip'}
          onPress={() => navigation.reset({index: 0, routes: [{name: 'Home'}]})}
          width="30%"
        />
      </View>
      <InputField
        label={t('strings:lbl_account_number')}
        value={bankDetails?.bank_account_number}
        onChangeText={text => {
          setBankDetail((prevState: BankDetail) => ({
            ...prevState,
            bank_account_number: text,
          }));
        }}
      />

      <InputField
        label={t('strings:lbl_ifsc_code')}
        value={bankDetails?.bank_account_ifsc}
        onChangeText={text =>
          setBankDetail((prevState: BankDetail) => ({
            ...prevState,
            bank_account_ifsc: text,
          }))
        }
      />
      <InputField
        disabled={true}
        label={t('strings:lbl_account_holder_name')}
        value={bankDetails?.bank_account_name}
        onChangeText={text => {
          setBankDetail((prevState: BankDetail) => ({
            ...prevState,
            bank_account_number: text,
          }));
        }}
      />
      <View style={styles.button}>
        <Buttons
          disabled={userData?.bank_verified == 1 ? true : false}
          label={'Verify'}
          variant={userData?.bank_verified == 1 ? 'disabled' : 'blackButton'}
          onPress={() => checkValidation()}
          width="100%"
        />
      </View>
      <Text style={styles.subHeading}>{'UPI Verification'}</Text>
      <InputField label="UPI Id" value={userData?.vpa_id} disabled={true} />
      <View style={styles.button}>
        <Buttons
          disabled={userData?.vpa_verified == 1 ? true : false}
          label={'Verify'}
          variant={userData?.vpa_verified == 1 ? 'disabled' : 'blackButton'}
          onPress={() => verfiyUPI()}
          width="100%"
        />
      </View>
      <View style={styles.button}>
        <Buttons
          label={'Finish'}
          variant="filled"
          onPress={() => navigation.reset({index: 0, routes: [{name: 'Home'}]})}
          width="100%"
        />
      </View>
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
    gap: 10,
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

export default Bank;
