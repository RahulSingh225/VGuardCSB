import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Linking,
  ImageBackground,
  Pressable,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import { useTranslation } from 'react-i18next';
import { getFile, getUserProfile } from '../../utils/apiservice';
import CustomTouchableOption from '../../components/CustomTouchableOption';
import NeedHelp from '../../components/NeedHelp';
import Constants, { Colors } from '../../utils/constants';
import { VguardUser } from '../../types';
import { AppContext } from '../../services/ContextService';
import { getImageUrl } from '../../utils/fileutils';
import { useFocusEffect } from '@react-navigation/native';
import { StorageItem, addItem, getItem, removeItem } from '../../services/StorageService';
import OpenPopupOnOpeningApp from '../../components/OpenPopupOnOpeningApp';

interface User {
  userCode: string;
  name: string;
  selfieImage: string;
  userRole: string;
  pointsBalance: string;
  redeemedPoints: string;
  numberOfScan: string;
  inAllow: number;
}

const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { t } = useTranslation();
  const appContext = useContext(AppContext);
  const [userData, setUserData] = useState<VguardUser | null>();
  const [profileImage, setProfileImage] = useState('');
  const [disableOptions, setDisableOptions] = useState(false);
  const [welcome, setWelocme] = useState(false);

  useEffect(() => {
    const user: VguardUser = appContext.getUserDetails();
    console.log('USERDATA', user);
    if (user?.login_date === null) {
      console.log('first time user');
      navigation.navigate('UpdatePassword');
    }

    if (userData?.selfie) {
      const getImage = async () => {
        try {
          const profileImageUrl = await getImageUrl(
            userData.selfie,
            Constants.Profile,
          );
          setProfileImage(profileImageUrl);
        } catch (error) {
          console.error('Error while fetching profile image:', error);
        }
      };
      getImage();
    }
  }, [userData?.selfie]);

  useFocusEffect(
    React.useCallback(() => {

      const user: VguardUser = appContext.getUserDetails();
      if (user?.login_date === null) {
        console.log('first time user');
        navigation.navigate('UpdatePassword');
      } else {
        getItem('FIRST_LOGIN').then(res => {
          if (res) {
            setWelocme(true);
          }
        });
        getUserProfile({ user_id: user?.user_id })
          .then(res => {
            if (res.data.status) {
              const vg: VguardUser = res.data.data;
              if (vg.contact != user.contact) {
                appContext.signOut();
              }
              const st: StorageItem = { key: 'USER', value: vg };
              addItem(st);
              //appContext.updateUser(vg);
              setUserData(vg);
            }
          })
          .catch(e => console.log(e));
      }
    }, []),
  );

  function handlePopupClose() {
    removeItem('FIRST_LOGIN').then(res => console.log(res))
  }

  return (
    <ScrollView style={styles.mainWrapper}>
      <View style={{ padding: 15 }}>
        <OpenPopupOnOpeningApp onClose={() => handlePopupClose()} />
        <View style={styles.detailContainer}>
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
          <View>
            <Text style={styles.name}>{userData?.name}</Text>
            <Text style={styles.code}>{userData?.rishta_id}</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
              <Text style={styles.viewProfile}>
                {t('strings:view_profile')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.points}>
          <Pressable
            onPress={() => navigation.navigate('Unique Code History')}
            style={styles.leftPoint}>
            <Text style={styles.greyText}>{t('strings:earned_points')}</Text>

            <Text style={styles.point}>
              {Number(userData?.earned_points)?.toFixed(1) || 0}
            </Text>
          </Pressable>
          <Pressable style={styles.middlePoint}>
            <Text style={styles.greyText}>
              {t('strings:redeemable_points')}
            </Text>
            <Text style={styles.point}>
              {Number(userData?.redeemable_points)?.toFixed(1) || 0}
            </Text>
          </Pressable>
          <Pressable
            onPress={() => navigation.navigate('Redemption History')}
            style={styles.middlePoint}>
            <Text style={styles.greyText}>{t('strings:points_redeemed')}</Text>
            <Text style={styles.point}>
              {Number(userData?.redeemded_points)?.toFixed(1) || 0}
            </Text>
          </Pressable>
          <Pressable style={styles.rightPoint}>
            <Text style={styles.greyText}>{'TDS \nKitty'}</Text>
            <Text style={styles.point}>
              {Number(userData?.tds_kitty)?.toFixed(1) || 0}
            </Text>
          </Pressable>
        </View>
        <View style={styles.dashboard}>
          <View style={styles.row}>
            {userData?.cs_type == 'Store Demonstrator' ? (
              <CustomTouchableOption
                text="strings:scan_code"
                iconSource={require('../../assets/images/ic_scan_code.png')}
                screenName="Scan QR"
              />
            ) : (
              <CustomTouchableOption
                text="strings:claims"
                iconSource={require('../../assets/images/claim.png')}
                screenName="Claims"
              />
            )}
            <CustomTouchableOption
              text="strings:redeem_points"
              iconSource={require('../../assets/images/ic_redeem_points.webp')}
              screenName="Redeem Products"
              diffAcc={disableOptions}
            />
            <CustomTouchableOption
              text="strings:dashboard"
              iconSource={require('../../assets/images/ic_dashboard.webp')}
              screenName="Dashboard"
            />
          </View>
          <View style={styles.row}>
            <CustomTouchableOption
              text="strings:scheem_offers"
              iconSource={require('../../assets/images/ic_scheme_offers.png')}
              screenName="schemes"
            />
            <CustomTouchableOption
              text="strings:info_desk"
              iconSource={require('../../assets/images/ic_vguard_info.webp')}
              screenName="info"
            />

            <CustomTouchableOption
              text="strings:what_s_new"
              iconSource={require('../../assets/images/ic_whats_new.webp')}
              screenName="new"
            />
          </View>
          <View style={styles.row}>
            <CustomTouchableOption
              text="TDS"
              iconSource={require('../../assets/images/tds_ic.png')}
              screenName="TDS"
            />
            <CustomTouchableOption
              text="strings:engagement"
              iconSource={require('../../assets/images/elink.png')}
              screenName="Engagement"
            />
            <CustomTouchableOption
              text="strings:raise_ticket"
              iconSource={require('../../assets/images/ic_raise_ticket.webp')}
              screenName="ticket"
            />
          </View>

          {/* <View style={styles.lastrow}>
            <CustomTouchableOption
              text="strings:tds_statement"
              iconSource={require('../../assets/images/tds_ic.png')}
              screenName="TDS Statement"
            />
          </View> */}
        </View>
        <NeedHelp />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  mainWrapper: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  name: {
    color: Colors.black,
    fontWeight: 'bold',
    fontSize: responsiveFontSize(1.7),
  },
  code: {
    color: Colors.black,
    fontSize: responsiveFontSize(1.7),
  },
  viewProfile: {
    color: Colors.yellow,
    fontWeight: 'bold',
    fontSize: responsiveFontSize(1.7),
  },
  detailContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: 20,
  },
  ImageProfile: {
    height: 50,
    width: 50,
    borderRadius: 100,
    // backgroundColor: 'red'
  },
  points: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    gap: 5,
    marginTop: 30,
  },
  leftPoint: {
    flex: 1,
    height: responsiveHeight(12),
    backgroundColor: Colors.lightYellow,
    borderTopLeftRadius: 50,
    borderBottomLeftRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  middlePoint: {
    flex: 1,
    height: responsiveHeight(12),
    backgroundColor: Colors.lightYellow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightPoint: {
    flex: 1,
    height: responsiveHeight(12),
    backgroundColor: Colors.lightYellow,
    borderTopRightRadius: 50,
    borderBottomRightRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  greyText: {
    marginTop: 20,
    width: '80%',
    color: Colors.grey,
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: responsiveFontSize(1.3),
    marginBottom: 10,
  },
  point: {
    fontWeight: 'bold',
    color: Colors.black,
    fontSize: responsiveFontSize(1.5),
    marginBottom: 20,
  },
  dashboard: {
    display: 'flex',
    flexDirection: 'column',
    gap: 30,
    marginTop: 30,
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    gap: 20,
    justifyContent: 'space-around',
  },
  lastrow: {
    marginLeft: 5,
  },
  oval: {
    padding: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: responsiveHeight(18),
    width: responsiveWidth(25),
    maxWidth: responsiveWidth(25),
    flexGrow: 1,
    backgroundColor: Colors.white,
    shadowColor: 'rgba(0, 0, 0, 0.8)',
    elevation: 5,
    borderRadius: 100,
  },
  optionIcon: {
    width: responsiveHeight(5),
    height: responsiveHeight(5),
    marginBottom: 20,
  },
  nav: {
    color: Colors.black,
    fontSize: responsiveFontSize(1.5),
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default HomeScreen;
