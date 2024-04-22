import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { responsiveFontSize } from 'react-native-responsive-dimensions';
import Loader from '../../components/Loader';
import { getScanCodeHistory } from '../../utils/apiservice';
import { Colors } from '../../utils/constants';

interface RedemptionHistoryItem {
  scanDate: string;
  couponCode: string;
  scanStatus: string;
}

const UniqueCodeHistory: React.FC = () => {
  const { t } = useTranslation();
  const [loader, showLoader] = useState(true);
  const [redemptionHistoryData, setRedemptionHistoryData] = useState<
    RedemptionHistoryItem[]
  >([]);

  useEffect(() => {
    fetchRedemptionHistory();
  }, []);

  const fetchRedemptionHistory = async () => {
    try {
      const response = await getScanCodeHistory();
      const responseData: RedemptionHistoryItem[] = await response.data;
      setRedemptionHistoryData(responseData);
      showLoader(false);
    } catch (error) {
      console.error('Error fetching redemption history data:', error);
    }
  };

  const renderItem = ({ item }: { item: RedemptionHistoryItem }) => (
    <View style={styles.item}>
      <Text style={styles.text}>{item.scanDate}</Text>
      <Text style={styles.text}>{item.couponCode}</Text>
      <Text style={styles.status}>{item.scanStatus}</Text>
    </View>
  );

  return (
    <View style={styles.mainWrapper}>
      <Loader isLoading={loader} />
      <FlatList
        data={redemptionHistoryData}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    fontSize: responsiveFontSize(2.5),
    fontWeight: 'bold',
    color: Colors.black,
  },
  headerWrapper: {
    padding: 15,
  },
  mainWrapper: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  item: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    display: 'flex',
  },
  text: {
    flexGrow: 1,
    width: '30%',
    color: Colors.black,
    fontWeight: 'bold',
  },
  separator: {
    height: 1,
    backgroundColor: Colors.lightGrey,
  },
  status: {
    width: '24%',
    textAlign: 'center',
    backgroundColor: Colors.yellow,
    color: Colors.black,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    fontWeight: 'bold',
  },
});

export default UniqueCodeHistory;
