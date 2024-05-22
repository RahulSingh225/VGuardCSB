import {View, Text, StyleSheet, ScrollView} from 'react-native';
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
} from '../../utils/apiservice';
import Buttons from '../../components/Buttons';
import Popup from '../../components/Popup';
import {width} from '../../utils/dimensions';

const Bank = ({navigation}) => {
  const {t} = useTranslation();
  const context = useContext(AppContext);

  useEffect(() => {
    const user: VguardUser = context.getUserDetails();
    setUserData(user);
  }, []);
  const [loader, setLoader] = useState(false);
  const [popup, setPopup] = useState({isVisible: false, content: null});

  const [bankDetails, setBankDetail] = useState<BankDetail | any>();
  const [userData, setUserData] = useState<VguardUser | any>();

  function checkValidation() {
    console.log(userData);
    console.log(bankDetails);
    if (!bankDetails?.bank_account_ifsc) {
      setPopup({isVisible: true, content: 'Please enter bank details'});
      return;
    } else if (!bankDetails?.bank_account_number) {
      setPopup({isVisible: true, content: 'Please enter bank details'});

      return;
    } else {
      console.log('calling hanlde submmit');
      handleSubmit();
    }
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
            content: () => <Text>{res.data.message}</Text>,
          });
          verifyBank(data).then(response => {
            updateProfileData();
          });
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
        context.signIn(vg);
        navigation.replace('Home');
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <ScrollView
      contentContainerStyle={{alignContent: 'center', gap: 10}}
      style={{width: width * 0.9, alignSelf: 'center'}}>
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
          onPress={() => updateProfileData()}
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
      <View style={styles.button}>
        <Buttons
          label={t('strings:submit')}
          variant="filled"
          onPress={() => checkValidation()}
          width="100%"
        />
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

export default Bank;
