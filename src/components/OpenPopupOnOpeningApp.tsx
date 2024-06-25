import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  Linking,
  Image,
  View,
  Modal,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { responsiveFontSize } from 'react-native-responsive-dimensions';
import { Colors } from '../utils/constants';

interface OpenPopupOnOpeningAppProp {
  onClose: () => void;
}

const OpenPopupOnOpeningApp = ({ onClose }: OpenPopupOnOpeningAppProp) => {
  const [isModalVisible, setModalVisible] = useState(true);

  const handleClose = () => {
    setModalVisible(false);
    onClose();
  };

  return (
    <Modal
      transparent={true}
      visible={isModalVisible}
      onRequestClose={() => setModalVisible(false)}>
      <View style={[styles.modalContainer]}>

        <View
          style={[
            styles.modalContent,
            { width: 200, height: 200 },
          ]}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => handleClose()}>
              <Image
                source={require('../assets/images/ic_close.png')}
                style={styles.closeButtonImage}
              />
            </TouchableOpacity>
          </View>
          <Image
            source={require('../assets/images/banners/welcomebanner.jpg')}
            style={styles.image}
            resizeMode="stretch"
          />


        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    transform: [{ scale: 1.03 }],
  },
  modalContent: {
    backgroundColor: 'white',
    alignItems: 'center',
  },
  image: {
    flex: 1,
    width: '100%',
    alignSelf: 'flex-start',
  },
  closeButton: {
    height: 45,
    width: 45,
    position: 'absolute',
    right: -20,
    top: -20,
    zIndex: 999
  },
  closeButtonImage: {
    height: '100%',
    width: '100%',
  },
  buttonContainer: {
    width: '100%',
  },
});

export default OpenPopupOnOpeningApp;
