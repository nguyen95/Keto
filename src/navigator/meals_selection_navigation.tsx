import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import UIStore from '../shared/store/ui';
import LanguageStore from '../shared/store/language';
import MealDetail from '../screens/meal_selection/detail';
import AddElementScreen from '../screens/meal_selection/add_element';
import CreateNewMealDetail from '../screens/meal_selection/create_new';
import MainMealSelection from '../screens/meal_selection/main';
import SubStore from '../shared/store/sub';

const Stack = createStackNavigator();

type MealsSelectionNavigationProps = {
  rootNavigation: any;
  rootRoute: any;
  uiStore: UIStore;
  langStore: LanguageStore;
  subStore: SubStore;
};

const MealsSelectionNavigation: React.FC<MealsSelectionNavigationProps> = ({
  rootNavigation,
  rootRoute,
  uiStore,
  langStore,
  subStore,
}: MealsSelectionNavigationProps) => {
  return (
    <Stack.Navigator
      initialRouteName="MainMealSelection"
      screenOptions={{headerShown: false}}>
      <Stack.Screen
        name="MainMealSelection"
        children={({navigation, route}) => (
          <MainMealSelection
            navigation={navigation}
            route={route}
            rootRoute={rootRoute}
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
            route={route}
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
  );
};

export default MealsSelectionNavigation;
