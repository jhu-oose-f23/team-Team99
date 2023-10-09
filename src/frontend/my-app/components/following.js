import React, { useState } from "react";
import { List, Colors } from "react-native-paper"; 
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';


const Connections = () => {    
    
    
    return (
        <View style={styles.container}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Following</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Followers</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Search</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'top',
      alignItems: 'center',
    },
    buttonContainer: {
      flexDirection: 'row', // Arrange buttons horizontally
      justifyContent: 'space-between', // Space them evenly
    },
    button: {
      backgroundColor: 'white',
      paddingHorizontal: 20,
      paddingVertical: 10,
    },
    buttonText: {
      color: 'blue',
      fontSize: 16,
      fontWeight: 'bold',
    },
  });
  

export default Connections;
