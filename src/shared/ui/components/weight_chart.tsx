import React, {useEffect} from 'react';
import {
  Animated,
  Easing,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LanguageStore from '../../store/language';
import {IC_PLAN, IC_RIGHT_CLICK} from '../../../utils/icons';
import AppStyle from '../styles/app.style';
import CustomLineChart from './custom_line_chart';

type ChartProps = {
  info: string;
  data: any;
  dataX: any;
  dataY: any;
  chartHeight?: number;
  action: () => void;
  actionPlus: () => void;
  actionPlan: () => void;
  langStore: LanguageStore;
};

const WeightChart: React.FC<ChartProps> = ({
  info,
  action,
  actionPlus,
  actionPlan,
  data,
  dataX,
  dataY,
  chartHeight,
  langStore,
}: ChartProps) => {
  const {currentLanguage} = langStore;
  let shakeAnimation = new Animated.Value(0);

  const startShake = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shakeAnimation, {
          toValue: 1.0,
          duration: 100,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnimation, {
          toValue: -1.0,
          duration: 100,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnimation, {
          toValue: 0.0,
          duration: 100,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  };

  startShake();

  return (
    <View>
      <View style={styles.headerTitle}>
        <Text style={[styles.text]}>{currentLanguage.BMR.weight}</Text>
      </View>
      <TouchableOpacity style={styles.container} onPress={action}>
        <View style={styles.weighTop}>
          <TouchableOpacity
            style={styles.textChartContainer}
            onPress={actionPlus}>
            <Text style={styles.textChart}>
              {currentLanguage.BMR.yourGoals.title}
            </Text>
            <Text style={styles.textInfo}>{info}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.planGroup} onPress={actionPlan}>
            <Animated.Image
              source={IC_RIGHT_CLICK}
              resizeMode="contain"
              style={{
                width: 35,
                height: 35,
                transform: [
                  {
                    rotate: shakeAnimation.interpolate({
                      inputRange: [-1, 1],
                      outputRange: ['-0.2rad', '0.2rad'],
                    }),
                  },
                ],
              }}
            />
            <Image source={IC_PLAN} style={styles.planIcon} />
          </TouchableOpacity>
        </View>
        <CustomLineChart
          label={'kg'}
          data={data}
          dataX={dataX}
          dataY={dataY}
          height={chartHeight}
          langStore={langStore}
        />
      </TouchableOpacity>
    </View>
  );
};

export default WeightChart;

const styles = StyleSheet.create({
  container: {
    width: AppStyle.Screen.FullWidth - 48,
    marginLeft: 24,
    borderRadius: 24,
    paddingBottom: 24,
    paddingLeft: 24,
    backgroundColor: AppStyle.Color.White,
    marginVertical: 8,
    elevation: 6,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowRadius: 3,
    shadowOpacity: 0.3,
  },
  headerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 0,
  },
  weighTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 24,
    marginLeft: -16,
  },
  planGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  planIcon: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },
  text: {
    fontSize: AppStyle.Text.Large,
    fontWeight: 'bold',
  },
  textInfo: {
    fontSize: AppStyle.Text.Large,
    fontWeight: '700',
  },
  textChartContainer: {
    margin: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textChart: {
    fontSize: AppStyle.Text.Normal,
  },
  textPlusContainer: {
    paddingHorizontal: 24,
  },
  textPlus: {
    fontSize: 20,
  },
});
