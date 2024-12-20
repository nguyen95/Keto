import React from 'react';
import {FlatList, View} from 'react-native';
import LanguageStore from '../../../../shared/store/language';
import {ExerciseType} from '../../../objects/exercise';
import ExerciseItem from './exercise_item';

type ExerciseListProps = {
  data: Array<ExerciseType>;
  canAdd?: boolean;
  canRemove?: boolean;
  callbackClickItem?: (item: ExerciseType) => void;
  callbackClickAddItem?: (item: ExerciseType) => void;
  callbackClickRemoveItem?: (item: ExerciseType) => void;
  langStore: LanguageStore;
};

const ExerciseList: React.FC<ExerciseListProps> = ({
  data,
  canAdd,
  canRemove,
  callbackClickItem,
  callbackClickAddItem,
  callbackClickRemoveItem,
  langStore,
}: ExerciseListProps) => {
  const onClickItem = (item: ExerciseType) => {
    callbackClickItem && callbackClickItem(item);
  };

  const onClickAddItem = (item: ExerciseType) => {
    callbackClickAddItem && callbackClickAddItem(item);
  };

  const onClickRemoveItem = (item: ExerciseType) => {
    callbackClickRemoveItem && callbackClickRemoveItem(item);
  };

  const renderItem = ({item}) => {
    return (
      <ExerciseItem
        exercise={item}
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
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => `${item.key}`}
      />
    </View>
  );
};

export default ExerciseList;
