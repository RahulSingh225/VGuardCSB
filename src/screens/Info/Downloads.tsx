import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking, StyleSheet } from 'react-native';

import { responsiveFontSize } from 'react-native-responsive-dimensions';

import { useTranslation } from 'react-i18next';
import { Colors } from '../../utils/constants';

interface DownloadItem {
  description: string;
  fileName: string;
  fullURL: string;
}

const Downloads: React.FC = () => {
  const baseURL = 'https://vguardrishta.com/';
  const [data, setData] = useState<DownloadItem[]>([]);
  const { t } = useTranslation();

  useEffect(() => {
    getDownloads()
      .then(response => response.data)
      .then(responseData => {
        const updatedData: DownloadItem[] = responseData.map(item => ({
          ...item,
          fullURL: baseURL + item.fileName,
        }));
        setData(updatedData);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []); 

  return (
    <View style={styles.container}>
      <ScrollView>
        {data.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.listItem}
            onPress={() => Linking.openURL(item.fullURL)}
          >
            <View style={styles.messageContainer}>
              <Text style={styles.messageText}>{item.description}</Text>
            </View>
            <Text style={styles.openLinkText}>View</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: Colors.white,
  },
  title: {
    fontSize: responsiveFontSize(2.5),
    fontWeight: 'bold',
    color: Colors.black,
    textAlign: 'center',
    marginBottom: 10,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGrey,
  },
  messageContainer: {
    flex: 1,
  },
  messageText: {
    fontSize: responsiveFontSize(2),
    color: Colors.black,
  },
  openLinkText: {
    color: Colors.yellow,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Downloads;
