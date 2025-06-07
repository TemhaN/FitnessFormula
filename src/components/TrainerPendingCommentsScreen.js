import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import {
	getPendingTrainerReviewsForTrainer,
	getPendingWorkoutCommentsForTrainer,
	approveReview,
	rejectReview,
	approveWorkoutComment,
	rejectWorkoutComment,
} from '../api/fitnessApi';

const TrainerPendingCommentsScreen = () => {
	const { trainerId } = useParams();
	const navigate = useNavigate();
	const [pendingReviews, setPendingReviews] = useState([]);
	const [pendingComments, setPendingComments] = useState([]);
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const reviews = await getPendingTrainerReviewsForTrainer(trainerId);
				setPendingReviews(reviews);

				const comments = await getPendingWorkoutCommentsForTrainer(trainerId);
				setPendingComments(comments);
			} catch (err) {
				setError('Не удалось загрузить данные');
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [trainerId]);

	const handleApproveReview = async reviewId => {
		try {
			await approveReview(reviewId, trainerId);
			setPendingReviews(pendingReviews.filter(r => r.reviewId !== reviewId));
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
			setPendingReviews(pendingReviews.filter(r => r.reviewId !== reviewId));
			setError('Отзыв отклонён');
			setTimeout(() => setError(''), 3000);
		} catch (err) {
			setError(err.message || 'Ошибка при отклонении отзыва');
			setTimeout(() => setError(''), 3000);
		}
	};

	const handleApproveComment = async commentId => {
		try {
			await approveWorkoutComment(commentId, trainerId);
			setPendingComments(
				pendingComments.filter(c => c.commentId !== commentId)
			);
			setError('Комментарий одобрен');
			setTimeout(() => setError(''), 3000);
		} catch (err) {
			setError(err.message || 'Ошибка при одобрении комментария');
			setTimeout(() => setError(''), 3000);
		}
	};

	const handleRejectComment = async commentId => {
		try {
			await rejectWorkoutComment(commentId, trainerId);
			setPendingComments(
				pendingComments.filter(c => c.commentId !== commentId)
			);
			setError('Комментарий отклонён');
			setTimeout(() => setError(''), 3000);
		} catch (err) {
			setError(err.message || 'Ошибка при отклонении комментария');
			setTimeout(() => setError(''), 3000);
		}
	};

	if (loading) return <p className='loading'>Загрузка...</p>;

	return (
		<div>
			<div className='header'>
				<button onClick={() => navigate(-1)} className='back-button'>
					<FontAwesomeIcon icon={faArrowLeft} size='lg' />
				</button>
				<h2>Комментарии на модерации</h2>
			</div>
			{error && <p className='error-message'>{error}</p>}

			<h3 className='mt center-text'>Отзывы к профилю тренера</h3>
			{pendingReviews.length > 0 ? (
				<div className='comments-user'>
					{pendingReviews.map(review => (
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
							<p>Дата: {new Date(review.reviewDate).toLocaleString()}</p>
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
					))}
				</div>
			) : (
				<p className='no-reviews'>Нет отзывов на модерации.</p>
			)}

			<h3 className='mt center-text'>Комментарии к занятиям</h3>
			{pendingComments.length > 0 ? (
				<div className='comments-user'>
					{pendingComments.map(comment => (
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
							<p>Дата: {new Date(comment.commentDate).toLocaleString()}</p>
							<p>Занятие: {comment.workoutTitle || 'Не указано'}</p>
							<div className='action-buttons-pending'>
								<button
									className='action-button'
									onClick={() => handleApproveComment(comment.commentId)}
								>
									Одобрить
								</button>
								<button
									className='action-button remove-button'
									onClick={() => handleRejectComment(comment.commentId)}
								>
									Отклонить
								</button>
							</div>
						</div>
					))}
				</div>
			) : (
				<p className='no-reviews'>Нет комментариев на модерации.</p>
			)}
		</div>
	);
};

export default TrainerPendingCommentsScreen;
