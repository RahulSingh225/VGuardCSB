import {useEffect, useState} from 'react';
import {
  Alert,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import {RadioButton} from 'react-native-paper';
import {
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';

import Buttons from './Buttons';
import {Colors, TDS_CONSENT_MESSAGE} from '../utils/constants';
import {useNavigation} from '@react-navigation/native';
import Loader from './Loader';
import {getUser, updateTdsContent} from '../utils/apiservice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useTranslation} from 'react-i18next';

interface TDSPopupProps {
  popupContent: string;
  isVisible: boolean;
  onClose: () => void;
  response?: any;
}
const TDSPopup = ({
  popupContent = TDS_CONSENT_MESSAGE?.EMPTY,
  isVisible,
  onClose,
  response,
}: TDSPopupProps) => {
  const navigation = useNavigation();
  const {t} = useTranslation();
  const [consent, setConsent] = useState<string>('');
  const [RenderingPopup, setRenderingPopup] = useState<string>(popupContent);
  const [tdsState, setTdsState] = useState({
    visible: true,
    tdsContent: '',
    tdsSubmit: false,
    internalNavigation: false,
  });
  const [loader, showLoader] = useState(false);

  useEffect(() => {
    handleInternalNav();
  }, [tdsState?.visible]);

  const submitRedirect = () => {
    if (!consent) {
      return ToastAndroid.show(
        'Please provide your consent for TDS',
        ToastAndroid.SHORT,
      );
    }
    handleClose('open');
    setRenderingPopup(TDS_CONSENT_MESSAGE?.YES);
  };

  const previewRedirect = () => {
    handleClose('open');
    setRenderingPopup(TDS_CONSENT_MESSAGE?.PREVIEW);
  };

  const changeConsent = (type: string) => {
    setConsent(type);
  };

  const acceptRedirect = async () => {
    try {
      if (RenderingPopup == TDS_CONSENT_MESSAGE?.PREVIEW) {
        navigation.navigate('Update KYC');
        handleClose('open');
        setRenderingPopup(TDS_CONSENT_MESSAGE?.ACCEPT);
        return;
      }

      if (consent == 'Yes') {
        navigation.navigate('Update KYC');
        handleClose('open');
        setRenderingPopup(TDS_CONSENT_MESSAGE?.ACCEPT);
        return;
      }

      if (consent == 'No') {
        if (response?.tdsConsents?.adminApprovalStatus != 2) {
          handleClose('close');
          return;
        }
        showLoader(true);
        const payload = {
          tdsConsent: consent,
        };
        const update = await updateTdsContent(payload);
        if (update) {
          handleClose('close');
        } else {
          ToastAndroid.show(
            'Something went wrong, please try again',
            ToastAndroid.SHORT,
          );
        }

        await updateUserDetails();
        return;
      }
    } catch (consentError: any) {
      ToastAndroid.show(
        'Something went wrong, please try again',
        ToastAndroid.SHORT,
      );
    } finally {
      showLoader(false);
    }
  };

  async function updateUserDetails() {
    const updateUserData = await getUser();
    if (updateUserData) {
      await AsyncStorage.setItem('USER', JSON.stringify(updateUserData));
    }
  }

  const goBackRedirect = () => {
    if (RenderingPopup === TDS_CONSENT_MESSAGE?.YES) {
      handleClose('open');
      setRenderingPopup(TDS_CONSENT_MESSAGE?.EMPTY);
    } else if (RenderingPopup === TDS_CONSENT_MESSAGE?.PREVIEW) {
      handleClose('open');
      setRenderingPopup(TDS_CONSENT_MESSAGE?.UPLOADED);
    }
  };

  const proceedRedirect = async () => {
    

    handleClose('close');
  };

  const handleClose = (type: string) => {
    setTdsState((prev: any) => ({
      ...prev,
      visible: false,
      internalNavigation: type == 'open',
    }));
    if (type == 'close') {
      onClose();
    }
  };

  const handleInternalNav = () => {
    if (tdsState?.internalNavigation) {
      setTdsState((prev: typeof tdsState) => ({...prev, visible: true}));
    }
  };

  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={tdsState.visible}
        onRequestClose={() => undefined}>
        <TouchableOpacity style={styles.container} activeOpacity={1}>
          <View style={styles.contentContainer}>
            {(RenderingPopup == TDS_CONSENT_MESSAGE?.EMPTY ||
              RenderingPopup == TDS_CONSENT_MESSAGE?.YES ||
              RenderingPopup == TDS_CONSENT_MESSAGE?.PREVIEW ||
              RenderingPopup == TDS_CONSENT_MESSAGE?.UPLOADED) && (
              <View>
                <Text style={styles.header}>
                  {t('strings:tds_consent_message.consent_header')}
                </Text>
              </View>
            )}

           
            {(RenderingPopup == TDS_CONSENT_MESSAGE?.YES ||
              RenderingPopup == TDS_CONSENT_MESSAGE?.PREVIEW) && (
              <View style={styles.selectiveLayout}>
                <Text style={styles.confirmMessage}>
                  {t('strings:tds_consent_message.agreed')}
                </Text>
              </View>
            )}

            {RenderingPopup == TDS_CONSENT_MESSAGE?.ACCEPT && (
              <View style={styles.selectiveLayout}>
                <Text style={styles.acceptMessage}>
                  {t('strings:tds_consent_message.panPreview')}
                </Text>
              </View>
            )}

            {RenderingPopup == TDS_CONSENT_MESSAGE?.UPLOADED && (
              <View style={styles.selectiveLayout}>
                <Text style={styles.uploadedMessage}>
                  {t('strings:tds_consent_message.uploaded')}
                </Text>
              </View>
            )}

            {RenderingPopup == TDS_CONSENT_MESSAGE?.VERIFIED && (
              <View style={styles.selectiveLayout}>
                <Text style={styles.verifiedMessage}>
                  {t('strings:tds_consent_message.verified')}
                </Text>
              </View>
            )}

            {RenderingPopup == TDS_CONSENT_MESSAGE?.INVALID && (
              <View style={styles.selectiveLayout}>
                <Text style={styles.invalidMessage}>
                  {t('strings:tds_consent_message.invalid')}
                </Text>
              </View>
            )}

            {RenderingPopup == TDS_CONSENT_MESSAGE?.NOT_LINKED && (
              <View style={styles.selectiveLayout}>
                <Text style={styles.invalidMessage}>
                  {t('strings:tds_consent_message.notLinked')}
                </Text>
              </View>
            )}

            {RenderingPopup == TDS_CONSENT_MESSAGE?.EMPTY_IT && (
              <View style={styles.selectiveLayout}>
                <Text style={styles.invalidMessage}>
                  {t('strings:tds_consent_message.emptyIT')}
                </Text>
              </View>
            )}

            {RenderingPopup == TDS_CONSENT_MESSAGE?.NOT_APPROVED && (
              <View style={styles.selectiveLayout}>
                <Text style={styles.invalidMessage}>
                  {t('strings:tds_consent_message.notApproved')}
                </Text>
              </View>
            )}

            {(RenderingPopup == TDS_CONSENT_MESSAGE?.UPLOADED ||
              RenderingPopup == TDS_CONSENT_MESSAGE?.EMPTY) && (
              <Text
                style={{
                  color: Colors?.black,
                  fontSize: 12,
                  textAlign: 'center',
                  alignSelf: 'center',
                  fontStyle: 'italic',
                  width: '90%',
                  marginTop: 15,
                }}>
                {t('strings:tds_consent_message.note')}
              </Text>
            )}

            <View style={styles.buttonWrapper}>
              {RenderingPopup == TDS_CONSENT_MESSAGE?.EMPTY && (
                <Buttons
                  label={t('strings:tds_consent_message.submit')}
                  variant="filled"
                  onPress={() => submitRedirect()}
                  width={100}
                  fontSize={17}
                  wrapperCustomStyle={styles.customButton}
                />
              )}

              {(RenderingPopup == TDS_CONSENT_MESSAGE?.PREVIEW ||
                RenderingPopup == TDS_CONSENT_MESSAGE?.YES) && (
                <Buttons
                  label={t('strings:tds_consent_message.accept')}
                  variant="filled"
                  onPress={() => acceptRedirect()}
                  width={100}
                  fontSize={17}
                  wrapperCustomStyle={styles.customButton}
                />
              )}

              {(RenderingPopup == TDS_CONSENT_MESSAGE?.PREVIEW ||
                RenderingPopup == TDS_CONSENT_MESSAGE?.YES) && (
                <Buttons
                  label={t('strings:tds_consent_message.goBack')}
                  variant="filled"
                  onPress={() => goBackRedirect()}
                  width={100}
                  fontSize={17}
                  wrapperCustomStyle={styles.customButton}
                />
              )}

              {RenderingPopup == TDS_CONSENT_MESSAGE?.INVALID &&
                response?.entity > 0 && (
                  <Buttons
                    label={
                      t('strings:tds_consent_message.reSubmit') +
                      (String(response?.entity) || '0')
                    }
                    variant="filled"
                    onPress={() => proceedRedirect()}
                    width={100}
                    fontSize={17}
                    wrapperCustomStyle={styles.customButton}
                  />
                )}

              {(RenderingPopup == TDS_CONSENT_MESSAGE?.ACCEPT ||
                RenderingPopup == TDS_CONSENT_MESSAGE?.VERIFIED ||
                RenderingPopup == TDS_CONSENT_MESSAGE?.INVALID ||
                RenderingPopup == TDS_CONSENT_MESSAGE?.NOT_LINKED ||
                RenderingPopup == TDS_CONSENT_MESSAGE?.EMPTY_IT ||
                RenderingPopup == TDS_CONSENT_MESSAGE?.NOT_APPROVED) && (
                <Buttons
                  label={t('strings:tds_consent_message.proceed')}
                  variant="filled"
                  onPress={() => proceedRedirect()}
                  width={100}
                  fontSize={17}
                  wrapperCustomStyle={styles.customButton}
                />
              )}

              {RenderingPopup == TDS_CONSENT_MESSAGE?.UPLOADED && (
                <Buttons
                  label={t('strings:tds_consent_message.preview')}
                  variant="filled"
                  onPress={() => previewRedirect()}
                  // width={100}
                  fontSize={17}
                  wrapperCustomStyle={styles.customButton}
                />
              )}

              {(RenderingPopup == TDS_CONSENT_MESSAGE?.PREVIEW ||
                RenderingPopup == TDS_CONSENT_MESSAGE?.YES) && (
                <TouchableOpacity>
                  <Text style={styles.tac}> Read terms & condition</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
      <Loader isLoading={loader} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  contentContainer: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 5,
    paddingRight: 5,
    backgroundColor: 'white',
    borderRadius: 10,
    width: responsiveScreenWidth(90),
    minHeight: responsiveScreenHeight(20),
  },
  header: {
    color: 'black',
    fontSize: 20,
    fontWeight: '800',
    fontStyle: 'italic',
    alignSelf: 'center',
  },
  selectiveContent: {
    width: '100%',
    color: 'black',
    flexWrap: 'wrap',
  },
  selectiveText: {
    color: 'black',
    flexWrap: 'wrap',
    marginTop: 5,
    marginRight: 20,
    width: responsiveScreenWidth(90) - responsiveScreenWidth(15),
    fontSize: 15,
    // width:"85%"
  },
  selectiveLayout: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  buttonWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  tac: {
    color: '#2852fa',
    textDecorationLine: 'underline',
    fontSize: 14,
    marginTop: 20,
  },
  customButton: {
    borderRadius: 20,
    marginVertical: 10,
    width: 140,
  },
  confirmMessage: {
    color: 'black',
    fontSize: 18,
    textAlign: 'center',
    marginHorizontal: '10%',
    marginTop: 20,
    marginBottom: 50,
    // alignSelf:"center"
  },
  acceptMessage: {
    color: 'black',
    fontSize: 18,
    textAlign: 'center',
    marginHorizontal: '15%',
    marginTop: 20,
    marginBottom: 20,
  },
  uploadedMessage: {
    color: 'black',
    fontSize: 16,
    textAlign: 'center',
    marginHorizontal: 20,
    marginBottom: 30,
  },
  verifiedMessage: {
    color: 'black',
    fontSize: 17,
    textAlign: 'center',
    marginHorizontal: 20,
    marginTop: 30,
    marginBottom: 30,
  },
  invalidMessage: {
    color: 'black',
    fontSize: 18,
    textAlign: 'center',
    marginHorizontal: 30,
    marginTop: 30,
    marginBottom: 5,
  },
});

export default TDSPopup;
