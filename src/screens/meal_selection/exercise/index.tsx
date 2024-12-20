import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  Modal,
  TouchableOpacity,
} from 'react-native';
import {commonStyles} from '../../../shared/ui/styles/common.style';
import LanguageStore from '../../../shared/store/language';
import BaseHeader from '../../../shared/ui/containers/base_header';
import SearchBar from 'react-native-dynamic-search-bar';
import AppStyle from '../../../shared/ui/styles/app.style';
import {IC_BACK} from '../../../utils/icons';
import UIStore from '../../../shared/store/ui';
import TipOfDay from '../../../shared/ui/containers/tip_of_day';
import {ExerciseType} from '../../../shared/objects/exercise';
import BaseTextInput from '../../../shared/ui/components/base_text_input';
import {mergeAllMealsData} from '../../../shared/ui/private/meal_list/services';
import {getDataLocal} from '../../../services/storage';
import {FIR_KEY_DB, FIR_KEY_USER_ID} from '../../../utils/config/setting';
import {getDataDoc, updateDataDoc} from '../../../services/firebase';
import ExerciseList from '../../../shared/ui/private/exercise_list';

type ExerciseSelectionProps = {
  navigation: any;
  uiStore: UIStore;
  langStore: LanguageStore;
};

const ExerciseSelection: React.FC<ExerciseSelectionProps> = ({
  navigation,
  uiStore,
  langStore,
}: ExerciseSelectionProps) => {
  const {currentLanguage} = langStore;
  const [exerciseList, changeExerciseList] = useState<Array<ExerciseType>>();
  const [filterData, changeFilterData] = useState<Array<ExerciseType>>();
  const [curExercise, changeCurExercise] = useState<ExerciseType>();
  const [curTip, changeCurTip] = useState();
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    async function getDataFromFirebase() {
      uiStore.showLoading('get_exercise');
      const arrData = langStore.currentExercise;
      changeExerciseList(arrData);
      changeFilterData(arrData);
      uiStore.hideLoading();
    }
    getDataFromFirebase();
    return;
  }, []);

  const onClickMealItem = (item: ExerciseType) => {
    navigation.navigate('MealDetail', {
      meal_data: item,
      onClickMealAddItem,
      isCreateNewMeal: true,
    });
  };

  const onClickMealAddItem = async (item: ExerciseType) => {
    changeCurExercise(item);
    setModalVisible(true);
  };

  const updateCurExercise = (text: string) => {
    const newMinus = Number(text);
    const excercise = exerciseList?.find((e) => e.key === curExercise!.key);
    const ratio = newMinus / 30;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTime = today.getTime();

    const newExercise: ExerciseType = {
      key: excercise!.key,
      id: excercise!.key,
      name: excercise!.name,
      calo: excercise!.calo * ratio,
      mins: newMinus,
      date: `${todayTime}`,
    };
    changeCurExercise(newExercise);
  };

  const updateDataToDb = async () => {
    uiStore.showLoading('save');
    const id = await getDataLocal(FIR_KEY_USER_ID);
    const oldData = await getDataDoc(`${FIR_KEY_DB}/${id}`);
    if (oldData) {
      const {healths} = oldData;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayTime = today.getTime();
      const indexChanged = healths.findIndex((e) => {
        return e.date === todayTime;
      });

      const curDayVal = healths[indexChanged];
      let curData = curDayVal;
      curData.burned += curExercise?.calo;

      const oldExercises = curData.exercises;
      const oldCurExercise = {...curExercise!};
      oldCurExercise.key = `exercise-${new Date().getTime()}`;
      curData.exercises = oldExercises.concat([oldCurExercise]);

      healths[indexChanged] = curData;
      await updateDataDoc(`${FIR_KEY_DB}/${id}`, {
        healths: healths,
      });
    }
    uiStore.hideLoading();
    setModalVisible(false);
    navigation.goBack();
  };

  const searchMeal = (key: string) => {
    if (exerciseList) {
      let curFilter = [...exerciseList];
      if (key) {
        curFilter = curFilter.filter((e) => e.name.includes(key));
        changeFilterData(curFilter);
      } else {
        changeFilterData(exerciseList);
      }
    } else {
      const {currentTip} = langStore;
      const newTip =
        currentTip[Math.floor(Math.random() * (currentTip.length - 1))];
      changeCurTip(newTip);
    }
  };

  return (
    <View style={styles.container}>
      <BaseHeader
        leftElement={<Image source={IC_BACK} style={styles.backIcon} />}
        rightElement={<View />}
        centerElement={
          <Text style={commonStyles.headerTitle}>
            {currentLanguage.exercise.title}
          </Text>
        }
        leftAction={() => {
          navigation.goBack();
        }}
      />
      <View style={styles.searchbarGroup}>
        <SearchBar
          placeholder={currentLanguage.calo.searchHint}
          style={styles.searchbarContainer}
          clearIconImageStyle={{tintColor: AppStyle.Color.Main}}
          onChangeText={searchMeal}
          onClearPress={() => searchMeal('')}
        />
      </View>
      {!filterData || filterData.length === 0 ? (
        <TipOfDay langStore={langStore} tipDefault={curTip} />
      ) : (
        <View style={{flex: 1, marginTop: 10}}>
          <ExerciseList
            data={filterData}
            canAdd={true}
            canRemove={false}
            callbackClickItem={onClickMealAddItem}
            callbackClickAddItem={onClickMealAddItem}
            langStore={langStore}
          />
        </View>
      )}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}>
        <TouchableOpacity
          onPress={() => setModalVisible(false)}
          style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>{`${
              curExercise?.name
            } (${Math.round(curExercise?.calo || 0)} calo / ${
              curExercise?.mins
            } ${currentLanguage.activityBurnCalo.time})`}</Text>
            <View style={[styles.inputContainer]}>
              <BaseTextInput
                onText={updateCurExercise}
                keyboardType="numeric"
                modifierStyle={{width: Dimensions.get('window').width / 8}}
                defaultValue="30"
              />
              <Text style={{width: '50%'}}>
                {currentLanguage.activityBurnCalo.time}
              </Text>
            </View>
            <View style={styles.btnModalGroup}>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.modalBtnText}>
                  {currentLanguage.BMR.weightStat.popupBtnSkipeTitle}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={updateDataToDb}>
                <Text style={styles.modalBtnText}>
                  {currentLanguage.shoppingList.done}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default ExerciseSelection;

const styles = StyleSheet.create({
  container: {flexGrow: 1},
  backIcon: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
    tintColor: AppStyle.Color.Background,
  },
  searchbarGroup: {
    justifyContent: 'space-between',
    backgroundColor: AppStyle.Color.Main,
    paddingHorizontal: 15,
  },
  searchbarContainer: {
    width: Dimensions.get('window').width - 30,
    height: 35,
    borderRadius: 20,
    marginBottom: 20,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalView: {
    width: '80%',
    padding: 15,
    borderRadius: 5,
    backgroundColor: AppStyle.Color.Background,
  },
  modalTitle: {
    fontSize: AppStyle.Text.Medium,
    fontWeight: 'bold',
  },
  modalBtnText: {
    color: AppStyle.Color.Main,
    paddingHorizontal: 10,
    fontWeight: 'bold',
    fontSize: AppStyle.Text.Small,
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  btnModalGroup: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingTop: 20,
    zIndex: 0,
  },
});
