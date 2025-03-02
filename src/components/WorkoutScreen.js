import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const WorkoutScreen = () => {
	const { workoutId } = useParams();
	const [workout, setWorkout] = useState(null);
	const [error, setError] = useState('');
	const [registrationMessage, setRegistrationMessage] = useState('');
	const navigate = useNavigate();

	useEffect(() => {
		fetch(`https://localhost:7149/api/Workouts/${workoutId}`)
			.then(response => response.json())
			.then(data => setWorkout(data))
			.catch(() => setError('Не удалось загрузить информацию о тренировке'));
	}, [workoutId]);

	const userData = JSON.parse(localStorage.getItem('userData')) || null;
	const userId = userData?.user?.userId || null;

	const handleRegister = () => {
		if (!userId) {
			navigate('/');
			return;
		}

		fetch(
			`https://localhost:7149/api/WorkoutRegistrations?userId=${userId}&workoutId=${workoutId}`,
			{ method: 'POST' }
		)
			.then(response => response.json())
			.then(data => setRegistrationMessage(data.message))
			.catch(() =>
				setRegistrationMessage('Ошибка при регистрации на тренировку')
			);
	};

	if (error) return <p className='error'>{error}</p>;
	if (!workout) return <p className='loading'>Загрузка...</p>;

	return (
		<div className='workout-container'>
			<div className='header'>
				<button onClick={() => navigate(-1)} className='back-button'>
					<FontAwesomeIcon icon={faArrowLeft} size='lg' />
				</button>
				<h2>{workout.title}</h2>
			</div>
			<div className='workout-box'>
				{workout.imageUrl ? (
					<img
						src={
							`https://localhost:7149${workout.imageUrl}` ||
							'/images/placeholder-image.png'
						}
						className='workout-image-screen'
					/>
				) : (
					<p className='no-image'>Изображение тренировки не доступно.</p>
				)}
				<p className='workout-description mt'>{workout.description}</p>
				<p className='workout-time'>
					<strong>Время начала:</strong>{' '}
					{new Date(workout.startTime).toLocaleString()}
				</p>

				<div className='center-container'>
					<div className='workout-trainer'>
						<h3>Тренер:</h3>

						<div className='trainer-image mt'>
							<img
								className='trainer-img'
								src={workout.trainer.avatar || '/images/placeholder-image.png'}
								alt={workout.trainer.fullName}
								onError={e => {
									if (!e.target.dataset.error) {
										console.log('Ошибка загрузки:', e.target.src);
										e.target.dataset.error = true;
										e.target.src = '/images/placeholder-image.png';
									}
								}}
							/>
						</div>
						<h2 className='mt'>{workout.trainer.fullName}</h2>
						<p>{workout.trainer.description}</p>
						<h4 className='mt'>Опыт {workout.trainer.experienceYears} лет</h4>
					</div>

					<button
						onClick={handleRegister}
						className='publish-submit-button submit-button'
					>
						{userId ? 'Записаться на тренировку' : 'Войдите, чтобы записаться'}
					</button>

					{registrationMessage && (
						<p className='registration-message mt text-gray'>
							{registrationMessage}
						</p>
					)}
				</div>
			</div>
		</div>
	);
};

export default WorkoutScreen;
