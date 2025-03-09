import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { getWorkoutById, registerForWorkout } from '../api/fitnessApi';

const WorkoutScreen = () => {
	const { workoutId } = useParams();
	const navigate = useNavigate();
	const [workout, setWorkout] = useState(null);
	const [error, setError] = useState('');
	const [registrationMessage, setRegistrationMessage] = useState('');
	const [loading, setLoading] = useState(true);

	const userData = JSON.parse(localStorage.getItem('userData')) || null;
	const userId = userData?.user?.userId || null;

	useEffect(() => {
		const fetchWorkout = async () => {
			try {
				setLoading(true);
				const workoutData = await getWorkoutById(workoutId);
				setWorkout(workoutData);
			} catch (err) {
				setError(err.message || 'Не удалось загрузить информацию о тренировке');
				console.error('Ошибка загрузки тренировки:', err);
			} finally {
				setLoading(false);
			}
		};

		fetchWorkout();
	}, [workoutId]);

	const handleRegister = async () => {
		if (!userId) {
			navigate('/login');
			return;
		}

		setRegistrationMessage(''); // Сбрасываем сообщение
		setLoading(true);

		try {
			const response = await registerForWorkout(userId, workoutId);
			setRegistrationMessage(
				response.message || 'Вы успешно записаны на тренировку'
			);
		} catch (err) {
			setRegistrationMessage(
				err.message || 'Ошибка при регистрации на тренировку'
			);
			console.error('Ошибка регистрации:', err);
		} finally {
			setLoading(false);
		}
	};

	if (loading) return <p className='loading'>Загрузка...</p>;
	if (error) return <p className='error'>{error}</p>;

	return (
		<div className='workout-container'>
			<div className='header'>
				<button
					onClick={() => navigate(-1)}
					className='back-button'
					disabled={loading}
				>
					<FontAwesomeIcon icon={faArrowLeft} size='lg' />
				</button>
				<h2>{workout.title || 'Без названия'}</h2>
			</div>
			<div className='workout-box'>
				{workout.imageUrl ? (
					<img
						src={`https://localhost:7149${workout.imageUrl}`}
						className='workout-image-screen'
						alt={workout.title}
						onError={e => (e.target.src = '/images/placeholder-image.png')}
					/>
				) : (
					<p className='no-image'>Изображение тренировки не доступно.</p>
				)}
				<p className='workout-description mt'>
					{workout.description || 'Описание отсутствует'}
				</p>
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
								src={
									workout.trainer?.avatar
										? `https://localhost:7149${workout.trainer.avatar}`
										: '/images/placeholder-image.png'
								}
								alt={workout.trainer?.fullName || 'Тренер'}
								onError={e => (e.target.src = '/images/placeholder-image.png')}
							/>
						</div>
						<h2 className='mt'>{workout.trainer?.fullName || 'Не указано'}</h2>
						<p>{workout.trainer?.description || 'Описание отсутствует'}</p>
						<h4 className='mt'>
							Опыт: {workout.trainer?.experienceYears || 0} лет
						</h4>
					</div>

					<button
						onClick={handleRegister}
						className='publish-submit-button submit-button'
						disabled={loading}
					>
						{loading
							? 'Регистрация...'
							: userId
							? 'Записаться на тренировку'
							: 'Войдите, чтобы записаться'}
					</button>

					{registrationMessage && (
						<p
							className={`registration-message mt text-gray ${
								registrationMessage.includes('Ошибка') ? 'error' : 'success'
							}`}
						>
							{registrationMessage}
						</p>
					)}
				</div>
			</div>
		</div>
	);
};

export default WorkoutScreen;
