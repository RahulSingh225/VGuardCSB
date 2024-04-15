/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {NavigationContainer} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';

import {AppContext} from './src/services/ContextService';
import BottomTab from './src/navigator/BottomTab';
import {
  addItem,
  getItem,
  removeItem,
  StorageItem,
} from './src/services/StorageService';
import {VguardUser} from './src/types';
import {Text} from 'react-native-paper';
import {View} from 'react-native';
import AuthNavigator from './src/navigator/AuthNavigator';
import Notification from './src/screens/BottomTab/Notification';
import EditProfile from './src/screens/BottomTab/EditProfile';
import Test from './src/screens/WhatsNew/Test';
import UpdatePassword from './src/screens/Home/UpdatePassword';

function App(): React.JSX.Element {
  useEffect(() => {
    getItem('USER').then(result => setUser(result));
  }, []);
  const [user, setUser] = useState<any>(null);

  const appUtils = React.useMemo(
    () => ({
      signIn: (data: VguardUser) => {
        setUser(data);
        const item: StorageItem = {key: 'USER', value: data};
        addItem(item).then(res => console.log(res));
      },
      signOut: () => {
        removeItem('USER').then(res => {
          setUser(null);
        });
      },
      getUserDetails: () => user,
    }),
    [user],
  );
  return (
    <NavigationContainer>
      {user ? (
        <AppContext.Provider value={{...appUtils, ...user}}>
          <BottomTab />
        </AppContext.Provider>
      ) : (
        <AppContext.Provider value={appUtils}>
          <AuthNavigator />
        </AppContext.Provider>
      )}
    </NavigationContainer>
  );
}

export default App;
