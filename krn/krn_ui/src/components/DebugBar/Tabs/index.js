import React from "react";
import styled from "@emotion/native";

const TabsContainer = styled.View``;
const TabsWrapper = styled.ScrollView`
  flex-direction: row;
  height: 40px;
  margin-bottom: 10px;
`;

const TabItem = styled.Pressable`
  border-width: 0 0 3px 0;
  border-color: ${({ active }) => (active ? "#21c397" : "transparent")};
  height: 100%;
  width: 60px;
  justify-content: center;
  align-items: center;
`;
const TabText = styled.Text`
  color: ${({ active }) => (active ? "#21c397" : "#000")};
`;

const Tabs = ({ activeTab, setActiveTab }) => {
  return (
    <TabsContainer>
      <TabsWrapper horizontal>
        {["Log", "Network", "Info", "Operate"].map((item) => (
          <TabItem
            key={item}
            active={activeTab === item}
            onPress={() => setActiveTab(item)}
          >
            <TabText active={activeTab === item}>{item}</TabText>
          </TabItem>
        ))}
      </TabsWrapper>
    </TabsContainer>
  );
};

export default Tabs;
