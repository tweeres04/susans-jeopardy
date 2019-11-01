import React, { useState } from 'react';
import update from 'immutability-helper';
import classnames from 'classnames';

import './App.css';

import questionData from './questionData';

const initialQuestions = questionData.map(c => ({
	...c,
	questions: c.questions.map(q => ({ ...q, answered: false }))
}));

function App() {
	const [questions, setQuestions] = useState(initialQuestions);
	const [currentQuestion, setCurrentQuestion] = useState();

	function setAnswered(question) {
		const categoryIndex = questions.findIndex(c =>
			c.questions.some(q => q === question)
		);
		const questionIndex = questions[categoryIndex].questions.findIndex(
			q => q === question
		);
		setQuestions(
			update(questions, {
				[categoryIndex]: {
					questions: {
						[questionIndex]: {
							answered: {
								$set: true
							}
						}
					}
				}
			})
		);
	}

	return (
		<>
			<div className="categories">
				{questions.map(({ name, questions }, ci) => (
					<div className="category child-borders child-shadows" key={ci}>
						<div className="category-name margin padding">{name}</div>
						{questions.map((q, qi) => (
							<div
								key={qi}
								className={classnames('question margin padding', {
									answered: q.answered
								})}
								onClick={
									q.answered
										? () => {}
										: () => {
												setCurrentQuestion(q);
										  }
								}
							>
								{q.answered || `$${(qi + 1) * 100}`}
							</div>
						))}
					</div>
				))}
			</div>
			<input
				className="modal-state"
				id="modal-1"
				type="checkbox"
				checked={currentQuestion}
			/>
			{currentQuestion && (
				<QuestionModal
					currentQuestion={currentQuestion}
					setCurrentQuestion={setCurrentQuestion}
					setAnswered={setAnswered}
				/>
			)}
		</>
	);
}

function QuestionModal({ currentQuestion, setCurrentQuestion, setAnswered }) {
	const [flipped, setFlipped] = useState(false);

	const { question, answer } = currentQuestion;
	return (
		<div className="modal">
			<div
				className="modal-bg"
				for="modal-1"
				onClick={() => {
					setCurrentQuestion(null);
				}}
			></div>
			<div className="modal-body" for="modal-1">
				{flipped ? answer : question}
				{flipped || (
					<div className="margin-top">
						<button
							onClick={() => {
								setAnswered(currentQuestion);
								setFlipped(!flipped);
							}}
						>
							Flip
						</button>
					</div>
				)}
			</div>
		</div>
	);
}

export default App;
