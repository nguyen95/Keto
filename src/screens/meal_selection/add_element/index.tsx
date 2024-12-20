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
import MealList from '../../../shared/ui/private/meal_list';
import {MealType} from '../../../shared/objects/meal';
import BaseTextInput from '../../../shared/ui/components/base_text_input';
import {mergeMealData} from '../../../shared/ui/private/meal_list/services';
import {getDataLocal} from '../../../services/storage';
import {FIR_KEY_DB, FIR_KEY_USER_ID} from '../../../utils/config/setting';
import {getDataDoc, updateDataDoc} from '../../../services/firebase';
import SubStore from '../../../shared/store/sub';

type AddElementScreenProps = {
  navigation: any;
  route: any;
  uiStore: UIStore;
  langStore: LanguageStore;
  subStore: SubStore;
};

const AddElementScreen: React.FC<AddElementScreenProps> = ({
  navigation,
  route,
  uiStore,
  langStore,
  subStore,
}: AddElementScreenProps) => {
  const {currentLanguage, currentFoodCommon} = langStore;
  const {elementAdded} = route.params;
  const [mealList, changeMealList] = useState<Array<MealType>>();
  const [filterData, changeFilterData] = useState<Array<MealType>>();
  const [curMeal, changeCurMeal] = useState<MealType>();
  const [curTip, changeCurTip] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, changeModalType] = useState<'add_info' | 'add_element'>(
    'add_info',
  );

  useEffect(() => {
    async function getDataFromFirebase() {
      uiStore.showLoading('get_meals');
      const arrData = await mergeMealData(currentFoodCommon);
      changeMealList(arrData);
      changeFilterData(arrData);
      uiStore.hideLoading();
    }
    getDataFromFirebase();
    return;
  }, []);

  function onClickMealItem(item: MealType) {
    navigation.navigate('MealDetail', {
      meal_data: item,
      onClickMealAddItem,
      isCreateNewMeal: true,
    });
  }

  const onClickMealAddItem = async (item: MealType) => {
    changeModalType('add_info');
    changeCurMeal(item);
    setModalVisible(true);
  };

  const onClickAddElement = () => {
    changeModalType('add_element');
    changeCurMeal({
      carbs: 0,
      fat: 0,
      fiber: 0,
      kcal: 0,
      key: '',
      name: '',
      protein: 0,
      sugar: 0,
    });
    setModalVisible(true);
  };

  const updateCurMeal = (text: string) => {
    const newWeight = Number(text);
    const ratio = newWeight / 100;
    const food = mealList?.find(e => e.key === curMeal!.key);
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
    };
    changeCurMeal(newMeal);
  };

  const updateCurElement = (
    text: string,
    type: 'title' | 'carbs' | 'fat' | 'protetin',
  ) => {
    const newMeal: MealType = {...curMeal!};
    if (type !== 'title') {
      const newWeight = Number(text);
      if (type === 'carbs') {
        newMeal.carbs = newWeight;
      } else if (type === 'fat') {
        newMeal.fat = newWeight;
      } else {
        newMeal.protein = newWeight;
      }
    } else {
      newMeal.name = text;
    }
    changeCurMeal(newMeal);
  };

  const addElementToDb = async () => {
    uiStore.showLoading('add_element');
    const userId = await getDataLocal(FIR_KEY_USER_ID);
    const oldData = await getDataDoc(`${FIR_KEY_DB}/${userId}`);
    if (oldData) {
      const {elements} = oldData;
      let newData = elements;
      const inputData = {...curMeal!};
      inputData.key = `element-${new Date().getTime()}`;
      if (inputData.name === '') {
        inputData.name = currentLanguage.food.simpleFood.defaultName;
      }
      inputData.kcal =
        inputData.carbs * 4 + inputData.protein * 4 + inputData.fat * 9;
      if (newData) {
        newData = newData.concat([inputData]);
      } else {
        newData = [inputData];
      }
      await updateDataDoc(`${FIR_KEY_DB}/${userId}`, {
        elements: newData,
      });
      setTimeout(async () => {
        const arrData = await mergeMealData(currentFoodCommon);
        changeMealList(arrData);
        changeFilterData(arrData);
      }, 500);
    }
    uiStore.hideLoading();
    setModalVisible(false);
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
        leftElement={<Image source={IC_BACK} style={styles.backIcon} />}
        rightElement={<View />}
        centerElement={
          <Text style={commonStyles.headerTitle}>
            {currentLanguage.favMeal.new.content.buttonTitle}
          </Text>
        }
        leftAction={() => navigation.goBack()}
      />
      <View style={styles.searchbarGroup}>
        <SearchBar
          placeholder={currentLanguage.calo.searchHint}
          style={styles.searchbarContainer}
          clearIconImageStyle={{tintColor: AppStyle.Color.Main}}
          onChangeText={searchMeal}
          onClearPress={() => searchMeal('')}
        />
        <TouchableOpacity style={{padding: 10}} onPress={onClickAddElement}>
          <Text style={{color: AppStyle.Color.White}}>
            + {currentLanguage.favMeal.new.content.buttonTitle}
          </Text>
        </TouchableOpacity>
      </View>
      {!filterData || filterData.length === 0 ? (
        <TipOfDay langStore={langStore} tipDefault={curTip} />
      ) : (
        <View style={{flex: 1, marginTop: 10}}>
          <MealList
            data={filterData}
            canAdd={true}
            canRemove={false}
            callbackClickItem={(item: MealType) => {
              onClickMealItem(item);
            }}
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
          {modalType === 'add_info' ? (
            <View style={styles.modalView}>
              <Text style={styles.modalTitle}>{curMeal?.name}</Text>
              <Text>{`${curMeal?.kcal}Kcal/gram`}</Text>
              <View
                style={[
                  styles.inputContainer,
                  {justifyContent: 'space-around'},
                ]}>
                <BaseTextInput
                  onText={updateCurMeal}
                  keyboardType="numeric"
                  modifierStyle={{width: Dimensions.get('window').width / 8}}
                  defaultValue="100"
                />
                <Text>gram</Text>
              </View>
              <View style={styles.btnModalGroup}>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Text style={styles.modalBtnText}>
                    {currentLanguage.BMR.weightStat.popupBtnSkipeTitle}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setModalVisible(false);
                    elementAdded(curMeal);
                    navigation.goBack();
                  }}>
                  <Text style={styles.modalBtnText}>
                    {currentLanguage.favMeal.addFoodButtonTitle}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.modalView}>
              <Text style={styles.modalTitle}>
                {currentLanguage.favMeal.new.content.buttonTitle}
              </Text>
              <View style={styles.inputContainer}>
                <Text style={styles.modalText}>
                  {currentLanguage.food.simpleFood.hintTitle}
                </Text>
                <BaseTextInput
                  onText={text => updateCurElement(text, 'title')}
                  modifierStyle={{width: '50%'}}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.modalText}>
                  {currentLanguage.food.simpleFood.hintCarbs}
                </Text>
                <BaseTextInput
                  onText={text => updateCurElement(text, 'carbs')}
                  keyboardType="numeric"
                  modifierStyle={{width: '50%'}}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.modalText}>
                  {currentLanguage.food.simpleFood.hintFat}
                </Text>
                <BaseTextInput
                  onText={text => updateCurElement(text, 'fat')}
                  keyboardType="numeric"
                  modifierStyle={{width: '50%'}}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.modalText}>
                  {currentLanguage.food.simpleFood.hintPro}
                </Text>
                <BaseTextInput
                  onText={text => updateCurElement(text, 'protetin')}
                  keyboardType="numeric"
                  modifierStyle={{width: '50%'}}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.modalText}>
                  {currentLanguage.food.simpleFood.hintkcal}
                </Text>
                <Text style={[styles.modalText, {color: 'red'}]}>
                  {(curMeal?.carbs || 0) * 4 +
                    (curMeal?.protein || 0) * 4 +
                    (curMeal?.fat || 0) * 9}
                </Text>
              </View>
              <View style={styles.btnModalGroup}>
                <TouchableOpacity
                  onPress={() => {
                    changeCurMeal(undefined);
                    setModalVisible(false);
                  }}>
                  <Text style={styles.modalBtnText}>
                    {currentLanguage.BMR.weightStat.popupBtnSkipeTitle}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={addElementToDb}>
                  <Text style={styles.modalBtnText}>
                    {currentLanguage.favMeal.addFoodButtonTitle}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default AddElementScreen;

const styles = StyleSheet.create({
  container: {flexGrow: 1},
  backIcon: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
    tintColor: AppStyle.Color.Background,
  },
  icon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
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
});
