import React, { useState } from "react";
import { SearchBar } from "@krn/ui";
import { View } from "react-native";
import searchImg from "assets/light/back.png";
import styled from "@emotion/native";

const SearchImg = styled.Image`
  width: 20px;
  height: 24px;
`;

export default () => {
  const [value, setValue] = useState("");

  const handleSearch = (val) => {
    console.log(val);
  };

  return (
    <View>
      <View style={{ marginBottom: 20 }}>
        <SearchBar
          value={value}
          onChange={(e) => setValue(e)}
          handleSearch={handleSearch}
          placeholder="search something"
        />
      </View>
      <View style={{ marginBottom: 20 }}>
        <SearchBar
          value={value}
          onChange={(e) => setValue(e)}
          handleSearch={handleSearch}
          placeholder="search something"
          searchIcon={false}
        />
      </View>
      <View style={{ marginBottom: 20 }}>
        <SearchBar
          value={value}
          onChange={(e) => setValue(e)}
          showClear={false}
          handleSearch={handleSearch}
          searchIcon={<SearchImg source={searchImg} />}
        />
      </View>
      <View>
        <SearchBar
          placeholder="disabled"
          disabled
          handleSearch={handleSearch}
        />
      </View>
    </View>
  );
};
