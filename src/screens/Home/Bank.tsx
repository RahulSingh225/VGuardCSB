import React, {useState, useEffect} from 'react';
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
import ImagePickerField from '../../components/ImagePickerField';
import PickerField from '../../components/PickerField';
import Popup from '../../components/Popup';
import { getany, getBanks, updateBank } from '../../utils/apiservice';
import Constants, { Colors } from '../../utils/constants';

type BankProps = {};

const Bank: React.FC<BankProps> = () => {
  const {t} = useTranslation();
  const [select, setSelect] = useState<string | null>(null);
  const [accNo, setAccNo] = useState<string>('');
  const [accHolder, setAccHolder] = useState<string>('');
  const [accType, setAccType] = useState<string>('');
  const [bankName, setBankName] = useState<string>('');
  const [ifscCode, setIfscCode] = useState<string>('');
  const [entityUid, setEntityUid] = useState<string>('');
  const [availableBanks, setAvailableBanks] = useState<string[]>([]);
  const [popupContent, setPopupContent] = useState('');
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [loader, showLoader] = useState(false);

  useEffect(() => {
    showLoader(true);

    const getBankDetailsAndCallFileUri = async () => {
      try {
        const response = await getany();
        if (response.status === 200) {
          const data = response.data;
          console.log(data);
          setAccHolder(data.bankAccHolderName);
          setAccType(data.bankAccType);
          setBankName(data.bankNameAndBranch);
          setIfscCode(data.bankIfsc);
          setAccNo(data.bankAccNo);
          setEntityUid(data.checkPhoto);

          if (data.errorMessage) {
            setPopupContent(data.errorMessage);
            setPopupVisible(true);
          }
          showLoader(false);
        } else {
          showLoader(false);
          throw new Error('Failed to get bank details');
        }
      } catch (error) {
        showLoader(false);
        console.error('API Error:', error);
      }
    };

    getBankDetailsAndCallFileUri();

    getBanks()
      .then(response => {
        if (response.status === 200) {
          return response.data;
        } else {
          throw new Error('Failed to get bank names');
        }
      })
      .then(responses => {
        if (Array.isArray(responses)) {
          const bankOptions = responses.map(bank => ({
            label: bank.bankNameAndBranch,
            value: bank.bankNameAndBranch,
          }));
          setAvailableBanks(bankOptions);
        } else {
          console.error('Invalid response format');
        }
      })
      .catch(error => {
        console.error('API Error:', error);
      });
  }, []);

  const handleProceed = () => {
    showLoader(true);

    const postData = {
      bankAccNo: accNo,
      bankAccHolderName: accHolder,
      bankAccType: accType,
      bankNameAndBranch: bankName,
      bankIfsc: ifscCode,
      checkPhoto: imageUid,
    };

    if (
      postData.bankAccNo !== '' &&
      postData.bankAccHolderName !== '' &&
      postData.bankAccType !== '' &&
      postData.bankNameAndBranch !== '' &&
      postData.bankIfsc !== '' &&
      postData.checkPhoto !== ''
    ) {
      updateBank(postData)
        .then(response => {
          if (response.status === 200) {
            showLoader(false);
            return response.data;
          } else {
            showLoader(false);
            setPopupContent('Failed to update Bank Details');
          }
        })
        .then(data => {
          showLoader(false);
          setPopupContent(data.message);
          setPopupVisible(true);
        })
        .catch(error => {
          showLoader(false);
          console.error('API Error:', error);
          setPopupContent('An error occurred');
          setPopupVisible(true);
        });
    } else {
      showLoader(false);
      setPopupContent('Enter all the details');
      setPopupVisible(true);
    }
  };

  const handleImageChange = async (
    image: string,
    type: string,
    imageName: string,
    label: string,
  ) => {
    try {
      setFileData({
        uri: image,
        name: imageName,
        type: type,
      });
    } catch (error) {
      console.error('Error handling image change in Raise Ticket:', error);
    }
  };

  

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {loader && <Loader isLoading={loader} />}

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
            value={accNo}
            onChangeText={value => setAccNo(value)}
          />
          <InputField
            label={t('strings:lbl_account_holder_name')}
            value={accHolder}
            onChangeText={value => setAccHolder(value)}
          />
          <PickerField
            label={'Select Bank Name'}
            selectedValue={bankName}
            onValueChange={itemValue => setBankName(itemValue)}
            items={availableBanks}
          />
          <InputField
            label={t('strings:ifsc')}
            value={ifscCode}
            onChangeText={value => setIfscCode(value)}
          />
          <ImagePickerField
            label={t('strings:cancelled_cheque_copy')}
            onImageChange={handleImageChange}
            imageRelated={Constants.Cheque}
            initialImage={entityUid}
            getImageRelated={Constants.Cheque}
          />
        </View>
        <View style={styles.button}>
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
    borderRadius: 5,
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
    width: '100%',
    color: Colors.grey,
  },
  labelPicker: {
    color: Colors.grey,
    fontWeight: 'bold',
  },
  modalcontainer: {alignSelf: 'center', backgroundColor: 'rgba(0,0,0,0.7)'},
});

export default Bank;
