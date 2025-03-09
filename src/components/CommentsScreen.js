import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { getUserReviews } from '../api/fitnessApi'; // Импортируем функцию (проверьте путь)

const CommentsScreen = () => {
	const [comments, setComments] = useState([]);
	const [error, setError] = useState('');
	const navigate = useNavigate();

	useEffect(() => {
		const userData = JSON.parse(localStorage.getItem('userData'));

		if (userData && userData.user.userId) {
			const userId = userData.user.userId;

			const fetchComments = async () => {
				try {
					const reviews = await getUserReviews(userId); // Используем функцию из fitnessApi
					setComments(reviews);
				} catch (err) {
					console.error('Error fetching reviews:', err);
					// setError('Не удалось загрузить комментарии');
				}
			};

			fetchComments();
		} else {
			setError('Данные пользователя не найдены');
		}
	}, []);

	return (
		<div>
			<div className='header'>
				<button onClick={() => navigate(-1)} className='back-button'>
					<FontAwesomeIcon icon={faArrowLeft} size='lg' />
				</button>
				<h2>Ваши комментарии</h2>
			</div>
			{error && <p>{error}</p>}

			{comments.length > 0 ? (
				<div className='comments-user'>
					{comments.map(comment => (
						<div key={comment.reviewId} className='review-card'>
							<div className='review-header'>
								<div className='review-text-box'>
									<div className='review-rating'>
										{[...Array(5)].map((_, i) => (
											<span
												key={i}
												className={i < comment.rating ? 'star filled' : 'star'}
											>
												★
											</span>
										))}
									</div>
									<h4 className='review-text'>{comment.comment}</h4>
								</div>
							</div>
							<p>Дата: {new Date(comment.reviewDate).toLocaleString()}</p>
							<p>Для тренера: {comment.trainer.fullName}</p>
						</div>
					))}
				</div>
			) : (
				<p>Нет комментариев для отображения.</p>
			)}
		</div>
	);
};

export default CommentsScreen;
