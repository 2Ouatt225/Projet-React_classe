import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';

export default function UserDetails() {
  const { userSelected } = useSelector((state) => state.users);

  if (!userSelected) {
    return (
      <View style={styles.container}>
        <Text>No user selected</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri: userSelected.picture.large }} style={styles.image} />
      <Text style={styles.name}>
        {userSelected.name.title} {userSelected.name.first} {userSelected.name.last}
      </Text>
      
      <View style={styles.infoSection}>
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{userSelected.email}</Text>
        
        <Text style={styles.label}>Phone:</Text>
        <Text style={styles.value}>{userSelected.phone}</Text>
        
        <Text style={styles.label}>Cell:</Text>
        <Text style={styles.value}>{userSelected.cell}</Text>
        
        <Text style={styles.label}>Location:</Text>
        <Text style={styles.value}>
          {userSelected.location.city}, {userSelected.location.country}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
    borderWidth: 3,
    borderColor: '#ddd',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  infoSection: {
    width: '100%',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
    marginTop: 10,
  },
  value: {
    fontSize: 18,
    marginBottom: 5,
    color: '#000',
  },
});
