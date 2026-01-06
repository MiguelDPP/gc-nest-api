import { TypeQuestionsEnum } from 'src/questions/enums/typeQuestions.enum';
import { SeedTypeQuestion } from '../interfaces/seed-question.interface';

const getTypeQuestionsData = (): SeedTypeQuestion[] => {
  // Recorrer los valores del enum y crear un objeto para cada uno
  return Object.values(TypeQuestionsEnum).map((typeName) => ({
    name: typeName,
  }));
};

export const TypeQuestionsData: SeedTypeQuestion[] = getTypeQuestionsData();
