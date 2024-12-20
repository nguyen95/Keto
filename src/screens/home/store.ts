import {makeAutoObservable, toJS} from 'mobx';
import {Alert} from 'react-native';
import {getDataLocal} from '../../services/storage';
import {addDataDoc, getDoc, updateDataDoc} from '../../services/firebase';
import {FIR_KEY_USER_ID} from '../../utils/config/setting';
import LanguageStore from '../../shared/store/language';
import {Healths} from '../../shared/objects/health';
import {ExerciseType} from '../../shared/objects/exercise';
import {MaterialType} from '../../shared/objects/material';
import {MealType} from '../../shared/objects/meal';
import {DataHealth} from '../../shared/objects/data_health';
import {staticBRM} from '../../services/static_calo';
import {DataHome} from '../../shared/objects/DataHome';

let dateOrigin = new Date();
dateOrigin.setHours(0, 0, 0, 0);

export default class HomeStore {
  initial = true;
  data: DataHealth = {
    activity: '',
    id: '',
    sex: 1,
    age: 20,
    height: 170,
    exercises: [],
    healths: [],
    meals: [],
    weight: 0,
    target: {
      calo: 0,
      status: 1,
      weight: 0,
      materials: {
        carbs: {eaten: 0, target: 0},
        protein: {eaten: 0, target: 0},
        fat: {eaten: 0, target: 0},
      },
    },
  };
  dataHealth: Array<Healths> = [];
  dataHealthDay: Healths = {
    burned: 0,
    eaten: 0,
    date: dateOrigin.getTime(),
    exercises: [],
    materials: {
      carbs: {eaten: 0, target: 0},
      protein: {eaten: 0, target: 0},
      fat: {eaten: 0, target: 0},
    },
    meals: [],
    target: 0,
    water: 0,
    weight: 0,
  };
  waterNum = 0;
  userId = '';
  materialTarget: MaterialType = {
    carbs: {eaten: 0, target: 0},
    protein: {eaten: 0, target: 0},
    fat: {eaten: 0, target: 0},
  };
  materialTargetNew: MaterialType = {
    carbs: {eaten: 0, target: 0},
    protein: {eaten: 0, target: 0},
    fat: {eaten: 0, target: 0},
  };
  currentDate = dateOrigin;
  dataExercises: Array<ExerciseType> = [];
  dataMeal0: Array<MealType> = [];
  dataMeal1: Array<MealType> = [];
  dataMeal2: Array<MealType> = [];
  dataMeal3: Array<MealType> = [];
  dataAll: Array<DataHome> = [];
  dataMeal: Array<MealType> = [];

  dataWeight: Array<number> = [];
  dataWeightX: Array<string> = [];
  dataWeightY: Array<number> = [];
  currentWeight = 0;
  dataWeightChart: Array<Healths> = [];
  suggestWeight = 0;
  langStore: LanguageStore = new LanguageStore();

  constructor(langStore: LanguageStore) {
    this.langStore = langStore;
    makeAutoObservable(this);
  }

  changeInitial = () => {
    console.log('changeInitial: ', this.initial);
    this.initial &&
      setTimeout(() => {
        this.initial = false;
      }, 1000);
    console.log('changeInitial: ', this.initial);
  };

  setData(data) {
    this.data = data;
  }

  listenData = async () => {
    let userId = await getDataLocal(FIR_KEY_USER_ID);
    if (userId !== null) {
      this.userId = userId;
      console.log(`users/${this.userId}`);
      getDoc(`users/${this.userId}`).onSnapshot((documentSnapshot) => {
        if (documentSnapshot && documentSnapshot.exists) {
          this.setData(documentSnapshot.data());
          this.setupMaterials();
          this.getDataHealth();
          this.getDataWeight(7);
          this.getDataHealthDay();
          this.getAllDataCalo();
          this.getSuggestWeight();
          this.getDataWeightChart();
          this.changeInitial();
        }
      });
    }
  };

  setupMaterials = () => {
    let target = this.data.target;
    if (target && !target.materials) {
      switch (target.status) {
        case 0:
          this.setupDataMaterial(
            (target.calo * 35) / 400,
            0,
            (target.calo * 35) / 400,
            0,
            (target.calo * 30) / 900,
            0,
          );
          break;
        case 1:
          this.setupDataMaterial(
            (target.calo * 35) / 400,
            0,
            (target.calo * 35) / 400,
            0,
            (target.calo * 30) / 900,
            0,
          );
          break;
        case 2:
          this.setupDataMaterial(
            (target.calo * 40) / 400,
            0,
            (target.calo * 30) / 400,
            0,
            (target.calo * 30) / 900,
            0,
          );
          break;
      }
    }
  };

  setupDataMaterial = (
    carbs1: number,
    carbs2: number,
    pro1: number,
    pro2: number,
    fat1: number,
    fat2: number,
  ) => {
    let materials = {
      carbs: {target: carbs1, eaten: carbs2},
      protein: {target: pro1, eaten: pro2},
      fat: {target: fat1, eaten: fat2},
    };
    updateDataDoc(`users/${this.userId}`, {
      'target.materials': materials,
    });
  };

  getDataHealth = () => {
    if (this.data) {
      if (this.data.healths) {
        this.dataHealth = this.data.healths;
      } else {
        this.data.healths = this.dataHealth;
        updateDataDoc(`users/${this.userId}`, this.data);
      }
      this.getDataMaterialFromParent();
    }
  };

  getDataMaterialFromParent = () => {
    let target = this.data.target;
    if (target) {
      switch (target.status) {
        case 0:
          this.updateDataMaterial(
            (target.calo * 35) / 400,
            0,
            (target.calo * 35) / 400,
            0,
            (target.calo * 30) / 900,
            0,
          );
          break;
        case 1:
          this.updateDataMaterial(
            (target.calo * 35) / 400,
            0,
            (target.calo * 35) / 400,
            0,
            (target.calo * 30) / 900,
            0,
          );
          break;
        case 2:
          this.updateDataMaterial(
            (target.calo * 40) / 400,
            0,
            (target.calo * 30) / 400,
            0,
            (target.calo * 30) / 900,
            0,
          );
          break;
      }
    }
  };

  getDataWeight = (size: number) => {
    // const {currentLanguageKey} = this.langStore;
    if (this.dataHealth.length > 0) {
      let dataW: Array<number> = [];
      let dataWS: Array<Healths> = [];
      let dataWX: Array<string> = [];
      let dataWY: Array<number> = [];
      this.dataHealth
        .sort((a, b) => a.date - b.date)
        .forEach((val) => {
          if (val.weight > 0 && val.date <= dateOrigin.getTime())
            dataWS.push(val);
        });
      dataWS = dataWS.slice(-size);
      dataWS.forEach((val, index) => {
        dataW.push(val.weight);
        dataWY.push(val.weight);
        dataWX.push(
          // new Date(val.date).toLocaleDateString(currentLanguageKey, {
          //   day: 'numeric',
          //   month: 'long',
          // }),
          new Date(val.date).toLocaleDateString(),
        );
      });
      dataWX.forEach((val, ind) => {
        dataWX[ind] = ind > 0 && ind < dataWX.length - 1 ? '' : val;
      });
      this.dataWeight = [...dataW];
      this.dataWeightX = [...dataWX];
      this.dataWeightY = [...dataWY];
    }
  };

  getDataWeightChart = () => {
    let dataWeight: Array<Healths> = [];
    this.dataHealth
      .sort((a, b) => a.date - b.date)
      .forEach((val) => {
        if (val.weight > 0 && val.date <= dateOrigin.getTime())
          dataWeight.push(val);
      });
    this.currentWeight =
      dataWeight.length > 0
        ? dataWeight[dataWeight.length - 1].weight
        : this.data.weight;
    this.dataWeightChart = dataWeight.slice(-30).reverse();
  };

  getSuggestWeight = () => {
    let weightGood = ((this.data.height - 100) * 9) / 10;
    if (this.data.target.status == 0) {
      this.suggestWeight =
        this.data.weight < weightGood ? this.data.weight - 1 : weightGood;
    }
    if (this.data.target.status == 1) {
      this.suggestWeight = this.data.weight;
    }
    if (this.data.target.status == 2) {
      this.suggestWeight =
        this.data.weight < weightGood ? weightGood : this.data.weight + 1;
    }
  };

  updateCurrentWeight = (value: string) => {
    let val = 0;
    try {
      val = parseFloat(value);
    } catch (error) {}
    this.currentWeight = parseFloat(val.toFixed(1));
    let activityR = this.getActivityR(parseInt(this.data.activity));
    let tdee =
      staticBRM(
        this.data.sex,
        this.currentWeight,
        this.data.height,
        this.data.age,
      ) * activityR;
    let totalCalo = tdee + (this.data.target.status - 1) * 500;
    this.dataHealth.forEach((value, index) => {
      if (value.date == this.dataHealthDay.date) {
        this.dataHealth[index].weight = this.currentWeight;
        this.dataHealth[index].target = totalCalo;
      }
    });
    if (this.dataHealthDay.date === dateOrigin.getTime()) {
      this.data.target.calo = totalCalo;
    }
    this.data.healths = this.dataHealth;
    updateDataDoc(`users/${this.userId}`, this.data);
  };

  getActivityR = (activity: number) => {
    let activityR = 0;
    if (activity == 0) {
      activityR = 1.2;
    }
    if (activity == 1) {
      activityR = 1.375;
    }
    if (activity == 2) {
      activityR = 1.55;
    }
    if (activity == 3) {
      activityR = 1.725;
    }
    if (activity == 4) {
      activityR = 1.9;
    }
    return activityR;
  };

  updateDataMaterial = (
    carbs1: number,
    carbs2: number,
    pro1: number,
    pro2: number,
    fat1: number,
    fat2: number,
  ) => {
    this.materialTarget = {
      carbs: {target: carbs1, eaten: carbs2},
      protein: {target: pro1, eaten: pro2},
      fat: {target: fat1, eaten: fat2},
    };
    this.materialTargetNew = {
      carbs: {target: carbs1, eaten: carbs2},
      protein: {target: pro1, eaten: pro2},
      fat: {target: fat1, eaten: fat2},
    };
  };

  getDataHealthDay = () => {
    if (this.dataHealth.length > 0) {
      let include = false;
      this.dataHealth.forEach((val) => {
        if (this.currentDate.getTime() == val.date) {
          this.dataHealthDay = val;
          this.waterNum = this.dataHealthDay.water;
          if (val.materials) {
            this.materialTarget = val.materials;
          }
          this.getAllDataCalo();
          include = true;
        }
      });
      if (!include) {
        this.dataHealth.push({
          burned: 0,
          date: this.currentDate.getTime(),
          eaten: 0,
          exercises: [],
          meals: [],
          target: this.data.target.calo,
          water: 0,
          weight:
            this.currentWeight > 0 ? this.currentWeight : this.data.weight,
          materials: this.materialTargetNew,
        });
        this.data.healths = this.dataHealth;
        updateDataDoc(`users/${this.userId}`, this.data);
      }
    } else {
      this.dataHealth.push({
        burned: 0,
        date: this.currentDate.getTime(),
        eaten: 0,
        exercises: [],
        meals: [],
        target: this.data.target.calo,
        water: 0,
        weight: this.data.weight,
        materials: this.materialTargetNew,
      });
      this.data.healths = this.dataHealth;
      updateDataDoc(`users/${this.userId}`, this.data);
    }
  };

  getAllDataCalo = () => {
    const {currentLanguage} = this.langStore;
    let totalEx = 0;
    let total0 = 0;
    let total1 = 0;
    let total2 = 0;
    let total3 = 0;
    let dataAll: Array<DataHome> = [];
    let dataMeal: Array<MealType> = [];
    let dataMeal0: Array<MealType> = [];
    let dataMeal1: Array<MealType> = [];
    let dataMeal2: Array<MealType> = [];
    let dataMeal3: Array<MealType> = [];
    if (this.dataHealthDay.meals) {
      this.dataHealthDay.meals.forEach((meal) => {
        dataMeal.push(meal);
        if (meal.meal_index == 'dinner') {
          dataMeal0.push(meal);
          total0 += meal.kcal;
        }
        if (meal.meal_index == 'lunch') {
          dataMeal1.push(meal);
          total1 += meal.kcal;
        }
        if (meal.meal_index == 'breakfast') {
          dataMeal2.push(meal);
          total2 += meal.kcal;
        }
        if (meal.meal_index == 'others') {
          dataMeal3.push(meal);
          total3 += meal.kcal;
        }
      });
    }
    dataMeal.forEach((d) => {
      console.log('data mealssss: ', d.key);
    });
    this.dataMeal = [...dataMeal];
    this.dataMeal0 = [...dataMeal0];
    this.dataMeal1 = [...dataMeal1];
    this.dataMeal2 = [...dataMeal2];
    this.dataMeal3 = [...dataMeal3];
    if (this.dataHealthDay.exercises) {
      this.dataExercises = this.dataHealthDay.exercises;
      this.dataHealthDay.exercises.forEach((ex) => {
        totalEx += ex.calo;
      });
    }
    if (this.dataExercises.length > 0)
      dataAll.push({
        name: currentLanguage.exercise.title,
        total: totalEx,
        data: this.dataExercises,
      });
    if (this.dataMeal0.length > 0)
      dataAll.push({
        name: currentLanguage.recipes.recipeName.dinner,
        total: total0,
        data: this.dataMeal0,
      });
    if (this.dataMeal1.length > 0)
      dataAll.push({
        name: currentLanguage.recipes.recipeName.lunch,
        total: total1,
        data: this.dataMeal1,
      });
    if (this.dataMeal2.length > 0)
      dataAll.push({
        name: currentLanguage.recipes.recipeName.breakfast,
        total: total2,
        data: this.dataMeal2,
      });
    if (this.dataMeal3.length > 0)
      dataAll.push({
        name: currentLanguage.recipes.recipeName.others,
        total: total3,
        data: this.dataMeal3,
      });
    this.dataAll = [...dataAll];
  };

  setCurrentDate = (date: Date) => {
    if (this.initial) return;
    date.setHours(0, 0, 0, 0);
    this.currentDate = date;
    this.dataHealthDay = {
      burned: 0,
      eaten: 0,
      date: this.currentDate.getTime(),
      exercises: [],
      materials: {
        carbs: {eaten: 0, target: 0},
        protein: {eaten: 0, target: 0},
        fat: {eaten: 0, target: 0},
      },
      meals: [],
      target: 0,
      water: 0,
      weight: 0,
    };
    this.getDataHealthDay();
  };

  setWaterNum = (val: number) => {
    this.waterNum = val;
    this.dataHealth.forEach((value, index) => {
      if (value.date == this.dataHealthDay.date) {
        this.dataHealth[index].water = val;
      }
    });
    this.data.healths = this.dataHealth;
    updateDataDoc(`users/${this.userId}`, this.data);
  };

  // meal...
  addMealItem = (item: MealType) => {
    let healths = toJS(this.dataHealth);
    const indexChanged = healths.findIndex((e) => {
      return e.date === this.currentDate.getTime();
    });

    const curDayVal = {...healths[indexChanged]};
    curDayVal.eaten += item.kcal;
    item.key = 'new-' + new Date().getTime();
    curDayVal.meals.push(item);

    curDayVal.materials.carbs.eaten += item.carbs;
    curDayVal.materials.fat.eaten += item.fat;
    curDayVal.materials.protein.eaten += item.protein;
    healths[indexChanged] = curDayVal;
    updateDataDoc(`users/${this.userId}`, {
      healths: healths,
    });
  };

  removeMealItem = (item: MealType) => {
    let dataHealth = [...this.dataHealth];
    let dataHealthDate: Healths;
    let indexItem = 0;
    dataHealth.forEach((value, index) => {
      if (value.date == this.dataHealthDay.date) {
        dataHealthDate = dataHealth[index];
        indexItem = index;
      }
    });
    if (dataHealthDate!) {
      dataHealthDate.meals = dataHealthDate.meals.filter(
        (e) => e.key !== item.key,
      );
      if (dataHealthDate.materials.carbs.eaten - item.carbs >= 0)
        dataHealthDate.materials.carbs.eaten -= item.carbs;
      if (dataHealthDate.materials.protein.eaten - item.protein >= 0)
        dataHealthDate.materials.protein.eaten -= item.protein;
      if (dataHealthDate.materials.fat.eaten - item.fat >= 0)
        dataHealthDate.materials.fat.eaten -= item.fat;
      if (dataHealthDate.eaten - item.kcal >= 0)
        dataHealthDate.eaten -= item.kcal;
      dataHealth[indexItem] = dataHealthDate;
      this.data.healths = dataHealth;
      updateDataDoc(`users/${this.userId}`, this.data);
    }
  };

  // exercises
  addExItem = (item: ExerciseType) => {
    let healths = toJS(this.dataHealth);
    const indexChanged = healths.findIndex((e) => {
      return e.date === this.currentDate.getTime();
    });

    const curDayVal = {...healths[indexChanged]};
    curDayVal.burned += item.calo;
    item.key = 'new-' + new Date().getTime();
    curDayVal.exercises.push(item);

    healths[indexChanged] = curDayVal;
    updateDataDoc(`users/${this.userId}`, {
      healths: healths,
    });
  };

  removeExItem = (item: ExerciseType) => {
    let healths = toJS(this.dataHealth);
    const indexChanged = healths.findIndex((e) => {
      return e.date === this.currentDate.getTime();
    });

    const curDayVal = {...healths[indexChanged]};
    if (curDayVal.burned - item.calo >= 0) {
      curDayVal.burned -= item.calo;
    }
    curDayVal.exercises = curDayVal.exercises.filter((e) => e.key !== item.key);
    healths[indexChanged] = curDayVal;
    updateDataDoc(`users/${this.userId}`, {
      healths: healths,
    });
  };
}
