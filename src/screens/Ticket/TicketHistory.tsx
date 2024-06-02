import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  ImageBackground,
} from 'react-native';

import {responsiveFontSize} from 'react-native-responsive-dimensions';

import {useTranslation} from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

import moment from 'moment';
import Loader from '../../components/Loader';
import {Colors} from '../../utils/constants';
import {getTicketHistory} from '../../utils/apiservice';
import {AppContext} from '../../services/ContextService';
import {VguardUser} from '../../types';

interface TicketItem {
  createdDate: string;
  name: string;
  status: string;
  ticketNo: string;
}

const TicketHistory: React.FC = () => {
  const [data, setData] = useState<TicketItem[]>([]);
  const [profileImage, setProfileImage] = useState('');
  const [userData, setUserData] = useState({
    userName: '',
    userId: '',
    userCode: '',
    userImage: '',
    userRole: '',
  });
  const {t} = useTranslation();
  const [loader, setLoader] = useState(true);
  const context = useContext(AppContext);

  useEffect(() => {
    const user: VguardUser = context.getUserDetails();
    const data = {
      userName: user.name,
      userCode: user.rishta_id,
      pointsBalance: user.balance_points,
      redeemedPoints: user.redeemded_points,
      userImage: user.selfie,

      userId: user.contact,
    };
    setUserData(data);

    getTicketHistory()
      .then(response => response.data)
      .then((responseData: TicketItem[]) => {
        console.log(responseData);
        const sortedData = responseData.sort((a, b) => {
          const dateA = moment(a.createdDate, 'DD MMM YYYY');
          const dateB = moment(b.createdDate, 'DD MMM YYYY');

          const dateComparison = dateB.diff(dateA);
          if (dateComparison !== 0) {
            return dateComparison;
          }

          return b.ticketNo.localeCompare(a.ticketNo);
        });

        setData(sortedData);
        setLoader(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setLoader(false);
      });
  }, []);

  const [expandedRows, setExpandedRows] = useState([]);

  const toggleRow = index => {
    if (expandedRows.includes(index)) {
      setExpandedRows(expandedRows.filter(rowIndex => rowIndex !== index));
    } else {
      setExpandedRows([...expandedRows, index]);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {loader && <Loader isLoading={loader} />}
      <View style={styles.profileDetails}>
        <View style={styles.ImageProfile}>
          <ImageBackground
            source={require('../../assets/images/ic_v_guards_user.png')}
            style={{width: '100%', height: '100%', borderRadius: 100}}
            resizeMode="contain">
            <Image
              source={{uri: profileImage}}
              style={{width: '100%', height: '100%', borderRadius: 100}}
              resizeMode="contain"
            />
          </ImageBackground>
        </View>
        <View>
          <Text style={styles.textDetail}>{userData.userName}</Text>
          <Text style={styles.textDetail}>{userData.userCode}</Text>
        </View>
      </View>
      {data.length === 0 ? (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>{t('strings:no_data')}</Text>
        </View>
      ) : (
        data.map((item, index) => (
          <View key={index} style={styles.listItem}>
            <View style={styles.messageContainer}>
              <Text style={styles.messageText}>{item.createdDate}</Text>
              <Text style={styles.messageTextDes}>{item.name}</Text>
              <TouchableOpacity
                style={{flex: 0.5}}
                onPress={() => toggleRow(index)}>
                <Image
                  resizeMode="contain"
                  style={{height: 20, width: 20}}
                  source={require('../../assets/images/ic_ticket_drop_down2.png')}
                />
              </TouchableOpacity>
              <View style={styles.statusContainer}>
                <Text style={styles.status}>{item.status}</Text>
              </View>
            </View>
            {expandedRows.includes(index) && (
              <View style={styles.expandedContent}>
                <Text style={styles.messageSmallText}>
                  Ticket NO.: {item.ticketNo}
                </Text>
                <Text style={styles.messageSmallText}>
                  Status: {item.status}
                </Text>
              </View>
            )}
          </View>
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: Colors.white,
  },
  profileDetails: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    fontSize: responsiveFontSize(1.7),
  },
  ImageProfile: {
    height: 50,
    width: 50,
    borderRadius: 100,
  },
  textDetail: {
    color: Colors.black,
    fontWeight: 'bold',
    fontSize: responsiveFontSize(1.7),
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    fontSize: responsiveFontSize(2),
    color: Colors.grey,
    fontWeight: 'bold',
  },
  title: {
    fontSize: responsiveFontSize(2.5),
    fontWeight: 'bold',
    color: Colors.black,
    textAlign: 'center',
    marginBottom: 10,
  },
  listItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGrey,
  },
  messageContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  messageText: {
    fontSize: responsiveFontSize(1.6),
    color: Colors.black,
    flex: 1,
    marginRight: 10,
  },
  messageSmallText: {
    fontSize: responsiveFontSize(1.6),
    color: Colors.black,
    // flex: 1,
    // marginRight: 20
  },
  messageTextDes: {
    fontSize: responsiveFontSize(1.6),
    color: Colors.black,
    flex: 2,
    fontWeight: 'bold',
  },
  expandedContent: {
    backgroundColor: Colors.lightYellow,
    alignSelf: 'center',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 5,
    marginTop: 5,
  },
  status: {
    backgroundColor: Colors.yellow,
    color: Colors.black,
    padding: 5,
    fontSize: responsiveFontSize(1.5),
    fontWeight: 'bold',
    borderRadius: 5,
  },
  downImage: {
    height: responsiveFontSize(2),
    width: responsiveFontSize(2),
  },
  statusContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
    flex: 1,
  },
});

export default TicketHistory;
