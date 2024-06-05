import {View, Text, StyleSheet, BackHandler, ScrollView} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {height, width} from '../../utils/dimensions';
import InputField from '../../components/InputField';
import Buttons from '../../components/Buttons';
import Popup from '../../components/Popup';
import Loader from '../../components/Loader';
import {updatePassword} from '../../utils/apiservice';
import {AppContext} from '../../services/ContextService';
import {VguardUser} from '../../types';
import {Colors} from '../../utils/constants';

const UpdatePassword = ({navigation}) => {
  const context = useContext(AppContext);
  const user: VguardUser = context.getUserDetails();
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => true,
    );
    return () => backHandler.remove();
  });
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [popup, setPopup] = useState({visible: false, content: ''});
  const [loader, setLoader] = useState(false);
  function handleSubmit() {
    if (password.trim().length != 8) {
      setPopup({visible: true, content: 'Password should contain 8 digits'});
      return 
    } 
    if (confirmPassword !== password) {
      setPopup({visible: true, content: 'Password does not match'});
      return 
    } 
    setLoader(true);
    updatePassword(password, user.user_id)
      .then(res => {
        setLoader(false);
        if (res.data.status) {
          navigation.replace('UpdateProfile');
        } else {
          setPopup({visible: true, content: res.data.message});
        }
      })
      .catch(err =>{
        setLoader(false);
        console.log(err);
        setPopup({visible:true,content:'Something went wrong'})
      });
  }

  return (
    <ScrollView
      contentContainerStyle={{alignContent: 'center', gap: 10}}
      // style={{width: width * 0.9, alignSelf: 'center'}}
      style={style.mainWrapper}
      >
      {loader && <Loader isLoading={loader} />}
      {popup.visible && (
        <Popup
          isVisible={true}
          children={<Text>{popup.content}</Text>}
          onClose={() => setPopup({visible: false, content: ''})}
        />
      )}
      <Text style={style.text}>Please Update your password!</Text>
      <InputField
        style={style.input}
        label="Enter Password"
        value={password}
        disabled={false}
        editable={true}
        maxLength={8}
        onChangeText={t => setPassword(t)}
      />
      <InputField
        style={style.input}
        label="Enter Confirm Password"
        value={confirmPassword}
        disabled={false}
        editable={true}
        maxLength={8}
        onChangeText={t => setConfirmPassword(t)}
      />

      <Buttons
        btnStyle={style.button}
        label={'Update'}
        variant="filled"
        onPress={() => handleSubmit()}
        width="80%"
      />
    </ScrollView>
  );
};
const style = StyleSheet.create({
  mainWrapper: {
    padding: 15,
    flex: 1,
    backgroundColor: Colors.white,
  },
  button: {
    alignSelf:'center',
    marginTop: 200,
  },
  input: {width: width * 0.8, color: Colors.black},
  text: {
    fontWeight: 'bold',
    fontSize: 24,
    marginBottom: 100,
    marginTop: 50,
    color: Colors.black,
  },
});
export default UpdatePassword;
