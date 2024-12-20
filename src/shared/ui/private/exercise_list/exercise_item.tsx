import React from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Image} from 'react-native';
import {IC_MINUS, IC_PLUS} from '../../../../utils/icons';
import AppStyle from '../../styles/app.style';
import LanguageStore from '../../../store/language';
import {ExerciseType} from '../../../objects/exercise';

type ExerciseItemProps = {
  exercise: ExerciseType;
  canAdd?: boolean;
  canRemove?: boolean;
  itemPress: () => void;
  addPress: () => void;
  removePress: () => void;
  langStore: LanguageStore;
};

const ExerciseItem: React.FC<ExerciseItemProps> = ({
  exercise,
  canAdd = true,
  canRemove,
  itemPress,
  addPress,
  removePress,
  langStore,
}: ExerciseItemProps) => {
  const {currentLanguage} = langStore;
  return (
    <TouchableOpacity style={styles.container} onPress={itemPress}>
      <View style={{flex: 1}}>
        <Text style={styles.title}>{exercise.name}</Text>
        <Text style={styles.subTitle}>
          {`${exercise.calo} calo - ${exercise.mins} ${currentLanguage.activityBurnCalo.time}`}
        </Text>
      </View>
      {(canAdd || canRemove) && (
        <View style={styles.btnGroup}>
          {canAdd && (
            <TouchableOpacity style={styles.btnContainer} onPress={addPress}>
              <Image source={IC_PLUS} style={styles.icon} />
            </TouchableOpacity>
          )}
          {canRemove && (
            <TouchableOpacity style={styles.btnContainer} onPress={removePress}>
              <Image source={IC_MINUS} style={styles.icon} />
            </TouchableOpacity>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

export default ExerciseItem;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: AppStyle.Color.Background,
    marginBottom: 10,
    marginHorizontal: 10,
  },
  title: {
    fontSize: AppStyle.Text.Medium,
    fontWeight: 'bold',
  },
  subTitle: {
    fontSize: AppStyle.Text.Normal,
  },
  btnGroup: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  btnContainer: {
    width: 35,
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
    tintColor: AppStyle.Color.TabBarGray,
  },
});
