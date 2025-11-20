/**
 * Owner: willen@kupotech.com
 */
import styled from "@emotion/native";
import API from "./API";
import registerAPI from "utils/registerAPI";
import React from "react";
import { useTheme } from "@krn/ui";
import searchImg from "assets/light/search.png";
import { Platform } from "react-native";
import search_clear from "assets/light/search_clear.png";
import { TouchableWithoutFeedback } from "react-native";

const ClearImg = styled.Image`
  width: 20px;
  height: 20px;
  flex-shrink: 0;
`;

const Wrapper = styled.View`
  flex: 1;
  display: flex;
  flex-direction: row;
  background: ${({ theme, disabled }) =>
    disabled ? theme.color.complementary2 : theme.color.complementary4};
  border-radius: 6px;
  padding: 5px 8px;
  align-items: center;
`;

const SearchImg = styled.Image`
  width: 24px;
  height: 24px;
`;

const InputBox = styled.View`
  flex: 1;
  flex-direction: row;
`;

const Input = styled.TextInput`
  font-size: 14px;
  height: 22px;
  font-weight: 500;
  padding-left: 8px;
  flex: 1;
  color: ${({ theme }) => theme.color.complementary};
  padding-top: 0;
  padding-bottom: 0;
  top: ${({ isIOS }) => (isIOS ? 0 : "2px")};
`;

const SearchBar = ({
  handleSearch,
  searchIcon,
  placeholder,
  showClear,
  onChange,
  value,
  disabled,
  style,
  inputProps,
  ...restProps
}) => {
  const theme = useTheme();
  const Icon =
    typeof searchIcon === "object" ? (
      searchIcon
    ) : typeof searchIcon === "boolean" ? (
      searchIcon ? (
        <SearchImg source={searchImg} />
      ) : null
    ) : (
      <SearchImg source={searchImg} />
    );

  const clear = () => {
    onChange && onChange("");
    typeof handleSearch === "function" && handleSearch("");
  };

  return (
    <Wrapper disabled={disabled} style={style} {...restProps}>
      {Icon}
      <InputBox>
        <Input
          value={value}
          editable={!disabled}
          selectionColor={theme.color.primary}
          isIOS={Platform.OS === "ios"}
          placeholder={placeholder}
          placeholderTextColor={theme.color.complementary40}
          onChangeText={(text) => {
            onChange && onChange(text);
            typeof handleSearch === "function" && handleSearch(text);
          }}
          {...inputProps}
        />
      </InputBox>
      {value && showClear !== false ? (
        <TouchableWithoutFeedback onPress={clear}>
          <ClearImg source={search_clear} />
        </TouchableWithoutFeedback>
      ) : null}
    </Wrapper>
  );
};

registerAPI(SearchBar, API);
export default SearchBar;
