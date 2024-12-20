import languageVI from '../../assets/locales/vi.json';
import languageDE from '../../assets/locales/de.json';
import languageEN from '../../assets/locales/en.json';
import languageFR from '../../assets/locales/fr.json';
import languageID from '../../assets/locales/id.json';
import languageJA from '../../assets/locales/ja.json';
import languageKO from '../../assets/locales/ko.json';
import languageTH from '../../assets/locales/th.json';
import tipCommonVI from '../../assets/database/VN/tipsCommon.json';
import tipCommonEN from '../../assets/database/US/tipsCommon.json';
import tipCommonDE from '../../assets/database/DE/tipsCommon.json';
import tipCommonFR from '../../assets/database/FR/tipsCommon.json';
import tipCommonJA from '../../assets/database/JP/tipsCommon.json';
import tipCommonKO from '../../assets/database/KR/tipsCommon.json';
import lifeCheckVI from '../../assets/database/VN/lifeCheckCommon.json';
import lifeCheckEN from '../../assets/database/US/lifeCheckCommon.json';
import lifeCheckDE from '../../assets/database/DE/lifeCheckCommon.json';
import lifeCheckFR from '../../assets/database/FR/lifeCheckCommon.json';
import lifeCheckJA from '../../assets/database/JP/lifeCheckCommon.json';
import lifeCheckKO from '../../assets/database/KR/lifeCheckCommon.json';
import exerciseVI from '../../assets/database/VN/exerciseCommon.json';
import exerciseEN from '../../assets/database/US/exerciseCommon.json';
import exerciseDE from '../../assets/database/DE/exerciseCommon.json';
import exerciseFR from '../../assets/database/FR/exerciseCommon.json';
import exerciseJA from '../../assets/database/JP/exerciseCommon.json';
import exerciseKO from '../../assets/database/KR/exerciseCommon.json';
import foodCommonVI from '../../assets/database/VN/foodCommon.json';
import foodCommonEN from '../../assets/database/US/foodCommon.json';
import foodCommonDE from '../../assets/database/DE/foodCommon.json';
import foodCommonFR from '../../assets/database/FR/foodCommon.json';
import foodCommonJA from '../../assets/database/JP/foodCommon.json';
import foodCommonKO from '../../assets/database/KR/foodCommon.json';
import timelineMenuVI from '../../assets/database/VN/timelineMenu.json';
import timelineMenuEN from '../../assets/database/US/timelineMenu.json';
import timelineMenuDE from '../../assets/database/DE/timelineMenu.json';
import timelineMenuFR from '../../assets/database/FR/timelineMenu.json';
import timelineMenuJA from '../../assets/database/JP/timelineMenu.json';
import timelineMenuKO from '../../assets/database/KR/timelineMenu.json';
import {action, makeAutoObservable, makeObservable, observable} from 'mobx';
import {saveDataLocal} from '../../services/storage';
import {LANGUAGE_KEY} from '../../utils/config/setting';

type LangType = {
  id: string;
  title: string;
};

export default class LanguageStore {
  currentLanguageIdx: number = 0;
  currentLanguage: any = languageEN;
  currentTip: any = tipCommonEN;
  tipDefault: any = tipCommonEN[0];
  currentLifeCheck: any = languageEN;
  currentExercise: any = exerciseEN;
  currentFoodCommon: any = foodCommonEN;
  currentTimelineMenu: any = timelineMenuEN;
  currentLanguageKey: string = 'en-US';
  langOptions: Array<LangType> = [
    {
      id: 'en',
      title: 'English',
    },
    {
      id: 'vi',
      title: 'Viet Nam',
    },
    {
      id: 'de',
      title: 'German',
    },
    {
      id: 'fr',
      title: 'French',
    },
    {
      id: 'ja',
      title: 'Japanese',
    },
    {
      id: 'de',
      title: 'Korean',
    },
  ];
  constructor() {
    makeAutoObservable(this);
  }

  changeCurLanguage(lang: string) {
    switch (lang) {
      case 'vi':
        this.currentLanguageIdx = 1;
        this.currentLanguage = languageVI;
        this.currentTip = tipCommonVI;
        this.currentLifeCheck = lifeCheckVI;
        this.currentExercise = exerciseVI;
        this.currentFoodCommon = foodCommonVI;
        this.currentTimelineMenu = timelineMenuVI;
        this.currentLanguageKey = 'vi-VN';
        break;
      case 'de':
        this.currentLanguageIdx = 2;
        this.currentLanguage = languageDE;
        this.currentTip = tipCommonDE;
        this.currentLifeCheck = lifeCheckDE;
        this.currentExercise = exerciseDE;
        this.currentFoodCommon = foodCommonDE;
        this.currentTimelineMenu = timelineMenuDE;
        this.currentLanguageKey = 'de-CH';
        break;
      case 'fr':
        this.currentLanguageIdx = 3;
        this.currentLanguage = languageFR;
        this.currentTip = tipCommonFR;
        this.currentLifeCheck = lifeCheckFR;
        this.currentExercise = exerciseFR;
        this.currentFoodCommon = foodCommonFR;
        this.currentTimelineMenu = timelineMenuFR;
        this.currentLanguageKey = 'fr-CH';
        break;
      case 'ja':
        this.currentLanguageIdx = 4;
        this.currentLanguage = languageJA;
        this.currentTip = tipCommonJA;
        this.currentLifeCheck = lifeCheckJA;
        this.currentExercise = exerciseJA;
        this.currentFoodCommon = foodCommonJA;
        this.currentTimelineMenu = timelineMenuJA;
        this.currentLanguageKey = 'ja-JP';
        break;
      case 'ko':
        this.currentLanguageIdx = 5;
        this.currentLanguage = languageKO;
        this.currentTip = tipCommonKO;
        this.currentLifeCheck = lifeCheckKO;
        this.currentExercise = exerciseKO;
        this.currentFoodCommon = foodCommonKO;
        this.currentTimelineMenu = timelineMenuKO;
        this.currentLanguageKey = 'ko-KR';
        break;
      default:
        this.currentLanguageIdx = 0;
        this.currentLanguage = languageEN;
        this.currentTip = tipCommonEN;
        this.currentLifeCheck = lifeCheckEN;
        this.currentExercise = exerciseEN;
        this.currentFoodCommon = foodCommonEN;
        this.currentTimelineMenu = timelineMenuEN;
        this.currentLanguageKey = 'en-US';
        break;
    }
    this.tipDefault =
      this.currentTip[Math.floor(Math.random() * (this.currentTip.length - 1))];
    saveDataLocal(LANGUAGE_KEY, lang);
  }
}
