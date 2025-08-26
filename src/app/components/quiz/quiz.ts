import { Component } from '@angular/core';
import quizz_questions from '../../../assets/data/quizz_questions.json';

type QuizzOption = {
  id: number;
  name: string;
  alias: string | string[];
};

type QuizzQuestion = {
  id: number;
  question: string;
  options: QuizzOption[];
};

type QuizzResult = {
  text: string;
  image: string;
};

type QuizzData = {
  title: string;
  questions: QuizzQuestion[];
  results: {
    [key: string]: QuizzResult;
  };
};

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [],
  templateUrl: './quiz.html',
  styleUrl: './quiz.css',
})
export class Quiz {
  title: string = '';
  questions: QuizzQuestion[] = [];
  questionSelected!: QuizzQuestion;
  answers: string[] = [];
  answerSelected: QuizzResult = { text: '', image: '' };
  questionIndex: number = 0;
  questionMaxIndex: number = 0;
  finished: boolean = false;

  ngOnInit(): void {
    const data = quizz_questions as QuizzData;

    this.finished = false;
    this.title = data.title;
    this.questions = data.questions;
    this.questionSelected = this.questions[this.questionIndex];
    this.questionMaxIndex = this.questions.length;
  }

  playerChoose(value: string | string[]) {
    if (Array.isArray(value)) {
      this.answers.push(...value);
    } else {
      this.answers.push(value);
    }
    this.nextStep();
  }

  async nextStep() {
    this.questionIndex += 1;

    if (this.questionIndex < this.questionMaxIndex) {
      this.questionSelected = this.questions[this.questionIndex];
    } else {
      const finalAlias: string = await this.checkResult(this.answers);
      const data = quizz_questions as QuizzData;

      this.finished = true;
      this.answerSelected = data.results[finalAlias] || {
        text: 'Não conseguimos identificar seu perfil.',
        image: 'https://via.placeholder.com/600x400?text=Perfil+Desconhecido',
      };
    }
  }

  async checkResult(answers: string[]): Promise<string> {
    const counts: { [key: string]: number } = {};

    for (const answer of answers) {
      counts[answer] = (counts[answer] || 0) + 1;
    }

    let maxCount = 0;
    let mostFrequent: string[] = [];

    for (const alias in counts) {
      const count = counts[alias];
      if (count > maxCount) {
        maxCount = count;
        mostFrequent = [alias];
      } else if (count === maxCount) {
        mostFrequent.push(alias);
      }
    }

    const randomIndex = Math.floor(Math.random() * mostFrequent.length);
    return mostFrequent[randomIndex];
  }
}
