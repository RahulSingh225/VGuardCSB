import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {Image} from 'react-native';
import {Colors} from '../utils/constants';
import Ticket from '../screens/Ticket/Ticket';
import TicketHistory from '../screens/Ticket/TicketHistory';

const TicketStack: React.FC = () => {
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
        name="Raise Tickets"
        component={Ticket}
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
        name="Ticket History"
        component={TicketHistory}
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

export default TicketStack;
