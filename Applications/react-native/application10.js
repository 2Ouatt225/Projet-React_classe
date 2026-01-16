import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, Image, ActivityIndicator } from 'react-native';

const UserItem = ({ item }) => {
  return (
    <View style={styles.itemContainer}>
      <Image 
        source={{ uri: item.picture?.large }} 
        style={styles.image} 
      />
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{item.name?.first} {item.name?.last}</Text>
        <Text style={styles.email}>{item.email}</Text>
        <Text style={styles.location}>{item.location?.city}, {item.location?.country}</Text>
      </View>
    </View>
  );
};

export default function Application10() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://randomuser.me/api/?results=10')
      .then(response => response.json())
      .then(data => {
        setUsers(data.results);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={users}
        renderItem={({ item }) => <UserItem item={item} />}
        keyExtractor={item => item.login.uuid}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 20,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginBottom: 15,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: 80,
    height: 80,
    resizeMode: 'cover',
  },
  infoContainer: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 5,
  },
  email: {
    fontSize: 14,
    color: 'gray',
    marginBottom: 3,
  },
  location: {
    fontSize: 14,
    color: '#555',
    fontStyle: 'italic',
  },
});