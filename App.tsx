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
import {api} from './src/utils/apiservice';
import FillProfile from './src/screens/Home/FillProfile';
import Bank from './src/screens/Home/Bank';

function App(): React.JSX.Element {
  useEffect(() => {
    getItem('USER').then(result => {
      api.defaults.headers.common.Authorization = `Bearer ${result.access_token}`;
      setUser(result);
    });
  }, []);
  const [user, setUser] = useState<any>(null);

  const appUtils = React.useMemo(
    () => ({
      signIn: (data: VguardUser) => {
        api.defaults.headers.common.Authorization = `Bearer ${data.access_token}`;
        console.log(api);
        setUser(data);
        const token: StorageItem = {
          key: 'REFRESH_TOKEN',
          value: data.refresh_token,
        };
        addItem(token).then(res => console.log(res));
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
