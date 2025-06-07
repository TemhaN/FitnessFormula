import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faArrowLeft,
	faClock,
	faStar,
} from '@fortawesome/free-solid-svg-icons';
import {
	getTrainerById,
	getTrainerWorkouts,
	getTrainerReviews,
	postReview,
	getTrainerStatistics,
	approveReview,
	rejectReview,
	getTrainerByUserId,
	getPendingTrainerReviewsForTrainer, // Изменён импорт
} from '../api/fitnessApi';
import axios from 'axios';

const API_URL = 'https://localhost:7149/api';

const TrainerScreen = () => {
	const { trainerId } = useParams();
	const navigate = useNavigate();
	const [trainerData, setTrainerData] = useState(null);
	const [workouts, setWorkouts] = useState([]);
	const [reviews, setReviews] = useState([]); // Одобренные отзывы
	const [pendingReviews, setPendingReviews] = useState([]); // Отзывы на модерации
	const [statistics, setStatistics] = useState(null);
	const [newReview, setNewReview] = useState({ rating: 0, comment: '' });
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(true);
	const [isTrainer, setIsTrainer] = useState(false);
	const [canLeaveReview, setCanLeaveReview] = useState(false);

	const userData = JSON.parse(localStorage.getItem('userData')) || null;
	const userId = userData?.user?.userId || null;

	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true);
				const trainer = await getTrainerById(trainerId);
				setTrainerData(trainer);

				const trainerWorkouts = await getTrainerWorkouts(trainerId);
				setWorkouts(trainerWorkouts);

				const trainerReviews = await getTrainerReviews(trainerId);
				// Нормализуем данные, добавляя isApproved: true, если отсутствует
				const normalizedReviews = trainerReviews.map(review => ({
					...review,
					isApproved: review.isApproved ?? true,
				}));
				console.log(
					'Approved reviews:',
					JSON.stringify(normalizedReviews, null, 2)
				);
				setReviews(normalizedReviews);

				const trainerStatistics = await getTrainerStatistics(trainerId);
				setStatistics(trainerStatistics);

				if (userId) {
					const currentTrainer = await getTrainerByUserId(userId);
					if (
						currentTrainer &&
						currentTrainer.trainerId === parseInt(trainerId)
					) {
						setIsTrainer(true);
						const trainerPendingReviews =
							await getPendingTrainerReviewsForTrainer(trainerId);
						// Нормализуем данные для pendingReviews
						const normalizedPendingReviews = trainerPendingReviews.map(
							review => ({
								...review,
								isApproved: review.isApproved ?? false,
							})
						);
						console.log(
							'Pending reviews:',
							JSON.stringify(normalizedPendingReviews, null, 2)
						);
						setPendingReviews(normalizedPendingReviews);
					} else {
						const checkCommentEligibility = await axios.get(
							`${API_URL}/Reviews/check-comment/${trainerId}/user/${userId}`
						);
						setCanLeaveReview(checkCommentEligibility.data.canComment);
					}
				}
			} catch (err) {
				setError('Ошибка при загрузке данных тренера');
				console.error('Fetch error:', err);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [trainerId, userId]);

	const handleReviewChange = e => {
		const { name, value } = e.target;
		setNewReview(prev => ({ ...prev, [name]: value }));
	};

	const handleReviewSubmit = async e => {
		e.preventDefault();
		if (!userId) {
			navigate('/login');
			return;
		}

		if (!newReview.rating || !newReview.comment) {
			setError('Оценка и комментарий обязательны');
			return;
		}

		setError('');
		try {
			await postReview({
				trainerId: parseInt(trainerId, 10),
				userId,
				rating: parseInt(newReview.rating, 10),
				comment: newReview.comment,
			});

			setNewReview({ rating: 0, comment: '' });
			const updatedReviews = await getTrainerReviews(trainerId);
			setReviews(updatedReviews);

			if (!isTrainer) {
				const checkCommentEligibility = await axios.get(
					`${API_URL}/Reviews/check-comment/${trainerId}/user/${userId}`
				);
				setCanLeaveReview(checkCommentEligibility.data.canComment);
			}

			const updatedStatistics = await getTrainerStatistics(trainerId);
			setStatistics(updatedStatistics);

			setError('Отзыв отправлен на модерацию');
			setTimeout(() => setError(''), 3000);
		} catch (err) {
			setError(err.message || 'Ошибка при отправке отзыва');
			setTimeout(() => setError(''), 3000);
		}
	};

	const handleApproveReview = async reviewId => {
		try {
			await approveReview(reviewId, trainerId);
			const updatedReviews = await getTrainerReviews(trainerId);
			setReviews(updatedReviews);
			const updatedPendingReviews = await getPendingTrainerReviewsForTrainer(
				trainerId
			);
			setPendingReviews(updatedPendingReviews);
			setError('Отзыв одобрен');
			setTimeout(() => setError(''), 3000);
		} catch (err) {
			setError(err.message || 'Ошибка при одобрении отзыва');
			setTimeout(() => setError(''), 3000);
		}
	};

	const handleRejectReview = async reviewId => {
		try {
			await rejectReview(reviewId, trainerId);
			const updatedReviews = await getTrainerReviews(trainerId);
			setReviews(updatedReviews);
			const updatedPendingReviews = await getPendingTrainerReviewsForTrainer(
				trainerId
			);
			setPendingReviews(updatedPendingReviews);
			setError('Отзыв отклонён');
			setTimeout(() => setError(''), 3000);
		} catch (err) {
			setError(err.message || 'Ошибка при отклонении отзыва');
			setTimeout(() => setError(''), 3000);
		}
	};

	const handleDeleteReview = async reviewId => {
		try {
			await rejectReview(reviewId, userId);
			const updatedPendingReviews = await getPendingTrainerReviewsForTrainer(
				trainerId
			);
			setPendingReviews(updatedPendingReviews);
			setError('Отзыв удалён');
			setTimeout(() => setError(''), 3000);
		} catch (err) {
			setError(err.message || 'Ошибка при удалении отзыва');
			setTimeout(() => setError(''), 3000);
		}
	};

	// Объединяем одобренные и неутверждённые отзывы
	const allReviews = [...reviews, ...pendingReviews].sort(
		(a, b) => new Date(b.reviewDate) - new Date(a.reviewDate)
	);

	if (loading) return <p className='loading'>Загрузка...</p>;

	return (
		<div className='trainer'>
			<div className='user-container'>
				<div className='header'>
					<button onClick={() => navigate(-1)} className='back-button'>
						<FontAwesomeIcon icon={faArrowLeft} size='lg' />
					</button>
					<h2>Тренер</h2>
				</div>
				<div className='profile'>
					<img
						src={
							trainerData?.user?.avatar
								? `https://localhost:7149/${trainerData.user.avatar}`
								: '/images/Profile_avatar_placeholder.png'
						}
						alt={trainerData?.user?.fullName || 'Аватар тренера'}
						className='avatar'
						onError={e =>
							(e.target.src = '/images/Profile_avatar_placeholder.png')
						}
					/>
					<div className='profile-info'>
						<p className='profile-name'>
							{trainerData?.user?.fullName || 'Имя не указано'}
						</p>
						<p>{trainerData?.user?.email || 'Почта не указана'}</p>
						<p>Опыт: {trainerData?.experienceYears || 'Не указано'} лет</p>
					</div>
				</div>
			</div>

			<div className='trainer-content'>
				{error && <p className='error-message'>{error}</p>}
				<h3>Описание</h3>
				<p className='text-gray mt-2'>
					{trainerData?.description || 'Описание не указано'}
				</p>
				<h3 className='mt'>Статистика</h3>
				{statistics && statistics.averageRating !== undefined ? (
					<div className='statistics-card'>
						<div className='statistics-item'>
							<span className='statistics-label'>Средний рейтинг:</span>
							<span className='statistics-value'>
								{statistics.averageRating.toFixed(2)} / 5{' '}
								<FontAwesomeIcon
									icon={faStar}
									className='star filled'
									style={{ color: '#ddd' }}
								/>
							</span>
						</div>
						<div className='statistics-item'>
							<span className='statistics-label'>Количество отзывов:</span>
							<span className='statistics-value'>{statistics.reviewCount}</span>
						</div>
						<div className='statistics-item'>
							<span className='statistics-label'>Проведено тренировок:</span>
							<span className='statistics-value'>
								{statistics.workoutCount}
							</span>
						</div>
					</div>
				) : (
					<p className='no-statistics'>Статистика недоступна</p>
				)}
				<h3 className='mt'>Навыки</h3>
				<div className='skills-container'>
					{trainerData?.skills?.length > 0 ? (
						trainerData.skills.map(skill => (
							<div key={skill.skillId} className='skill-card'>
								{skill.skillName}
							</div>
						))
					) : (
						<p className='no-skills'>Нет навыков</p>
					)}
				</div>
				<h3 className='mt'>Занятия</h3>
				{workouts.length > 0 ? (
					<div className='horizontal-scroll'>
						{workouts.map(workout => (
							<div
								key={workout.workoutId}
								onClick={() => navigate(`/workout/${workout.workoutId}`)}
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
										alt={workout.title || 'Изображение тренировки'}
										onError={e =>
											(e.target.src = '/images/placeholder-image.png')
										}
									/>
								</div>
								<div className='workout-text-box'>
									<p className='workout-title'>
										{workout.title || 'Без названия'}
									</p>
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
					<p className='no-reviews'>Тренировки не найдены.</p>
				)}
				<h3 className='mt'>Ваши отзывы на модерации</h3>
				<div className='reviews-container'>
					{pendingReviews.length > 0 ? (
						pendingReviews.map(review => (
							<div key={review.reviewId} className='review-card'>
								<div className='review-header'>
									<div>
										<strong className='review-name'>
											{userData?.user?.fullName || 'Вы'}
										</strong>
										<div className='review-rating'>
											{[...Array(5)].map((_, i) => (
												<span
													key={i}
													className={i < review.rating ? 'star filled' : 'star'}
												>
													★
												</span>
											))}
										</div>
									</div>
								</div>
								<p className='review-text'>{review.comment}</p>
								<p>Дата: {new Date(review.reviewDate).toLocaleString()}</p>
								<p>Статус: На модерации</p>
								<button
									className='action-button remove-button'
									onClick={() => handleDeleteReview(review.reviewId)}
								>
									Удалить
								</button>
							</div>
						))
					) : (
						<p className='no-reviews'>Нет отзывов на модерации.</p>
					)}
				</div>

				<h3 className='mt'>Отзывы</h3>
				<div className='reviews-container'>
					{reviews.length > 0 ? (
						reviews.map(review => (
							<div key={review.reviewId} className='review-card'>
								<div className='review-header'>
									<img
										src={
											review.user?.avatar
												? `https://localhost:7149/${review.user.avatar}`
												: '/images/Profile_avatar_placeholder.png'
										}
										alt={review.user?.fullName || 'Аватар пользователя'}
										className='review-avatar'
										onError={e =>
											(e.target.src = '/images/Profile_avatar_placeholder.png')
										}
									/>
									<div>
										<strong className='review-name'>
											{review.user?.fullName || 'Аноним'}
										</strong>
										<div className='review-rating'>
											{[...Array(5)].map((_, i) => (
												<span
													key={i}
													className={i < review.rating ? 'star filled' : 'star'}
												>
													★
												</span>
											))}
										</div>
									</div>
								</div>
								<p className='review-text'>{review.comment}</p>
							</div>
						))
					) : (
						<p className='no-reviews'>Одобренных отзывов пока нет.</p>
					)}
				</div>

				{isTrainer && trainerData?.trainerId === parseInt(trainerId) && (
					<>
						<h3 className='mt'>Отзывы на модерации</h3>
						<div className='reviews-container'>
							{pendingReviews.length > 0 ? (
								pendingReviews.map(review => (
									<div key={review.reviewId} className='review-card'>
										<div className='review-header'>
											<img
												src={
													review.user?.avatar
														? `https://localhost:7149/${review.user.avatar}`
														: '/images/Profile_avatar_placeholder.png'
												}
												alt={review.user?.fullName || 'Аватар пользователя'}
												className='review-avatar'
												onError={e =>
													(e.target.src =
														'/images/Profile_avatar_placeholder.png')
												}
											/>
											<div>
												<strong className='review-name'>
													{review.user?.fullName || 'Аноним'}
												</strong>
												<div className='review-rating'>
													{[...Array(5)].map((_, i) => (
														<span
															key={i}
															className={
																i < review.rating ? 'star filled' : 'star'
															}
														>
															★
														</span>
													))}
												</div>
											</div>
										</div>
										<p className='review-text'>{review.comment}</p>
										<div className='action-buttons-pending'>
											<button
												className='action-button'
												onClick={() => handleApproveReview(review.reviewId)}
											>
												Одобрить
											</button>
											<button
												className='action-button remove-button'
												onClick={() => handleRejectReview(review.reviewId)}
											>
												Отклонить
											</button>
										</div>
									</div>
								))
							) : (
								<p className='no-reviews'>Нет отзывов на модерации.</p>
							)}
						</div>
					</>
				)}

				<h3 className='mt'>Оставить отзыв</h3>
				{userId ? (
					canLeaveReview ? (
						<form onSubmit={handleReviewSubmit} className='review-form'>
							<div className='rating-input'>
								<div className='rating-controls'>
									<label>Оценка:</label>
									<button
										type='button'
										className='rating-btn'
										onClick={() =>
											setNewReview(prev => ({
												...prev,
												rating: Math.max(1, prev.rating - 1),
											}))
										}
									>
										-
									</button>
									<input
										type='number'
										name='rating'
										min='1'
										max='5'
										value={newReview.rating}
										onChange={handleReviewChange}
										className='rating-field'
									/>
									<button
										type='button'
										className='rating-btn'
										onClick={() =>
											setNewReview(prev => ({
												...prev,
												rating: Math.min(5, prev.rating + 1),
											}))
										}
									>
										+
									</button>
								</div>
							</div>
							<textarea
								name='comment'
								placeholder='Напишите ваш отзыв...'
								value={newReview.comment}
								onChange={handleReviewChange}
								className='review-textarea'
							/>
							<button type='submit' className='submit-button'>
								Отправить
							</button>
						</form>
					) : (
						<p className='no-reviews'>
							Вы не посещали тренировки этого тренера или уже оставили отзыв.
						</p>
					)
				) : (
					<button className='submit-button' onClick={() => navigate('/login')}>
						Войдите, чтобы оставить отзыв
					</button>
				)}
			</div>
		</div>
	);
};

export default TrainerScreen;
