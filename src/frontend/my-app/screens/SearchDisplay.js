// SearchBar.js
import React from 'react';
import { TextInput } from 'react-native';

const SearchBar = ({ value, onChange, onFocus, onBlur }) => {
  return (
    <TextInput
      style={{
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
      }}
      value={value}
      onChangeText={onChange}
      placeholder="Search..."
      onFocus={onFocus}
      onBlur={onBlur}
    />
  );
};

export default SearchBar;
