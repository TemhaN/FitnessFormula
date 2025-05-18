import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
	getWorkouts,
	getTrainers,
	getNotifications,
	markNotificationAsRead,
	deleteNotification,
	getUserInterests,
	getWeeklyChallenge,
} from '../api/fitnessApi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faHouse,
	faUser,
	faClock,
	faBell,
	faArrowRight,
	faChartPie,
} from '@fortawesome/free-solid-svg-icons';
import NotificationsModal from './NotificationsModal';

const HomeScreen = () => {
	const navigate = useNavigate();
	const [username, setUsername] = useState('');
	const [userId, setUserId] = useState(null);
	const [workouts, setWorkouts] = useState([]);
	const [trainers, setTrainers] = useState([]);
	const [notifications, setNotifications] = useState([]);
	const [unreadCount, setUnreadCount] = useState(0);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [userNotFound, setUserNotFound] = useState(false);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [challengeWorkout, setChallengeWorkout] = useState(null);
	const navigateToWorkoutsList = () => navigate('/workouts-list');
	const navigateToCalculator = () => navigate('/calculator');

	useEffect(() => {
		const fetchData = async () => {
			try {
				const userData = JSON.parse(localStorage.getItem('userData'));
				if (
					userData &&
					userData.user &&
					userData.user.fullName &&
					userData.user.userId
				) {
					setUsername(userData.user.fullName);
					setUserId(userData.user.userId);
				} else {
					setUserNotFound(true);
				}

				const workoutsData = await getWorkouts();
				setWorkouts(workoutsData);

				const trainersData = await getTrainers();
				setTrainers(trainersData);

				if (!userNotFound && userId) {
					const notificationsData = await getNotifications(userId);
					setNotifications(notificationsData);
					setUnreadCount(notificationsData.filter(n => !n.isRead).length);

					// Загружаем челлендж недели через серверный эндпоинт
					try {
						const challengeData = await getWeeklyChallenge(userId);
						setChallengeWorkout(challengeData);
					} catch (err) {
						setError('Не удалось загрузить челлендж недели.');
					}

					// Интересы можно загрузить для других целей, но они не используются для челленджа
					await getUserInterests(userId);
				}
			} catch (err) {
				setError('Не удалось загрузить данные. Попробуйте позже.');
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [userNotFound, userId]);

	const handleMarkRead = async notificationId => {
		await markNotificationAsRead(notificationId, userId);
		const notificationsData = await getNotifications(userId);
		setNotifications(notificationsData);
		setUnreadCount(notificationsData.filter(n => !n.isRead).length);
	};

	const handleDelete = async notificationId => {
		await deleteNotification(notificationId, userId);
		const notificationsData = await getNotifications(userId);
		setNotifications(notificationsData);
		setUnreadCount(notificationsData.filter(n => !n.isRead).length);
	};

	const navigateToLogin = () => navigate('/');
	const navigateToTrainer = trainerId => navigate(`/trainer/${trainerId}`);
	const navigateToWorkout = workoutId => navigate(`/workout/${workoutId}`);
	const navigateToHome = () => navigate('/home');
	const navigateToUser = () => navigate('/user');

	return (
		<div className='home-screen'>
			{loading ? (
				<section className='home-padding'>
					<p>Загрузка...</p>
				</section>
			) : (
				<>
					<section className='home-padding'>
						{error && <p className='error-text'>{error}</p>}
						{userNotFound ? (
							<div className='login-prompt'>
								<h2 className='greeting'>Привет, пожалуйста авторизуйтесь</h2>
								<button className='submit-button' onClick={navigateToLogin}>
									Войти
								</button>
							</div>
						) : (
							<div className='header-container'>
								<h2 className='greeting'>Привет, {username}</h2>
								<button
									className={`notification-button ${
										unreadCount > 0 ? 'has-notifications' : ''
									}`}
									onClick={() => setIsModalOpen(true)}
								>
									<FontAwesomeIcon icon={faBell} />
									{unreadCount > 0 && (
										<span className='notification-badge'>{unreadCount}</span>
									)}
								</button>
							</div>
						)}
						<p className='info-text'>Проверь свои лимиты</p>

						<div className='section-header mt-2'>
							<button
								className='arrow-button'
								onClick={navigateToWorkoutsList}
								title='Все занятия'
							>
								<h3 className='section-title'>Рекомендации</h3>
								<FontAwesomeIcon icon={faArrowRight} size='lg' />
							</button>
						</div>
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
													workout.imageUrl
														? `https://localhost:7149/${workout.imageUrl}`
														: '/images/placeholder-image.png'
												}
												alt={workout.title}
												onError={e => {
													e.target.src = '/images/placeholder-image.png';
												}}
											/>
										</div>
										<div className='workout-text-box'>
											<p className='workout-title'>{workout.title}</p>
											<div className='workout-time'>
												<FontAwesomeIcon className='time-icon' icon={faClock} />
												<p>
													Начало в{' '}
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
								<p>
									{challengeWorkout ? challengeWorkout.title : 'Загрузка...'}
								</p>
							</div>
							<div className='challenge-image'>
								<img
									src={
										challengeWorkout?.imageUrl
											? `https://localhost:7149/${challengeWorkout.imageUrl}`
											: '/images/woman-helping-man-gym.png'
									}
									alt='Челлендж'
									onError={e => {
										e.target.src = '/images/woman-helping-man-gym.png';
									}}
								/>
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
													trainer.user.avatar
														? `https://localhost:7149/${trainer.user.avatar}`
														: '/images/placeholder-image.png'
												}
												alt={trainer.user.fullName}
												onError={e => {
													e.target.src = '/images/placeholder-image.png';
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

					<div className='bottom-bar'>
						<button onClick={navigateToHome} className='bottom-bar-button'>
							<FontAwesomeIcon icon={faHouse} size='lg' />
						</button>
						<button
							onClick={navigateToCalculator}
							className='bottom-bar-button'
						>
							<FontAwesomeIcon icon={faChartPie} size='lg' />
						</button>
						<button onClick={navigateToUser} className='bottom-bar-button'>
							<FontAwesomeIcon icon={faUser} size='lg' />
						</button>
					</div>

					{isModalOpen && (
						<NotificationsModal
							notifications={notifications}
							onClose={() => setIsModalOpen(false)}
							onMarkRead={handleMarkRead}
							onDelete={handleDelete}
						/>
					)}
				</>
			)}
		</div>
	);
};

export default HomeScreen;
