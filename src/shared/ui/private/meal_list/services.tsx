import {getDataDoc} from '../../../../services/firebase';
import {getDataLocal} from '../../../../services/storage';
import {FIR_KEY_DB, FIR_KEY_USER_ID} from '../../../../utils/config/setting';

export async function mergeMealData(localData) {
  const userID = await getDataLocal(FIR_KEY_USER_ID);
  const snapshotData = await getDataDoc(`${FIR_KEY_DB}/${userID}`);

  if (snapshotData && snapshotData.elements) {
    const elements = snapshotData.elements;
    return elements.concat(localData);
  } else {
    return localData;
  }
}

export async function mergeAllMealsData(localData) {
  const userID = await getDataLocal(FIR_KEY_USER_ID);
  const snapshotData = await getDataDoc(`${FIR_KEY_DB}/${userID}`);

  if (snapshotData && (snapshotData.elements || snapshotData.meals)) {
    const elements = snapshotData.elements;
    const meals = snapshotData.meals;

    let total = localData;
    if (elements) {
      total = elements.concat(total);
    }
    if (meals) {
      total = meals.concat(total);
    }

    return total;
  } else {
    return localData;
  }
}
