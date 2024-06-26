// InputField.tsx

import React, { useState, useRef } from 'react';
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity, ImageBackground } from 'react-native';
// import Colors from '.';
import { responsiveFontSize } from 'react-native-responsive-dimensions';
import { Colors } from '../utils/constants';

interface InputFieldProps {
  label: string;
  errorMessage?: string;
  disabled?: boolean;
  isImage?: boolean;
  imageSource?: string;
  onPressImage?: () => void;
  onChangeText: (value: string) => void;
  numeric?: boolean;
  maxLength?: number;
  imageName?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  errorMessage,
  disabled,
  isImage,
  imageSource,
  imageName,
  onPressImage,
  onChangeText,
  numeric,
  maxLength,
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const hasInput = rest.value && rest.value.toString().trim() !== '';

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    if (!isImage && !hasInput) {
      setIsFocused(false);
    }
  };


  return (
    <View style={[styles.container, isFocused || hasInput || isImage ? styles.focusedContainer : null]}>
      <Text style={[styles.label, isFocused || hasInput || isImage ? styles.focusedLabel : null]}>{label}</Text>
      {isImage ? (
        <View style={{ flexDirection: 'row' }}>
          <TextInput
            style={[styles.input, styles.disabledInput, { flex: 1 }]}
            editable={false}
            value={label}
            {...rest}
          />
          <TouchableOpacity onPress={onPressImage}>
            <ImageBackground
              source={require('../assets/images/no_image.webp')}
              style={styles.image}
              resizeMode="cover"
            >
              <Image
                source={{ uri: imageSource }}
                style={styles.image}
                resizeMode="cover"
              />
            </ImageBackground>
          </TouchableOpacity>
        </View>
      ) : (
        <TextInput
          style={[styles.input, disabled && styles.disabledInput]}
          editable={!disabled}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChangeText={onChangeText}
          keyboardType={numeric ? 'numeric' : 'default'}
          maxLength={maxLength}
          {...rest}
        />
      )}
      {errorMessage && <Text style={styles.error}>{errorMessage}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 50,
    marginBottom: 20,
    borderColor: Colors.lightGrey,
    borderWidth: 2,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  focusedContainer: {
    borderColor: Colors.grey,
  },
  label: {
    fontSize: responsiveFontSize(1.7),
    fontWeight: 'bold',
    color: Colors.black,
    backgroundColor: Colors.white,
    paddingHorizontal: 3,
    top:7
  },
  focusedLabel: {
    position: 'absolute',
    top: -8,
    left: 10,
    fontSize: responsiveFontSize(1.5),
    color: Colors.black,
  },
  input: {
    color: Colors.black,
    paddingTop: 10,
  },
  disabledInput: {
    color: Colors.grey,
  },
  image: {
    width: 35,
    height: 35,
    alignSelf: 'flex-end',
    // backgroundColor: Colors.lightGrey
  },
  error: {
    color: 'red',
    marginTop: 5,
  },
  imageName: {
    color: Colors.grey,
  },
});

export default InputField;