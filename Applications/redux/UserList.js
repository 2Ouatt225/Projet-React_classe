import React, { useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUsers, setUserSelected } from './userSlice';
import { useNavigation } from '@react-navigation/native';

export default function UserList() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { users, loading, error } = useSelector((state) => state.users);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.itemContainer} 
      onPress={() => {
        dispatch(setUserSelected(item));
        navigation.navigate('UserDetails');
      }}
    >
        <Image source={{ uri: item.picture.thumbnail }} style={styles.thumbnail} />
        <View style={styles.infoContainer}>
            <Text style={styles.name}>{item.name.first} {item.name.last}</Text>
            <Text style={styles.email}>{item.email}</Text>
        </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>User List</Text>
      <FlatList
        data={users}
        keyExtractor={(item) => item.login.uuid}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    paddingTop: 50,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10,  
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  thumbnail: {
      width: 50,
      height: 50,
      borderRadius: 25,
      marginRight: 15
  },
  infoContainer: {
      flex: 1
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
  },
  email: {
      fontSize: 14,
      color: 'gray'
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
});
