import React, { useState } from "react";
import { List, Colors } from "react-native-paper"; 
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';


const Connections = () => {
    const [activeButton, setActiveButton] = useState('Following');


    const handleButtonPress = (buttonName) => {
        setActiveButton(buttonName);
    };
    
    return (
        <View style={styles.container}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity       // For following
              style={[
                styles.button,
                activeButton === 'Following' ? styles.activeButton: null,
              ]}
              onPress={()=>handleButtonPress('Following')}
            >
              <Text 
                style={[
                    styles.buttonText,
                    activeButton === 'Following' ? styles.activeButton : null,
                ]}
              >
                Following
              </Text>
            </TouchableOpacity>


            <TouchableOpacity    // For followers
              style={[
                styles.button,
                activeButton === 'Followers' ? styles.activeButton: null,
              ]}
              onPress={()=>handleButtonPress('Followers')}
            >
              <Text 
                style={[
                    styles.buttonText,
                    activeButton === 'Followers' ? styles.activeButton : null,
                ]}
              >
                Followers
              </Text>
            </TouchableOpacity>


            <TouchableOpacity           // For search
              style={[
                styles.button,
                activeButton === 'Search' ? styles.activeButton: null,
              ]}
              onPress={()=>handleButtonPress('Search')}
            >
              <Text 
                style={[
                    styles.buttonText,
                    activeButton === 'Search' ? styles.activeButton : null,
                ]}
              >
                Search
              </Text>
            </TouchableOpacity>
          </View>

          {activeButton === 'Following' && <Text>This is following content</Text>}
          {activeButton === 'Followers' && <Text>This is followers content</Text>}
          {activeButton === 'Search' && <Text>This is search content</Text>}
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
      width: '100%',
      flexDirection: 'row', // Arrange buttons horizontally
      justifyContent: 'space-between', // Space them evenly
    },
    button: {
      flex: 1,
      backgroundColor: 'white',
      alignItems: 'center',
      paddingVertical: 10,
    },
    buttonText: {
      color: '#47B7F7',
      fontSize: 16,
      fontWeight: 'bold',
    },

    activeButton: {
        backgroundColor: '#526570'
    }
  });
  

export default Connections;
