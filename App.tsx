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
import {Alert, PermissionsAndroid} from 'react-native';
import AuthNavigator from './src/navigator/AuthNavigator';
import {api} from './src/utils/apiservice';

function App(): React.JSX.Element {
  async function requestAllPermissions() {
    try {
      const cameraPermission = PermissionsAndroid.PERMISSIONS.CAMERA;
      const contactPermission = PermissionsAndroid.PERMISSIONS.READ_CONTACTS;
      const locationPermission =
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION;
      const notificationPermission =
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS;

      const granted = await PermissionsAndroid.requestMultiple([
        cameraPermission,
        contactPermission,
        locationPermission,
        notificationPermission,
      ]);

      if (
        granted[cameraPermission] === PermissionsAndroid.RESULTS.GRANTED &&
        granted[contactPermission] === PermissionsAndroid.RESULTS.GRANTED &&
        granted[locationPermission] === PermissionsAndroid.RESULTS.GRANTED &&
        granted[notificationPermission] === PermissionsAndroid.RESULTS.GRANTED
      ) {
        console.log('Camera, contact, and location permissions granted.');
      } else {
        Alert.alert(
          'Permission denied',
          'You must grant camera, contact, and location permissions to use this feature.',
        );
      }
    } catch (error) {
      console.error('Permission request error:', error);
    }
  }

  useEffect(() => {
    requestAllPermissions();
    getItem('USER').then(result => {
      api.defaults.headers.common.Authorization = `Bearer ${result.access_token}`;
      setUser(result);
    });
  }, []);
  const [user, setUser] = useState<any>(null);

  const appUtils = React.useMemo(
    () => ({
      signIn: (data: VguardUser) => {
        if (!data.login_date) {
          const first: StorageItem = {
            key: 'FIRST_LOGIN',
            value: JSON.stringify(true),
          };
          addItem(first);
        }
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
      updateUser: (user: VguardUser) => {
        setUser(user);
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
