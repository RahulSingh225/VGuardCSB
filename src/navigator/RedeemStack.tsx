import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {Image} from 'react-native';
import {Colors} from '../utils/constants';
import RedeemPoints from '../screens/Redeem/RedeemPoints';
import Bank from '../screens/Redeem/InstantBankTransfer';
import UpiTransfer from '../screens/Redeem/UpiTransfer';
import RedeemProducts from '../screens/Redeem/RedeemProducts';

import RedemptionHistory from '../screens/Redeem/RedemptionHistory';

type RedeemStackParamList = {
  'Redeem Products': undefined;
  'Bank Transfer': undefined;
  'Paytm Transfer': undefined;
  redeemproducts: undefined;
  'Gift Voucher': undefined;
  'Track Redemption': undefined;
  'Redemption History': undefined;
  'View Cart': undefined;
  'Add Address': undefined;
  'UPI Transfer': undefined;
};

const RedeemStack: React.FC = () => {
  const Stack = createNativeStackNavigator<RedeemStackParamList>();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.yellow,
        },
        headerShown: false,
      }}>
      <Stack.Screen
        name="RedeemPoints"
        component={RedeemPoints}
        options={{
          headerShown: true,
          headerRight: () => (
            <Image
              style={{width: 70, height: 50}}
              resizeMode="contain"
              source={require('../assets/images/group_910.png')}
            />
          ),
        }}
      />
      <Stack.Screen
        name="Bank Transfer"
        component={Bank}
        options={{
          headerShown: true,
        }}
      />

      <Stack.Screen
        name="redeemproducts"
        component={RedeemProducts}
        options={{
          headerShown: true,
        }}
      />

      
      <Stack.Screen
        name="Redemption History"
        component={RedemptionHistory}
        options={{
          headerShown: true,
          headerRight: () => (
            <Image
              style={{width: 70, height: 50}}
              resizeMode="contain"
              source={require('../assets/images/group_910.png')}
            />
          ),
        }}
      />

      <Stack.Screen
        name="UPI Transfer"
        component={UpiTransfer}
        options={{
          headerShown: true,
        }}
      />
    </Stack.Navigator>
  );
};

export default RedeemStack;
