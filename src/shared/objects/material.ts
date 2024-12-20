export type MaterialType = {
  carbs: MaterialElement;
  fat: MaterialElement;
  protein: MaterialElement;
};

type MaterialElement = {
  eaten: number;
  target: number;
};
