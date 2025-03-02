import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faUser } from '@fortawesome/free-solid-svg-icons';

const UserScreen = () => {
	const navigate = useNavigate();
	const [userData, setUserData] = useState(null);
	const [trainerData, setTrainerData] = useState(null);
	const [error, setError] = useState('');

	useEffect(() => {
		const storedUserData = localStorage.getItem('userData');
		if (!storedUserData) {
			navigate('/');
			return;
		}

		const parsedUserData = JSON.parse(storedUserData);
		if (!parsedUserData?.user?.userId) {
			navigate('/');
			return;
		}

		setUserData(parsedUserData);

		const storedTrainerData = JSON.parse(localStorage.getItem('trainerData'));

		if (storedTrainerData?.userId === parsedUserData.user.userId) {
			setTrainerData(storedTrainerData);
		} else {
			fetchTrainerData(parsedUserData.user.userId);
		}

		const interval = setInterval(() => {
			checkForUpdates(parsedUserData.user.userId);
		}, 3000); // Проверяем каждые 30 секунд

		return () => clearInterval(interval);
	}, [navigate]);

	const fetchTrainerData = async userId => {
		try {
			const response = await axios.get(
				`https://localhost:7149/api/Trainers/user/${userId}`
			);
			if (!response.data) throw new Error('Тренер не найден');

			setTrainerData(response.data);
			localStorage.setItem('trainerData', JSON.stringify(response.data));
		} catch (err) {
			console.error('Ошибка загрузки тренера:', err);
		}
	};

	const checkForUpdates = async userId => {
		try {
			const userResponse = await axios.get(
				`https://localhost:7149/api/Accounts/${userId}`
			);
			if (!userResponse.data) throw new Error('Пользователь не найден');

			const updatedUserData = userResponse.data;

			if (
				updatedUserData.fullName !== userData.user.fullName ||
				updatedUserData.email !== userData.user.email ||
				updatedUserData.avatar !== userData.user.avatar
			) {
				setUserData({ user: updatedUserData });
				localStorage.setItem(
					'userData',
					JSON.stringify({ user: updatedUserData })
				);
			}

			const trainerResponse = await axios.get(
				`https://localhost:7149/api/Trainers/user/${userId}`
			);
			if (!trainerResponse.data) throw new Error('Тренер не найден');

			const updatedTrainerData = trainerResponse.data;

			if (
				updatedTrainerData.description !== trainerData?.description ||
				updatedTrainerData.experienceYears !== trainerData?.experienceYears ||
				JSON.stringify(updatedTrainerData.skills) !==
					JSON.stringify(trainerData?.skills)
			) {
				setTrainerData(updatedTrainerData);
				localStorage.setItem('trainerData', JSON.stringify(updatedTrainerData));
			}
		} catch (error) {
			console.error('Ошибка при проверке обновлений:', error);
		}
	};

	const handleLogout = () => {
		localStorage.removeItem('userData');
		localStorage.removeItem('trainerData');
		navigate('/');
	};

	if (!userData) return <p>Загрузка...</p>;

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
						alt='User Avatar'
					/>

					<div className='profile-info'>
						<p className='profile-name'>{userData.user.fullName}</p>
						<p>{userData.user.email}</p>
						{trainerData && (
							<div className='trainer-info'>
								<h3>Информация о тренере</h3>
								<p>
									<strong>Описание:</strong> {trainerData.description}
								</p>
								<p>Опыт {trainerData.experienceYears} лет</p>
								<p>
									<strong>Скилы:</strong>{' '}
									{trainerData.skills
										?.map(skill => skill.skillName)
										.join(', ') || 'Нет данных'}
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
					Занятия на которые вы подписаны
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
