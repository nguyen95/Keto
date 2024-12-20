export function staticBRM(
  sex: number,
  weight: number,
  height: number,
  age: number,
) {
  if (sex === 1) {
    //male
    return 13.397 * weight + 4.799 * height - 5.677 * age + 88.362;
  } else {
    return 9.247 * weight + 3.098 * height - 4.33 * age + 447.593;
  }
}

export function staticR(minutes: number, days: number) {
  const totalAct = minutes * days;
  if (totalAct < 30) {
    return 1.2;
  } else if (totalAct >= 30 && totalAct < 90) {
    return 1.375;
  } else if (totalAct >= 90 && totalAct < 150) {
    return 1.55;
  } else if (totalAct >= 150 && totalAct < 210) {
    return 1.725;
  } else {
    return 1.9;
  }
}

export function staticActivityLevel(minutes: number, days: number) {
  const totalAct = minutes * days;
  if (totalAct < 30) {
    return 0;
  } else if (totalAct >= 30 && totalAct < 90) {
    return 1;
  } else if (totalAct >= 90 && totalAct < 150) {
    return 2;
  } else if (totalAct >= 150 && totalAct < 210) {
    return 3;
  } else {
    return 4;
  }
}

export function staticTDEE(
  sex: number,
  weight: number,
  height: number,
  age: number,
  minutes: number,
  days: number,
) {
  const BRM = staticBRM(sex, weight, height, age);
  const R = staticR(minutes, days);
  return BRM * R;
}

export function staticBMI(weight: number, height: number) {
  return weight / (height * height);
}

export function staticLipid(
  sex: number,
  weight: number,
  height: number,
  age: number,
) {
  const BMI = staticBMI(weight, height);
  return 1.2 * BMI + 0.23 * age - 10.8 * sex - 5.4;
}
