import React, {useEffect, useState} from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {Materials, MealType} from '../../../shared/objects/meal';
import LanguageStore from '../../../shared/store/language';
import BaseHeader from '../../../shared/ui/containers/base_header';
import AppStyle from '../../../shared/ui/styles/app.style';
import {commonStyles} from '../../../shared/ui/styles/common.style';
import {IC_BACK} from '../../../utils/icons';
import MealList from '../../../shared/ui/private/meal_list';
import CaloCircleChart from '../../../shared/ui/components/calo_circle_chart';
import BaseTextInput from '../../../shared/ui/components/base_text_input';
import UIStore from '../../../shared/store/ui';
import {getDataLocal} from '../../../services/storage';
import {getDataDoc, updateDataDoc} from '../../../services/firebase';
import {FIR_KEY_DB, FIR_KEY_USER_ID} from '../../../utils/config/setting';
import {alertInfo} from '../../../utils/functions';

type CreateNewMealDetailProps = {
  navigation: any;
  route: any;
  uiStore: UIStore;
  langStore: LanguageStore;
};

const CreateNewMealDetail: React.FC<CreateNewMealDetailProps> = ({
  navigation,
  route,
  uiStore,
  langStore,
}: CreateNewMealDetailProps) => {
  const {currentLanguage} = langStore;
  const {onNewMealAdded} = route.params;
  const [meal, setMeal] = useState<MealType>({
    carbs: 0,
    fat: 0,
    fiber: 0,
    kcal: 0,
    key: '0',
    name: '',
    protein: 0,
    sugar: 0,
    elements: [],
  });
  const [totalCalo, setTotalCalo] = useState(0);
  const [dataC, setDataC] = useState<Materials>();
  const staticMaterials = (elements: Array<MealType>) => {
    let carbs: number = 0;
    let fat: number = 0;
    let protein: number = 0;
    let fiber: number = 0;
    let sugar: number = 0;

    if (elements) {
      elements.forEach((element) => {
        carbs += element.carbs;
        fat += element.fat;
        fiber += element.fiber;
        protein += element.protein;
        sugar += element.sugar;
      });
      setTotalCalo(carbs * 4 + protein * 4 + fat * 9);
      setDataC({
        carbs,
        fat,
        protein,
      });
    }
  };

  const mealNameChanged = (text: string) => {
    const curMeal = meal;
    curMeal.name = text;
    setMeal(curMeal);
  };

  const createNewMeal = async () => {
    if (!meal.name) {
      alertInfo(
        '',
        currentLanguage.favMeal.new.info.validateMsg,
        false,
        () => {},
      );
      return;
    }
    uiStore.showLoading('create');
    const id = await getDataLocal(FIR_KEY_USER_ID);
    const oldData = await getDataDoc(`${FIR_KEY_DB}/${id}`);
    if (oldData) {
      const {meals} = oldData;
      let newData = meals;
      const newMeal = Object.assign(dataC, {
        name: meal.name,
        key: `new-${new Date().getTime()}`,
        kcal: Math.round(totalCalo * 10) / 10,
        elements: meal.elements!,
        type: 'group',
      });

      if (newData) {
        newData = newData.concat([newMeal]);
      } else {
        newData = [newMeal];
      }

      await updateDataDoc(`${FIR_KEY_DB}/${id}`, {
        meals: newData,
      });
    }
    uiStore.hideLoading();
    onNewMealAdded();
    navigation.goBack();
  };

  function elementAdded(element: MealType) {
    const newData = meal;
    if (newData.elements) {
      newData.elements = newData.elements.concat([element]);
    } else {
      newData.elements = [element];
    }
    setMeal(newData);

    uiStore.showLoading('add');
    setTimeout(() => {
      staticMaterials(newData.elements!);
      uiStore.hideLoading();
    }, 100);
  }

  const addElements = () => {
    navigation.navigate('AddElement', {elementAdded});
  };

  const removeElement = (element: MealType) => {
    const newData = meal;
    if (newData.elements && newData.elements.length > 0) {
      newData.elements = newData.elements.filter((e) => e.key !== element.key);
      setMeal(newData);

      uiStore.showLoading('add');
      setTimeout(() => {
        staticMaterials(newData.elements!);
        uiStore.hideLoading();
      }, 100);
    }
  };

  return (
    <View style={styles.container}>
      <BaseHeader
        leftElement={<Image source={IC_BACK} style={styles.icon} />}
        rightElement={null}
        centerElement={
          <Text style={commonStyles.headerTitle}>
            {currentLanguage.favMeal.addButtonTitle}
          </Text>
        }
        leftAction={() => navigation.goBack()}
      />
      <ScrollView style={[styles.container, {paddingTop: 20, paddingBottom: 80}]}>
        <View style={[styles.container, {marginHorizontal: 15}]}>
          <Text style={styles.title}>
            {currentLanguage.favMeal.tracking.infoHeader}
          </Text>
          <View style={[styles.subContainer, {flexDirection: 'row'}]}>
            <Text style={styles.normalText}>
              {currentLanguage.favMeal.new.info.name}
            </Text>
            {meal.name ? (
              <Text style={styles.normalText}>{meal.name}</Text>
            ) : (
              <BaseTextInput
                modifierStyle={{width: Dimensions.get('window').width / 2}}
                onText={mealNameChanged}
                placeHolder={
                  currentLanguage.BMR.trackingActivity.spentTimes1WeekAmount
                }
              />
            )}
          </View>
        </View>
        <View
          style={[styles.container, {marginHorizontal: 15, paddingTop: 15}]}>
          <Text style={[styles.title, {paddingBottom: 10}]}>
            {currentLanguage.favMeal.new.content.title}
          </Text>
          {meal && meal.elements && meal.elements.length > 0 && (
            <MealList
              data={meal.elements}
              canAdd={false}
              canRemove={true}
              callbackClickRemoveItem={removeElement}
              langStore={langStore}
            />
          )}
          <TouchableOpacity
            style={[
              styles.subContainer,
              {flexDirection: 'row', justifyContent: 'center'},
            ]}
            onPress={addElements}>
            <Text>+ {currentLanguage.favMeal.new.content.buttonTitle}</Text>
          </TouchableOpacity>
        </View>
        {dataC && Object['values'](dataC).length > 0 && (
          <View
            style={[styles.container, {marginHorizontal: 15, paddingTop: 15}]}>
            <Text style={[styles.title, {paddingBottom: 5}]}>
              {currentLanguage.nutritions.title}
            </Text>
            <View style={{alignItems: 'center'}}>
              <CaloCircleChart
                data={Object['values'](dataC)}
                center={totalCalo}
                centerSub={'cal'}
                colors={[
                  AppStyle.Color.Main,
                  AppStyle.Color.Orange,
                  AppStyle.Color.Green,
                ]}
                keys={[
                  currentLanguage.nutritions.carbs,
                  currentLanguage.nutritions.protein,
                  currentLanguage.nutritions.fat,
                ]}
              />
            </View>
          </View>
        )}
        {meal && meal.elements && meal.elements.length > 0 && (
          <TouchableOpacity style={styles.continueBtn} onPress={createNewMeal}>
            <Text style={{color: AppStyle.Color.White}}>
              {currentLanguage.favMeal.addButtonTitle}
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
};

export default CreateNewMealDetail;

const styles = StyleSheet.create({
  container: {flex: 1},
  icon: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
    tintColor: AppStyle.Color.Background,
  },
  title: {
    fontSize: AppStyle.Text.Large,
    width: '100%',
    fontWeight: '500',
    paddingHorizontal: 10,
  },
  subContainer: {
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: AppStyle.Color.White,
    borderRadius: 5,
    margin: 10,
    padding: 10,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowRadius: 3,
    shadowOpacity: 0.2,
  },
  normalText: {
    fontSize: AppStyle.Text.Normal,
  },
  continueBtn: {
    height: 40,
    width: '40%',
    borderRadius: 20,
    backgroundColor: AppStyle.Color.Orange,
    marginVertical: 30,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
});
