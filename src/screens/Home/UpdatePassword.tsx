import {View, Text, StyleSheet, BackHandler} from 'react-native';
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
    if (confirmPassword !== password) {
      setPopup({visible: true, content: 'Password does not match'});
    } else {
      setLoader(true);
      updatePassword(password, user.user_id)
        .then(res => {
          setLoader(false);
          if (res.data.status) {
            navigation.replace('Profile');
          } else {
            setPopup({visible: true, content: res.data.message});
          }
        })
        .catch(err => console.log(err));
    }
  }

  return (
    <View
      style={{
        width: width,
        height: height * 0.9,
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
      }}>
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
    </View>
  );
};
const style = StyleSheet.create({
  button: {
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
