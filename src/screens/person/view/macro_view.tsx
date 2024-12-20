import React, {useState} from 'react';
import {
  Alert,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import LanguageStore from '../../../shared/store/language';
import UserStore from '../../../shared/store/user';
import CustomCircleChart from '../../../shared/ui/components/custom_pie_chart';
import BaseHeader from '../../../shared/ui/containers/base_header';
import AppStyle from '../../../shared/ui/styles/app.style';
import {commonStyles} from '../../../shared/ui/styles/common.style';
import Slider from '@react-native-community/slider';
import PersonStore from '../store';
import {APP_NAME} from '../../../utils/config/setting';
import {IC_BACK} from '../../../utils/icons';

type MacroProps = {
  navigation: any;
  personStore: PersonStore;
  langStore: LanguageStore;
};

const MacroScreen: React.FC<MacroProps> = ({
  navigation,
  personStore,
  langStore,
}: MacroProps) => {
  const {currentLanguage} = langStore;
  const {data, saveMacroData} = personStore;

  const {carbs, protein, fat} = data.target.materials;
  const [macroArr, setMacroArr] = useState([
    carbs.target,
    protein.target,
    fat.target,
  ]); // gram
  const [macroTotal, setMacroTotal] = useState(data.target.calo); // calo
  let totalCalo = carbs.target * 4 + protein.target * 4 + fat.target * 9;
  const ItemMacro = ({item, index}) => {
    return (
      <View style={styles.itemMacro}>
        <View style={styles.itemMacroChild}>
          <View style={styles.itemMacroTitle}>
            <View
              style={[styles.itemMacroSign, {backgroundColor: item.color}]}
            />
            <Text style={styles.itemMacroLabel}>{item.label}</Text>
          </View>
          <Text style={styles.itemMacroLabel}>
            {macroArr[index].toFixed(0)} gram
          </Text>
          <Text style={styles.itemMacroLabel}>
            {(
              (macroArr[index] * 100 * (index < 2 ? 4 : 9)) /
              macroTotal
            ).toFixed(0)}
            %
          </Text>
          <Text style={styles.itemMacroLabel}>{totalCalo.toFixed(0)} cal</Text>
        </View>
        <View style={styles.itemMacroChild}>
          <TouchableOpacity
            style={styles.itemMacroBtn}
            onPress={item.actionMinus}>
            <Text style={styles.itemMacroBtnText}>-</Text>
          </TouchableOpacity>
          <Slider
            style={{width: AppStyle.Screen.FullWidth / 2, height: 20}}
            minimumValue={0}
            value={macroArr[index]}
            maximumValue={totalCalo / (index < 2 ? 4 : 9)}
            minimumTrackTintColor={item.color}
            maximumTrackTintColor="#00000030"
            // onValueChange={item.actionChange}
            onSlidingComplete={item.actionChange}
          />
          <TouchableOpacity
            style={styles.itemMacroBtn}
            onPress={item.actionPlus}>
            <Text style={styles.itemMacroBtnText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  const dataMacro = [
    {
      label: currentLanguage.nutritions.carbs,
      color: AppStyle.Color.Main,
      actionPlus: () => {
        onPlus(0);
      },
      actionMinus: () => {
        onMinus(0);
      },
      actionChange: (val: number) => {
        onChange(0, val);
      },
    },
    {
      label: currentLanguage.nutritions.protein,
      color: AppStyle.Color.Orange,
      actionPlus: () => {
        onPlus(1);
      },
      actionMinus: () => {
        onMinus(1);
      },
      actionChange: (val: number) => {
        onChange(1, val);
      },
    },
    {
      label: currentLanguage.nutritions.fat,
      color: AppStyle.Color.Green,
      actionPlus: () => {
        onPlus(2);
      },
      actionMinus: () => {
        onMinus(2);
      },
      actionChange: (val: number) => {
        onChange(2, val);
      },
    },
  ];

  const dataP = [
    {
      key: dataMacro[0].label,
      value: macroArr[0] * 4,
      svg: {fill: dataMacro[0].color},
    },
    {
      key: dataMacro[1].label,
      value: macroArr[1] * 4,
      svg: {fill: dataMacro[1].color},
    },
    {
      key: dataMacro[2].label,
      value: macroArr[2] * 9,
      svg: {fill: dataMacro[2].color},
    },
  ];
  const onMinus = (index: number) => {
    let arr = [...macroArr];
    arr[index] = arr[index] - 1;
    setMacroArr(arr);
    setMacroTotal(arr[0] * 4 + arr[1] * 4 + arr[2] * 9);
  };
  const onPlus = (index: number) => {
    let arr = [...macroArr];
    arr[index] = arr[index] + 1;
    setMacroArr(arr);
    setMacroTotal(arr[0] * 4 + arr[1] * 4 + arr[2] * 9);
  };
  const onChange = (index: number, val: number) => {
    let arr = [...macroArr];
    arr[index] = val;
    setMacroArr(arr);
    setMacroTotal(arr[0] * 4 + arr[1] * 4 + arr[2] * 9);
  };
  const onSave = () => {
    if (Math.round((macroTotal * 100) / totalCalo) !== 100) {
      Alert.alert(
        currentLanguage.BMR.nutritionSettingsTitle,
        currentLanguage.BMR.nutritionSettingsError,
      );
    } else {
      saveMacroData(macroArr);
      goBack();
    }
  };
  const goBack = () => {
    navigation.goBack();
  };
  return (
    <View style={styles.container}>
      <BaseHeader
        leftElement={<Image source={IC_BACK} style={styles.icon} />}
        leftAction={goBack}
        rightElement={null}
        centerElement={
          <Text style={commonStyles.headerTitle}>
            {currentLanguage.BMR.nutritionSettings}
          </Text>
        }
      />
      <ScrollView contentContainerStyle={styles.containerScroll}>
        <CustomCircleChart
          height={AppStyle.Screen.FullWidth / 2 + 24}
          dataP={dataP}
          total={macroTotal}
          center={`${((macroTotal * 100) / totalCalo).toFixed(0)}%`}
        />
        <FlatList
          // scrollEnabled={false}
          data={dataMacro}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item, index}) => (
            <ItemMacro item={item} index={index} />
          )}
        />
        <TouchableOpacity style={styles.saveBtn} onPress={onSave}>
          <Text style={styles.saveBtnText}>{currentLanguage.BMR.save}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default MacroScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppStyle.Color.White,
    alignItems: 'center',
  },
  btnBack: {},
  icon: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
    tintColor: AppStyle.Color.White,
  },
  containerScroll: {
    flexGrow: 1,
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 100,
  },
  saveBtn: {
    height: 40,
    width: AppStyle.Screen.FullWidth / 2,
    marginTop: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: AppStyle.Color.Orange,
    elevation: 4,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 2,
    shadowOpacity: 0.3,
  },
  saveBtnText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: AppStyle.Color.White,
  },
  itemMacro: {
    width: AppStyle.Screen.FullWidth,
    paddingHorizontal: 24,
    paddingVertical: 8,
  },
  itemMacroChild: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  itemMacroTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemMacroSign: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  itemMacroLabel: {
    fontSize: 14,
    textAlign: 'center',
  },
  itemMacroBtn: {
    padding: 4,
  },
  itemMacroBtnText: {
    fontSize: 18,
    textAlign: 'center',
  },
});
