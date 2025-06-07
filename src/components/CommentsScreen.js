import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import {
	getUserWorkoutComments, // Новая функция
	getPendingTrainerReviews,
	deleteWorkoutComment,
	rejectReview,
} from '../api/fitnessApi';

const CommentsScreen = () => {
	const [comments, setComments] = useState([]);
	const [pendingReviews, setPendingReviews] = useState([]);
	const [error, setError] = useState('');
	const navigate = useNavigate();

	const userData = JSON.parse(localStorage.getItem('userData')) || null;
	const userId = userData?.user?.userId || null;

	useEffect(() => {
		if (!userId) {
			setError('Данные пользователя не найдены. Войдите в аккаунт.');
			return;
		}

		const fetchData = async () => {
			try {
				const comments = await getUserWorkoutComments(userId);
				setComments(comments);

				const reviews = await getPendingTrainerReviews(userId);
				setPendingReviews(reviews);
			} catch (err) {
				setError('Не удалось загрузить данные');
			}
		};

		fetchData();
	}, [userId]);

	const handleDeleteComment = async commentId => {
		try {
			await deleteWorkoutComment(commentId, userId);
			setComments(comments.filter(c => c.commentId !== commentId));
			setError('Комментарий успешно удалён');
			setTimeout(() => setError(''), 3000);
		} catch (err) {
			setError(err.message || 'Ошибка при удалении комментария');
			setTimeout(() => setError(''), 3000);
		}
	};

	const handleDeleteReview = async reviewId => {
		try {
			await rejectReview(reviewId, userId);
			setPendingReviews(pendingReviews.filter(r => r.reviewId !== reviewId));
			setError('Отзыв успешно удалён');
			setTimeout(() => setError(''), 3000);
		} catch (err) {
			setError(err.message || 'Ошибка при удалении отзыва');
			setTimeout(() => setError(''), 3000);
		}
	};

	return (
		<div>
			<div className='header'>
				<button onClick={() => navigate(-1)} className='back-button'>
					<FontAwesomeIcon icon={faArrowLeft} size='lg' />
				</button>
				<h2>Ваши комментарии и отзывы</h2>
			</div>
			{error && <p className='error-message'>{error}</p>}

			<h3 className='mt center-text'>Комментарии к тренировкам</h3>
			{comments.length > 0 ? (
				<div className='comments-user'>
					{comments.map(comment => (
						<div key={comment.commentId} className='review-card'>
							<div className='review-header'>
								<div className='review-text-box'>
									<h4 className='review-text'>{comment.commentText}</h4>
								</div>
							</div>
							<p>Дата: {new Date(comment.commentDate).toLocaleString()}</p>
							<p>Для тренировки: {comment.workoutTitle || 'Не указано'}</p>
							<p>Тренер: {comment.trainer?.fullName || 'Не указано'}</p>
							<p>Статус: {comment.isApproved ? 'Одобрен' : 'На модерации'}</p>
							<button
								className='action-button remove-button'
								onClick={() => handleDeleteComment(comment.commentId)}
							>
								Удалить
							</button>
						</div>
					))}
				</div>
			) : (
				<p className='no-reviews'>Нет комментариев.</p>
			)}

			<h3 className='mt center-text'>Отзывы о тренерах на модерации</h3>
			{pendingReviews.length > 0 ? (
				<div className='comments-user'>
					{pendingReviews.map(review => (
						<div key={review.reviewId} className='review-card'>
							<div className='review-header'>
								<div className='review-text-box'>
									<div className='rating'>
										{[...Array(5)].map((_, i) => (
											<span
												key={i}
												className={i < review.rating ? 'star filled' : 'star'}
											>
												★
											</span>
										))}
									</div>
									<h4 className='review-text'>{review.comment}</h4>
								</div>
							</div>
							<p>Дата: {new Date(review.reviewDate).toLocaleString()}</p>
							<p>Для тренера: {review.trainerName || 'Не указано'}</p>
							<p>Статус: На модерации</p>
							<button
								className='action-button remove-button'
								onClick={() => handleDeleteReview(review.reviewId)}
							>
								удалить
							</button>
						</div>
					))}
				</div>
			) : (
				<p className='no-reviews'>Нет отзывов на модерации.</p>
			)}
		</div>
	);
};

export default CommentsScreen;
