import React, {useEffect} from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
} from 'react-native';
import LanguageStore from '../../../shared/store/language';
import UserStore from '../../../shared/store/user';
import BaseHeader from '../../../shared/ui/containers/base_header';
import {commonStyles} from '../../../shared/ui/styles/common.style';
import AppStyle from '../../../shared/ui/styles/app.style';
import Icon from 'react-native-vector-icons/FontAwesome5';
import CaloChart from '../../../shared/ui/components/calo_chart';
import CaloCircleChart from '../../../shared/ui/components/calo_circle_chart';
import {observer} from 'mobx-react';
import PersonStore from '../store';
import {IC_BACK} from '../../../utils/icons';

type ChartScreenProps = {
  navigation: any;
  personStore: PersonStore;
  langStore: LanguageStore;
};

const ChartScreen: React.FC<ChartScreenProps> = observer(
  ({navigation, personStore, langStore}: ChartScreenProps) => {
    const {currentLanguage} = langStore;
    const {
      getDataWeek,
      dataCalo,
      dataCaloX,
      dataCaloY,
      dataWater,
      dataWaterX,
      dataWaterY,
      dataCarbs,
      dataProtein,
      dataFat,
    } = personStore;

    const goBack = () => {
      navigation.goBack();
    };

    useEffect(() => {
      getDataWeek();
      return () => {};
    }, []);
    return (
      <View style={styles.container}>
        <BaseHeader
          leftElement={<Image source={IC_BACK} style={styles.icon} />}
          leftAction={goBack}
          rightElement={null}
          centerElement={
            <Text style={commonStyles.headerTitle}>
              {currentLanguage.statistics.title}
            </Text>
          }
        />
        <ScrollView contentContainerStyle={styles.containerScroll}>
          <CaloChart
            label={'cal'}
            chartHeight={200}
            title={currentLanguage.statistics.caloriesChartTitle}
            data={dataCalo}
            dataX={dataCaloX}
            dataY={dataCaloY}
            langStore={langStore}
          />
          <CaloCircleChart
            title={currentLanguage.statistics.week.nutritionAverage}
            data={[dataCarbs / 7, dataProtein / 7, dataFat / 7]}
            center={(dataCarbs * 4 + dataProtein * 4 + dataFat * 9) / 7}
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
          <CaloChart
            label={'l'}
            chartHeight={200}
            title={currentLanguage.statistics.waterChartTitle}
            data={dataWater}
            dataX={dataWaterX}
            dataY={dataWaterY}
            langStore={langStore}
          />
        </ScrollView>
      </View>
    );
  },
);

export default ChartScreen;

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
    alignItems: 'center',
  },
  itemPerson: {
    backgroundColor: AppStyle.Color.White,
    width: AppStyle.Screen.FullWidth - 48,
    borderRadius: 16,
    elevation: 6,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowRadius: 3,
    shadowOpacity: 0.2,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 16,
  },
  itemRow: {
    width: AppStyle.Screen.FullWidth - 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 24,
  },
  itemChild: {
    alignItems: 'center',
  },
  itemTextBigRed: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'red',
  },
  itemTextSmall: {
    fontSize: 14,
    fontWeight: '500',
  },
  itemTextSmallRed: {
    fontSize: 14,
    color: 'red',
  },
  itemTextSmallSub: {
    fontSize: 20,
    fontWeight: 'bold',
    color: AppStyle.Color.TextGray,
    marginTop: 8,
  },
  itemWater: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemWaterBtnContainer: {
    height: 100,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemWaterBtn: {
    margin: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppStyle.Color.White,
    height: 20,
    width: 20,
    borderRadius: 10,
    elevation: 4,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 2,
    shadowOpacity: 0.3,
  },
  itemWaterBtnText: {
    color: AppStyle.Color.Main,
    fontSize: 18,
    textAlign: 'center',
  },
  itemWaterChartContainer: {
    alignItems: 'center',
    width: 50,
    height: 160,
    backgroundColor: AppStyle.Color.White,
    borderRadius: 25,
    margin: 8,
    elevation: 6,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowRadius: 3,
    shadowOpacity: 0.2,
    overflow: 'hidden',
  },
  water: {
    width: 50,
    height: 160,
    backgroundColor: AppStyle.Color.Main,
    paddingBottom: -100,
  },
  waterPercent: {
    fontSize: 16,
    color: AppStyle.Color.White,
    paddingBottom: 40,
  },
});
