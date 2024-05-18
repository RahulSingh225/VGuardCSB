import {View, Text, StyleSheet, ScrollView} from 'react-native';
import React, {useEffect, useState} from 'react';
import {getClaims} from '../../utils/apiservice';
import {height, width} from '../../utils/dimensions';
import {Colors} from '../../utils/constants';

const ClaimList = () => {
  useEffect(() => {
    getClaims().then(res => setClaimData(res.data.data));
  }, []);
  const [claimdata, setClaimData] = useState([]);
  return (
    <ScrollView style={{height: height, width: width}}>
      {claimdata.map(c => (
        <>
          <View style={styles.itemWrapper}>
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.textKey}>Claim No. :</Text>
              <Text style={styles.textValue}>{c.ClaimNo}</Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.textKey}>{'Raised On :'}</Text>
              <Text style={styles.textValue}>{c.CreatedDate}</Text>
            </View>
          </View>
        </>
      ))}
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
});
export default ClaimList;
