import {View, Text, ScrollView, TouchableOpacity, Modal} from 'react-native';
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
import ScrollPopup from '../../components/ScrollPopup';

const RaiseClaim = ({navigation}) => {
  const context = React.useContext(AppContext);
  useEffect(() => {
    const user:VguardUser = context.getUserDetails()
    setfaqContent(
      `Hi ${user.name},\nAs a store manager, you can claim benefits from V-Guard by raising claims for the business done through your outlet. Refer to the below FAQ using the following conditions:\n\n1. When can a claim be raised?\n Answer - Claims for a particular month have to be raised latest by the 7th of the next month.\nFor example: A claim for the month of May can be raised any time in May, but latest by 7th June. After 8th June, you will not be able to raise claims for May anymore.\n\n\n2. How much time does the claim approval take?\n Answer - Claims typically take on average 10-20 days to be passed via the V-Guard sales team.\n\n\n3. How are claims processed? Can my claim be rejected?\n Answer - Claims are reviewed by the V-Guard sales team and verified against the purchase records of your store.\nIf the sales team feels that the claims you are raising does not match with the sales records, then the sales team may contact you to clarify the issue. If the sales team does not find the claim appropriate, they may partially approve (lesser quantity will be approved) or totally reject the claim (0 units will be approved).\n\n\n4. What happens if my claim gets rejected?\n Answer - Claims, once rejected or partially approved, cannot be edited on the system. You may speak to the sales team to understand how they made their decision, but they may not be able to reverse their decision once made. Therefore, please raise valid claims which the sales team can pass without discrepancy.\n\n\n5. For which products can I raise a claim?\n Answer - You can raise claims for approved categories and for which schemes are available on the Rishta app. For approved categories, please refer to the ‘profile section’ and refer to ‘Mapped categories’ field. For available schemes, please refer to the ‘scheme’ section.\n\n\n6. How many points do I get for the claim?\n Answer - Points are assigned based on the approved quantity and the available scheme for the quantity you have raised. The points per product will be visible in the ‘scheme’ section.\n\n\n7. How can I raise a claim?\n Answer - On the claims page, enter the following details:\n-Select the start date and end date of the claim\n-Pin code of the store\n-Upload proof of sale or purchase of V-Guard products from your store (only jpg, png and pdf files, maximum <insert max size>)\n-Select category, sub-category and SKU name and add quantity sold as per uploaded proof.\n-Add more units as needed\n\nPlease note:\nYou cannot raise 2 claims for the same dates, so please upload ALL products sold within those dates at the same time.\nFor example: If you are selecting 1st May to 7th May, you cannot raise another claim from 6th May to 8th May because 6th and 7th are overlapping dates. So if you raise claims for stabilizer category from 1st to 7th, then you will miss out on claiming points for other categories for those dates.\n\n8. After submitting, do I have a chance to edit my claim?\n Answer - Yes, you can submit the claim unless it has already started being reviewed by the V-Guard sales team.\nTo edit, go the ‘claim’s history’ section and find the claim you want to edit. \nIf the status of the claim is ‘pending’, you can edit the claim and re-submit.\nIf the status is ‘in-progress’ or ‘completed’, you will not be able to edit the claim anymore.\n\n9. How do I know what happened to the claim and how many points I earned?\n Answer - In the ‘claim’s history’ section, find the claim you want to know details for and click it.\nYou will be able to see whether the claim was totally approved, partially approved or rejected.\nIf partially approved or rejected, you will be able to view the comments added by the V-Guard sales team and see how many quantity and points are finally approved.\n\n\n10. How do I redeem the points earned?\n Answer - Go to the ‘redeem points’ section and redeem points for money using the mode of transfer that you prefer.`
    );
    setFAQ(true)
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
  const [startDate,setStartDate] = useState(null);
  const [endDate,setEndDate] = useState(null)
  const [claimData, setClaimData] = useState([new ClaimsData()]);
  const [claimDataCount, setClaimDataCount] = useState(1);
  const [faq, setFAQ] = useState(false);
  const [faqcontent, setfaqContent] = useState(
    'Hi (insert name),\nAs a store manager, you can claim benefits from V-Guard by raising claims for the business done through your outlet. Refer to the below FAQ using the following conditions:\n\n1. When can a claim be raised?\n Answer - Claims for a particular month have to be raised latest by the 7th of the next month.\nFor example: A claim for the month of May can be raised any time in May, but latest by 7th June. After 8th June, you will not be able to raise claims for May anymore.\n\n\n2. How much time does the claim approval take?\n Answer - Claims typically take on average 10-20 days to be passed via the V-Guard sales team.\n\n\n3. How are claims processed? Can my claim be rejected?\n Answer - Claims are reviewed by the V-Guard sales team and verified against the purchase records of your store.\nIf the sales team feels that the claims you are raising does not match with the sales records, then the sales team may contact you to clarify the issue. If the sales team does not find the claim appropriate, they may partially approve (lesser quantity will be approved) or totally reject the claim (0 units will be approved).\n\n\n4. What happens if my claim gets rejected?\n Answer - Claims, once rejected or partially approved, cannot be edited on the system. You may speak to the sales team to understand how they made their decision, but they may not be able to reverse their decision once made. Therefore, please raise valid claims which the sales team can pass without discrepancy.\n\n\n5. For which products can I raise a claim?\n Answer - You can raise claims for approved categories and for which schemes are available on the Rishta app. For approved categories, please refer to the ‘profile section’ and refer to ‘Mapped categories’ field. For available schemes, please refer to the ‘scheme’ section.\n\n\n6. How many points do I get for the claim?\n Answer - Points are assigned based on the approved quantity and the available scheme for the quantity you have raised. The points per product will be visible in the ‘scheme’ section.\n\n\n7. How can I raise a claim?\n Answer - On the claims page, enter the following details:\n-Select the start date and end date of the claim\n-Pin code of the store\n-Upload proof of sale or purchase of V-Guard products from your store (only jpg, png and pdf files, maximum <insert max size>)\n-Select category, sub-category and SKU name and add quantity sold as per uploaded proof.\n-Add more units as needed\n\nPlease note:\nYou cannot raise 2 claims for the same dates, so please upload ALL products sold within those dates at the same time.\nFor example: If you are selecting 1st May to 7th May, you cannot raise another claim from 6th May to 8th May because 6th and 7th are overlapping dates. So if you raise claims for stabilizer category from 1st to 7th, then you will miss out on claiming points for other categories for those dates.\n\n8. After submitting, do I have a chance to edit my claim?\n Answer - Yes, you can submit the claim unless it has already started being reviewed by the V-Guard sales team.\nTo edit, go the ‘claim’s history’ section and find the claim you want to edit. \nIf the status of the claim is ‘pending’, you can edit the claim and re-submit.\nIf the status is ‘in-progress’ or ‘completed’, you will not be able to edit the claim anymore.\n\n9. How do I know what happened to the claim and how many points I earned?\n Answer - In the ‘claim’s history’ section, find the claim you want to know details for and click it.\nYou will be able to see whether the claim was totally approved, partially approved or rejected.\nIf partially approved or rejected, you will be able to view the comments added by the V-Guard sales team and see how many quantity and points are finally approved.\n\n\n10. How do I redeem the points earned?\n Answer - Go to the ‘redeem points’ section and redeem points for money using the mode of transfer that you prefer.',
  );
  const [popup, setPopup] = useState({isPopupVisible: false, popupContent: ''});

  const [endDateLimit,setEndDateLimit] = useState({ min:moment().toDate(), max:moment().toDate() });

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
    let filtersku = skuName[position].filter(s => {
      if (s.SubCategoryId == subCategories[position][index].subcategory_id) {
        return s;
      }
    });
    let s = [...skuName];
    filtersku.unshift({PartDescription: 'Select SKU', PartNumber: 0});
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
      return;
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

  const setMaxForEndDate = (startDateEvent:any) => { 

    const selectedMonth = moment(startDateEvent,"DD MMM YYYY").format("MM");
    const currentMonth = moment().format("MM");
    if(selectedMonth == currentMonth){

      setEndDateLimit({
        min:moment(startDateEvent,"DD MMM YYYY").toDate(),
        max:moment().toDate()
      })

    }else{

      setEndDateLimit({
        min:moment(startDateEvent,"DD MMM YYYY").toDate(),
        max:moment(startDateEvent,"DD MMM YYYY").endOf("month").toDate()
      })
      
    }
    
  }

  return (
    <ScrollView style={styles.mainWrapper}>
      {loader && <Loader isLoading={loader} />}
      {popup.isPopupVisible && (
        <ScrollPopup
          isVisible={popup.isPopupVisible}
          onClose={() =>
            setPopup({...popup, isPopupVisible: !popup.isPopupVisible})
          }>
          <Text style={{fontWeight: 'bold'}}>{popup.popupContent}</Text>
        </ScrollPopup>
      )}
      <Modal
        animationType="slide"
        transparent={true}
        visible={faq}
        onDismiss={() => setFAQ(false)}>
        <View
          style={{
            width: width * 0.9,
            maxHeight: height * 0.8,
            alignSelf: 'center',
            marginTop:50,
            backgroundColor: Colors.activity_bg_color,
            flex: 1,
            borderRadius: 10,
            elevation: 10,
            justifyContent: 'center',
            gap: 10,
            flexDirection: 'column',
          }}>
          <Text
            style={{
              color: 'black',
              fontWeight: 'bold',
              fontSize: 24,
              textAlign: 'center',
              }}>
            Claims FAQ
          </Text>
          <ScrollView
            style={{flexGrow: 1, width: '100%'}}
            contentContainerStyle={{
              justifyContent: 'center',
              alignItems: 'center',
            }}>
          <Text
            style={{
              fontWeight: '500',
              color: Colors.black,
              textAlign: 'left',
            }}
          >
            {faqcontent}
          </Text>
          </ScrollView>
          <Buttons
            btnStyle={{width: '50%', alignSelf: 'center',marginVertical:20}}
            onPress={() => setFAQ(false)}
            variant="filled"
            label="OK"
          />
        </View>
      </Modal>
      <View style={styles.mainView}>
        <Buttons
          btnStyle={{alignSelf: 'center'}}
          label="View Claims History"
          onPress={() => navigation.navigate('ClaimsList')}
          width="90%"
          variant="outlined"
        />
        <TouchableOpacity onPress={()=>setFAQ(true)}>
        <Text style={{color:'black',textDecorationLine:'underline',alignSelf:'flex-end',marginRight:20}}>Claim FAQ</Text>
        </TouchableOpacity>
        <Text style={styles.label1}>Raise new claim</Text>

        <DatePickerField
          label="Start Date"
          minimum={
            new Date().getDate() > 7
              ? new Date(moment().year(), moment().month(), 1)
              : new Date(moment().year(), moment().month() - 1, 1)
          }
          maximum={new Date()}
          date={claim?.start_date}
          onDateChange={date => {
            setStartDate(date)
            setClaim({...claim, start_date: date,end_date:''})
            setMaxForEndDate(date)
          }}

        />
     
        <DatePickerField
          label="End Date"
          date={claim?.end_date}
          minimum={ endDateLimit.min }
          maximum={ endDateLimit.max }
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
        {claimData.map((cl, position) => (
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
              <View
                style={{
                  justifyContent: 'center',
                  marginVertical: 5,
                  alignSelf: 'stretch',
                  borderWidth: 1,
                  borderRadius: 10,
                }}>
                <Picker
                  selectedValue={cl.category_name || 0}
                  onValueChange={(value, index) => {
                    handleCategoryChange(index, position);
                  }}>
                  {categories.map(c => (
                    <Picker.Item label={c.label} value={c.value} />
                  ))}
                </Picker>
              </View>
              <View
                style={{
                  justifyContent: 'center',
                  marginVertical: 5,
                  alignSelf: 'stretch',
                  borderWidth: 1,
                  borderRadius: 10,
                }}>
                <Picker
                  selectedValue={cl.subcategory_id || 0}
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
              </View>
              <View
                style={{
                  justifyContent: 'center',
                  marginVertical: 5,
                  alignSelf: 'stretch',
                  borderWidth: 1,
                  borderRadius: 10,
                }}>
                <Picker
                  selectedValue={cl.sku_id || 0}
                  onValueChange={(value, index) => {
                    handleSKUChange(index, position);
                  }}>
                  {skuName[position]?.map(c => (
                    <Picker.Item
                      label={c.PartDescription}
                      value={c.PartNumber}
                    />
                  ))}
                </Picker>
              </View>

              <InputField
                label="Quantity"
                value={cl?.quantity}
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
