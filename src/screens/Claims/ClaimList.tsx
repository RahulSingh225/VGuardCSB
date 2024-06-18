import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  Touchable,
  TouchableOpacity,
  Modal,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {getClaims} from '../../utils/apiservice';
import {height, width} from '../../utils/dimensions';
import {Colors} from '../../utils/constants';
import Loader from '../../components/Loader';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import OptionsMenu from 'react-native-options-menu';
import {Pressable} from 'react-native';

const ClaimList = ({navigation}) => {
  useEffect(() => {
    getClaims().then(res => {
      console.log(res);
      setClaimData(res.data.data);
    });
  }, []);
  const [claimdata, setClaimData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [modal, setModal] = useState({visible: false, data: ''});
  const headerComponent = () => (
    <View style={styles.item}>
      <Text style={styles.text}>Date</Text>
      <Text style={styles.text}>Claim No</Text>
      <Text style={styles.text}>Status</Text>
    </View>
  );

  const renderItem = ({item}) => (
    <View style={styles.item}>
      <Text style={styles.text}>{item.CreatedDate}</Text>
      <Text style={styles.text}>{item.ClaimNo}</Text>
      <Text style={styles.status}>{item.ClaimStatus}</Text>
      <TouchableOpacity style={{paddingHorizontal:5}}
        onPress={() => setModal({visible: true, data: item.ClaimNo})}>
        <Icon name="options-vertical" />
      </TouchableOpacity>
    </View>
  );
  return (
    <ScrollView style={{height: height, width: width}}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modal.visible}
        onRequestClose={() => setModal({visible: false, data: ''})}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            
            <Pressable
              style={styles.option}
              onPress={() => {
                setModal({visible: false});
                navigation.navigate('EditClaim', {claimNo: modal.data});
              }}>
              <Text style={styles.optionText}>Edit</Text>
            </Pressable>
            <Pressable
              style={styles.option}
              onPress={() => {
                setModal({visible: false});
                navigation.navigate('ClaimsDetail', {claimNo: modal.data});
              }}>
              <Text style={styles.optionText}>Details</Text>
            </Pressable>
            <Pressable
              style={styles.option}
              onPress={() => setModal({visible: false, data: ''})}>
              <Text style={[styles.optionText, {color: 'red'}]}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <Loader isLoading={loader} />
      <FlatList
        ListHeaderComponent={headerComponent}
        data={claimdata}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        ItemSeparatorComponent={() => <View style={styles.separator1} />}
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
    textAlign: 'center',
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
  separator1: {
    height: 2,
    width: width * 0.9,
    alignSelf: 'center',
    backgroundColor: Colors.primary_light,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    paddingVertical: 20,
  },
  option: {
    padding: 20,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  optionText: {
    fontSize: 18,
  },
});
export default ClaimList;
