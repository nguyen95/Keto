import {makeAutoObservable} from 'mobx';
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
import {staticTDEE, staticBRM, staticLipid} from '../../services/static_calo';

let dateOrigin = new Date();
dateOrigin.setHours(0, 0, 0, 0);
export default class PersonStore {
  data: DataHealth = {
    activity: '',
    id: '',
    sex: 1,
    age: 20,
    lifeSpan: 80,
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
  currentDate = dateOrigin;

  BMI = 0;
  activityR = 1.2;
  currentWeight = 0;
  dateUpdateWeight = '';
  messageWeight = '';

  dataWeight: Array<number> = [];
  dataWeightX: Array<string> = [];
  dataWeightY: Array<number> = [];
  dataWeightChart: Array<Healths> = [];
  suggestWeight = 0;

  dataCalo: Array<number> = [];
  dataCaloX: Array<string> = [];
  dataCaloY: Array<number> = [];

  dataWater: Array<number> = [];
  dataWaterX: Array<string> = [];
  dataWaterY: Array<number> = [];

  dataCarbs = 0;
  dataProtein = 0;
  dataFat = 0;
  langStore: LanguageStore = new LanguageStore();

  constructor(langStore: LanguageStore) {
    this.langStore = langStore;
    makeAutoObservable(this);
  }

  setData(data) {
    this.data = data;
  }

  listenData = async () => {
    let userId = await getDataLocal(FIR_KEY_USER_ID);
    if (userId !== null) {
      this.userId = userId;
      getDoc(`users/${this.userId}`).onSnapshot((documentSnapshot) => {
        if (documentSnapshot && documentSnapshot.exists) {
          console.log('User data: ', documentSnapshot.data());
          this.setData(documentSnapshot.data());
          this.getDataHealth();
          this.getDataWeight(7);
          this.getBmi();
          this.getDataHealthDay();
          this.getActivityLevel();
          this.getSuggestWeight();
          this.getDataWeightChart();
        }
      });
    }
  };

  getDataHealth = () => {
    if (this.data) {
      if (this.data.healths) {
        this.dataHealth = this.data.healths;
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

  getBmi = () => {
    let dataWeight: Array<Healths> = [];
    let weight = 0;
    let dateUpdate = new Date();
    this.dataHealth
      .sort((a, b) => a.date - b.date)
      .forEach((val) => {
        if (val.weight > 0 && val.date <= dateOrigin.getTime())
          dataWeight.push(val);
      });
    weight = dataWeight[dataWeight.length - 1].weight;
    dateUpdate = new Date(dataWeight[dataWeight.length - 1].date);
    this.currentWeight = weight > 0 ? weight : this.data.weight;
    this.dateUpdateWeight =
      dateUpdate.getDate() +
      '-' +
      (dateUpdate.getMonth() + 1) +
      '-' +
      dateUpdate.getFullYear();
    this.BMI =
      this.currentWeight > 0
        ? (this.currentWeight * 10000) / (this.data.height * this.data.height)
        : 0;
    this.getWeightMessage();
  };

  getWeightMessage = () => {
    const {currentLanguage} = this.langStore;
    if (this.BMI < 18.5) {
      this.messageWeight = currentLanguage.BMR.bmiComment.UNDERWEIGHT;
    }
    if (this.BMI >= 18.5 && this.BMI <= 24.9) {
      this.messageWeight = currentLanguage.BMR.bmiComment.NORMAL;
    }
    if (this.BMI > 24.9 && this.BMI < 30) {
      this.messageWeight = currentLanguage.BMR.bmiComment.OVERWEIGHT;
    }
    if (this.BMI > 30) {
      this.messageWeight = currentLanguage.BMR.bmiComment.OBESE;
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
    this.data.target.calo = totalCalo;
    this.data.healths = this.dataHealth;
    updateDataDoc(`users/${this.userId}`, this.data);
  };

  updateTargetWeight = (val: number) => {
    updateDataDoc(`users/${this.userId}`, {
      'target.weight': val,
    });
  };

  getDataWeek = () => {
    if (this.dataHealth.length > 0) {
      let dataW: Array<number> = [];
      let dataW2: Array<number> = [];
      let dataWS: Array<Healths> = [];
      let dataWX: Array<string> = [];
      let dataWY: Array<number> = [];
      let dataWY2: Array<number> = [];
      let dataCarbs = 0;
      let dataProtein = 0;
      let dataFat = 0;
      this.dataHealth
        .sort((a, b) => a.date - b.date)
        .forEach((val) => {
          val.date <= dateOrigin.getTime() && dataWS.push(val);
        });
      let days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      dataWS = dataWS.slice(-7);
      dataWS.forEach((val, index) => {
        dataW.push(val.eaten > val.burned ? val.eaten - val.burned : 0);
        dataW2.push(val.water * 0.25);
        dataWY.push(val.eaten > val.burned ? val.eaten - val.burned : 0);
        dataWY2.push(val.water * 0.25);
        let d = new Date(val.date);
        dataWX.push(days[d.getDay()]);

        dataCarbs += val.materials.carbs.eaten;
        dataProtein += val.materials.protein.eaten;
        dataFat += val.materials.fat.eaten;
      });
      this.dataCalo = [...dataW];
      this.dataCaloX = [...dataWX];
      this.dataCaloY = [...dataWY];
      this.dataWater = [...dataW2];
      this.dataWaterX = [...dataWX];
      this.dataWaterY = [...dataWY2];

      this.dataCarbs = dataCarbs;
      this.dataProtein = dataProtein;
      this.dataFat = dataFat;
    }
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
      carbs: {eaten: carbs1, target: carbs2},
      protein: {eaten: pro1, target: pro2},
      fat: {eaten: fat1, target: fat2},
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
          include = true;
        }
      });
    }
  };

  setCurrentDate = (date: Date) => {
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

  getActivityLevel = (level?: number) => {
    const {currentLanguage} = this.langStore;
    let activity = 0;
    try {
      activity = level !== undefined ? level : parseInt(this.data.activity);
    } catch (error) {}
    this.activityR = this.getActivityR(activity);
    console.log('getActivityLevel: ', activity, level);
    if (activity == 0) {
      return currentLanguage.BMR.activityLevelMsg.littleOrNoExercise.title;
    }
    if (activity == 1) {
      return currentLanguage.BMR.activityLevelMsg.lightExercise.title;
    }
    if (activity == 2) {
      return currentLanguage.BMR.activityLevelMsg.moderateExercise.title;
    }
    if (activity == 3) {
      return currentLanguage.BMR.activityLevelMsg.veryActive.title;
    }
    if (activity == 4) {
      return currentLanguage.BMR.activityLevelMsg.extraActive.title;
    }
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

  updateBRMTarget = (index: number) => {
    console.log('updateBRMTarget: ', index);
    let CN = this.data.weight;
    let CC = this.data.height;
    let T = this.data.age;
    let tdee = staticBRM(this.data.sex, CN, CC, T) * this.activityR;
    let totalCalo = tdee + (index - 1) * 500;
    let materials: MaterialType = this.getDataMaterial(totalCalo, index);
    updateDataDoc(`users/${this.userId}`, {
      target: {
        calo: totalCalo,
        status: index,
        materials: materials,
        weight: CN,
      },
    });
  };

  updateInfo = (arrInfo: Array<number>) => {
    let materials: MaterialType = this.getDataMaterial(arrInfo[0], arrInfo[5]);
    let dataUser = {...this.data};
    dataUser.activity = arrInfo[5] + '';
    dataUser.target.calo = arrInfo[0];
    dataUser.height = arrInfo[1];
    // dataUser.weight = arrInfo[2];
    dataUser.age = arrInfo[3];
    dataUser.sex = arrInfo[4];
    dataUser.target.materials = materials!;
    dataUser.target.status = arrInfo[6];
    dataUser.target.weight = arrInfo[7];
    this.updateCurrentWeight(arrInfo[2] + '');
    updateDataDoc(`users/${this.userId}`, dataUser);
  };

  updateCalo = (totalCalo: number) => {
    let materials: MaterialType = this.getDataMaterial(
      totalCalo,
      this.data.target.status,
    );
    let target = {...this.data.target};
    target.materials = materials!;
    target.calo = totalCalo;
    updateDataDoc(`users/${this.userId}`, {
      target: target,
    });
  };

  getLipid = () => {
    return staticLipid(
      this.data.sex,
      this.currentWeight,
      this.data.height / 100,
      this.data.age,
    );
  };

  getDataMaterial = (totalCalo: number, status: number) => {
    let materials: MaterialType;
    switch (status) {
      case 0:
        materials = {
          carbs: {
            target: (totalCalo * 35) / 400,
            eaten: 0,
          },
          protein: {
            target: (totalCalo * 35) / 400,
            eaten: 0,
          },
          fat: {
            target: (totalCalo * 30) / 900,
            eaten: 0,
          },
        };
        break;
      case 1:
        materials = {
          carbs: {
            target: (totalCalo * 35) / 400,
            eaten: 0,
          },
          protein: {
            target: (totalCalo * 35) / 400,
            eaten: 0,
          },
          fat: {
            target: (totalCalo * 30) / 900,
            eaten: 0,
          },
        };
        break;
      case 2:
        materials = {
          carbs: {
            target: (totalCalo * 40) / 400,
            eaten: 0,
          },
          protein: {
            target: (totalCalo * 30) / 400,
            eaten: 0,
          },
          fat: {
            target: (totalCalo * 30) / 900,
            eaten: 0,
          },
        };
        break;
    }
    return materials!;
  };

  saveMacroData = (arr: Array<number>) => {
    let materials = {
      carbs: {target: arr[0], eaten: 0},
      protein: {target: arr[1], eaten: 0},
      fat: {target: arr[2], eaten: 0},
    };
    updateDataDoc(`users/${this.userId}`, {
      'target.materials': materials,
    });
  };

  setWaterNum = (val: number) => {
    this.waterNum = val;
    this.dataHealth.forEach((value, index) => {
      if (this.currentDate.getTime() == value.date) {
        this.dataHealth[index].water = val;
      }
    });
    this.data.healths = this.dataHealth;
    updateDataDoc(`users/${this.userId}`, this.data);
  };

  getMaxAge = () => {
    let ageMax = 0;
    if (this.data.age < 20) {
      ageMax = this.data.sex === 1 ? 72 : 78;
    }
    if (this.data.age >= 20 && this.data.age <= 29) {
      ageMax = this.data.sex === 1 ? 73 : 79;
    }
    if (this.data.age >= 30 && this.data.age <= 39) {
      ageMax = this.data.sex === 1 ? 74 : 80;
    }
    if (this.data.age >= 40 && this.data.age <= 49) {
      ageMax = this.data.sex === 1 ? 75 : 81;
    }
    if (this.data.age >= 50 && this.data.age <= 59) {
      ageMax = this.data.sex === 1 ? 77 : 81;
    }
    if (this.data.age >= 60 && this.data.age <= 69) {
      ageMax = this.data.sex === 1 ? 79 : 83;
    }
    if (this.data.age >= 70) {
      ageMax = this.data.sex === 1 ? 85 : 89;
    }
    return ageMax;
  };

  calculatorAge = (arrO: Array<Array<boolean>>) => {
    let ageMax = this.getMaxAge();
    let arrResult = [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 10
      [0, 0, 0, 0, 0, 0, 0, 0], // 8
      [0, 0, 0, 0], // 4
      [0, 0, 0, 0, 0, 0], // 5
      [0, 0], // 2
      [0, 0, 0, 0, 0, 0, 0], // 7
    ];
    let arr = [...arrO];
    arr.shift();
    arrResult[0][0] = arr[0][0] ? 3 : 0;
    arrResult[0][1] = arr[0][1] ? 2 : 0;
    arrResult[0][2] = arr[0][2] ? 1 : 0;
    arrResult[0][3] = arr[0][3] ? -12 : 0;
    arrResult[0][4] = arr[0][4] ? -7 : 0;
    arrResult[0][5] = arr[0][5] ? -2 : 0;
    arrResult[0][6] = arr[0][6] ? -2 : 0;
    arrResult[0][7] = arr[0][7] ? -2 : 0;
    arrResult[0][8] = arr[0][8] ? -2 : 0;
    arrResult[0][9] = arr[0][9] ? -5 : 0;
    arrResult[1][0] = arr[1][0] ? 2 : 0;
    arrResult[1][1] = arr[1][1] ? 2 : 0;
    arrResult[1][2] = arr[1][2] ? 1 : 0;
    arrResult[1][3] = arr[1][3] ? 7 : 0;
    arrResult[1][4] = arr[1][4] ? -4 : 0;
    arrResult[1][5] = arr[1][5] ? -2 : 0;
    arrResult[1][6] = arr[1][6] ? -2 : 0;
    arrResult[1][7] = arr[1][7] ? -2 : 0;
    arrResult[2][0] = arr[2][0] ? 1 : 0;
    arrResult[2][1] = arr[2][1] && this.data.sex === 1 ? -9 : 0;
    arrResult[2][2] = arr[2][2] && this.data.sex === 0 ? -5 : 0;
    arrResult[2][3] = arr[2][3] && this.data.sex === 0 ? -0.5 : 0;
    arrResult[3][0] = arr[3][0] ? 1.5 : 0;
    arrResult[3][1] = arr[3][1] ? 2 : 0;
    arrResult[3][2] = arr[3][2] ? 3 : 0;
    arrResult[3][3] = arr[3][3] ? -1 : 0;
    arrResult[3][4] = arr[3][4] ? 1 : 0;
    arrResult[4][0] = arr[4][0] ? 2 : 0;
    arrResult[4][1] = arr[4][1] ? -1 : 0;
    arrResult[5][0] = arr[5][0] ? 4 : 0;
    arrResult[5][1] = arr[5][1] ? 2 : 0;
    arrResult[5][2] = arr[5][2] ? 1 : 0;
    arrResult[5][3] = arr[5][3] ? -3 : 0;
    arrResult[5][4] = arr[5][4] ? -2 : 0;
    arrResult[5][5] = arr[5][5] ? -2 : 0;
    arrResult[5][6] = arr[5][6] ? -1 : 0;
    arrResult.forEach((a) =>
      a.forEach((b) => {
        ageMax += b;
      }),
    );
    updateDataDoc(`users/${this.userId}`, {
      lifeSpan: ageMax,
    });
    return ageMax;
  };
}
