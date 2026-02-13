import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {HomeScreen} from '../screens/HomeScreen';
import {TestBeforeRemoveScreen} from '../screens/TestBeforeRemoveScreen';
import {TestUsePreventRemoveScreen} from '../screens/TestUsePreventRemoveScreen';

export type RootStackParamList = {
  Home: undefined;
  TestBeforeRemove: undefined;
  TestUsePreventRemove: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export function RootNavigator(): React.JSX.Element {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerMode: 'screen',
      }}>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{title: 'iOS Swipe preventDefault Repro'}}
      />

      <Stack.Screen
        name="TestBeforeRemove"
        component={TestBeforeRemoveScreen}
        options={{
          title: 'addListener("beforeRemove")',
          headerLeft: () => null,
        }}
      />

      <Stack.Screen
        name="TestUsePreventRemove"
        component={TestUsePreventRemoveScreen}
        options={{
          title: 'usePreventRemove()',
          headerLeft: () => null,
        }}
      />
    </Stack.Navigator>
  );
}
