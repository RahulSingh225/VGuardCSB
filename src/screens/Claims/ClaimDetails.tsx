import {View, Text, FlatList, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import {getClaimDetails} from '../../utils/apiservice';
import {Claims} from '../../types';
import { width } from '../../utils/dimensions';
import { Colors } from '../../utils/constants';

const ClaimDetails = ({navigation, route}) => {
  const {claimNo} = route.params;
  useEffect(() => {
    getClaimDetails(claimNo).then(res => {
      console.log(res);
      var claim = res.data;
      claim.claim_data = JSON.parse(claim.claim_data);
      setClaimData(claim);
    });
  }, []);

  const [claimData, setClaimData] = useState<Claims | any>(new Claims());

  const renderItem = ({item}) => (
    <View style={styles.item}>
      <Text style={styles.text}>{item.category_name}</Text>
      <Text style={styles.text}>{item.subcategory_name}</Text>
      <Text style={styles.text}>{item.sku_name}</Text>
      <Text style={styles.text}>{item.quantity}</Text>
      <Text style={styles.text}>{item.bm_comments}</Text>
      <Text style={styles.text}>{item.rm_comments}</Text>
    </View>
  );

  return (
    <View>
         <View style={styles.item}>
         <Text style={styles.text}>Claim Number</Text>
      <Text style={styles.text}>{claimData.claim_number}</Text>
      </View>
      <View style={styles.item}>
      <Text style={styles.text}>Claim Date</Text>
      <Text style={styles.text}>{claimData.claim_date}</Text>
      </View>
      <View style={styles.item}>
      <Text style={styles.text}>Claim Status</Text>
      <Text style={styles.status}>{claimData.claim_status}</Text>
      </View>
      <View style={styles.item}>
      <Text style={styles.text}>Claim Outcome</Text>
      <Text style={styles.text}>{claimData.claim_outcome}</Text>
      </View>
      <View style={styles.item}>
      <Text style={styles.text}>Start Date</Text>
      <Text style={styles.text}>{claimData.start_date}</Text>
      </View>
      <View style={styles.item}>
      <Text style={styles.text}>End Date</Text>
      <Text style={styles.text}>{claimData.end_date}</Text>
      </View>
      <Text style={{alignSelf:'center',fontSize:18,fontWeight:'bold',color:'black',marginVertical:10}}>Claim Details</Text>
      <View style={styles.item}>
        <Text style={styles.text}>Category</Text>
        <Text style={styles.text}>Sub-Category</Text>
        <Text style={styles.text}>SKU</Text>
        <Text style={styles.text}>Qty</Text>
      </View>
      <FlatList
        data={claimData.claim_data}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
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
export default ClaimDetails;
