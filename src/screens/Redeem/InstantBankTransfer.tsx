import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
} from 'react-native';
import {Button} from 'react-native-paper';
import {
  responsiveFontSize,
  responsiveHeight,
} from 'react-native-responsive-dimensions';
import {useTranslation} from 'react-i18next';
import {
  launchCamera,
  launchImageLibrary,
  ImagePickerResponse,
} from 'react-native-image-picker';
import Snackbar from 'react-native-snackbar';
import {Picker} from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '../../components/Loader';
import InputField from '../../components/InputField';
import Buttons from '../../components/Buttons';
import Popup from '../../components/Popup';
import {Colors} from '../../utils/constants';
import {bankTransfer} from '../../utils/apiservice';
import arrowIcon from '../../assets/images/arrow.png';
import {AppContext} from '../../services/ContextService';
import {VguardUser} from '../../types';
import PopupWithButton from '../../components/PopupWithButton';

type BankProps = {};

interface BankDetail {
  bankAccNo: string;
  bankAccHolderName: string;
  bankNameAndBranch: string;
  bankAccType: string;
  bankIfsc: string;
  checkPhoto: string;
}

interface BankTransferData {
  amount: string;
  bankDetail: BankDetail;
}

const Bank: React.FC<BankProps> = ({navigation}) => {
  const {t} = useTranslation();
  const [points, setPoints] = useState<string>('');
  const [OkPopup, SetOkPopup] = useState({visible: false});
  const [popupContent, setPopupContent] = useState('');
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [loader, showLoader] = useState(false);
  const [user, setUser] = useState<VguardUser | any>();
  const context = useContext(AppContext);

  useEffect(() => {
    const vguser: VguardUser = context.getUserDetails();
    setUser(vguser);
    if (user?.bank_verified == 0) {
      SetOkPopup({visible: true});
    }
  }, []);

  async function handleProceed() {
    try {
      if (points < 150) {
        setPopupContent('Redemption available on minimum of 150 points.');
        setPopupVisible(true);
        return;
      }
      showLoader(true);
      const data = {user_id: user.user_id, amount: points};
      showLoader(false);
      const result = await bankTransfer(data);
      setPopupContent(result.data.message);
      setPopupVisible(true);
    } catch (error) {
      showLoader(false);
      console.log(error);
      setPopupContent('Cannot place request');
      setPopupVisible(true);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Loader isLoading={loader} />
      <View style={styles.mainWrapper}>
        <View style={styles.header}>
          <Text style={styles.textHeader}>{t('strings:bank_details')}</Text>
          <Text style={styles.textSubHeader}>
            {t('strings:for_account_tranfer_only')}
          </Text>
        </View>
        <View style={styles.form}>
          <InputField
            label={t('strings:lbl_account_number')}
            value={user?.bank_details?.bank_account_number}
            disabled={true}
          />
          <InputField
            label={t('strings:lbl_account_holder_name')}
            value={user?.bank_details?.bank_account_name}
            disabled={true}
          />
          <InputField
            label={t('strings:ifsc')}
            value={user?.bank_details?.bank_account_ifsc}
            disabled={true}
          />

          <InputField
            label={t('strings:enter_points_to_be_redeemed')}
            value={points}
            onChangeText={value => setPoints(value)}
          />
        </View>
        <View style={styles.button}>
          {user?.bank_verified == 1 && (
            <Buttons
              label={t('strings:submit')}
              variant="filled"
              onPress={() => handleProceed()}
              width="100%"
              iconHeight={10}
              iconWidth={30}
              iconGap={30}
              icon={arrowIcon}
            />
          )}
        </View>
      </View>

      <PopupWithButton
        buttonText="Ok"
        isVisible={OkPopup.visible}
        onClose={() => SetOkPopup({visible: false})}
        onConfirm={() => navigation.navigate('Profile')}
        children="Please update Bank details"
      />
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
    marginTop: 20,
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
  picker: {
    width: '90%',
    color: Colors.grey,
  },
  labelPicker: {
    color: Colors.grey,
    fontWeight: 'bold',
  },
  modalcontainer: {alignSelf: 'center', backgroundColor: 'rgba(0,0,0,0.7)'},
});

export default Bank;
