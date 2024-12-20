import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {PieChart, Grid, XAxis, YAxis} from 'react-native-svg-charts';
import {} from '../../../utils/icons';
import {Text as TvT} from 'react-native-svg';

type ChartProps = {
  height: number;
  dataP?: any;
  total?: number;
  center?: any;
  centerSub?: string;
};

const Labels = ({slices, height, width, total}) => {
  return slices.map((slice, index) => {
    const {labelCentroid, pieCentroid, data} = slice;
    return (
      <TvT
        key={index}
        x={pieCentroid[0]}
        y={pieCentroid[1]}
        fill={'black'}
        textAnchor={'middle'}
        alignmentBaseline={'middle'}
        fontSize={12}
        stroke={'white'}
        strokeWidth={0.2}>
        {total === 0 ? '0%' : `${((data.value * 100) / total).toFixed(0)}%`}
        {/* : `${(data.value * 100 / total).toFixed(1)}` */}
      </TvT>
    );
  });
};

const CustomCircleChart: React.FC<ChartProps> = ({
  height,
  dataP,
  total,
  center,
  centerSub,
}: ChartProps) => {
  const [labelWidth, setLabelWidth] = useState(0);

  return (
    <PieChart
      style={{
        width: height,
        height: height,
      }}
      data={dataP}
      innerRadius={height / 5}
      outerRadius={height / 2}
      padAngle={0}
      valueAccessor={({item}) => item.value}
      animate={true}>
      <Labels total={total} />
      <View
        onLayout={({
          nativeEvent: {
            layout: {width},
          },
        }) => {
          setLabelWidth(width);
        }}
        style={{
          position: 'absolute',
          left: height / 2 - labelWidth / 2,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text style={styles.textRed}>{center}</Text>
        {centerSub && <Text style={styles.textRedSub}>{centerSub}</Text>}
      </View>
    </PieChart>
  );
};

export default CustomCircleChart;

const styles = StyleSheet.create({
  textRed: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'red',
  },
  textRedSub: {
    fontSize: 14,
    color: 'red',
  },
});
