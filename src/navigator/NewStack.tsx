import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { Colors } from '../utils/constants';
import New from '../screens/WhatsNew/New';
import DailyWinner from '../screens/WhatsNew/DailyWinner';



const NewStack = () => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator
      screenOptions={{
          headerStyle: {
            backgroundColor: Colors.yellow
          },
          headerShown: false
        }}>
      <Stack.Screen name="What's New?" component={New} 
        options={{
          headerShown: true
        }}
      />                               
      <Stack.Screen name="Daily Winner" component={DailyWinner} 
        options={{
          headerShown: true
        }}
      />                               
    </Stack.Navigator>
  );
};

export default NewStack;
