import React, {useState} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import UIStore from '../shared/store/ui';
import UserStore from '../shared/store/user';
import PersonScreen from '../screens/person';
import SettingScreen from '../screens/person/view/setting_view';
import BmrUpdateScreen from '../screens/person/view/bmr_view';
import ChartScreen from '../screens/person/view/chart_view';
import MacroScreen from '../screens/person/view/macro_view';
import WeightChartScreen from '../screens/person/view/weight_chart_view';
import PersonStore from '../screens/person/store';
import TargetSelection from '../screens/person/view/target_view';
import ActivitySelection from '../screens/person/view/activity_view';
import LifeCheck from '../screens/person/view/life_check';
import MyWebView from '../screens/person/view/web_view';
import LanguageStore from '../shared/store/language';
import {View} from 'react-native';
import MoreAppScreen from '../screens/person/view/more_app_view';
import SuggestionMenuScreen from '../screens/person/view/suggestion_menu_view';
import SubStore from '../shared/store/sub';
import SubscriptionScreen from '../screens/subscription/view';

const Stack = createStackNavigator();

type PersonNavigationProps = {
  rootNavigation: any;
  uiStore: UIStore;
  userStore: UserStore;
  langStore: LanguageStore;
  subStore: SubStore;
  personStore: PersonStore;
};

const PersonNavigation: React.FC<PersonNavigationProps> = ({
  rootNavigation,
  uiStore,
  userStore,
  langStore,
  subStore,
  personStore,
}: PersonNavigationProps) => {
  return (
    <View style={{flex: 1}}>
      <Stack.Navigator
        initialRouteName="Person"
        screenOptions={{headerShown: false}}>
        <Stack.Screen
          name="Person"
          children={({navigation}) => (
            <PersonScreen
              rootNavigation={rootNavigation}
              navigation={navigation}
              uiStore={uiStore}
              personStore={personStore}
              userStore={userStore}
              langStore={langStore}
              subStore={subStore}
            />
          )}
        />
        <Stack.Screen
          name="SettingScreen"
          children={({navigation}) => (
            <SettingScreen
              navigation={navigation}
              rootNavigation={rootNavigation}
              userStore={userStore}
              langStore={langStore}
              uiStore={uiStore}
              subStore={subStore}
            />
          )}
        />
        <Stack.Screen
          name="MoreApp"
          children={({navigation}) => (
            <MoreAppScreen navigation={navigation} uiStore={uiStore} />
          )}
        />
        <Stack.Screen
          name="BmrUpdateScreen"
          children={({navigation}) => (
            <BmrUpdateScreen
              navigation={navigation}
              personStore={personStore}
              langStore={langStore}
            />
          )}
        />
        <Stack.Screen
          name="TargetSelection"
          children={({navigation, route}) => (
            <TargetSelection
              navigation={navigation}
              uiStore={uiStore}
              personStore={personStore}
              langStore={langStore}
              route={route}
            />
          )}
        />
        <Stack.Screen
          name="ActivitySelection"
          children={({navigation, route}) => (
            <ActivitySelection
              navigation={navigation}
              uiStore={uiStore}
              personStore={personStore}
              langStore={langStore}
              route={route}
            />
          )}
        />
        <Stack.Screen
          name="ChartScreen"
          children={({navigation}) => (
            <ChartScreen
              navigation={navigation}
              personStore={personStore}
              langStore={langStore}
            />
          )}
        />
        <Stack.Screen
          name="MacroScreen"
          children={({navigation}) => (
            <MacroScreen
              navigation={navigation}
              personStore={personStore}
              langStore={langStore}
            />
          )}
        />
        <Stack.Screen
          name="WeightChartScreen"
          children={({navigation}) => (
            <WeightChartScreen
              navigation={navigation}
              personStore={personStore}
              langStore={langStore}
            />
          )}
        />
        <Stack.Screen
          name="LifeCheck"
          children={({navigation}) => (
            <LifeCheck
              navigation={navigation}
              personStore={personStore}
              langStore={langStore}
            />
          )}
        />
        <Stack.Screen
          name="MyWebView"
          children={({route, navigation}) => (
            <MyWebView
              route={route}
              navigation={navigation}
              uiStore={uiStore}
            />
          )}
        />
        <Stack.Screen
          name="SuggestionMenu"
          children={({route, navigation}) => (
            <SuggestionMenuScreen
              route={route}
              navigation={navigation}
              langStore={langStore}
            />
          )}
        />
        <Stack.Screen
          name="Subscription"
          children={({route, navigation}) => (
            <SubscriptionScreen
              route={route}
              navigation={navigation}
              langStore={langStore}
              subStore={subStore}
              uiStore={uiStore}
            />
          )}
        />
      </Stack.Navigator>
    </View>
  );
};

export default PersonNavigation;
