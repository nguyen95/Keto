import AsyncStorage from "@react-native-async-storage/async-storage";

async function saveDataLocal(key: string, val: string) {
  try {
    await AsyncStorage.setItem(key, val);
  } catch (error) {
    console.error(error);
  }
}

async function getDataLocal(key: string) {
  let value: string | null = null;
  try {
    value = await AsyncStorage.getItem(key);
  } catch (error) {
    console.error(error);
  }
  return value == null ? "" : value;
}

async function clearDataLocal() {
  await AsyncStorage.getAllKeys((err, keys) => {
    keys && AsyncStorage.multiRemove(keys, (err) => {});
  });
}

export { saveDataLocal, getDataLocal, clearDataLocal };
