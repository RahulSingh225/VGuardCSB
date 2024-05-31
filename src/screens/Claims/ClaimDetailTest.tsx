import {View, Text, FlatList, StyleSheet} from 'react-native';

import React, {useEffect, useState} from 'react';
import {getClaimDetails} from '../../utils/apiservice';
import {Claims} from '../../types';
import {width} from '../../utils/dimensions';
import {Colors} from '../../utils/constants';

const ClaimDetailTest = ({navigation, route}) => {
  const {claimNo} = route.params;
  useEffect(() => {
    getClaimDetails(claimNo).then(res => {
      console.log(res);
      var claim = res.data;
      claim.claim_data = JSON.parse(claim.claim_data);
      setClaimData(claim);
    });
  }, []);
  var data = [
    {
      claim_number: null,
      categoryId: null,
      sub_category_id: null,
      sku_code: null,
      quantity: 15,
      claimed_count: 0,
      bm_comments: 'null',
      rm_comments: 'null',
      category_name: 'Stabilizer',
      subcategory_name: 'Stabilizer MTW',
      sku_name: 'VG CRYSTAL',
    },
    {
      claim_number: null,
      categoryId: null,
      sub_category_id: null,
      sku_code: null,
      quantity: 22,
      claimed_count: 0,
      bm_comments: 'Not Approving all the Skus',
      rm_comments: 'null',
      category_name: 'Stabilizer',
      subcategory_name: 'Stabilizer MTW',
      sku_name: 'DIGI 200',
    },
    {
      claim_number: null,
      categoryId: null,
      sub_category_id: null,
      sku_code: null,
      quantity: 22,
      claimed_count: 0,
      bm_comments: 'Not Approving all the Skus',
      rm_comments: 'null',
      category_name: 'Stabilizer',
      subcategory_name: 'Stabilizer MTW',
      sku_name: 'DIGI 200',
    },
    {
      claim_number: null,
      categoryId: null,
      sub_category_id: null,
      sku_code: null,
      quantity: 22,
      claimed_count: 0,
      bm_comments: 'Not Approving all the Skus',
      rm_comments: 'null',
      category_name: 'Stabilizer',
      subcategory_name: 'Stabilizer MTW',
      sku_name: 'DIGI 200',
    },
    {
      claim_number: null,
      categoryId: null,
      sub_category_id: null,
      sku_code: null,
      quantity: 22,
      claimed_count: 0,
      bm_comments: 'Not Approving all the Skus',
      rm_comments: 'null',
      category_name: 'Stabilizer5',
      subcategory_name: 'Stabilizer MTW',
      sku_name: 'DIGI 200',
    },
    {
      claim_number: null,
      categoryId: null,
      sub_category_id: null,
      sku_code: null,
      quantity: 22,
      claimed_count: 0,
      bm_comments: 'Not Approving all the Skus',
      rm_comments: 'null',
      category_name: 'Stabilizer6',
      subcategory_name: 'Stabilizer MTW',
      sku_name: 'DIGI 200',
    },
  ];
  const [claimData, setClaimData] = useState<Claims | any>(new Claims());

  const renderItem = ({item}) => (
    <>
      <View style={styles.item}>
        <Text style={styles.text}>Category</Text>
        <Text style={styles.text}>{item.category_name}</Text>
      </View>
      <View style={styles.item}>
        <Text style={styles.text}>SubCategory</Text>
        <Text style={styles.text}>{item.subcategory_name}</Text>
      </View>
      <View style={styles.item}>
        <Text style={styles.text}>SKU Name</Text>
        <Text style={styles.text}>{item.sku_name}</Text>
      </View>
      <View style={styles.item}>
        <Text style={styles.text}>Claimed Quantity</Text>
        <Text style={styles.text}>{item.quantity}</Text>
      </View>
      <View style={styles.item}>
        <Text style={styles.text}>Claimed Points</Text>
        <Text style={styles.text}>{item.claimed_points}</Text>
      </View>
      <View style={styles.item}>
        <Text style={styles.text}>BM Approved Qty</Text>
        <Text style={styles.text}>{item.bm_qty}</Text>
      </View>
      <View style={styles.item}>
        <Text style={styles.text}>BM Comments</Text>
        <Text style={styles.text}>{item.bm_comments}</Text>
      </View>
      <View style={styles.item}>
        <Text style={styles.text}>RM Approved Qty</Text>
        <Text style={styles.text}>{item.rm_qty}</Text>
      </View>
     
      <View style={styles.item}>
        <Text style={styles.text}>RM Comments</Text>
        <Text style={styles.text}>{item.rm_comments}</Text>
      </View>
      <View style={styles.item}>
        <Text style={styles.text}>Approved Points</Text>
        <Text style={styles.text}>{item.approved_points}</Text>
      </View>
    </>
  );

  return (
    <View style={{flex:1}}>
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
        <Text style={styles.text}>{claimData.end_date}</Text>
      </View>
      <View style={styles.item}>
        <Text style={styles.text}>End Date</Text>
        <Text style={styles.text}>{claimData.start_date}</Text>
      </View>
      <View style={styles.separator2} />
      <Text
        style={{
          alignSelf: 'center',
          fontSize: 18,
          fontWeight: 'bold',
          color: 'black',
          marginVertical: 10,
        }}>
        Claim Details
      </Text>
      <View style={{marginBottom: 220}}>
        <FlatList
          style={{ marginBottom: 10}}
          contentContainerStyle={{
            paddingVertical: 10,
            overflow: 'hidden',
            width: width * 0.9,
            alignSelf: 'center',
            gap: 10,
           
            justifyContent: 'space-between',
            borderRadius: 10,
            borderColor: Colors.primary_light,
            borderWidth:2,
            elevation: 1,
            shadowColor:Colors.primary_light,
            shadowOpacity:0.1
           
            
          }}
          data={claimData.claim_data}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          ItemSeparatorComponent={() => <View style={styles.separator1} />}
        />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  itemWrapper: {
    width: width * 0.99,

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
    width: width,
    
    padding: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
  },
  scroll_item: {
    maxWidth: width,
    padding: 5,
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
  separator1: {
    height: 2,
    width: width * 0.9,
    alignSelf: 'center',
    backgroundColor: Colors.primary_light,
  },
  separator2: {
    height: 2,
    width: width * 0.9,
    alignSelf: 'center',
    backgroundColor: Colors.lightGrey,
  },
  status: {
    flexGrow: 1,
    width: '30%',
    textAlign: 'center',
    backgroundColor: Colors.yellow,
    color: Colors.black,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    fontWeight: 'bold',
  },
});

export default ClaimDetailTest;
