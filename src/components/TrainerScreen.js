import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faClock } from '@fortawesome/free-solid-svg-icons';
import {
	getTrainerById,
	getTrainerWorkouts,
	getTrainerReviews,
	postReview,
} from '../api/fitnessApi';

const TrainerScreen = () => {
	const { trainerId } = useParams();
	const navigate = useNavigate();
	const [trainerData, setTrainerData] = useState(null);
	const [workouts, setWorkouts] = useState([]);
	const [reviews, setReviews] = useState([]);
	const [newReview, setNewReview] = useState({ rating: 0, comment: '' });
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(true);

	const userData = JSON.parse(localStorage.getItem('userData')) || null;

	console.log('trainerId from params:', trainerId);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const trainer = await getTrainerById(trainerId);
				setTrainerData(trainer);

				const trainerWorkouts = await getTrainerWorkouts(trainerId);
				setWorkouts(trainerWorkouts);

				const trainerReviews = await getTrainerReviews(trainerId);
				setReviews(trainerReviews);
			} catch (err) {
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [trainerId]);

	const handleReviewChange = e => {
		const { name, value } = e.target;
		setNewReview(prev => ({ ...prev, [name]: value }));
	};

	const handleReviewSubmit = async e => {
		e.preventDefault();
		if (!userData || !userData.user?.userId) {
			navigate('/login');
			return;
		}

		if (!newReview.rating || !newReview.comment) {
			return;
		}

		setError('');
		try {
			await postReview({
				trainerId,
				userId: userData.user.userId,
				rating: parseInt(newReview.rating, 10),
				comment: newReview.comment,
			});

			setNewReview({ rating: 0, comment: '' });
			const updatedReviews = await getTrainerReviews(trainerId);
			setReviews(updatedReviews);
		} catch (err) {}
	};

	if (loading) return <p>Загрузка...</p>;

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
						<p className='no-reviews'>Отзывов пока нет.</p>
					)}
				</div>

				<h3 className='mt'>Оставить отзыв</h3>
				{userData?.user?.userId ? (
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
					<button className='submit-button' onClick={() => navigate('/login')}>
						Войдите, чтобы оставить комментарий
					</button>
				)}
			</div>
		</div>
	);
};

export default TrainerScreen;
