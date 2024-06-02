import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Image,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Linking,
  ImageBackground,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';

import AsyncStorage from '@react-native-async-storage/async-storage';

import {Picker} from '@react-native-picker/picker';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

import Snackbar from 'react-native-snackbar';

import {Button} from 'react-native-paper';
import {getImageUrl} from '../../utils/fileutils';
import Loader from '../../components/Loader';
import Constants, {Colors} from '../../utils/constants';
import ImagePickerField from '../../components/ImagePickerField';
import Buttons from '../../components/Buttons';
import NeedHelp from '../../components/NeedHelp';
import Popup from '../../components/Popup';
import {getTicketTypes, sendFile, sendTicket} from '../../utils/apiservice';
import {AppContext} from '../../services/ContextService';
import {VguardUser} from '../../types';

const Ticket: React.FC<{navigation: any}> = ({navigation}) => {
  const baseURL = 'https://www.vguardrishta.com/img/appImages/Profile/';

  const {t} = useTranslation();

  const [userData, setUserData] = useState({
    userName: '',
    userId: '',
    userCode: '',
    userImage: '',
  });

  const [profileImage, setProfileImage] = useState('');

  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState('');
  const [isOptionsLoading, setIsOptionsLoading] = useState(true);
  const [entityUid, setEntityUid] = useState('');
  const [fileData, setFileData] = useState({
    uri: '',
    name: '',
    type: '',
  });
  const [descriptionInput, setDescriptionInput] = useState('');
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [popupContent, setPopupContent] = useState('');
  const [loader, showLoader] = useState(true);
  const context = useContext(AppContext);

  useEffect(() => {
    const user: VguardUser = context.getUserDetails();
    const data = {
      userName: user.name,
      userCode: user.rishta_id,
      pointsBalance: user.balance_points,
      redeemedPoints: user.redeemded_points,
      userImage: user.selfie,

      userId: user.contact,
    };
    setUserData(data);

    getTicketTypes()
      .then(response => response.data)
      .then(data => {
        setOptions(data);
        showLoader(false);
        setIsOptionsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching options:', error);
        setIsOptionsLoading(false);
      });
  }, []);

  useEffect(() => {
    const getImage = async () => {
      try {
        const profileImageUrl = await getImageUrl(
          userData.userImage,
          'Profile',
        );
        setProfileImage(profileImageUrl);
      } catch (error) {
        console.error('Error while fetching profile image:', error);
      }
    };

    getImage();
  }, [userData.userImage]);

  const handleOptionChange = value => {
    setSelectedOption(value);
  };

  const openTnC = () => {
    Linking.openURL('https://vguardrishta.com/tnc_retailer.html');
  };

  const openFaqS = () => {
    Linking.openURL(
      'https://vguardrishta.com/frequently-questions-retailer.html',
    );
  };

  // const handleSubmission = async () => {
  //   const postData = {
  //     userId: userData.userId,
  //     issueTypeId: selectedOption,
  //     imagePath: entityUid,
  //     description: descriptionInput,
  //   };

  //   if (postData.userId != '' && postData.issueTypeId != '' && postData.description != '') {
  //     sendTicket(postData)
  //       .then((response) => {
  //         if (response.status === 200) {
  //           setSelectedOption('');
  //           setEntityUid('');
  //           setDescriptionInput('');
  //           setPopupContent('Ticket Created Successfully');
  //           setPopupVisible(true);
  //         } else {
  //           setPopupContent('Failed to create ticket');
  //           setPopupVisible(true);
  //           throw new Error('Failed to create ticket');
  //         }
  //       })
  //       .catch((error) => {
  //         setPopupContent('Failed to create ticket');
  //         setPopupVisible(true);
  //         console.error('API Error:', error);
  //       });
  //   }
  //   else {
  //     setPopupContent('Enter All Details');
  //     setPopupVisible(true);
  //   }
  // };

  const handleSubmission = async () => {
    showLoader(true);
    let imageUrl = await triggerApiWithImage(fileData);
    const postData = {
      userId: userData.userId,
      issueTypeId: selectedOption,
      imagePath: imageUrl,
      description: descriptionInput,
    };
    if (postData.userId != '' && postData.issueTypeId != '') {
      sendTicket(postData)
        .then(response => {
          if (response.status === 200) {
            setSelectedOption('');
            setEntityUid('');
            setDescriptionInput('');
            setPopupVisible(true);
            setPopupContent(response.data.message);
            showLoader(false);
          } else {
            setPopupContent('Failed to create ticket');
            setPopupVisible(true);
            showLoader(false);
            throw new Error('Failed to create ticket');
          }
        })
        .catch(error => {
          setPopupContent('Failed to create ticket');
          setPopupVisible(true);
          showLoader(false);
          console.error('API Error:', error);
        });
    } else {
      showLoader(false)
      setPopupContent('Enter All Details');
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

  const triggerApiWithImage = async (fileData: {
    uri: string;
    type: string;
    name: string;
  }) => {
    if (fileData.uri != '') {
      const formData = new FormData();

      formData.append('imageRelated', Constants.Ticket);
      formData.append('file', {
        uri: fileData.uri,
        name: fileData.name,
        type: fileData.type,
      });
      try {
        const response = await sendFile(formData);
        setEntityUid(response.data.entityUid);
        return response.data.entityUid;
      } catch (error) {
        setPopupContent('Error uploading image');
        setPopupVisible(true);
        console.error('API Error:', error);
      }
    }
    return '';
  };

  return (
    <ScrollView style={styles.mainWrapper}>
      {loader && <Loader isLoading={loader} />}
      <View style={styles.flexBox}>
        <View style={styles.profileDetails}>
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
            <Text style={styles.textDetail}>{userData.userName}</Text>
            <Text style={styles.textDetail}>{userData.userCode}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Ticket History')}>
          <Text style={styles.buttonText}>{t('strings:ticket_history')}</Text>
        </TouchableOpacity>
      </View>
      <Text style={[styles.blackText, {marginTop: responsiveFontSize(2)}]}>
        {t('strings:issue_type')}
      </Text>
      {isOptionsLoading ? (
        <Text style={styles.blackText}>Loading options...</Text>
      ) : options.length === 0 ? (
        <Text style={styles.blackText}>No options available.</Text>
      ) : (
        <View style={styles.inputContainer}>
          <Picker
            dropdownIconColor={Colors.black}
            selectedValue={selectedOption}
            onValueChange={handleOptionChange}
            style={styles.picker}
            label={t('strings:select_ticket_type')}>
            <Picker.Item key={''} label={'Select Issue Type'} value={''} />
            {options.map(option => (
              <Picker.Item
                key={option.issueTypeId}
                label={option.name}
                value={option.issueTypeId}
              />
            ))}
          </Picker>
        </View>
      )}
      <ImagePickerField
        label="Upload Picture (optional)"
        onImageChange={handleImageChange}
        imageRelated="Ticket"
      />
      <Text style={styles.blackText}>{t('strings:description_remarks')}</Text>
      <TextInput
        style={styles.descriptionInput}
        placeholder={t('strings:provide_description_in_the_box')}
        placeholderTextColor={Colors.grey}
        multiline={true}
        textAlignVertical="top"
        value={descriptionInput}
        onChangeText={text => setDescriptionInput(text)}
      />

      <Buttons
        label={t('strings:submit')}
        variant="filled"
        onPress={handleSubmission}
        width="100%"
      />
      <View style={styles.footerRow}>
        <View style={styles.hyperlinks}>
          <TouchableOpacity style={styles.link} onPress={openTnC}>
            <Image
              style={{
                height: 30,
                width: 30,
              }}
              resizeMode="contain"
              source={require('../../assets/images/ic_tand_c.png')}
            />
            <Text style={styles.linkText}>
              {t('strings:terms_and_conditions')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.link} onPress={openFaqS}>
            <Image
              style={{
                height: 30,
                width: 30,
              }}
              resizeMode="contain"
              source={require('../../assets/images/ic_faq.png')}
            />
            <Text style={styles.linkText}>
              {t('strings:frequently_asked_quetions_faq')}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.footer}>
          <NeedHelp />
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
  footer: {
    marginBottom: 40,
  },
  picker: {
    color: Colors.black,
    // backgroundColor: Colors.grey,
    height: responsiveHeight(5),
    width: '100%',
    fontSize: responsiveFontSize(1.5),
  },
  mainWrapper: {
    padding: 15,
    flexGrow: 1,
  },
  flexBox: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileDetails: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    fontSize: responsiveFontSize(1.7),
  },
  ImageProfile: {
    height: 50,
    width: 50,
    borderRadius: 100,
  },
  textDetail: {
    color: Colors.black,
    fontWeight: 'bold',
    fontSize: responsiveFontSize(1.7),
  },
  buttonText: {
    color: Colors.black,
    fontWeight: 'bold',
    fontSize: responsiveFontSize(1.5),
  },
  button: {
    backgroundColor: Colors.yellow,
    paddingHorizontal: responsiveWidth(5),
    paddingVertical: responsiveHeight(1),
    shadowColor: 'rgba(0, 0, 0, 0.8)',
    elevation: 5,
    borderRadius: 5,
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
    marginVertical: responsiveHeight(1),
  },
  input: {
    width: '90%',
    padding: 10,
    fontSize: responsiveFontSize(1.8),
    color: Colors.black,
    fontWeight: 'bold',
  },
  descriptionInput: {
    width: '100%',
    height: responsiveHeight(20),
    borderColor: Colors.lightGrey,
    borderWidth: 2,
    borderRadius: 5,
    padding: 5,
    fontSize: responsiveFontSize(1.8),
    color: Colors.black,
    fontWeight: 'bold',
    marginTop: responsiveHeight(1),
    marginBottom: responsiveHeight(2),
  },
  inputImage: {
    height: responsiveHeight(2),
    width: responsiveHeight(2),
    marginRight: 5,
  },
  blackText: {
    color: Colors.black,
    fontWeight: 'bold',
  },
  hyperlinks: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '40%',
    marginRight: 25,
    marginTop: responsiveHeight(1),
  },
  footerRow: {
    flexDirection: 'row',
  },
  linkText: {
    color: 'blue',
    textDecorationLine: 'underline',
    fontSize: responsiveFontSize(1.7),
  },
  link: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 5,
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
});

export default Ticket;
