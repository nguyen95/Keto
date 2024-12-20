import React, {useState} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import {Text as TvT} from 'react-native-svg';
import {} from '../../../utils/icons';
import AppStyle from '../styles/app.style';
import CustomCircleChart from './custom_pie_chart';

type ChartProps = {
  title?: string;
  center: number;
  centerSub: string;
  data: any;
  keys: any;
  colors: any;
  // chartHeight?: number;
};

const CaloCircleChart: React.FC<ChartProps> = ({
  title,
  center,
  centerSub,
  data,
  keys,
  colors,
}: // chartHeight,
ChartProps) => {
  const [labelWidth, setLabelWidth] = useState(0);
  let total = 0;
  data.forEach((d, i) => {
    total = total + d * (i < 2 ? 4 : 9);
  });
  const dataP = [
    {
      key: keys[0],
      value: total === 0 ? 1 : data[0] * 4,
      svg: {fill: colors[0]},
    },
    {
      key: keys[1],
      value: total === 0 ? 1 : data[1] * 4,
      svg: {fill: colors[1]},
    },
    {
      key: keys[2],
      value: total === 0 ? 1 : data[2] * 9,
      svg: {fill: colors[2]},
    },
  ];
  console.log('material: ', data);
  return (
    <View style={[styles.container]}>
      {title && (
        <View style={styles.headerTitle}>
          <Text style={[styles.text]}>{title}</Text>
        </View>
      )}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          width: AppStyle.Screen.FullWidth - 96,
        }}>
        <CustomCircleChart
          height={AppStyle.Screen.FullWidth / 2 - 8}
          dataP={dataP}
          total={total}
          center={center.toFixed(0)}
          centerSub={centerSub}
        />
        <FlatList
          style={{marginLeft: 16}}
          data={dataP}
          scrollEnabled={false}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item, index}) => (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                height: 20,
                marginTop: 8,
                marginBottom: 8,
              }}>
              <View
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 6,
                  backgroundColor: item.svg.fill,
                }}
              />
              <View style={{marginLeft: 4}}>
                <Text
                  style={{
                    fontSize: 12,
                  }}>
                  {item.key}
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                  }}>
                  {data[index].toFixed(1)}
                </Text>
              </View>
            </View>
          )}
        />
      </View>
    </View>
  );
};

export default CaloCircleChart;

const styles = StyleSheet.create({
  container: {
    width: AppStyle.Screen.FullWidth - 48,
    backgroundColor: AppStyle.Color.White,
    borderRadius: 24,
    padding: 24,
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
    // justifyContent: 'space-between',
    marginBottom: 24,
  },
  textRed: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'red',
  },
  textRedSub: {
    fontSize: 14,
    color: 'red',
  },
  text: {
    fontSize: AppStyle.Text.Large,
    fontWeight: 'bold',
  },
  textInfo: {
    fontSize: 16,
  },
  textChartContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textChart: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  textPlusContainer: {
    paddingHorizontal: 24,
  },
  textPlus: {
    fontSize: 16,
  },
});
