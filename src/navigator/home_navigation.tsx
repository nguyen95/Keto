import React, {useState} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import UIStore from '../shared/store/ui';
import LanguageStore from '../shared/store/language';
import WeightChartScreen from '../screens/person/view/weight_chart_view';
import HomeScreen from '../screens/home';
import HomeStore from '../screens/home/store';
import MealDetail from '../screens/meal/detail';
import {View} from 'react-native';
import {getBottomSpace} from 'react-native-iphone-x-helper';
import SubStore from '../shared/store/sub';
import PersonStore from '../screens/person/store';
import SubscriptionScreen from '../screens/subscription/view';

const Stack = createStackNavigator();

type HomeNavigationProps = {
  rootNavigation: any;
  uiStore: UIStore;
  langStore: LanguageStore;
  subStore: SubStore;
  personStore: PersonStore;
};

const HomeNavigation: React.FC<HomeNavigationProps> = ({
  rootNavigation,
  uiStore,
  langStore,
  subStore,
  personStore,
}: HomeNavigationProps) => {
  const [homeStore] = useState(() => new HomeStore(langStore));
  return (
    <View style={{flex: 1}}>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{headerShown: false}}>
        <Stack.Screen
          name="Home"
          children={({navigation}) => (
            <HomeScreen
              rootNavigation={rootNavigation}
              navigation={navigation}
              uiStore={uiStore}
              homeStore={homeStore}
              langStore={langStore}
              subStore={subStore}
              personStore={personStore}
            />
          )}
        />
        <Stack.Screen
          name="MealDetail"
          children={({navigation, route}) => (
            <MealDetail
              navigation={navigation}
              route={route}
              langStore={langStore}
            />
          )}
        />
        <Stack.Screen
          name="WeightChartScreen"
          children={({navigation}) => (
            <WeightChartScreen
              navigation={navigation}
              homeStore={homeStore}
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

export default HomeNavigation;
