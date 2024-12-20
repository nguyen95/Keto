import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import LanguageStore from '../../store/language';
import {} from '../../../utils/icons';
import AppStyle from '../styles/app.style';
import CustomLineChart from './custom_line_chart';

type ChartProps = {
  title?: string;
  data: any;
  dataX: any;
  dataY: any;
  chartHeight: number;
  label: string;
  langStore: LanguageStore;
};

const CaloChart: React.FC<ChartProps> = ({
  title,
  data,
  dataX,
  dataY,
  chartHeight,
  label,
  langStore,
}: ChartProps) => {
  const {currentLanguage} = langStore;
  return (
    <View style={[styles.container]}>
      {title && (
        <View style={styles.headerTitle}>
          <Text style={[styles.text]}>{title}</Text>
        </View>
      )}
      <CustomLineChart
        data={data}
        dataX={dataX}
        dataY={dataY}
        height={chartHeight}
        label={label}
        langStore={langStore}
      />
    </View>
  );
};

export default CaloChart;

const styles = StyleSheet.create({
  container: {
    width: AppStyle.Screen.FullWidth - 48,
    backgroundColor: AppStyle.Color.White,
    borderRadius: 24,
    marginVertical: 8,
    padding: 24,
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
