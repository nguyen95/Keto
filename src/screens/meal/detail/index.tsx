import React, {useEffect, useState} from 'react';
import {View, Image, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {Materials, MealType} from '../../../shared/objects/meal';
import LanguageStore from '../../../shared/store/language';
import BaseHeader from '../../../shared/ui/containers/base_header';
import AppStyle from '../../../shared/ui/styles/app.style';
import {commonStyles} from '../../../shared/ui/styles/common.style';
import {IC_BACK} from '../../../utils/icons';
import MealList from '../../../shared/ui/private/meal_list';
import CaloCircleChart from '../../../shared/ui/components/calo_circle_chart';

type MealDetailProps = {
  navigation: any;
  route: any;
  langStore: LanguageStore;
};

const MealDetail: React.FC<MealDetailProps> = ({
  navigation,
  route,
  langStore,
}: MealDetailProps) => {
  const {currentLanguage} = langStore;
  const {meal_data, onClickMealAddItem, isCreateNewMeal} = route.params;
  const meal = meal_data as MealType;
  const [totalCalo, setTotalCalo] = useState(0);
  const [dataC, setDataC] = useState<Materials>();
  const staticMaterials = () => {
    let carbs: number = 0;
    let fat: number = 0;
    let protein: number = 0;

    if (meal.elements) {
      meal.elements.forEach((element) => {
        carbs += element.carbs;
        fat += element.fat;
        protein += element.protein;
      });
    } else {
      carbs += meal.carbs;
      fat += meal.fat;
      protein += meal.protein;
    }
    setTotalCalo(carbs * 4 + protein * 4 + fat * 9);
    setDataC({
      carbs,
      fat,
      protein,
    });
  };
  useEffect(() => {
    staticMaterials();
  }, []);
  return (
    <View style={styles.container}>
      <BaseHeader
        leftElement={<Image source={IC_BACK} style={styles.icon} />}
        rightElement={null}
        centerElement={
          <Text style={commonStyles.headerTitle}>
            {currentLanguage.favMeal.tracking.title}
          </Text>
        }
        leftAction={() => navigation.goBack()}
      />
      <ScrollView style={[styles.container, {paddingTop: 20}]}>
        <View style={[styles.container, {marginHorizontal: 15}]}>
          <Text style={styles.title}>
            {currentLanguage.favMeal.tracking.infoHeader}
          </Text>
          <View style={[styles.subContainer, {flexDirection: 'row'}]}>
            <Text style={styles.normalText}>
              {currentLanguage.favMeal.new.info.name}
            </Text>
            <Text style={styles.normalText}>{meal.name}</Text>
          </View>
        </View>
        {meal.elements && meal.elements.length > 0 && (
          <View
            style={[styles.container, {marginHorizontal: 15, paddingTop: 15}]}>
            <Text style={[styles.title, {paddingBottom: 10}]}>
              {currentLanguage.favMeal.new.content.title}
            </Text>
            <MealList
              data={meal.elements}
              canAdd={false}
              langStore={langStore}
            />
          </View>
        )}
        <View
          style={[styles.container, {marginHorizontal: 15, paddingTop: 15}]}>
          <Text style={[styles.title, {paddingBottom: 5}]}>
            {currentLanguage.nutritions.title}
          </Text>
          {dataC && Object['values'](dataC).length > 0 && (
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
          )}
        </View>
        <TouchableOpacity
          style={styles.continueBtn}
          onPress={() => {
            onClickMealAddItem(meal);
            navigation.goBack();
          }}>
          <Text style={{color: AppStyle.Color.White}}>
            {!isCreateNewMeal
              ? currentLanguage.calo.addToDiary
              : currentLanguage.favMeal.new.content.buttonTitle}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default MealDetail;

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
    marginBottom: 110,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
});
