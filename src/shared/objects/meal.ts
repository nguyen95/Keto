export type MealType = {
  carbs: number;
  fat: number;
  fiber: number;
  kcal: number;
  key: string;
  uid?: string;
  name: string;
  protein: number;
  sugar: number;
  elements?: Array<MealType>;
  weight?: number;
  type?: 'element' | 'group',
  meal_index?: 'others' | 'breakfast' | 'lunch' | 'dinner'
};

export type Materials = {
  carbs: number;
  fat: number;
  protein: number;
  // fiber: number;
  // sugar: number;
}