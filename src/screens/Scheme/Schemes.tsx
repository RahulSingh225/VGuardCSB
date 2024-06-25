import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ReusableUrlCarousel from '../../components/ReusableUrlCarousel';
import CustomTouchableOption from '../../components/CustomTouchableOption';
import NeedHelp from '../../components/NeedHelp';
import { Colors } from '../../utils/constants';
import { getSchemeImages } from '../../utils/apiservice';
import ReusableCarousel from '../../components/ReusableCarousel';

const Schemes: React.FC = () => {
  const carouselData = [
    {
      imageUrl: require('../../assets/images/banners/SchemeOffers.jpg'),
    }
  ];
  return (
    <View style={styles.container}>
      <View style={styles.carousel}>
        <ReusableCarousel data={carouselData}
          carouselHeight={300} />
      </View>
      <View style={styles.mainWrapper}>
        <View style={styles.options}>
          <CustomTouchableOption
            text="strings:product_wise_offers"
            iconSource={require('../../assets/images/ic_product_wise_offers.webp')}
            screenName="Product Wise Offers"
          />
          <CustomTouchableOption
            text="strings:active_scheme_offers"
            iconSource={require('../../assets/images/ic_active_offers.webp')}
            screenName="Active Schemes/Offers"
          />
          <CustomTouchableOption
            text="strings:special_combo_offers"
            iconSource={require('../../assets/images/ic_special_combo_offers.webp')}
            screenName="Special Combo"
            disabled={true}
          />
        </View>
        <NeedHelp />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  carousel: {
    backgroundColor: Colors.white,
  },
  options: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 30,
  },
  mainWrapper: {
    padding: 15,
  },
});

export default Schemes;
