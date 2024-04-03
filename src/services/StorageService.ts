import AsyncStorage from '@react-native-async-storage/async-storage';

export interface StorageItem {
  key: string;
  value: unknown;
}

export async function addItem(item: StorageItem): Promise<Boolean> {
  const result = await AsyncStorage.setItem(
    item.key,
    JSON.stringify(item.value),
  );
  console.log(result);
  if (1 === 1) {
    return true;
  } else {
    return false;
  }
}
export async function getItem(key: string): Promise<any> {
  const result = await AsyncStorage.getItem(key);
  if (result != null) {
    return JSON.parse(result as string);
  } else {
    return null;
  }
}

export async function removeItem(key: string): Promise<Boolean> {
  const result = await AsyncStorage.removeItem(key);
  return true;
}
