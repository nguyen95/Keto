import { MealType } from "./meal";
import { ExerciseType } from "./exercise";
import { MaterialType } from "./material";

export type Healths = {
  date: number;
  burned: number;
  eaten: number;
  target: number;
  water: number;
  weight: number;
  exercises: Array<ExerciseType>;
  materials: MaterialType;
  meals: Array<MealType>;
}