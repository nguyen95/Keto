import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import LanguageStore from '../../store/language';
import {
  LineChart,
  AreaChart,
  Grid,
  XAxis,
  YAxis,
} from 'react-native-svg-charts';
import {Circle, G, Line, Rect, Text as TvT} from 'react-native-svg';
import {} from '../../../utils/icons';
import AppStyle from '../styles/app.style';

type ChartProps = {
  data?: any;
  dataX?: any;
  dataY?: any;
  height?: number;
  label: string;
  month?: boolean;
  langStore: LanguageStore;
};

const CustomLineChart: React.FC<ChartProps> = ({
  data,
  dataX,
  dataY,
  height,
  label,
  month,
  langStore,
}: ChartProps) => {
  const {currentLanguage} = langStore;
  let min = Math.min.apply(Math, data);
  let max = Math.max.apply(Math, data);
  let num = max - min;
  num = num > 6 ? 6 : num > 3 ? num : 3;
  const Decorator = ({x, y, data}) => {
    return data.map((value, index) => (
      <Circle
        key={index}
        cx={x(index)}
        cy={y(value)}
        r={3}
        stroke={'rgb(134, 65, 244)'}
        fill={'white'}
      />
    ));
  };
  return (
    <View style={{width: AppStyle.Screen.FullWidth - 96 - 16, marginTop: 8}}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <YAxis
          style={{width: 50}}
          data={dataY}
          numberOfTicks={num}
          contentInset={{top: 10, bottom: 5}}
          formatLabel={(value) => `${value} ${label}`}
          svg={{
            fontSize: 10,
            fill: 'black',
            stroke: 'white',
            strokeWidth: 0.1,
            alignmentBaseline: 'baseline',
            baselineShift: '3',
          }}>
          <Grid />
        </YAxis>
        <LineChart
          style={{
            height: height,
            width: AppStyle.Screen.FullWidth - 48 - 50 - 44 - 16,
            backgroundColor: AppStyle.Color.MainBlur,
          }}
          svg={{stroke: AppStyle.Color.Main}}
          data={data}
          numberOfTicks={num}
          contentInset={{top: 10, bottom: 5, left: 8, right: 8}}>
          <Grid />
          {month && <Decorator />}
        </LineChart>
      </View>
      <XAxis
        style={{
          height: 30,
          width: AppStyle.Screen.FullWidth - 48 - 24 - 16,
          // marginBottom: 24,
        }}
        data={dataX}
        spacingInner={0.1}
        contentInset={{left: 50, right: 24}}
        formatLabel={(value) => dataX[value]}
        svg={{
          fontSize: 8,
          fill: 'black',
          // stroke: 'white',
          // strokeWidth: 0.1,
          originY: 32,
          y: 16,
        }}
      />
    </View>
  );
};

export default CustomLineChart;

const styles = StyleSheet.create({});
