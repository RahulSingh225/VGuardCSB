import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {Image} from 'react-native';
import {Colors} from '../utils/constants';
import Info from '../screens/Info/Info';
import Downloads from '../screens/Info/Downloads';
import ProductCatalogue from '../screens/Info/ProductCatalogue';
import VGuardInfo from '../screens/Info/VGuardInfo';

const InfoStack: React.FC = () => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.yellow,
        },
        headerShown: false,
      }}>
      <Stack.Screen
        name="Info Desk"
        component={Info}
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
        name="Downloads"
        component={Downloads}
        options={{
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="Product Catalogue"
        component={ProductCatalogue}
        options={{
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="V-Guard Info"
        component={VGuardInfo}
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
    </Stack.Navigator>
  );
};

export default InfoStack;
