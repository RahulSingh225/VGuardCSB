import React, {useEffect} from 'react';
import {View, Image, StyleSheet} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {Colors} from '../../utils/constants';

const SplashScreen: React.FC<{navigation: any}> = ({navigation}) => {
  useFocusEffect(
    React.useCallback(() => {
      const timeoutId = setTimeout(() => {
        navigation.navigate('loginWithNumber');
      }, 1000);

      return () => clearTimeout(timeoutId);
    }, [navigation]),
  );

  return (
    <View style={styles.mainWrapper}>
      <View style={styles.imageContainer}>
        <Image
          source={require('../../assets/images/group_910.png')}
          style={styles.imageVguard}
        />
        <Image
          source={require('../../assets/images/cs_logo.png')}
          style={styles.imageSaathi}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainWrapper: {
    flex: 1,
    padding: 25,
    backgroundColor: Colors.white,
  },
  imageContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '75%',
    width: '100%',
    gap: 100,
  },
  imageVguard: {
    width: 200,
    height: 73,
  },
  imageSaathi: {
    width: 200,
    height: 186,
  },
});

export default SplashScreen;
