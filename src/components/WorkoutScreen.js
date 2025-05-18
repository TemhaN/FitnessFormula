import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faArrowLeft,
	faClock,
	faMapMarkerAlt,
} from '@fortawesome/free-solid-svg-icons';
import {
	getWorkoutById,
	registerForWorkout,
	unregisterFromWorkout,
	getWorkoutRegistrationsForTrainer,
	getTrainerByUserId,
	getUserWorkoutRegistrations,
	removeUserFromWorkout,
	getWorkoutComments,
	postWorkoutComment,
} from '../api/fitnessApi';

const WorkoutScreen = () => {
	const { workoutId } = useParams();
	const navigate = useNavigate();
	const [workout, setWorkout] = useState(null);
	const [registrations, setRegistrations] = useState(null);
	const [isRegistered, setIsRegistered] = useState(false);
	const [registrationId, setRegistrationId] = useState(null);
	const [error, setError] = useState('');
	const [registrationMessage, setRegistrationMessage] = useState('');
	const [loading, setLoading] = useState(true);
	const [isTrainer, setIsTrainer] = useState(false);
	const [trainerData, setTrainerData] = useState(null);
	const [comments, setComments] = useState([]);
	const [newComment, setNewComment] = useState({ commentText: '' });

	const userData = JSON.parse(localStorage.getItem('userData')) || null;
	const userId = userData?.user?.userId || null;

	useEffect(() => {
		const fetchWorkoutData = async () => {
			try {
				setLoading(true);
				const workoutData = await getWorkoutById(workoutId);
				setWorkout(workoutData);

				// Загрузка комментариев
				const workoutComments = await getWorkoutComments(workoutId);
				setComments(workoutComments);

				if (userId) {
					const trainer = await getTrainerByUserId(userId);
					setTrainerData(trainer);

					if (trainer) {
						setIsTrainer(true);
						if (trainer.trainerId === workoutData.trainerId) {
							const registrationsData = await getWorkoutRegistrationsForTrainer(
								workoutId,
								trainer.trainerId
							);
							setRegistrations(registrationsData);
						}
					} else {
						const userRegistrations = await getUserWorkoutRegistrations(userId);
						const parsedWorkoutId = parseInt(workoutId);
						const registration = userRegistrations.find(
							reg => reg.workout.workoutId === parsedWorkoutId
						);
						setIsRegistered(!!registration);
						setRegistrationId(registration?.registrationId || null);
					}
				}
			} catch (err) {
				// Ошибки отображаются как уведомления, не на весь экран
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

		if (workout.availableSlots === 0) {
			setRegistrationMessage('Тренировка переполнена. Нет доступных мест.');
			setTimeout(() => setRegistrationMessage(''), 3000);
			return;
		}

		setRegistrationMessage('');
		setLoading(true);

		try {
			const response = await registerForWorkout(userId, workoutId);
			setRegistrationMessage(
				response.message || 'Вы успешно записаны на тренировку'
			);
			setIsRegistered(true);

			const updatedWorkoutData = await getWorkoutById(workoutId);
			setWorkout(updatedWorkoutData);

			const userRegistrations = await getUserWorkoutRegistrations(userId);
			const registration = userRegistrations.find(
				reg => reg.workout.workoutId === parseInt(workoutId)
			);
			setRegistrationId(registration?.registrationId || null);

			if (
				isTrainer &&
				trainerData?.trainerId === updatedWorkoutData.trainerId
			) {
				const updatedRegistrations = await getWorkoutRegistrationsForTrainer(
					workoutId,
					trainerData.trainerId
				);
				setRegistrations(updatedRegistrations);
			}

			setTimeout(() => setRegistrationMessage(''), 2000);
		} catch (err) {
			const errorMessage =
				err.message.includes('переполнена') ||
				err.message.includes('Нет доступных мест')
					? 'Тренировка переполнена. Нет доступных мест.'
					: err.message || 'Ошибка при регистрации на тренировку';
			setRegistrationMessage(errorMessage);
			setTimeout(() => setRegistrationMessage(''), 3000);
		} finally {
			setLoading(false);
		}
	};

	const handleUnregister = async () => {
		if (!userId || !registrationId) {
			setRegistrationMessage(
				'Ошибка: данные для отмены регистрации недоступны'
			);
			return;
		}

		setRegistrationMessage('');
		setLoading(true);

		try {
			const response = await unregisterFromWorkout(registrationId, userId);
			setRegistrationMessage(
				response.message || 'Вы успешно отписались от тренировки'
			);
			setIsRegistered(false);
			setRegistrationId(null);

			const updatedWorkoutData = await getWorkoutById(workoutId);
			setWorkout(updatedWorkoutData);

			if (
				isTrainer &&
				trainerData?.trainerId === updatedWorkoutData.trainerId
			) {
				const updatedRegistrations = await getWorkoutRegistrationsForTrainer(
					workoutId,
					trainerData.trainerId
				);
				setRegistrations(updatedRegistrations);
			}

			setTimeout(() => setRegistrationMessage(''), 2000);
		} catch (err) {
			const errorMessage = err.message || 'Ошибка при отмене регистрации';
			setRegistrationMessage(errorMessage);
			setTimeout(() => setRegistrationMessage(''), 3000);
		} finally {
			setLoading(false);
		}
	};

	const handleRemoveUser = async userIdToRemove => {
		if (!trainerData?.trainerId) {
			setRegistrationMessage('Ошибка: данные тренера недоступны');
			return;
		}

		setRegistrationMessage('');
		setLoading(true);

		try {
			const response = await removeUserFromWorkout(
				workoutId,
				trainerData.trainerId,
				userIdToRemove
			);
			setRegistrationMessage(
				response.message || 'Пользователь успешно удалён из тренировки'
			);

			const updatedWorkoutData = await getWorkoutById(workoutId);
			setWorkout(updatedWorkoutData);

			const updatedRegistrations = await getWorkoutRegistrationsForTrainer(
				workoutId,
				trainerData.trainerId
			);
			setRegistrations(updatedRegistrations);

			setTimeout(() => setRegistrationMessage(''), 2000);
		} catch (err) {
			const errorMessage = err.message || 'Ошибка при удалении пользователя';
			setRegistrationMessage(errorMessage);
			setTimeout(() => setRegistrationMessage(''), 3000);
		} finally {
			setLoading(false);
		}
	};

	const handleCommentChange = e => {
		const { value } = e.target;
		setNewComment({ commentText: value });
	};

	const handleCommentSubmit = async e => {
		e.preventDefault();
		if (!userData || !userId) {
			navigate('/login');
			return;
		}

		if (!newComment.commentText.trim()) {
			setError('Комментарий не может быть пустым');
			setTimeout(() => setError(''), 3000);
			return;
		}

		setError('');
		try {
			await postWorkoutComment({
				workoutId: parseInt(workoutId),
				userId,
				commentText: newComment.commentText,
			});

			setNewComment({ commentText: '' });
			const updatedComments = await getWorkoutComments(workoutId);
			setComments(updatedComments);
		} catch (err) {
			setError(err.message || 'Ошибка при отправке комментария');
			setTimeout(() => setError(''), 3000);
		}
	};

	const handleTrainerClick = () => {
		if (workout?.trainer?.trainerId) {
			navigate(`/trainer/${workout.trainer.trainerId}`);
		}
	};

	if (loading) return <p className='loading'>Загрузка...</p>;

	return (
		<div className='workout-screen'>
			<div className='workout-header'>
				<button
					onClick={() => navigate(-1)}
					className='back-button'
					disabled={loading}
				>
					<FontAwesomeIcon icon={faArrowLeft} size='lg' />
				</button>
				<h2>{workout?.title || 'Без названия'}</h2>
			</div>
			<div className='workout-content'>
				{workout?.imageUrl ? (
					<img
						src={`https://localhost:7149/${workout.imageUrl}`}
						className='workout-image'
						alt={workout.title}
						onError={e => (e.target.src = '/images/placeholder-image.png')}
					/>
				) : (
					<p className='no-image'>Изображение тренировки не доступно.</p>
				)}
				<div className='workout-details-card'>
					<p className='workout-description'>
						{workout?.description || 'Описание отсутствует'}
					</p>
					<div className='workout-info'>
						<p className='workout-time'>
							<FontAwesomeIcon icon={faClock} className='info-icon' />
							<span>
								{workout?.startTime
									? new Date(workout.startTime).toLocaleString()
									: 'Не указано'}
							</span>
						</p>
						<p className='workout-location'>
							<FontAwesomeIcon icon={faMapMarkerAlt} className='info-icon' />
							<span>
								{workout?.gym
									? `${workout.gym.gymName}, ${workout.gym.address}`
									: 'Не указано'}
							</span>
						</p>
						<p className='workout-slots'>
							<span>Свободных мест: </span>
							<strong>
								{workout?.availableSlots ?? 0} из{' '}
								{workout?.maxParticipants ?? 0}
							</strong>
						</p>
					</div>
				</div>
				<div className='trainer-card'>
					<h3>Тренер</h3>
					<div
						className='trainer-info-workout-screen trainer-info'
						onClick={handleTrainerClick}
					>
						<img
							src={
								workout?.trainer?.avatar
									? `https://localhost:7149/${workout.trainer.avatar}`
									: '/images/placeholder-image.png'
							}
							alt={workout?.trainer?.fullName || 'Тренер'}
							className='trainer-avatar'
							onError={e => (e.target.src = '/images/placeholder-image.png')}
						/>
						<div className='trainer-details'>
							<h4>{workout?.trainer?.fullName || 'Не указано'}</h4>
							<p>{workout?.trainer?.description || 'Описание отсутствует'}</p>
							<p>Опыт: {workout?.trainer?.experienceYears || 0} лет</p>
						</div>
					</div>
				</div>
				<div className='action-buttons'>
					{!isTrainer && !isRegistered && (
						<button
							onClick={handleRegister}
							className='action-button register-button'
							disabled={loading || workout?.availableSlots === 0}
						>
							{loading
								? 'Регистрация...'
								: workout?.availableSlots === 0
								? 'Нет свободных мест'
								: userId
								? 'Записаться'
								: 'Войдите, чтобы записаться'}
						</button>
					)}
					{!isTrainer && isRegistered && (
						<button
							onClick={handleUnregister}
							className='action-button unregister-button'
							disabled={loading}
						>
							{loading ? 'Отписка...' : 'Отписаться'}
						</button>
					)}
				</div>
				{registrationMessage && (
					<div
						className={`notification ${
							registrationMessage.includes('Ошибка') ||
							registrationMessage.includes('переполнена')
								? 'error'
								: 'success'
						}`}
					>
						<p>{registrationMessage}</p>
						{(registrationMessage.includes('Ошибка') ||
							registrationMessage.includes('переполнена')) && (
							<button
								className='close-notification'
								onClick={() => setRegistrationMessage('')}
							>
								Закрыть
							</button>
						)}
					</div>
				)}
				{!registrationMessage && !isTrainer && isRegistered && (
					<p className='registration-status success'>
						Вы уже записаны на эту тренировку!
					</p>
				)}
				{!registrationMessage && isTrainer && (
					<p className='registration-status info'>
						Вы тренер (кнопка регистрации недоступна)
					</p>
				)}
				{isTrainer &&
					trainerData?.trainerId === workout?.trainerId &&
					registrations && (
						<div className='registrations-card'>
							<h3>
								({registrations.totalUsers}) Зарегистрированные пользователи
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
												<h4>{reg.user.fullName}</h4>
												<p>Email: {reg.user.email}</p>
												<p>Телефон: {reg.user.phoneNumber}</p>
												<p>
													Дата регистрации:{' '}
													{new Date(reg.registrationDate).toLocaleString()}
												</p>
												<button
													onClick={() => handleRemoveUser(reg.user.userId)}
													className='action-button remove-button'
													disabled={loading}
												>
													{loading ? 'Удаление...' : 'Удалить'}
												</button>
											</div>
										</li>
									))}
								</ul>
							) : (
								<p className='no-registrations'>
									Никто ещё не записан на это занятие.
								</p>
							)}
						</div>
					)}
				{error && (
					<div className='notification error'>
						<p>{error}</p>
						<button className='close-notification' onClick={() => setError('')}>
							Закрыть
						</button>
					</div>
				)}
				<h3 className='mt'>Комментарии</h3>
				<div className='reviews-container'>
					{comments.length > 0 ? (
						comments.map(comment => (
							<div key={comment.commentId} className='review-card'>
								<div className='review-header'>
									<img
										src={
											comment.user?.avatar
												? `https://localhost:7149/${comment.user.avatar}`
												: '/images/Profile_avatar_placeholder.png'
										}
										alt={comment.user?.fullName || 'Аватар пользователя'}
										className='review-avatar'
										onError={e =>
											(e.target.src = '/images/Profile_avatar_placeholder.png')
										}
									/>
									<div>
										<strong className='review-name'>
											{comment.user?.fullName || 'Аноним'}
										</strong>
									</div>
								</div>
								<p className='review-text'>{comment.commentText}</p>
							</div>
						))
					) : (
						<p className='no-reviews'>Комментариев пока нет.</p>
					)}
				</div>
				<h3 className='mt'>Оставить комментарий</h3>
				{userData?.user?.userId ? (
					<form onSubmit={handleCommentSubmit} className='review-form'>
						<textarea
							name='commentText'
							placeholder='Напишите ваш комментарий...'
							value={newComment.commentText}
							onChange={handleCommentChange}
							className='review-textarea'
						/>
						<button type='submit' className='submit-button'>
							Отправить
						</button>
					</form>
				) : (
					<button className='submit-button' onClick={() => navigate('/login')}>
						Войдите, чтобы оставить комментарий
					</button>
				)}
			</div>
		</div>
	);
};

export default WorkoutScreen;
