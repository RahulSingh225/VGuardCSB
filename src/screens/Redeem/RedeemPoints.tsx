import React, {useState, useEffect, useContext} from 'react';
import {ScrollView, Image, StyleSheet, Text, View} from 'react-native';

import {useTranslation} from 'react-i18next';

import {
  responsiveFontSize,
  responsiveWidth,
} from 'react-native-responsive-dimensions';

import AsyncStorage from '@react-native-async-storage/async-storage';
import ReusableCarousel from '../../components/ReusableCarousel';
import CustomTouchableOption from '../../components/CustomTouchableOption';
import NeedHelp from '../../components/NeedHelp';
import {Colors} from '../../utils/constants';
import {AppContext} from '../../services/ContextService';
import {VguardUser} from '../../types';
import { useFocusEffect } from '@react-navigation/native';
import Loader from '../../components/Loader';
import { getUserProfile } from '../../utils/apiservice';

interface PointData {
  pointsBalance: string;
  redeemedPoints: string;
  tdsPoints: string;
}

const RedeemPoints: React.FC<{navigation: any}> = ({navigation}) => {
  const {t} = useTranslation();
  const context = useContext(AppContext);
  const carouselData = [
    {
      imageUrl: require('../../assets/images/banner_redeem_ppoints.webp'),
    },
    {imageUrl: require('../../assets/images/banner.webp')},
    {
      imageUrl: require('../../assets/images/banner_redeem_ppoints.webp'),
    },
  ];
  const [loader,setLoader] = useState(false)
  const [pointData, setPointData] = useState<PointData>({
    pointsBalance: '',
    redeemedPoints: '',
    tdsPoints: '',
  });

  useFocusEffect(
    React.useCallback(() => {
      setLoader(true)

      const user: VguardUser = context.getUserDetails();
      getUserProfile({user_id:user.user_id}).then(res=>{
        setLoader(false)
        if(res.data.status){
          const vg:VguardUser = res.data.data;
          const data: PointData = {
            pointsBalance: vg?.redeemable_points || 0,
            redeemedPoints: vg?.redeemded_points || 0,
            tdsPoints: vg?.tds_deducted || 0,
          };
          context.updateUser(vg);
          setPointData(data);
        }
      }).catch(err=>{
        setLoader(false)
        const data: PointData = {
          pointsBalance: user?.redeemable_points || 0,
          redeemedPoints: user?.redeemded_points || 0,
          tdsPoints: user?.tds_deducted || 0,
        };
        setPointData(data);
      })
      
    }, []),
  );

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
      <View style={styles.mainWrapper}>
        <Loader isLoading={loader}/>
        <View style={styles.carousel}>
          <ReusableCarousel data={carouselData} />
        </View>
        <View style={styles.points}>
          <View style={styles.leftPoint}>
            <Text style={styles.greyText}>{t('strings:redeemable_points')}</Text>
            <Text style={styles.point}>
              {pointData.pointsBalance ? pointData.pointsBalance : '0'}
            </Text>
          </View>
          <View style={styles.middlePoint}>
            <Text style={styles.greyText}>{t('strings:points_redeemed')}</Text>
            <Text style={styles.point}>
              {pointData.redeemedPoints ? pointData.redeemedPoints : '0'}
            </Text>
          </View>
          <View style={styles.rightPoint}>
            <Text style={styles.greyText}>{t('strings:tds_deducted')}</Text>
            <Text style={styles.point}>
              {pointData.tdsPoints ? pointData.tdsPoints : '0'}
            </Text>
          </View>
        </View>
        <View style={styles.dashboard}>
          <View style={styles.row}>
            <CustomTouchableOption
              text="strings:bank_transfer"
              iconSource={require('../../assets/images/ic_bank_transfer.webp')}
              screenName="Bank Transfer"
            />
            <CustomTouchableOption
              text="UPI Transfer"
              iconSource={require('../../assets/images/upi_transfer.webp')}
              screenName="UPI Transfer"
            />
            <CustomTouchableOption
              text="strings:redeem_products"
              iconSource={require('../../assets/images/ic_redeem_products.webp')}
              screenName="Redeem Products"
              disabled={true}
            />
          </View>
          <View style={styles.row}>
            <CustomTouchableOption
              text="strings:e_gift_cards"
              iconSource={require('../../assets/images/ic_egift_cards.webp')}
              screenName="Gift Voucher"
              disabled={true}
            />
            <CustomTouchableOption
              text="strings:track_your_redemption"
              iconSource={require('../../assets/images/ic_track_your_redemption.webp')}
              screenName="Track Redemption"
              disabled={true}
            />
            <CustomTouchableOption
              text="strings:redemption_history"
              iconSource={require('../../assets/images/ic_redemption_history.webp')}
              screenName="Redemption History"
            />
          </View>
        </View>
        <NeedHelp />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollViewContainer: {
    flexGrow: 1,
    backgroundColor: Colors.white,
  },
  mainWrapper: {
    padding: 15,
  },
  carousel: {
    backgroundColor: Colors.white,
  },
  points: {
    width: responsiveWidth(100),
    display: 'flex',
    flexDirection: 'row',
    gap: 5,
    marginTop: 30,
  },
  leftPoint: {
    width: responsiveWidth(30),
    height: 100,
    backgroundColor: Colors.lightYellow,
    borderTopLeftRadius: 50,
    borderBottomLeftRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  middlePoint: {
    width: responsiveWidth(30),
    height: 100,
    backgroundColor: Colors.lightYellow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightPoint: {
    width: responsiveWidth(30),
    height: 100,
    backgroundColor: Colors.lightYellow,
    borderTopRightRadius: 50,
    borderBottomRightRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  greyText: {
    width: '80%',
    color: Colors.grey,
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: responsiveFontSize(1.7),
    marginBottom: 10,
  },
  point: {
    fontWeight: 'bold',
    color: Colors.black,
    fontSize: responsiveFontSize(1.7),
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
});

export default RedeemPoints;
