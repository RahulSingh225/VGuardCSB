import { StyleSheet, View } from 'react-native';
import React from 'react';
import CustomTouchableOption from '../../components/CustomTouchableOption';

const TDSScreen = ({ navigation }: any) => {

    return (
        <View style={styles.flexRow}>
            <CustomTouchableOption
                text="strings:tds_certificate"
                iconSource={require('../../assets/images/tds_ic.png')}
                screenName="TDS Certificate"
            />
            <CustomTouchableOption
                text="strings:tds_statement"
                iconSource={require('../../assets/images/tds_ic.png')}
                screenName="TDS Statement"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    flexRow: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        height: '100%'
    }
})

export default TDSScreen;
