import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const AuthNavigator: React.FC = () => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen
        name="splash"
        component={SplashScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="login"
        component={LoginScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="forgotPassword"
        component={ForgotPassword}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="loginWithNumber"
        component={LoginWithNumber}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="loginwithotp"
        component={LoginWithOtp}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="updatekyc"
        component={ReUpdateKycOTP}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ReUpdateKyc"
        component={ReUpdateKyc}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="PreviewReUpdateKyc"
        component={ReUpdateKycPreview}
        options={{headerShown: false}}
      />
      <Stack.Screen name="Home" component={HomeStack} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
