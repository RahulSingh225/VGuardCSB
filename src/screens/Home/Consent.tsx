import {View, Text, Alert} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import Buttons from '../../components/Buttons';
import { width } from '../../utils/dimensions';
import { AppContext } from '../../services/ContextService';
import { VguardUser } from '../../types';

const Consent = ({navigation}) => {

    const context = useContext(AppContext)

    useEffect(()=>{
        const user:VguardUser = context.getUserDetails();
        setText(`I, ${user.name}, hereby confirm that:\n\n 1. I am not directly employed by or working exclusively for any other brand or company that is a competitor of V-Guard.\n\n 2. I have obtained the necessary consent from my current employer to participate in the V-Guard Rishta Counter Expert loyalty program.\n\n This declaration is made truthfully and accurately to the best of my knowledge.`)
    },[])
  const [text, setText] = useState(
    '  I, Test, hereby confirm that:\n\n 1. I am not directly employed by or working exclusively for any other brand or company that is a competitor of V-Guard.\n\n 2. I have obtained the necessary consent from my current employer to participate in the V-Guard Rishta Counter Expert loyalty program.\n\n This declaration is made truthfully and accurately to the best of my knowledge.',
  );
  return (
    <View>
      <Text
        style={{
          color: 'black',
          fontSize: 18,
          fontStyle: 'normal',
          textAlign: 'auto',
          textAlignVertical: 'center',
          marginVertical:50,
          paddingHorizontal:40
        }}>{text}
      </Text>
      <View style={{flexDirection:'row',justifyContent:'space-around',paddingTop:100}}>
        <Buttons btnStyle={{width:'40%'}} variant='outlined' label='Cancel' onPress={()=>Alert.alert('Please accept terms and conditions')}/>
        <Buttons btnStyle={{width:'40%'}} variant='filled' label='Confirm' onPress={()=>navigation.replace('UpdateProfile')}/>

      </View>
    </View>
  );
};

export default Consent;
