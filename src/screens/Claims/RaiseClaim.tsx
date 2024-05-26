import {View, Text, ScrollView, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import {StyleSheet} from 'react-native';
import {Colors} from '../../utils/constants';
import DatePickerField from '../../components/DatePickerField';
import {Claims, ClaimsData, VguardUser} from '../../types';
import InputField from '../../components/InputField';
import ImagePickerField from '../../components/ImagePickerField';
import {Picker} from '@react-native-picker/picker';
import {
  getCategoryList,
  getSubCategoryList,
  raiseClaim,
} from '../../utils/apiservice';
import Buttons from '../../components/Buttons';
import {height, width} from '../../utils/dimensions';
import moment from 'moment';
import {
  launchCamera,
  launchImageLibrary,
  ImagePickerResponse,
} from 'react-native-image-picker';
import {AppContext} from '../../services/ContextService';
import Popup from '../../components/Popup';
import Loader from '../../components/Loader';

const RaiseClaim = ({navigation}) => {
  const context = React.useContext(AppContext);
  useEffect(() => {
    setLoader(true);
    getCategoryList()
      .then(res => {
        setLoader(false);
        let cat = [{label: 'Select Category', value: 0}];

        res.data.data.map(r => {
          cat.push({label: r, value: r});
        });
        setCategories(cat);
      })
      .catch(e => {
        setLoader(false);
        setPopup({isPopupVisible: true, popupContent: e.message});
      });
  }, []);
  const [loader, setLoader] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [skuName, setSkuName] = useState([]);
  const [claim, setClaim] = useState(new Claims());
  const [claimImage, setClaimImage] = useState([]);
  const [claimData, setClaimData] = useState([new ClaimsData()]);
  const [claimDataCount, setClaimDataCount] = useState(1);
  const [popup, setPopup] = useState({isPopupVisible: false, popupContent: ''});

  function handleCategoryChange(index: number, position: number) {
    console.log(categories[index].label);
    setLoader(true);
    getSubCategoryList({category: categories[index].value})
      .then(res => {
        setLoader(false);
        const data = res.data.data;
        let subcat = data.subCategories;
        subcat.unshift({
          subcategory_name: 'Select Sub-Category',
          subcategory_id: 0,
        });
        let newSubArr = [...subCategories];
        newSubArr[position] = subcat;
        setSubCategories(newSubArr);
        let sku = data.skulist;
        sku.unshift({PartDescription: 'Select SKU', PartNumber: 0});
        let newSKU = [...skuName];
        newSKU[position] = sku;
        setSkuName(newSKU);
        let newArr = [...claimData];
        newArr[position].category_id = categories[index].value;
        newArr[position].category_name = categories[index].label;
        setClaimData(newArr);
      })
      .catch(e => {
        setLoader(false);
        setPopup({isPopupVisible: true, popupContent: e.message});
      });
  }

  function handleSubCategoryChange(index: number, position: number) {
    console.log(subCategories);
    const filtersku = skuName[position].filter(s => {
      if (s.SubCategoryId == subCategories[position][index].subcategory_id) {
        return s;
      }
    });
    let s = [...skuName];
    s[position] = filtersku;
    setSkuName(s);
    let newArr = [...claimData];
    newArr[position].subcategory_id =
      subCategories[position][index].subcategory_id;
    newArr[position].subcategory_name =
      subCategories[position][index].subcategory_name;

    setClaimData(newArr);
  }
  function handleSKUChange(index: number, position: number) {
    const selectedSKU = skuName[position][index];

    // Check for duplicate SKU entry
    const isDuplicate = claimData.some(
      (claim, pos) =>
        claim.sku_id === selectedSKU.PartNumber && pos !== position,
    );

    if (isDuplicate) {
      setPopup({
        isPopupVisible: true,
        popupContent: 'Duplicate SKU entry detected!',
      });
      return;
    }

    let newArr = [...claimData];
    newArr[position].sku_id = skuName[position][index].PartNumber;
    newArr[position].sku_name = skuName[position][index].PartDescription;
    setClaimData(newArr);
    console.log(claimData);
  }
  function handleqtyChange(value: string, postion: number) {
    let newArr = [...claimData];
    newArr[postion].quantity = value;
    setClaimData(newArr);
  }

  function handleCross(position: number) {
    let newArr = [...claimData];
    newArr.splice(position, 1);
    setClaimData(newArr);
    let subArr = [...subCategories];
    subArr.splice(position, 1);
    setSubCategories(subArr);
    let skuArr = [...skuName];
    skuArr.splice(position, 1);
    setSkuName(skuArr);
  }

  const handleGalleryUpload = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        includeBase64: true,
        selectionLimit: 15,
      },
      (response: ImagePickerResponse) => {
        handleImageResponse(response);
      },
    );
  };

  const handleImageResponse = async (response: ImagePickerResponse) => {
    if (response.didCancel) {
      console.error('Image picker was canceled');
    } else if (response.error) {
      console.error('Image picker error: ', response.error);
    } else {
      console.log(response.assets);
      setClaimImage(response.assets);
    }
  };

  function handleSubmit() {
    if (!claim.start_date || !claim.end_date || !claim.pincode) {
      console.log(claim);
      setPopup({
        isPopupVisible: true,
        popupContent: 'Please enter all the details',
      });
      return;
    }
    if (claimImage.length < 1) {
      setPopup({
        isPopupVisible: true,
        popupContent: 'Please upload atleast one proof of sale',
      });
    }
    const user: VguardUser = context.getUserDetails();
    console.log(user);
    var postData: Claims = new Claims();
    postData.user_id = user.user_id;
    postData.unique_id = user.unique_id;
    postData.start_date = claim.start_date;
    postData.rishta_id = user.rishta_id;
    postData.pincode = claim.pincode;
    postData.end_date = claim.end_date;
    postData.claim_date = new Date().toISOString();
    postData.claim_data = JSON.stringify(claimData);

    const formData = new FormData();
    Object.keys(postData).forEach(key => formData.append(key, postData[key]));
    claimImage.forEach(cl =>
      formData.append('files', {
        uri: cl.uri,
        type: cl.type,
        name: cl.fileName,
      }),
    );
    console.log(formData);
    setLoader(true);
    raiseClaim(formData)
      .then(res => {
        console.log(res);
        setClaim(null);
        setClaimData([new ClaimsData()]);
        setClaimImage([]);
        setSkuName([]);
        setSubCategories([]);

        setLoader(false);
        setPopup({isPopupVisible: true, popupContent: res.data.message});
      })
      .catch(e => {
        console.log(e);
        setLoader(false);
        setPopup({isPopupVisible: true, popupContent: e.response.data.message});
      });
  }

  return (
    <ScrollView style={styles.mainWrapper}>
      {loader && <Loader isLoading={loader} />}
      {popup.isPopupVisible && (
        <Popup
          isVisible={popup.isPopupVisible}
          onClose={() =>
            setPopup({...popup, isPopupVisible: !popup.isPopupVisible})
          }>
          <Text style={{fontWeight: 'bold'}}>{popup.popupContent}</Text>
        </Popup>
      )}
      <View style={styles.mainView}>
        <Buttons
          btnStyle={{alignSelf: 'center'}}
          label="View Claims History"
          onPress={() => navigation.navigate('ClaimsList')}
          width="90%"
          variant="outlined"
        />
        <Text style={styles.label1}>Raise new claim</Text>

        <DatePickerField
          label="Start Date"
          minimum={
            new Date().getDate() > 7
              ? new Date(moment().year(), moment().month(), 1)
              : new Date(moment().year(), moment().month() - 1, 1)
          }
          maximum={
            new Date().getDate() > 7
              ? new Date()
              : new Date(
                  moment().year(),
                  moment().month() - 1,
                  moment().subtract(1, 'month').endOf('month').date(),
                )
          }
          date={claim?.start_date}
          onDateChange={date => setClaim({...claim, start_date: date})}
        />
        <DatePickerField
          label="End Date"
          date={claim?.end_date}
          minimum={
            new Date().getDate() > 7
              ? new Date(moment().year(), moment().month(), 1)
              : new Date(moment().year(), moment().month() - 1, 1)
          }
          maximum={
            new Date().getDate() > 7
              ? new Date()
              : new Date(
                  moment().year(),
                  moment().month() - 1,
                  moment().subtract(1, 'month').endOf('month').date(),
                )
          }
          onDateChange={date => setClaim({...claim, end_date: date})}
        />
        <InputField
          label="Pincode"
          value={claim?.pincode}
          onChangeText={t => setClaim({...claim, pincode: t})}
        />
        <TouchableOpacity onPress={() => handleGalleryUpload()}>
          <InputField
            label="Proof of Sale"
            value={`${claimImage.length} files selected`}
            editable={false}
          />
        </TouchableOpacity>
        <Text style={styles.label1}>Claim Details</Text>
        {claimData.map((c, position) => (
          <>
            <View
              style={{
                backgroundColor: Colors.white,
                shadowColor: 'rgba(0, 0, 0, 0.8)',
                elevation: 5,
                borderRadius: 10,
                marginVertical: 20,
                width: '100%',
              }}>
              {position > 0 && (
                <TouchableOpacity
                  onPress={() => {
                    console.log(position);
                    handleCross(position);
                  }}>
                  <Text
                    style={{
                      color: Colors.black,
                      fontSize: 24,
                      alignSelf: 'flex-end',
                      marginRight: 10,
                      fontWeight: 'bold',
                    }}>
                    X
                  </Text>
                </TouchableOpacity>
              )}
              <Picker
                selectedValue={c.category_id || 0}
                onValueChange={(value, index) => {
                  handleCategoryChange(index, position);
                }}>
                {categories.map(c => (
                  <Picker.Item label={c.label} value={c.value} />
                ))}
              </Picker>

              <Picker
                selectedValue={c.subcategory_id || 0}
                onValueChange={(value, index) => {
                  handleSubCategoryChange(index, position);
                }}>
                {subCategories[position]?.map(c => (
                  <Picker.Item
                    label={c.subcategory_name}
                    value={c.subcategory_id}
                  />
                ))}
              </Picker>

              <Picker
                selectedValue={c.sku_id || 0}
                onValueChange={(value, index) => {
                  handleSKUChange(index, position);
                }}>
                {skuName[position]?.map(c => (
                  <Picker.Item label={c.PartDescription} value={c.PartNumber} />
                ))}
              </Picker>

              <InputField
                label="Quantity"
                value={c.quantity}
                numeric={true}
                onChangeText={t => handleqtyChange(t, position)}
              />
            </View>
          </>
        ))}

        {claimData.length < 10 && (
          <Buttons
            variant="outlined"
            width="100%"
            label="Add More"
            onPress={() => {
              setClaimData([...claimData, new ClaimsData()]);
            }}
          />
        )}
        <Buttons
          variant="filled"
          width="100%"
          label="Submit"
          onPress={() => {
            handleSubmit();
          }}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  label1: {
    color: Colors.black,
    textAlign: 'center',
    fontSize: 24,
  },
  mainWrapper: {
    padding: 15,
    flex: 1,
    paddingBottom: 50,
    backgroundColor: Colors.white,
    maxHeight: height * 0.9,
    maxWidth: width,
    alignSelf: 'center',
  },
  mainView: {
    rowGap: 10,
    paddingBottom: 100,
    flex: 1,
    backgroundColor: Colors.white,
    width: width * 0.9,
    alignItems: 'stretch',
  },
});
export default RaiseClaim;
