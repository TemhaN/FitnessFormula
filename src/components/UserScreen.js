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
		if (!parsedUserData || !parsedUserData.user?.userId) {
			navigate('/');
			return;
		}

		setUserData(parsedUserData);

		const storedTrainerData = JSON.parse(localStorage.getItem('trainerData'));

		if (
			storedTrainerData &&
			storedTrainerData.userId === parsedUserData.user.userId
		) {
			setTrainerData(storedTrainerData);
		} else {
			fetchTrainerData(parsedUserData.user.userId);
		}
	}, [navigate]);

	const fetchTrainerData = async userId => {
		if (!userId) return;
		try {
			const response = await axios.get(
				`https://192.168.8.158:7113/api/Trainers/user/${userId}`
			);
			setTrainerData(response.data);
			localStorage.setItem('trainerData', JSON.stringify(response.data));
		} catch (err) {
			setError('Не удалось загрузить данные тренера');
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
							userData.user.avatar || '/images/Profile_avatar_placeholder.png'
						}
						alt='Avatar'
						className='avatar'
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
				<button onClick={() => navigate('/settings')} className='user-button'>
					Настройки
				</button>
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
