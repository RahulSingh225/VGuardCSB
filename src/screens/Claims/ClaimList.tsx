import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  Touchable,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {getClaims} from '../../utils/apiservice';
import {height, width} from '../../utils/dimensions';
import {Colors} from '../../utils/constants';
import Loader from '../../components/Loader';

const ClaimList = ({navigation}) => {
  useEffect(() => {
    getClaims().then(res => {
      console.log(res);
      setClaimData(res.data.data);
    });
  }, []);
  const [claimdata, setClaimData] = useState([]);
  const [loader, setLoader] = useState(false);
  const renderItem = ({item}) => (
    <TouchableOpacity
    onPress={() =>
      navigation.navigate('ClaimsDetail', {claimNo: item.ClaimNo})
    }>
    <View style={styles.item}>
     
        <Text style={styles.text}>{item.CreatedDate}</Text>
        <Text style={styles.text}>{item.ClaimNo}</Text>
        <Text style={styles.status}>{item.ClaimStatus}</Text>
     
    </View>
    </TouchableOpacity>
  );
  return (
    <ScrollView style={{height: height, width: width}}>
      <Loader isLoading={loader} />
      <FlatList
        data={claimdata}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  itemWrapper: {
    width: width * 0.99,

    flex: 1,
    alignSelf: 'center',
    paddingVertical: 5,
    gap: 3,
    borderRadius: 10,
    borderColor: Colors.primary_light,
    backgroundColor: Colors.white,
    shadowColor: 'rgba(0, 0, 0, 0.8)',
    elevation: 5,
  },
  textKey: {
    color: Colors.black,
    fontWeight: 'bold',
  },
  textValue: {
    color: Colors.grey,
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
export default ClaimList;
