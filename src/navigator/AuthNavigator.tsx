import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SplashScreen from '../screens/Auth/SplashScreen';

import Login from '../screens/Auth/Login';
import LoginWithNumber from '../screens/Auth/LoginWithNumber';
import LoginWithOtp from '../screens/Auth/LoginWithOtp';

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
        component={Login}
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
    </Stack.Navigator>
  );
};

export default AuthNavigator;
