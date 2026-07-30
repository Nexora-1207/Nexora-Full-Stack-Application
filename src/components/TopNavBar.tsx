import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  /**
   * Title to display in the centre of the navigation bar.
   * "title" is kept for backward compatibility – if provided it will be used; otherwise
   * the "categoryName" prop is rendered.
   */
  title?: string;
  categoryName?: string;
};

const TopNavBar: React.FC<Props> = ({ title, categoryName }) => {
  const navigation = useNavigation<any>();
  const isDark = useColorScheme() === 'dark';
  const themeCyan = isDark ? '#00F0FF' : '#008B8B';
  const displayTitle = title ?? categoryName ?? '';
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate('Home')}>
        <Ionicons name="home" size={24} color={themeCyan} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
        <Ionicons name="chevron-back" size={24} color={themeCyan} />
      </TouchableOpacity>
      <Text style={styles.title}>{displayTitle}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 10,
    backgroundColor: 'transparent',
  },
  backBtn: {
    padding: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFF',
  },
});

export default TopNavBar;
