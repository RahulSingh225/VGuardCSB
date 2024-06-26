import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Modal,
  Dimensions,
  ImageBackground,
} from 'react-native';
import {
  launchCamera,
  launchImageLibrary,
  ImagePickerResponse,
} from 'react-native-image-picker';

import {responsiveFontSize} from 'react-native-responsive-dimensions';

import Popup from './Popup';

import {Colors} from '../utils/constants';
import {getImageUrl} from '../utils/fileutils';

const {height} = Dimensions.get('window');

interface ImagePickerFieldProps {
  label: string;
  onImageChange?: (
    image: string,
    type: string,
    imageName: string,
    label: string,
  ) => void;
  imageRelated: string;
  initialImage?: string;
  getImageRelated?: string;
  editable?: boolean;
}

const ImagePickerField: React.FC<ImagePickerFieldProps> = ({
  label,
  onImageChange,
  initialImage,
  imageRelated,
  getImageRelated,
  editable = true,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedImageName, setSelectedImageName] = useState<string | null>(
    null,
  );
  const [showImagePickerModal, setShowImagePickerModal] = useState(false);

  const [isImageSelected, setIsImageSelected] = useState(false);

  const [isPopupVisible, setPopupVisible] = useState(false);
  const [popupContent, setPopupContent] = useState('');
  const [showImageModal, setShowImageModal] = useState(false);
  useEffect(() => {
    console.log(initialImage, imageRelated);
    if (initialImage) {
      console.log('Huhh');

      // const image = await getFile(initialImage, imageRelated, "2");
      const image = getImageUrl(initialImage, imageRelated);

      setIsImageSelected(true);
      setSelectedImage(image);
      setSelectedImageName(initialImage);
    }
  }, [initialImage]);

  const handleImagePickerPress = () => {
    setShowImagePickerModal(true);
  };

  const handleImageModalToggle = () => {
    setShowImageModal(!showImageModal);
  };

  const handleCameraUpload = () => {
    setShowImagePickerModal(false);
    launchCamera(
      {
        mediaType: 'photo',
        includeBase64: false,
      },
      (response: ImagePickerResponse) => {
        handleImageResponse(response);
      },
    );
  };

  const handleGalleryUpload = () => {
    setShowImagePickerModal(false);
    launchImageLibrary(
      {
        mediaType: 'photo',
        includeBase64: true,
        selectionLimit: 15,
      },
      (response: ImagePickerResponse) => {
        handleImageResponse(response);
      },
    );
  };

  const handleImageResponse = async (response: ImagePickerResponse) => {
    if (response.didCancel) {
      console.error('Image picker was canceled');
    } else if (response.error) {
      console.error('Image picker error: ', response.error);
    } else {
        
      setSelectedImage(response?.assets[0]?.uri);
      setSelectedImageName(response?.assets[0]?.fileName || 'Image');
      setIsImageSelected(true);

      try {
        // const apiResponse = await triggerApiWithImage(fileData);
        onImageChange(
          response?.assets[0]?.uri,
          response?.assets[0]?.type,
          response?.assets[0]?.fileName,
          label,
        );
      } catch (error) {
        console.error(
          'Error triggering API with image in ImagePickerField:',
          error,
        );
        throw error;
      }
    }
  };

  return (
    <View style={styles.container}>
      <Popup isVisible={isPopupVisible} onClose={() => setPopupVisible(false)}>
        <Text>{popupContent}</Text>
      </Popup>
      <TouchableOpacity
        style={[styles.input, isImageSelected && styles.selectedContainer]}
        onPress={() => handleGalleryUpload()}>
        <View style={[styles.labelContainer]}>
          <Text
            style={[
              styles.notfocusedLabel,
              isImageSelected && styles.focusedLabel,
            ]}>
            {label}
          </Text>
        </View>
        {selectedImage ? (
          <View style={styles.imageContainer}>
            <Text style={styles.imageName}>{label}</Text>
            <TouchableOpacity onPress={handleImageModalToggle}>
              <ImageBackground
                source={require('../assets/images/no_image.webp')}
                style={styles.image}
                resizeMode="cover">
                <Image
                  source={{uri: selectedImage}}
                  style={styles.image}
                  resizeMode="cover"
                />
              </ImageBackground>
              {/* <Image source={{ uri: selectedImage }} style={styles.image} resizeMode="cover" /> */}
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.cameraContainer}>
            <Text style={styles.label}>{label}</Text>
            <Image
              source={require('../assets/images/photo_camera.png')}
              style={styles.cameraImage}
              resizeMode="contain"
            />
          </View>
        )}
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={showImageModal}
        onRequestClose={handleImageModalToggle}>
        <View style={styles.modalcontainer}>
          <TouchableOpacity onPress={handleImageModalToggle}>
            <Image
              resizeMode="contain"
              style={{width: 50, height: 50}}
              source={require('../assets/images/ic_close.png')}
            />
          </TouchableOpacity>
          {/* <ImageBackground
                        source={require('../assets/images/no_image.webp')}
                        style={{ width: '100%', height: '70%' }}
                        resizeMode="contain"
                    > */}
          <Image
            source={{uri: selectedImage as string}}
            style={{width: '100%', height: '70%'}}
            resizeMode="contain"
          />
          {/* </ImageBackground> */}
          {/* <Image source={{ uri: selectedImage }} style={{ width: '70%', height: '70%' }} resizeMode="contain" /> */}
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={showImagePickerModal}
        hardwareAccelerated={true}>
        <TouchableOpacity
          style={styles.modalContainer}
          onPressOut={() => setShowImagePickerModal(false)}
          activeOpacity={1}>
          <View style={styles.modalContent}>
            <View style={{flexDirection: 'column', gap: 15, width: '90%'}}>
              <Text style={styles.blackHeading}>Select Action</Text>
              <TouchableOpacity onPress={() => handleCameraUpload()}>
                <Text style={styles.blackText}>Capture photo from camera</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleGalleryUpload()}>
                <Text style={styles.blackText}>Select photo from gallery</Text>
              </TouchableOpacity>
            </View>
            {/* <Button mode="text" onPress={() => setShowImagePickerModal(false)}>
                            Close
                        </Button> */}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  input: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    borderColor: Colors.lightGrey,
    borderWidth: 2,
    borderRadius: 5,
    paddingHorizontal: 10,
    justifyContent: 'space-between',
    position: 'relative',
  },
  labelContainer: {
    position: 'absolute',
    top: 0,
    left: 10,
    right: 0,
    justifyContent: 'center',
    zIndex: 1,
  },
  label: {
    fontSize: responsiveFontSize(1.7),
    fontWeight: 'bold',
    color: Colors.black,
    width: '92%',
  },
  focusedLabel: {
    position: 'absolute',
    top: -10,
    left: 0,
    fontSize: responsiveFontSize(1.5),
    fontWeight: 'bold',
    color: Colors.black,
    // backgroundColor: Colors.white,
    paddingHorizontal: 3,
  },
  notfocusedLabel: {
    display: 'none',
  },
  cameraContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cameraImage: {
    width: 25,
    height: 20,
  },
  imageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  image: {
    width: 25,
    height: 20,
    marginRight: 0,
    // backgroundColor: Colors.lightGrey
  },
  modalContainer: {
    flex: 1,
  },
  modalContent: {
    width: '80%',
    alignSelf: 'center',
    // height: height / 6,
    top: height / 2.8,
    margin: 20,
    backgroundColor: Colors.white,
    borderRadius: 5,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 100,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    alignItems: 'center',
  },
  imageName: {
    color: Colors.black,
    fontSize: responsiveFontSize(1.5),
    width: '92%',
  },
  selectedContainer: {
    borderColor: Colors.grey,
  },
  modalcontainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalImageContent: {
    backgroundColor: 'white',
    padding: 20,
    gap: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  blackText: {
    color: Colors.black,
    fontSize: responsiveFontSize(2.2),
    width: '100%',
  },
  blackHeading: {
    color: Colors.black,
    fontSize: responsiveFontSize(2.3),
    fontWeight: 'bold',
  },
});

export default ImagePickerField;
