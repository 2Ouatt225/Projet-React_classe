import { StyleSheet, Text, View, FlatList, Image } from 'react-native';
import React from 'react';

const articles = [
  { id: '1', name: 'Smartphone XML', price: '999 Fr', like: 120, image: 'https://picsum.photos/id/1/200/200' },
  { id: '2', name: 'Laptop Pro', price: '1299 Fr', like: 85, image: 'https://picsum.photos/id/0/200/200' },
  { id: '3', name: 'Casque Audio', price: '199 Fr', like: 230, image: 'https://picsum.photos/id/3/200/200' },
  { id: '4', name: 'Montre Connectée', price: '249 Fr', like: 45, image: 'https://picsum.photos/id/4/200/200' },
  { id: '5', name: 'Tablette Graphique', price: '350 Fr', like: 67, image: 'https://picsum.photos/id/5/200/200' },
];

const ArticleItem = ({ item }) => {
  return (
    <View style={styles.itemContainer}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{item.name}</Text>
        
        <Text style={styles.price}>{item.price}</Text>
        
        <Text style={styles.like}>Likes: {item.like}</Text>
      </View>
    </View>
  );
};

export default function Application6() {
  return (
    <View style={styles.container}>
      <FlatList
        data={articles}
        renderItem={ArticleItem}
        keyExtractor={item => item.id}
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
    elevation: 3, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: 100,
    height: 100,
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
  price: {
    fontSize: 16,
    color: 'gray', 
    marginBottom: 5,
  },
  like: {
    fontSize: 14,
    color: 'red', 
    fontWeight: '600',
  },
});
