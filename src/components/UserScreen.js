import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faUser } from '@fortawesome/free-solid-svg-icons';
import { getUserById, getTrainerByUserId } from '../api/fitnessApi';

const UserScreen = () => {
	const navigate = useNavigate();
	const [userData, setUserData] = useState(null);
	const [trainerData, setTrainerData] = useState(null);
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const initializeData = async () => {
			const storedUserData = localStorage.getItem('userData');
			if (!storedUserData) {
				navigate('/login');
				return;
			}

			const parsedUserData = JSON.parse(storedUserData);
			if (!parsedUserData?.user?.userId) {
				navigate('/login');
				return;
			}

			setUserData(parsedUserData);
			setLoading(true);

			// Встроенная функция fetchInitialData
			try {
				const [user, trainer] = await Promise.all([
					getUserById(parsedUserData.user.userId),
					getTrainerByUserId(parsedUserData.user.userId),
				]);

				if (user) {
					const newUserData = { ...parsedUserData, user };
					setUserData(newUserData);
					localStorage.setItem('userData', JSON.stringify(newUserData));
				}

				if (trainer) {
					setTrainerData(trainer);
					localStorage.setItem('trainerData', JSON.stringify(trainer));
				}
			} catch (err) {
				setError('Ошибка при загрузке данных');
				console.error('Ошибка загрузки данных:', err);
			} finally {
				setLoading(false);
			}
		};

		initializeData();
	}, [navigate]); // Зависимость только от navigate

	const handleLogout = () => {
		localStorage.removeItem('userData');
		localStorage.removeItem('trainerData');
		navigate('/login');
	};

	if (loading || !userData) return <p>Загрузка...</p>;

	return (
		<div className='user'>
			<div className='user-container'>
				<h2 className='user-text'>Профиль</h2>
				{error && <p className='error-text'>{error}</p>}
				<div className='profile'>
					<img
						src={
							userData?.user?.avatar
								? `https://localhost:7149/${userData.user.avatar}`
								: '/images/Profile_avatar_placeholder.png'
						}
						className='avatar'
						alt={userData?.user?.fullName || 'Аватар пользователя'}
						onError={e =>
							(e.target.src = '/images/Profile_avatar_placeholder.png')
						}
					/>
					<div className='profile-info'>
						<p className='profile-name'>
							{userData.user.fullName || 'Без имени'}
						</p>
						<p>{userData.user.email || 'Email не указан'}</p>
						{trainerData && (
							<div className='trainer-info'>
								<h3>Информация о тренере</h3>
								<p>
									<strong>Описание:</strong>{' '}
									{trainerData.description || 'Нет описания'}
								</p>
								<p>Опыт: {trainerData.experienceYears || 0} лет</p>
								<p>
									<strong>Навыки:</strong>{' '}
									{trainerData.skills
										?.map(skill => skill.skillName)
										.join(', ') || 'Нет навыков'}
								</p>
							</div>
						)}
					</div>
				</div>
			</div>

			<div className='buttons'>
				<button
					onClick={() => navigate('/edit-profile')}
					className='user-button'
				>
					Изменить профиль
				</button>
				<button onClick={() => navigate('/comments')} className='user-button'>
					Комментарии
				</button>
				<button
					onClick={() => navigate('/user/workoutregistration')}
					className='user-button'
				>
					Занятия, на которые вы подписаны
				</button>
				{trainerData && (
					<>
						<button
							onClick={() => navigate('/publish-workout')}
							className='user-button'
						>
							Публиковать занятия
						</button>
						<button
							onClick={() => navigate('/trainer/workouts')}
							className='user-button'
						>
							Ваши занятия
						</button>
					</>
				)}
				<button onClick={handleLogout} className='user-button'>
					Выйти
				</button>
			</div>

			<div className='bottom-bar'>
				<button onClick={() => navigate('/home')} className='bottom-bar-button'>
					<FontAwesomeIcon icon={faHouse} size='lg' />
				</button>
				<button onClick={() => navigate('/user')} className='bottom-bar-button'>
					<FontAwesomeIcon icon={faUser} size='lg' />
				</button>
			</div>
		</div>
	);
};

export default UserScreen;
