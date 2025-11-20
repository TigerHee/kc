/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
const Stack = createNativeStackNavigator();

export const componentMap = [
  { name: 'ThemeProvider', component: require('./packages/ThemeProvider').default },
  { name: 'NumberFormat', component: require('./packages/NumberFormat').default },
  { name: 'DateTimeFormat', component: require('./packages/DateTimeFormat').default },
  { name: 'Button', component: require('./packages/Button').default },
  { name: 'Header', component: require('./packages/Header').default },
  { name: 'Loading', component: require('./packages/Loading').default },
  { name: 'Card', component: require('./packages/Card').default },
  { name: 'Empty', component: require('./packages/Empty').default },
  { name: 'Drawer', component: require('./packages/Drawer').default },
  { name: 'Confirm', component: require('./packages/Confirm').default },
  { name: 'NumberPad', component: require('./packages/NumberPad').default },
  { name: 'CountUp', component: require('./packages/CountUp').default },
  { name: 'Skeleton', component: require('./packages/Skeleton').default },
  { name: 'Switch', component: require('./packages/Switch').default },
  { name: 'Slider', component: require('./packages/Slider').default },
  { name: 'Badge', component: require('./packages/Badge').default },
  // { name: 'SearchBar(已过时)', component: require('./packages/SearchBar').default },
  { name: 'Swipeable', component: require('./packages/Swipeable').default },
  { name: 'Checkbox', component: require('./packages/Checkbox').default },
  { name: 'Radio', component: require('./packages/Radio').default },
  { name: 'RichLocale', component: require('./packages/RichLocale').default },
  { name: 'FallbackPage', component: require('./packages/FallbackPage').default },
  { name: 'Alert', component: require('./packages/Alert').default },
  { name: 'Tabs', component: require('./packages/Tabs').default },
  // { name: 'Input', component: require('./packages/Input').default },
  { name: 'Select', component: require('./packages/Select').default },
  { name: 'Tag', component: require('./packages/Tag').default },
];

const allRoutes = [
  { name: 'Home', component: require('./compoents/Home').default },
  { name: 'FallbackPageDemo', component: require('./demos/FallbackPage/Basic').default },
].concat(componentMap.sort((a, b) => a.name.localeCompare(b.name)));

function Router() {
  const initName = 'Home';

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initName} screenOptions={{ headerShown: false }}>
        {allRoutes.map((item) => (
          <Stack.Screen key={item.name} {...item} />
        ))}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Router;
