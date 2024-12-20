import {toJS} from 'mobx';
import {observer} from 'mobx-react';
import React, {useEffect, useState} from 'react';
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import {getBottomSpace, getStatusBarHeight} from 'react-native-iphone-x-helper';
import Timeline from 'react-native-timeline-flatlist';
import LanguageStore from '../../../shared/store/language';
import BaseHeader from '../../../shared/ui/containers/base_header';
import AppStyle from '../../../shared/ui/styles/app.style';
import {
  commonStyles,
  heightHeader,
} from '../../../shared/ui/styles/common.style';
import {IC_BACK} from '../../../utils/icons';

type SuggestionMenuViewProps = {
  navigation: any;
  route: any;
  langStore: LanguageStore;
};

const SuggestionMenuScreen: React.FC<SuggestionMenuViewProps> = observer(
  ({route, navigation, langStore}: SuggestionMenuViewProps) => {
    const {currentLanguage} = langStore;
    const {schedule} = route.params;
    const [menuIdx, changeMenu] = useState(0);

    useEffect(() => {
      return () => {};
    }, []);

    const goBack = () => {
      navigation.goBack();
    };

    function convertScheduleToTimelineData(menu_data: any) {
      const timelineData = menu_data.map((e) => {
        return {
          time: e.time,
          title: e.timeline,
          description: `👉 ` + e.description.replace(/,/g, '\n👉 '),
        };
      });
      return timelineData;
    }

    return (
      <View style={styles.container}>
        <BaseHeader
          leftElement={<Image source={IC_BACK} style={styles.icon} />}
          rightElement={<View />}
          centerElement={
            <Text style={commonStyles.headerTitle}>
              {currentLanguage.BMR.yourGoals.suggestMeal}
            </Text>
          }
          leftAction={goBack}
        />
        <View style={styles.segmentContainer}>
          <SegmentedControl
            values={['Menu 1', 'Menu 2', 'Menu 3']}
            backgroundColor={AppStyle.Color.White}
            activeFontStyle={{color: AppStyle.Color.White}}
            tintColor={AppStyle.Color.Main}
            selectedIndex={menuIdx}
            onChange={(event) => {
              changeMenu(event.nativeEvent.selectedSegmentIndex);
            }}
          />
        </View>
        <ScrollView style={styles.scrollContainer}>
          {toJS(schedule)[menuIdx].schedule.map((data, index) => {
            return (
              <View
                style={[
                  styles.timelineContainer,
                  {
                    backgroundColor:
                      index % 2
                        ? AppStyle.Color.MainBlur
                        : AppStyle.Color.White,
                  },
                ]}>
                <Text
                  style={styles.timelineHeader}>{`🧑‍🍳 Day ${data.day}`}</Text>
                <Timeline
                  data={convertScheduleToTimelineData(data.menu)}
                  columnFormat="two-column"
                  circleSize={20}
                  circleColor="rgb(45,156,219)"
                  lineColor="rgb(45,156,219)"
                  timeContainerStyle={{width: 80}}
                  timeStyle={styles.time}
                  descriptionStyle={styles.timelineDes}
                  detailContainerStyle={[
                    styles.timelineDetailContainer,
                    {
                      backgroundColor:
                        index % 2
                          ? AppStyle.Color.White
                          : AppStyle.Color.MainBlur,
                    },
                  ]}
                  options={{
                    style: {paddingTop: 5},
                  }}
                />
              </View>
            );
          })}
        </ScrollView>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppStyle.Color.White,
    alignItems: 'center',
  },
  headerContainer: {
    height:
      Platform.OS === 'android'
        ? heightHeader
        : heightHeader - getStatusBarHeight(),
    width: '100%',
    backgroundColor: AppStyle.Color.Background,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  headerTitle: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '500',
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    left: 10,
  },
  icon: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
    tintColor: 'white',
  },
  iconSmall: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  iconLarge: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  segmentContainer: {
    width: '100%',
    height: 30,
  },
  scrollContainer: {
    flexGrow: 1,
    width: '100%',
    marginBottom: getBottomSpace(),
    marginTop: 5,
  },
  timelineContainer: {
    flex: 1,
    width: '100%',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  timelineHeader: {
    fontSize: AppStyle.Text.Large,
    textAlign: 'center',
    fontWeight: '800',
    paddingVertical: 16,
  },
  time: {
    textAlign: 'center',
    backgroundColor: '#ff9797',
    color: 'white',
    padding: 5,
    borderRadius: 13,
  },
  timelineDes: {
    color: AppStyle.Color.DarkBlue,
    lineHeight: 24,
    paddingLeft: 8,
  },
  timelineDetailContainer: {
    marginBottom: 24,
    paddingLeft: 5,
    paddingRight: 5,
    borderRadius: 10,
  },
});

export default SuggestionMenuScreen;
