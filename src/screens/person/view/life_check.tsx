import {observer} from 'mobx-react';
import React, {useState} from 'react';
import {
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {CheckBox} from 'react-native-elements';
import {ScrollView} from 'react-native-gesture-handler';
import LanguageStore from '../../../shared/store/language';
import BaseHeader from '../../../shared/ui/containers/base_header';
import AppStyle from '../../../shared/ui/styles/app.style';
import {commonStyles} from '../../../shared/ui/styles/common.style';
import {IC_BACK} from '../../../utils/icons';
import PersonStore from '../store';

type LifeCheckProps = {
  navigation: any;
  personStore: PersonStore;
  langStore: LanguageStore;
};

type QuestCategory = {
  id: string;
  title: string;
  questions: Array<string>;
};

type LifeCheckItemProps = {
  item: QuestCategory;
  arrCheck: Array<boolean>;
  onPressQuestion: (check: boolean, index: number) => void;
};

type QuestItemProps = {
  content: string;
  check: boolean;
  onPressQuest: (check: boolean) => void;
};

const ItemQuestion: React.FC<QuestItemProps> = ({
  content,
  check,
  onPressQuest,
}: QuestItemProps) => {
  return (
    <CheckBox
      containerStyle={styles.quest}
      title={content}
      checkedIcon="dot-circle-o"
      uncheckedIcon="circle-o"
      checkedColor={AppStyle.Color.Main}
      uncheckedColor={AppStyle.Color.Main}
      checked={check}
      onPress={() => onPressQuest(check)}
    />
  );
};

const ItemLifeCheck: React.FC<LifeCheckItemProps> = ({
  item,
  onPressQuestion,
  arrCheck,
}: LifeCheckItemProps) => {
  return (
    <View key={item.id}>
      <Text style={styles.subTitleItem}>{item.title}</Text>
      <FlatList
        contentContainerStyle={{paddingBottom: 100}}
        key={item.id}
        data={item.questions}
        keyExtractor={(item) => item}
        renderItem={({item, index}) => (
          <ItemQuestion
            content={item}
            check={arrCheck[index]}
            onPressQuest={(check) => onPressQuestion(check, index)}
          />
        )}
      />
    </View>
  );
};

const LifeCheck: React.FC<LifeCheckProps> = observer(
  ({navigation, personStore, langStore}: LifeCheckProps) => {
    let arrIntitial = [
      [],
      [false, false, false, false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false, false],
      [false, false, false, false],
      [false, false, false, false, false],
      [false, false],
      [false, false, false, false, false, false, false],
    ];
    const {currentLanguage, currentLifeCheck} = langStore;
    const [curOptionIdx, changeOption] = useState(0);
    const [reftList, setReftList] = useState<FlatList | null>(null);
    const [arrQuestState, setArrQuestState] = useState<Array<Array<boolean>>>([
      ...arrIntitial,
    ]);

    const onItemQuestionCheck = (
      index: number,
      indexItem: number,
      checkItem: boolean,
    ) => {
      let arrQuest = [...arrQuestState];
      arrQuest[index][indexItem] = !checkItem;
      setArrQuestState(arrQuest);
    };

    const onBack = () => {
      let indexBack = curOptionIdx > 0 ? curOptionIdx - 1 : curOptionIdx;
      reftList && reftList.scrollToIndex({animated: true, index: indexBack});
      changeOption(indexBack);
    };

    const onNext = () => {
      let indexNext = curOptionIdx < 6 ? curOptionIdx + 1 : curOptionIdx;
      reftList && reftList.scrollToIndex({animated: true, index: indexNext});
      changeOption(indexNext);
    };

    const onSaveQuestion = () => {
      let age = personStore.calculatorAge(arrQuestState);
      // personStore.saveAgeCalculator(age)
      Alert.alert('', `${currentLanguage.custom.estimatedLifespan}: ${age}`, [
        {text: 'OK', onPress: () => navigation.goBack()},
      ]);
    };

    let dataMain = [
      {
        id: '0',
        title: 'none',
        questions: [''],
      },
    ];
    dataMain = dataMain.concat(currentLifeCheck);
    return (
      <View style={styles.container}>
        <BaseHeader
          leftElement={<Image source={IC_BACK} style={styles.icon} />}
          rightElement={null}
          centerElement={
            <Text style={commonStyles.headerTitle}>
              {currentLanguage.custom.lifeCheckTitle}
            </Text>
          }
          leftAction={() => navigation.goBack()}
        />
        <FlatList
          ref={(ref) => {
            setReftList(ref);
          }}
          showsHorizontalScrollIndicator={false}
          scrollEnabled={false}
          horizontal
          data={dataMain}
          keyExtractor={(item) => item.id}
          renderItem={({item, index}) => {
            if (index > 0) {
              return (
                <ItemLifeCheck
                  item={item}
                  arrCheck={arrQuestState[index]}
                  onPressQuestion={(checkItem, indexItem) => {
                    onItemQuestionCheck(index, indexItem, checkItem);
                  }}
                />
              );
            } else {
              return (
                <ScrollView
                  contentContainerStyle={{
                    flexGrow: 1,
                    padding: 16,
                    width: AppStyle.Screen.FullWidth,
                    alignItems: 'center',
                  }}>
                  <Text style={styles.subTitle}>
                    {currentLanguage.custom.lifeCheckSub}
                  </Text>
                </ScrollView>
              );
            }
          }}
        />
        <View style={styles.btnBottom}>
          {curOptionIdx > 0 && (
            <TouchableOpacity style={styles.saveBtn} onPress={onBack}>
              <Text style={styles.saveBtnText}>
                {currentLanguage.custom.back}
              </Text>
            </TouchableOpacity>
          )}
          {curOptionIdx === 6 && (
            <TouchableOpacity style={styles.saveBtn} onPress={onSaveQuestion}>
              <Text style={styles.saveBtnText}>
                {currentLanguage.ratingPopup.child}
              </Text>
            </TouchableOpacity>
          )}
          {curOptionIdx < 6 && (
            <TouchableOpacity style={styles.saveBtn} onPress={onNext}>
              <Text style={styles.saveBtnText}>
                {currentLanguage.custom.next}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  },
);

export default LifeCheck;

const styles = StyleSheet.create({
  container: {flex: 1},
  icon: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
    tintColor: AppStyle.Color.Background,
  },
  scrollView: {
    flexGrow: 1,
    alignItems: 'center',
  },
  subTitle: {
    fontSize: AppStyle.Text.IpadNormal,
    color: AppStyle.Color.DarkBlue,
    textAlign: 'center',
    width: '100%',
    paddingHorizontal: 16,
    marginVertical: 24,
  },
  subTitleItem: {
    fontSize: AppStyle.Text.Large,
    fontWeight: 'bold',
    color: AppStyle.Color.Black1,
    paddingHorizontal: 16,
    marginVertical: 16,
  },
  quest: {
    backgroundColor: 'white',
    borderWidth: 0,
    width: AppStyle.Screen.FullWidth - 16,
    padding: 8,
    marginVertical: 4,
    paddingHorizontal: 16,
    marginHorizontal: 8,
    justifyContent: 'flex-end',
  },
  normalText: {
    fontSize: AppStyle.Text.Normal,
    textAlign: 'center',
    padding: 5,
  },
  optionContainer: {
    width: '80%',
    minHeight: 60,
    margin: 10,
    padding: 10,
    backgroundColor: AppStyle.Color.Background,
    borderRadius: 40,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  btnBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 16,
    position: 'absolute',
    bottom: 50,
    left: 0,
  },
  saveBtn: {
    height: 40,
    width: AppStyle.Screen.FullWidth / 2 - 64,
    marginVertical: 24,
    marginHorizontal: 16,
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
});
