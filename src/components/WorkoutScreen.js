import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import {
	getWorkoutById,
	registerForWorkout,
	getWorkoutRegistrations,
	getTrainerByUserId,
} from '../api/fitnessApi';

const WorkoutScreen = () => {
	const { workoutId } = useParams();
	const navigate = useNavigate();
	const [workout, setWorkout] = useState(null);
	const [registrations, setRegistrations] = useState(null);
	const [error, setError] = useState('');
	const [registrationMessage, setRegistrationMessage] = useState('');
	const [loading, setLoading] = useState(true);
	const [isTrainer, setIsTrainer] = useState(false);

	const userData = JSON.parse(localStorage.getItem('userData')) || null;
	const userId = userData?.user?.userId || null;

	useEffect(() => {
		const fetchWorkoutData = async () => {
			try {
				setLoading(true);
				const workoutData = await getWorkoutById(workoutId);
				setWorkout(workoutData);

				// Проверяем, является ли текущий пользователь тренером этой тренировки
				if (userId) {
					const trainerData = await getTrainerByUserId(userId);
					if (trainerData && trainerData.trainerId === workoutData.trainerId) {
						setIsTrainer(true);
						// Загружаем список зарегистрированных только для тренера
						const registrationsData = await getWorkoutRegistrations(
							workoutId,
							trainerData.trainerId
						);
						setRegistrations(registrationsData);
					}
				}
			} catch (err) {
				// setError(err.message || 'Не удалось загрузить информацию о тренировке');
				// console.error('Ошибка загрузки данных:', err);
			} finally {
				setLoading(false);
			}
		};

		fetchWorkoutData();
	}, [workoutId, userId]);

	const handleRegister = async () => {
		if (!userId) {
			navigate('/login');
			return;
		}

		setRegistrationMessage('');
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
			// console.error('Ошибка регистрации:', err);
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
						src={`https://localhost:7149/${workout.imageUrl}`}
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
										? `https://localhost:7149/${workout.trainer.avatar}`
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

					{/* Кнопка записи отображается только для не-тренеров */}
					{!isTrainer && (
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
					)}

					{registrationMessage && (
						<p
							className={`registration-message mt text-gray ${
								registrationMessage.includes('Ошибка') ? 'error' : 'success'
							}`}
						>
							{registrationMessage}
						</p>
					)}

					{/* Отображение списка зарегистрированных только для тренера */}
					{isTrainer && registrations && (
						<div className='registrations-section mt'>
							<h3>
								Зарегистрированные пользователи ({registrations.totalUsers})
							</h3>
							{registrations.totalUsers > 0 ? (
								<ul className='registrations-list'>
									{registrations.registrations.map(reg => (
										<li key={reg.registrationId} className='registration-item'>
											<img
												src={
													reg.user.avatar
														? `https://localhost:7149/${reg.user.avatar}`
														: '/images/placeholder-image.png'
												}
												alt={reg.user.fullName}
												className='user-avatar'
												onError={e =>
													(e.target.src = '/images/placeholder-image.png')
												}
											/>
											<div className='user-info'>
												<p>
													<strong>{reg.user.fullName}</strong>
												</p>
												<p>Email: {reg.user.email}</p>
												<p>Телефон: {reg.user.phoneNumber}</p>
												<p>
													Дата регистрации:{' '}
													{new Date(reg.registrationDate).toLocaleString()}
												</p>
											</div>
										</li>
									))}
								</ul>
							) : (
								<p>Никто ещё не записан на это занятие.</p>
							)}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default WorkoutScreen;
