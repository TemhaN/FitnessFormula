import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const WorkoutsScreen = () => {
	const [workouts, setWorkouts] = useState([]);
	const [trainerData, setTrainerData] = useState(null);
	const [error, setError] = useState('');
	const navigate = useNavigate();

	const navigateToWorkout = workoutId => {
		navigate(`/workout/${workoutId}`);
	};

	useEffect(() => {
		const savedTrainerData = JSON.parse(localStorage.getItem('trainerData'));

		if (savedTrainerData && savedTrainerData.trainerId) {
			const workoutsUrl = `https://localhost:7149/api/Workouts/trainer/${savedTrainerData.trainerId}`;
			axios
				.get(workoutsUrl)
				.then(response => {
					setWorkouts(response.data);
					setTrainerData(savedTrainerData);
				})
				.catch(err => {
					console.error('Error fetching workouts:', err);
				});
		} else {
			setError('Данные тренера не найдены');
		}
	}, []);

	return (
		<div>
			<div className='header'>
				<button onClick={() => navigate(-1)} className='back-button'>
					<FontAwesomeIcon icon={faArrowLeft} size='lg' />
				</button>
				<h2>Ваши занятия</h2>
			</div>

			<div className='workouts-list'>
				{error && <p className='error'>{error}</p>}

				{workouts.length > 0 ? (
					workouts.map(workout => (
						<div
							onClick={() => navigateToWorkout(workout.workoutId)}
							key={workout.workoutId}
							className='workouts-card'
						>
							<img
								className='image-workouts'
								src={
									`https://localhost:7149${workout.imageUrl}` ||
									'/images/placeholder-image.png'
								}
								alt=''
							/>

							<h4>{workout.title}</h4>
							<p className='date'>
								{new Date(workout.startTime).toLocaleString()}
							</p>
							<p className='description'>{workout.description}</p>
						</div>
					))
				) : (
					<p className='no-workouts'>Нет занятий для отображения.</p>
				)}
			</div>
		</div>
	);
};

export default WorkoutsScreen;
