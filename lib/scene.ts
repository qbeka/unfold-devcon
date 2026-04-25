import { sceneQuestionId } from "@/lib/data/demoQuestions";
import { demoCorrectionScene } from "@/lib/data/demoScene";

export function getCorrectionSceneForQuestion(questionId: string) {
  return questionId === sceneQuestionId ? demoCorrectionScene : undefined;
}
