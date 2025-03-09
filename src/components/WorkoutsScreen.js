import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { getTrainerWorkouts } from '../api/fitnessApi';

const WorkoutsScreen = () => {
	const [workouts, setWorkouts] = useState([]);
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();

	const navigateToWorkout = workoutId => {
		navigate(`/workout/${workoutId}`);
	};

	useEffect(() => {
		const fetchWorkouts = async () => {
			const savedTrainerData = JSON.parse(localStorage.getItem('trainerData'));

			if (!savedTrainerData || !savedTrainerData.trainerId) {
				setError('Данные тренера не найдены');
				navigate('/user');
				return;
			}

			try {
				setLoading(true);
				const workoutsData = await getTrainerWorkouts(
					savedTrainerData.trainerId
				);
				setWorkouts(workoutsData || []);
			} catch (err) {
				setError(err.message || 'Ошибка при загрузке занятий');
				console.error('Ошибка загрузки занятий:', err);
			} finally {
				setLoading(false);
			}
		};

		fetchWorkouts();
	}, [navigate]);

	if (loading) return <p className='loading'>Загрузка...</p>;

	return (
		<div>
			<div className='header'>
				<button
					onClick={() => navigate(-1)}
					className='back-button'
					disabled={loading}
				>
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
									workout.imageUrl
										? `https://localhost:7149${workout.imageUrl}`
										: '/images/placeholder-image.png'
								}
								alt={workout.title || 'Тренировка'}
								onError={e => (e.target.src = '/images/placeholder-image.png')}
							/>
							<h4>{workout.title || 'Без названия'}</h4>
							<p className='date'>
								{new Date(workout.startTime).toLocaleString() ||
									'Дата не указана'}
							</p>
							<p className='description'>
								{workout.description || 'Описание отсутствует'}
							</p>
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
