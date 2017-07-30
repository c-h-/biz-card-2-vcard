import React from 'react';
import {
  View,
  Text,
} from 'react-native';
import styles from './styles';

const NotFound = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>
        Nothing found here
      </Text>
    </View>
  );
};

export default NotFound;
