import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faClock } from '@fortawesome/free-solid-svg-icons';

const TrainerScreen = () => {
	const { trainerId } = useParams();
	const [trainerData, setTrainerData] = useState(null);
	const [workouts, setWorkouts] = useState([]);
	const [reviews, setReviews] = useState([]);
	const [newReview, setNewReview] = useState({ rating: 0, comment: '' });
	const navigate = useNavigate();

	useEffect(() => {
		fetch(`https://localhost:7149/api/Trainers/${trainerId}`)
			.then(response => response.json())
			.then(data => setTrainerData(data))
			.catch(() => setTrainerData({}));

		fetch(`https://localhost:7149/api/Workouts/trainer/${trainerId}`)
			.then(response => response.json())
			.then(data => setWorkouts(data));

		fetch(`https://localhost:7149/api/Reviews/trainer/${trainerId}`)
			.then(response => response.json())
			.then(data => setReviews(data));
	}, [trainerId]);

	const handleReviewChange = e => {
		const { name, value } = e.target;
		setNewReview(prevReview => ({ ...prevReview, [name]: value }));
	};

	const userData = JSON.parse(localStorage.getItem('userData')) || null;

	const handleReviewSubmit = e => {
		e.preventDefault();
		if (!userData) return; // Проверяем, что пользователь авторизован

		fetch('https://localhost:7149/api/Reviews', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				trainerId,
				userId: userData.user.userId, // Убрал лишний user
				rating: newReview.rating,
				comment: newReview.comment,
			}),
		})
			.then(response => response.json())
			.then(() => {
				setNewReview({ rating: 0, comment: '' });

				// Обновление списка отзывов после публикации
				return fetch(`https://localhost:7149/api/Reviews/trainer/${trainerId}`);
			})
			.then(response => response.json())
			.then(data => setReviews(data))
			.catch(error => console.error('Ошибка при обновлении отзывов:', error));
	};

	// Функция навигации на экран авторизации
	const navigateToLogin = () => {
		navigate('/');
	};

	if (!trainerData) return <p>Загрузка...</p>;

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
							`https://localhost:7149/${trainerData.user.avatar}` ||
							'/images/Profile_avatar_placeholder.png'
						}
						alt='Avatar'
						className='avatar'
					/>
					<div className='profile-info'>
						<p className='profile-name'>
							{trainerData.user?.fullName || 'Имя не указано'}
						</p>
						<p>{trainerData.user?.email || 'Почта не указана'}</p>
						<p>Опыт: {trainerData.experienceYears || 'Не указан'} лет</p>
					</div>
				</div>
			</div>

			<div className='trainer-content'>
				<h3>Описание</h3>
				<p className='text-gray mt-2'>
					{trainerData.description || 'Описание не указано'}
				</p>

				<h3 className='mt'>Навыки</h3>
				<div className='skills-container'>
					{trainerData.skills?.length > 0 ? (
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
										src={workout.imageUrl || '/images/placeholder-image.png'}
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
											review.user?.avatar ||
											'/images/Profile_avatar_placeholder.png'
										}
										alt='User Avatar'
										onError={e => {
											if (!e.target.error) {
												console.log('Ошибка загрузки:', e.target.src);
												e.target.error = true;
												e.target.src = '/images/Profile_avatar_placeholder.png';
											}
										}}
										className='review-avatar'
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
				{userData && userData.user.userId ? (
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
					<button className='submit-button' onClick={navigateToLogin}>
						Войдите, чтобы оставить комментарий
					</button>
				)}
			</div>
		</div>
	);
};

export default TrainerScreen;
