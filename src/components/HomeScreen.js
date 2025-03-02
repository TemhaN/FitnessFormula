import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { getWorkouts, getTrainers } from '../api/fitnessApi';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faUser, faClock } from '@fortawesome/free-solid-svg-icons';

const HomeScreen = () => {
	const navigate = useNavigate();
	const [username, setUsername] = useState('');
	const [workouts, setWorkouts] = useState([]);
	const [trainers, setTrainers] = useState([]);
	const [userNotFound, setUserNotFound] = useState(false);

	useEffect(() => {
		// Проверка данных из localStorage
		const userData = JSON.parse(localStorage.getItem('userData'));
		console.log('userData из localStorage:', userData);

		if (userData && userData.user && userData.user.fullName) {
			setUsername(userData.user.fullName);
		} else {
			setUserNotFound(true);
		}

		// Получение списка тренировок
		getWorkouts()
			.then(data => {
				console.log('Тренировки:', data);
				setWorkouts(data);
			})
			.catch(err => {
				console.error('Ошибка при загрузке тренировок:', err);
			});

		// Получение списка тренеров
		getTrainers()
			.then(data => {
				console.log('Тренеры:', data);
				setTrainers(data);
			})
			.catch(err => {
				console.error('Ошибка при загрузке тренеров:', err);
			});
	}, []);

	// Функция навигации на экран авторизации
	const navigateToLogin = () => {
		navigate('/');
	};

	// Функции навигации
	const navigateToTrainer = trainerId => {
		navigate(`/trainer/${trainerId}`);
	};

	const navigateToWorkout = workoutId => {
		navigate(`/workout/${workoutId}`);
	};

	const navigateToHome = () => {
		navigate('/home');
	};

	const navigateToUser = () => {
		navigate('/user');
	};

	return (
		<div className='home-screen'>
			<section className='home-padding'>
				{userNotFound ? (
					<div className='login-prompt'>
						<h2 className='greeting'>Привет, пожалуйста авторизуйтесь</h2>
						<button className='submit-button' onClick={navigateToLogin}>
							Войти
						</button>
					</div>
				) : (
					<>
						<h2 className='greeting'>Привет, {username}</h2>
						<p className='info-text'>Проверь свои лимиты</p>
					</>
				)}

				<h3 className='section-title mt-2'>Рекомендации</h3>
				{workouts.length > 0 ? (
					<div className='horizontal-scroll'>
						{workouts.map(workout => (
							<div
								key={workout.workoutId}
								onClick={() => navigateToWorkout(workout.workoutId)}
								className='card workout-card'
							>
								<div className='workout-image'>
									<img
										className='workout-img'
										src={
											`https://localhost:7149${workout.imageUrl}` ||
											'/images/placeholder-image.png'
										}
										alt={workout.title}
										onError={e => {
											if (!e.target.dataset.error) {
												console.log('Ошибка загрузки:', e.target.src);
												e.target.dataset.error = true;
												e.target.src = '/images/placeholder-image.png';
											}
										}}
									/>
								</div>
								<div className='workout-text-box'>
									<p className='workout-title'>{workout.title}</p>
									<div className='workout-time'>
										<FontAwesomeIcon className='time-icon' icon={faClock} />
										<p>
											Начало В{' '}
											{new Date(workout.startTime).toLocaleTimeString([], {
												hour: '2-digit',
												minute: '2-digit',
											})}
										</p>
									</div>
								</div>
							</div>
						))}
					</div>
				) : (
					<p>Тренировки не найдены.</p>
				)}
			</section>

			<section className='challenge-section'>
				<div className='challenge-container'>
					<div className='challenge-text'>
						<h2>Челлендж Недели</h2>
						<p>Планка</p>
					</div>
					<div className='challenge-image'>
						<img src='/images/woman-helping-man-gym.png' alt='Челлендж' />
					</div>
				</div>
			</section>

			<section className='home-padding'>
				<h3 className='section-title'>Тренеры</h3>
				{trainers.length > 0 ? (
					<div className='horizontal-scroll'>
						{trainers.map(trainer => (
							<div
								key={trainer.trainerId}
								onClick={() => navigateToTrainer(trainer.trainerId)}
								className='card trainer-card'
							>
								<div className='trainer-image'>
									<img
										className='trainer-img'
										src={
											`https://localhost:7149/${trainer.user.avatar}` ||
											'/images/placeholder-image.png'
										}
										alt={trainer.user.fullName}
										onError={e => {
											if (!e.target.dataset.error) {
												console.log('Ошибка загрузки:', e.target.src);
												e.target.dataset.error = true;
												e.target.src = '/images/placeholder-image.png';
											}
										}}
									/>
								</div>
								<div className='trainer-text-box'>
									<p className='trainer-text'>{trainer.user.fullName}</p>
									<p>{trainer.description}</p>
									<br />
									Опыт: {trainer.experienceYears} лет
								</div>
							</div>
						))}
					</div>
				) : (
					<p>Тренеры не найдены.</p>
				)}
				<div className='bottom-div'></div>
			</section>

			{/* Bottom bar */}
			<div className='bottom-bar'>
				<button onClick={navigateToHome} className='bottom-bar-button'>
					<FontAwesomeIcon icon={faHouse} size='lg' />
				</button>
				<button onClick={navigateToUser} className='bottom-bar-button'>
					<FontAwesomeIcon icon={faUser} size='lg' />
				</button>
			</div>
		</div>
	);
};

export default HomeScreen;
