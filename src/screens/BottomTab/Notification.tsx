import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  FlatList,
} from 'react-native';

import {
  responsiveFontSize,
  responsiveWidth,
} from 'react-native-responsive-dimensions';

import Loader from '../../components/Loader';
import { Colors } from '../../utils/constants';
import { getNotifications } from '../../utils/apiservice';

interface NotificationItem {
  alertDesc: string;
  alertDate: string;
}

const Notification: React.FC = () => {
  const [loader, showLoader] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    showLoader(true);

    getNotifications().then(async response => {
      const result = await response.data;
      setNotifications(result);
      showLoader(false);
    });
  }, []);

  return (
    <ScrollView style={styles.mainWrapper}>
      {loader && <Loader isLoading={loader} />}
      <FlatList
        data={notifications}
        renderItem={({item}) => (
          <View style={styles.messageItem}>
            <Image
              style={styles.image}
              source={require('../../assets/images/ic_alert_.png')}
            />
            <View style={styles.messageContainer}>
              <Text style={styles.messageHeader}>{item.alertDate}</Text>
              <ScrollView style={styles.messageTextContainer} horizontal={true}>
                <Text style={styles.messageText}>{item.alertDesc}</Text>
              </ScrollView>
            </View>
          </View>
        )}
        // keyExtractor={item => item.alertDesc}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  mainWrapper: {
    backgroundColor: Colors.white,
    flex: 1,
    paddingHorizontal: 15,
  },
  header: {
    color: Colors.black,
    fontWeight: 'bold',
    fontSize: responsiveFontSize(2.5),
    textAlign: 'center',
  },
  messageItem: {
    borderBottomWidth: 1,
    borderColor: Colors.lightGrey,
    paddingVertical: 10,
    display: 'flex',
    flexDirection: 'row',
    gap: 20,
    alignItems: 'center',
  },
  messageHeader: {
    fontSize: responsiveFontSize(1.5),
    fontWeight: 'bold',
    color: Colors.black,
  },
  messageText: {
    fontSize: responsiveFontSize(1.7),
    color: Colors.black,
  },
  messageContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  image: {
    height: responsiveFontSize(5),
    width: responsiveFontSize(5),
  },
  messageTextContainer: {
    maxWidth: responsiveWidth(75),
    overflow: 'hidden',
  },
});

export default Notification;
