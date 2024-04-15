import { View, Text } from 'react-native'
import React from 'react'
import ImagePickerField from '../../components/ImagePickerField'
import Constants from '../../utils/constants'
import { getImageUrl } from '../../utils/fileutils'

const Test = () => {

    const image = getImageUrl('tata','PROFILE')
    console.log(image)
  return (
    <View>
    <ImagePickerField label='Selfie'
    imageRelated='PROFILE'
    editable={false}
    initialImage='tata'/>
    </View>
  )
}

export default Test