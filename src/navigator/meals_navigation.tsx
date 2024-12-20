import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import UIStore from '../shared/store/ui';
import UserStore from '../shared/store/user';
import LanguageStore from '../shared/store/language';
import MealScreen from '../screens/meal/meal_tab';
import MealDetail from '../screens/meal/detail';
import CreateNewMealDetail from '../screens/meal/create_new';
import AddElementScreen from '../screens/meal/add_element';
import {View} from 'react-native';
import SubStore from '../shared/store/sub';

const Stack = createStackNavigator();

type MealsNavigationProps = {
  rootNavigation: any;
  uiStore: UIStore;
  langStore: LanguageStore;
  subStore: SubStore;
};

const MealsNavigation: React.FC<MealsNavigationProps> = ({
  rootNavigation,
  uiStore,
  langStore,
  subStore,
}: MealsNavigationProps) => {
  return (
    <View style={{flex: 1}}>
      <Stack.Navigator
        initialRouteName="Meal"
        screenOptions={{headerShown: false}}>
        <Stack.Screen
          name="Meal"
          children={({navigation}) => (
            <MealScreen
              navigation={navigation}
              uiStore={uiStore}
              langStore={langStore}
              subStore={subStore}
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
          name="CreateMeal"
          children={({navigation, route}) => (
            <CreateNewMealDetail
              navigation={navigation}
              uiStore={uiStore}
              langStore={langStore}
            />
          )}
        />
        <Stack.Screen
          name="AddElement"
          children={({navigation, route}) => (
            <AddElementScreen
              navigation={navigation}
              route={route}
              uiStore={uiStore}
              langStore={langStore}
              subStore={subStore}
            />
          )}
        />
      </Stack.Navigator>
    </View>
  );
};

export default MealsNavigation;
