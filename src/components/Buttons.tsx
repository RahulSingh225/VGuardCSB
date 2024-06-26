import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ImageSourcePropType,
} from 'react-native';

import {responsiveFontSize} from 'react-native-responsive-dimensions';
import {Colors} from '../utils/constants';

interface ButtonsProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: 'outlined' | 'filled' | 'disabled' | 'blackButton';
  width?: string | number;
  icon?: ImageSourcePropType;
  iconWidth?: number;
  iconHeight?: number;
  iconGap?: number;
  btnStyle: {};
}

const Buttons: React.FC<ButtonsProps> = ({
  label,
  onPress,
  disabled,
  variant = 'default',
  width,
  icon,
  iconWidth,
  iconHeight,
  iconGap,
  btnStyle,
}) => {
  const getButtonStyle = () => {
    switch (variant) {
      case 'outlined':
        return [styles.outlinedButton, {width}];
      case 'filled':
        return [styles.filledButton, {width}];
      case 'disabled':
        return [styles.disabledButton, {width}];
      case 'blackButton':
        return [styles.blackButton, {width}];
      default:
        return [styles.defaultButton, {width}];
    }
  };

  return (
    <TouchableOpacity
      style={[styles.button, getButtonStyle(), btnStyle]}
      onPress={onPress}
      disabled={variant === 'disabled' || disabled}>
      <View style={[styles.buttonContent, {gap: iconGap}]}>
        <Text
          style={[
            styles.buttonText,
            variant === 'blackButton' && styles.yellowText,
          ]}>
          {label}
        </Text>
        {icon && (
          <Image
            source={icon}
            style={[styles.icon, {width: iconWidth, height: iconHeight}]}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  buttonContent: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    textAlignVertical: 'top',
    fontSize: responsiveFontSize(1.8),
    color: Colors.black,
    fontWeight: 'bold',
  },
  whiteText: {
    color: 'white',
  },
  yellowText: {
    color: Colors.yellow,
  },
  outlinedButton: {
    backgroundColor: 'transparent',
    borderColor: Colors.black,
    borderWidth: 2,
  },
  filledButton: {
    backgroundColor: Colors.yellow,
    borderRadius: 5,
    shadowColor: 'rgba(0, 0, 0, 0.8)',
    elevation: 5,
    shadowOffset: {width: 1, height: 13},
  },
  disabledButton: {
    backgroundColor: 'gray',
  },
  blackButton: {
    backgroundColor: 'black',
    borderRadius: 5,
    shadowColor: 'rgba(0, 0, 0, 0.8)',
    elevation: 5,
    flex: 1,
  },
  defaultButton: {
    backgroundColor: Colors.yellow,
  },
  icon: {
    marginLeft: 5,
  },
});

export default Buttons;
