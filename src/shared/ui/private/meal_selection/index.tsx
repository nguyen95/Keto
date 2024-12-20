import React from 'react';
import {StyleSheet, Image} from 'react-native';
import ActionButton from 'react-native-action-button';
import LanguageStore from '../../../store/language';
import {
  IC_BREAKFAST,
  IC_DINNER,
  IC_EXERCISE,
  IC_LUNCH,
  IC_MEAL_OTHER,
} from '../../../../utils/icons';
import {MealSelectionType} from '../../../../shared/objects/meal_selection';
import {heightFooter} from '../../../../shared/ui/styles/common.style';
import AppStyle from '../../../../shared/ui/styles/app.style';

const ITEM_SIZE = 40;

type MealSelectionProps = {
  selectedItem: (item: MealSelectionType) => void;
  langStore: LanguageStore;
};

const MealSelection: React.FC<MealSelectionProps> = ({
  selectedItem,
  langStore,
}: MealSelectionProps) => {
  const {currentLanguage} = langStore;
  const options: Array<MealSelectionType> = [
    {
      title: currentLanguage.exercise.title,
      icon: IC_EXERCISE,
      labelColor: '#3498db',
      type: 'exercise',
    },
    {
      title: currentLanguage.recipes.recipeName.others,
      icon: IC_MEAL_OTHER,
      labelColor: '#75bcea',
      type: 'others',
    },
    {
      title: currentLanguage.recipes.recipeName.dinner,
      icon: IC_DINNER,
      labelColor: '#48cf81',
      type: 'dinner',
    },
    {
      title: currentLanguage.recipes.recipeName.lunch,
      icon: IC_LUNCH,
      labelColor: '#ffad78',
      type: 'lunch',
    },
    {
      title: currentLanguage.recipes.recipeName.breakfast,
      icon: IC_BREAKFAST,
      labelColor: '#e67e22',
      type: 'breakfast',
    },
  ];
  return (
    <ActionButton
      offsetY={heightFooter + 148}
      size={50}
      buttonColor={AppStyle.Color.Green}
      bgColor="rgba(255,255,255,0.5)">
      {options.map((option, index) => {
        return (
          <ActionButton.Item
            size={ITEM_SIZE}
            buttonColor="transparent"
            textContainerStyle={{
              backgroundColor: option.labelColor,
              borderWidth: 0,
            }}
            textStyle={{color: 'white'}}
            key={`action-${index}`}
            title={option.title}
            onPress={() => selectedItem(option)}>
            <Image source={option.icon} style={styles.actionButtonIcon} />
          </ActionButton.Item>
        );
      })}
    </ActionButton>
  );
};

export default MealSelection;

const styles = StyleSheet.create({
  actionButtonIcon: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    resizeMode: 'contain',
  },
});
