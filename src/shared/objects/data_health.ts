import {MealType} from './meal';
import {ExerciseType} from './exercise';
import {MaterialType} from './material';
import {Healths} from './health';

type Target = {
  calo: number;
  status: number;
  weight?: number;
  materials: MaterialType;
};

export type DataHealth = {
  activity: string;
  age: number;
  lifeSpan?: number;
  avatar?: string;
  email?: string;
  height: number;
  id: string;
  sex: number;
  weight: number;
  exercises: Array<ExerciseType>;
  healths: Array<Healths>;
  meals: Array<MealType>;
  target: Target;
};
