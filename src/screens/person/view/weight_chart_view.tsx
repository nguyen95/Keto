import React, {useEffect} from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  FlatList,
} from 'react-native';
import LanguageStore from '../../../shared/store/language';
import UserStore from '../../../shared/store/user';
import BaseHeader from '../../../shared/ui/containers/base_header';
import {commonStyles} from '../../../shared/ui/styles/common.style';
import AppStyle from '../../../shared/ui/styles/app.style';
import Icon from 'react-native-vector-icons/FontAwesome5';
import CaloChart from '../../../shared/ui/components/calo_chart';
import {observer} from 'mobx-react';
import WeightChart from '../../../shared/ui/components/weight_chart';
import CustomLineChart from '../../../shared/ui/components/custom_line_chart';
import PersonStore from '../store';
import HomeStore from '../../../screens/home/store';
import {IC_BACK} from '../../../utils/icons';

type ChartScreenProps = {
  navigation: any;
  personStore?: PersonStore;
  homeStore?: HomeStore;
  langStore: LanguageStore;
};

const WeightChartScreen: React.FC<ChartScreenProps> = observer(
  ({navigation, homeStore, personStore, langStore}: ChartScreenProps) => {
    const {currentLanguage, currentLanguageKey} = langStore;
    let store = homeStore ? homeStore : personStore;
    const {
      data,
      waterNum,
      setWaterNum,
      dataWeight,
      dataWeightX,
      dataWeightY,
      currentWeight,
      dataWeightChart,
      suggestWeight,
      getDataWeightChart,
      getDataWeight,
    } = store!!;

    const ItemWeightIfo = ({item}) => {
      return (
        <View style={styles.itemInfo}>
          <Icon name="check" size={18} color="#000000" />
          <Text> {item.label}: </Text>
          <Text>{item.weight.toFixed(1)} kg</Text>
        </View>
      );
    };

    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };

    const ItemWeightHistory = ({item}) => {
      return (
        <View style={styles.itemHistory}>
          <Text>
            {new Date(item.date).toLocaleDateString(
              currentLanguageKey,
              options,
            )}
          </Text>
          <Text>{item.weight} kg</Text>
        </View>
      );
    };

    const dataWeightInfo = [
      {
        label: currentLanguage.BMR.weightStat.startingWeight,
        weight: data.weight,
      },
      {
        label: currentLanguage.BMR.yourGoals.title,
        weight: data.target.weight ? data.target.weight : suggestWeight,
      },
      {
        label: currentLanguage.BMR.weightStat.currentWeight,
        weight: currentWeight,
      },
      {
        label: currentLanguage.BMR.weightStat.gapWeight,
        weight: Math.abs(currentWeight - data.weight),
      },
    ];
    const goBack = () => {
      navigation.goBack();
    };

    useEffect(() => {
      // getDataWeightChart();
      getDataWeight(30);
      return () => {
        getDataWeight(7);
      };
    }, []);
    return (
      <View style={styles.container}>
        <BaseHeader
          leftElement={<Image source={IC_BACK} style={styles.icon} />}
          leftAction={goBack}
          rightElement={null}
          centerElement={
            <Text style={commonStyles.headerTitle}>
              {currentLanguage.BMR.weightStat.popupTitle}
            </Text>
          }
        />
        <ScrollView contentContainerStyle={styles.containerScroll}>
          <Text style={styles.titleInfo}>
            {currentLanguage.BMR.weightStat.dailyStaticTitle}
          </Text>
          <FlatList
            contentContainerStyle={{paddingHorizontal: 16}}
            data={dataWeightInfo}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) => <ItemWeightIfo item={item} />}
          />
          <View style={{padding: 24}}>
            <CaloChart
              label={'kg'}
              chartHeight={150}
              data={dataWeight}
              dataY={dataWeightY}
              dataX={dataWeightX}
              langStore={langStore}
            />
          </View>
          <Text style={styles.titleHistory}>
            {currentLanguage.BMR.weightStat.history}
          </Text>
          <FlatList
            data={dataWeightChart}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item, index}) => <ItemWeightHistory item={item} />}
          />
        </ScrollView>
      </View>
    );
  },
);

export default WeightChartScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    backgroundColor: AppStyle.Color.White,
    paddingBottom: 56,
  },
  titleInfo: {
    fontSize: 18,
    fontWeight: 'bold',
    padding: 16,
  },
  itemInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  titleHistory: {
    marginHorizontal: 24,
    marginVertical: 8,
    fontSize: 18,
    fontWeight: 'bold',
  },
  itemHistory: {
    padding: 8,
    paddingHorizontal: 16,
    backgroundColor: AppStyle.Color.White,
    borderRadius: 8,
    margin: 16,
    marginVertical: 8,
    elevation: 4,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 2,
    shadowOpacity: 0.2,
  },
});
