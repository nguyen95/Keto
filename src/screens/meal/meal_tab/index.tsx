import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  ScrollView,
  Modal,
} from 'react-native';
import ModalDropdown from 'react-native-modal-dropdown';
import {commonStyles} from '../../../shared/ui/styles/common.style';
import LanguageStore from '../../../shared/store/language';
import BaseHeader from '../../../shared/ui/containers/base_header';
import SearchBar from 'react-native-dynamic-search-bar';
import AppStyle from '../../../shared/ui/styles/app.style';
import {IC_PLUS} from '../../../utils/icons';
import UIStore from '../../../shared/store/ui';
import TipOfDay from '../../../shared/ui/containers/tip_of_day';
import MealList from '../../../shared/ui/private/meal_list';
import {MealType} from '../../../shared/objects/meal';
import {getDataDoc, updateDataDoc} from '../../../services/firebase';
import firestore from '@react-native-firebase/firestore';
import {FIR_KEY_DB, FIR_KEY_USER_ID} from '../../../utils/config/setting';
import {getDataLocal} from '../../../services/storage';
import BaseTextInput from '../../../shared/ui/components/base_text_input';
import SubStore from '../../../shared/store/sub';

type MealScreenProps = {
  navigation: any;
  uiStore: UIStore;
  langStore: LanguageStore;
  subStore: SubStore;
};

const MealScreen: React.FC<MealScreenProps> = ({
  navigation,
  uiStore,
  langStore,
  subStore,
}: MealScreenProps) => {
  const {currentLanguage} = langStore;
  const [mealList, changeMealList] = useState<Array<MealType>>();
  const [filterData, changeFilterData] = useState<Array<MealType>>();
  const [curMeal, changeCurMeal] = useState<MealType>();
  const [curTip, changeCurTip] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const optionsSelection = [
    {label: currentLanguage.recipes.recipeName.others, value: 'others'},
    {label: currentLanguage.recipes.recipeName.dinner, value: 'dinner'},
    {label: currentLanguage.recipes.recipeName.lunch, value: 'lunch'},
    {label: currentLanguage.recipes.recipeName.breakfast, value: 'breakfast'},
  ];

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (subStore.isVip) return;
      const curCount = uiStore.tabClickedCount;
      uiStore.changeNumTabClicked(curCount + 1);
    });
    let subscriber: any;
    async function getDataFromFirebase() {
      const userID = await getDataLocal(FIR_KEY_USER_ID);
      subscriber = firestore()
        .collection(FIR_KEY_DB)
        .doc(userID)
        .onSnapshot(documentSnapshot => {
          if (documentSnapshot) {
            const snapshotData = documentSnapshot.data();
            changeMealList(snapshotData?.meals);
            changeFilterData(snapshotData?.meals);
          }
        });
    }
    const unsubscribeIn = navigation.addListener('focus', () => {
      uiStore.changeShowMealSelection(true);
    });
    const unsubscribeOut = navigation.addListener('blur', () => {
      uiStore.changeShowMealSelection(false);
    });
    getDataFromFirebase();
    return () => {
      unsubscribe;
      subscriber();
      unsubscribeIn;
      unsubscribeOut;
    };
  }, []);

  const updateDataToDb = async () => {
    uiStore.showLoading('save');
    const id = await getDataLocal(FIR_KEY_USER_ID);
    const oldData = await getDataDoc(`${FIR_KEY_DB}/${id}`);
    if (oldData) {
      const {healths} = oldData;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayTime = today.getTime();
      const indexChanged = healths.findIndex(e => {
        return e.date === todayTime;
      });

      const curDayVal = healths[indexChanged];
      let curData = curDayVal;
      curData.eaten += curMeal?.kcal;
      const oldMeals = curData.meals;

      const oldCurMeal = {...curMeal!};
      oldCurMeal.key = `new-${new Date().getTime()}`;
      curData.meals = oldMeals.concat([oldCurMeal]);

      let oldMaterias = curDayVal.materials;
      oldMaterias.carbs.eaten += curMeal?.carbs;
      oldMaterias.fat.eaten += curMeal?.fat;
      oldMaterias.protein.eaten += curMeal?.protein;
      curData.materials = oldMaterias;
      healths[indexChanged] = curData;
      await updateDataDoc(`${FIR_KEY_DB}/${id}`, {
        healths: healths,
      });
    }
    uiStore.hideLoading();
    setModalVisible(false);
    navigation.goBack();
  };

  function onClickMealItem(item: MealType) {
    navigation.navigate('MealDetail', {
      meal_data: item,
      onClickMealAddItem,
      isCreateNewMeal: false,
    });
  }

  const onClickMealAddItem = async (item: MealType) => {
    changeCurMeal(item);
    setModalVisible(true);
  };

  const onClickMealRemoveItem = async (item: MealType) => {
    uiStore.showLoading('remove');
    const id = await getDataLocal(FIR_KEY_USER_ID);
    const oldData = await getDataDoc(`${FIR_KEY_DB}/${id}`);
    if (oldData) {
      const {meals} = oldData;
      let newData = meals;
      newData = newData.filter(e => e.key !== item.key);
      await updateDataDoc(`${FIR_KEY_DB}/${id}`, {
        meals: newData,
      });
    }
    uiStore.hideLoading();
  };

  const createNewMeal = () => {
    navigation.navigate('CreateMeal');
  };

  const updateCurMeal = (text: string) => {
    const newWeight = Number(text);
    const food = mealList?.find(e => e.key === curMeal!.key);
    let ratio = newWeight;
    if (food?.type !== 'group') {
      ratio = newWeight / 100;
    }
    const newMeal: MealType = {
      key: food!.key,
      name: food!.name,
      carbs: food!.carbs * ratio,
      fat: food!.fat * ratio,
      fiber: food!.fiber * ratio,
      kcal: food!.kcal * ratio,
      protein: food!.protein * ratio,
      sugar: food!.sugar * ratio,
      weight: newWeight,
      elements: food?.elements,
      type: food?.type || 'element',
      meal_index: 'others',
    };
    changeCurMeal(newMeal);
  };

  const searchMeal = (key: string) => {
    if (mealList) {
      let curFilter = [...mealList];
      if (key) {
        curFilter = curFilter.filter(e => e.name.includes(key));
        changeFilterData(curFilter);
      } else {
        changeFilterData(mealList);
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
        leftElement={null}
        rightElement={null}
        centerElement={
          <Text style={commonStyles.headerTitle}>
            {currentLanguage.favMeal.title}
          </Text>
        }
      />
      <View style={styles.searchbarGroup}>
        <SearchBar
          placeholder={currentLanguage.calo.searchHint}
          style={styles.searchbarContainer}
          clearIconImageStyle={{tintColor: AppStyle.Color.Main}}
          onChangeText={searchMeal}
          onClearPress={() => searchMeal('')}
        />
        <TouchableOpacity style={styles.icon} onPress={createNewMeal}>
          <Image source={IC_PLUS} style={styles.icon} />
        </TouchableOpacity>
      </View>
      {!filterData || filterData.length === 0 ? (
        <ScrollView contentContainerStyle={{paddingBottom: 180, flexGrow: 1}}>
          <TipOfDay langStore={langStore} tipDefault={curTip} />
        </ScrollView>
      ) : (
        <View style={{flex: 1, marginTop: 10}}>
          <MealList
            data={filterData}
            canAdd={true}
            canRemove={true}
            callbackClickItem={(item: MealType) => {
              onClickMealItem(item);
            }}
            callbackClickAddItem={onClickMealAddItem}
            callbackClickRemoveItem={onClickMealRemoveItem}
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
            <Text style={styles.modalTitle}>{curMeal?.name}</Text>
            <Text>{`${curMeal?.kcal}Kcal/gram`}</Text>
            <View style={styles.inputContainer}>
              <Text style={{width: '50%'}}>
                {curMeal?.type !== 'group'
                  ? 'gram'
                  : currentLanguage.favMeal.cell.serving}
              </Text>
              <BaseTextInput
                onText={updateCurMeal}
                keyboardType="numeric"
                modifierStyle={{width: Dimensions.get('window').width / 8}}
                defaultValue={curMeal?.type !== 'group' ? '100' : '1'}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={{width: '50%'}}>{currentLanguage.calo.time}</Text>
              <ModalDropdown
                options={optionsSelection}
                defaultIndex={0}
                defaultValue={optionsSelection[0].label}
                style={styles.dropdownView}
                textStyle={[styles.dropdownText, {paddingLeft: 0}]}
                dropdownStyle={{
                  width: '40%',
                  height: optionsSelection.length * 30,
                }}
                renderRow={rowData => {
                  return (
                    <Text style={styles.dropdownText}>{rowData.label}</Text>
                  );
                }}
                renderButtonText={rowData => {
                  return (
                    <Text style={styles.dropdownText}>{rowData.label}</Text>
                  );
                }}
                onSelect={(idx, item) => {
                  const newMeal = {...curMeal!};
                  if (newMeal) {
                    newMeal.meal_index = item.value;
                    changeCurMeal(newMeal);
                  }
                }}
              />
            </View>
            <View style={styles.btnModalGroup}>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.modalBtnText}>
                  {currentLanguage.BMR.weightStat.popupBtnSkipeTitle}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={updateDataToDb}>
                <Text style={styles.modalBtnText}>
                  {currentLanguage.favMeal.addFoodButtonTitle}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default MealScreen;

const styles = StyleSheet.create({
  container: {flexGrow: 1},
  icon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  searchbarGroup: {
    justifyContent: 'space-between',
    backgroundColor: AppStyle.Color.Main,
    flexDirection: 'row',
    paddingBottom: 15,
    paddingHorizontal: 15,
  },
  searchbarContainer: {
    width: Dimensions.get('window').width - 80,
    height: 35,
    borderRadius: 20,
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
  modalText: {
    fontSize: AppStyle.Text.Normal,
    width: '50%',
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 20,
  },
  btnModalGroup: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingTop: 20,
  },
  dropdownView: {
    width: '50%',
    backgroundColor: AppStyle.Color.White,
    borderBottomWidth: 0.5,
  },
  dropdownText: {
    fontSize: AppStyle.Text.Normal,
    paddingHorizontal: 10,
    paddingTop: 7,
    textAlign: 'left',
    height: 30,
  },
});
