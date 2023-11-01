import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";
import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { Avatar } from "react-native-elements";

const Leaderboard = ({ navigation, route }) => {
  const username = route.params.username;
  const name = route.params.name;

  // Sample data for the leaderboard. Replace this with your actual data source.
  const leaderboardData = [
    { username: "User1", score: 500 },
    { username: "User2", score: 600 },
    { username: "shaq", score: 700 },
    { username: "User4", score: 800 },
    { username: "User5", score: 900 },
  ];

  // Sort the leaderboard data by score in descending order
  leaderboardData.sort((a, b) => b.score - a.score);

  const renderItem = ({ item, index }) => (
    <View
      style={[
        styles.row,
        item.username === username ? styles.highlighted : null,
      ]}
    >
      <Text style={styles.rank}>{index + 1}</Text>
      <Avatar
        rounded
        title={item.username[0].toUpperCase()}
        size="medium"
        containerStyle={styles.avatar}
      />
      <View style={styles.userInfo}>
        <Text style={styles.username}>{item.username}</Text>
        <Text style={styles.score}>Score: {item.score}</Text>
      </View>
      <Text style={styles.rank}>
        {index === 0 && (
          <FontAwesome5Icon name="crown" solid color="gold" size={16} />
        )}
        {index === 1 && (
          <FontAwesome5Icon name="crown" solid color="silver" size={16} />
        )}
        {index === 2 && (
          <FontAwesome5Icon name="crown" solid color="#cd7f32" size={16} />
        )}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{name} Leaderboard</Text>
      <FlatList
        data={leaderboardData}
        renderItem={renderItem}
        keyExtractor={(item) => item.username}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 10,
  },
  row: {
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    margin: 5,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  highlighted: {
    backgroundColor: "lightblue",
  },
  avatar: {
    backgroundColor: "lightgray",
  },
  userInfo: {
    flex: 1,
    marginLeft: 10,
  },
  username: {
    fontSize: 16,
  },
  score: {
    fontSize: 14,
  },
  rank: {
    fontSize: 16,
    fontWeight: "bold",
    margin: 10,
  },
});

export default Leaderboard;
