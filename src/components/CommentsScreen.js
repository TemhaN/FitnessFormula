import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const CommentsScreen = () => {
	const [comments, setComments] = useState([]);
	const [error, setError] = useState('');
	const navigate = useNavigate(); // Используем useNavigate

	useEffect(() => {
		// Загружаем данные пользователя из localStorage
		const userData = JSON.parse(localStorage.getItem('userData'));

		if (userData && userData.user.userId) {
			const userId = userData.user.userId; // Извлекаем userId из userData

			const commentsUrl = `https://localhost:7149/api/Reviews/user/${userId}`;
			axios
				.get(commentsUrl)
				.then(response => {
					setComments(response.data); // Сохраняем отзывы
				})
				.catch(err => {
					console.error('Error fetching reviews:', err);
					// setError('Не удалось загрузить комментарии');
				});
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

			{/* Отображаем комментарии */}
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
