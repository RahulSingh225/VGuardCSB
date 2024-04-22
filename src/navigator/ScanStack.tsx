import React, { useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AddWarranty from '../screens/Scan/AddWarranty';
import ProductRegistration from '../screens/Scan/ProductRegistration';
import ProductRegistrationForm from '../screens/Scan/ProductRegistrationForm';
import ScanCode from '../screens/Scan/ScanCode';
import ScanCodeReg from '../screens/Scan/ScanCodeReg';
import UniqueCodeHistory from '../screens/Scan/UniqueCodeHistory';
import { Colors } from '../utils/constants';

const ScanStack: React.FC = () => {
    type ScanStackParams = {
        'Product Registratrion': undefined;
        'Scan Code': undefined;
        'Unique Code History': undefined;
        'Product Registration Form': undefined;
        'Add Warranty': undefined;
        'Scan-in Code': undefined;
    };

    const Stack = createNativeStackNavigator<ScanStackParams>();

    return (
        <>
            <Stack.Navigator
                screenOptions={{
                    headerStyle: {
                        backgroundColor: Colors.yellow,
                    },
                    headerShown: false,
                }}>
                <Stack.Screen
                    name="Product Registratrion"
                    component={ProductRegistration}
                    options={{
                        headerShown: true,
                    }}
                />
                <Stack.Screen
                    name="Scan Code"
                    component={ScanCode}
                    options={{
                        headerShown: true,
                    }}
                />
                <Stack.Screen
                    name="Scan-in Code"
                    component={ScanCodeReg}
                    options={{
                        headerShown: true,
                    }}
                />
                <Stack.Screen
                    name="Unique Code History"
                    component={UniqueCodeHistory}
                    options={{
                        headerShown: true,
                    }}
                />
                <Stack.Screen
                    name="Product Registration Form"
                    component={ProductRegistrationForm}
                    options={{
                        headerShown: true,
                    }}
                />
                <Stack.Screen
                    name="Add Warranty"
                    component={AddWarranty}
                    options={{
                        headerShown: true,
                    }}
                />
            </Stack.Navigator>
        </>
    );
};

const styles = StyleSheet.create({
    languageContainer: {
        borderWidth: 1,
        borderColor: Colors.black,
        paddingVertical: 2,
        paddingHorizontal: 5,
        borderRadius: 5,
        flexDirection: 'row',
        alignItems: 'center',
    },
    languagePickerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.white,
    },
    closeText: {
        marginTop: 20,
        color: Colors.black,
        backgroundColor: Colors.yellow,
        paddingHorizontal: 15,
        paddingVertical: 5,
        borderRadius: 5,
        fontWeight: 'bold',
    },
});

export default ScanStack;
