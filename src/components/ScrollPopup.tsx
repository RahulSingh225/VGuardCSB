import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Image,
  ImageSourcePropType,
  ScrollView,
} from 'react-native';
import closeIcon from '../assets/images/ic_close.png';

import {
  responsiveFontSize,
  responsiveHeight,
} from 'react-native-responsive-dimensions';
import {Colors} from '../utils/constants';

interface PopupProps {
  isVisible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const ScrollPopup: React.FC<PopupProps> = ({isVisible, onClose, children}) => {
  if (!isVisible) {
    return null;
  }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <ScrollView
            style={{flexGrow: 1, width: '100%'}}
            contentContainerStyle={{
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={styles.popupText}>{children}</Text>
          </ScrollView>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Image
              source={closeIcon as ImageSourcePropType}
              style={{flex: 1, width: '100%', height: '100%'}}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    height: '30%',
    width: '80%',
    padding: 30,
    backgroundColor: Colors.yellow,
    borderRadius: 10,
    borderBottomRightRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    width: responsiveHeight(8),
    height: responsiveHeight(8),
  },
  closeButtonText: {
    color: 'blue',
  },
  popupText: {
    color: Colors.black,
    fontSize: responsiveFontSize(2.2),
    textAlign: 'center',
    fontWeight: 'bold',
    lineHeight: responsiveHeight(3),
    width: '70%',
  },
});

export default ScrollPopup;
