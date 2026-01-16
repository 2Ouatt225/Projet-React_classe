import { StyleSheet, View } from 'react-native';
import React from 'react';

export default function Application7() {
  const renderCheckerboard = (size = 6, squareSize = 70, color1 = 'black', color2 = 'white') => {
    const rows = Array.from({ length: size }, (_, i) => i);
    const cols = Array.from({ length: size }, (_, i) => i);

    return (
      <View style={styles.board}>
        {rows.map((row) => (
          <View key={row} style={styles.row}>
            {cols.map((col) => (
              <View
                key={col}
                style={[
                  styles.square,
                  { 
                    width: squareSize, 
                    height: squareSize,
                    backgroundColor: (row + col) % 2 === 0 ? color1 : color2 
                  },
                ]}
              />
            ))}
          </View>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {renderCheckerboard(6, 70, 'black', 'white')}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#c8e6c9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  board: {
    borderWidth: 2,
    borderColor: '#c8e6c9',
  },
  row: {
    flexDirection: 'row',
  },
  square: {
   
  },
});
