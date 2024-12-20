import React from 'react';
import {FlatList, View} from 'react-native';
import MealItem from './meal_item';
import {MealType} from '../../../objects/meal';
import LanguageStore from '../../../../shared/store/language';

type MealListProps = {
  data: Array<MealType>;
  canAdd?: boolean;
  canRemove?: boolean;
  callbackClickItem?: (item: MealType) => void;
  callbackClickAddItem?: (item: MealType) => void;
  callbackClickRemoveItem?: (item: MealType) => void;
  langStore: LanguageStore;
};

const MealList: React.FC<MealListProps> = ({
  data,
  canAdd,
  canRemove,
  callbackClickItem,
  callbackClickAddItem,
  callbackClickRemoveItem,
  langStore,
}: MealListProps) => {
  const onClickItem = (item: MealType) => {
    callbackClickItem && callbackClickItem(item);
  };

  const onClickAddItem = (item: MealType) => {
    callbackClickAddItem && callbackClickAddItem(item);
  };

  const onClickRemoveItem = (item: MealType) => {
    callbackClickRemoveItem && callbackClickRemoveItem(item);
  };

  const renderItem = ({item}) => {
    return (
      <MealItem
        meal={item}
        canAdd={canAdd}
        canRemove={canRemove}
        itemPress={() => onClickItem(item)}
        addPress={() => onClickAddItem(item)}
        removePress={() => onClickRemoveItem(item)}
        langStore={langStore}
      />
    );
  };

  return (
    <View style={{flex: 1}}>
      <FlatList
        contentContainerStyle={{paddingBottom: 80}}
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => `${item.key}`}
      />
    </View>
  );
};

export default MealList;
