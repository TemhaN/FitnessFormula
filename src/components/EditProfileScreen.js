import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const EditProfileScreen = () => {
	const navigate = useNavigate();
	const [userData, setUserData] = useState(null);
	const [fullName, setFullName] = useState('');
	const [email, setEmail] = useState('');
	const [phoneNumber, setPhoneNumber] = useState('');
	const [avatar, setAvatar] = useState('');
	const [avatarFile, setAvatarFile] = useState(null);
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
		setFullName(parsedUserData.user.fullName);
		setEmail(parsedUserData.user.email);
		setPhoneNumber(parsedUserData.user.phoneNumber || '');
		setAvatar(parsedUserData.user.avatar || '');
	}, [navigate]);

	const handleAvatarChange = e => {
		const file = e.target.files[0];
		if (file) {
			setAvatarFile(file);
			setAvatar(URL.createObjectURL(file)); // Показываем превью
		}
	};

	const handleSave = async () => {
		if (!userData) return;

		try {
			const formData = new FormData();
			formData.append('FullName', fullName);
			formData.append('Email', email);
			formData.append('PhoneNumber', phoneNumber);
			if (avatarFile) {
				formData.append('AvatarFile', avatarFile);
			}

			const response = await axios.put(
				`https://localhost:7149/api/Accounts/update/${userData.user.userId}`,
				formData,
				{ headers: { 'Content-Type': 'multipart/form-data' } }
			);

			if (!response.data) throw new Error('Ошибка обновления данных');

			// Сохраняем токен перед обновлением userData
			const currentToken = userData.token;

			// Обновляем userData, но сохраняем токен
			const updatedUser = {
				user: response.data.user,
				token: currentToken, // Восстанавливаем токен
			};

			setUserData(updatedUser);
			localStorage.setItem('userData', JSON.stringify(updatedUser));

			navigate('/user');
		} catch (err) {
			setError('Не удалось обновить профиль. Попробуйте еще раз.');
			console.error('Ошибка при обновлении профиля:', err);
		}
	};

	return (
		<div className='user'>
			<div className='header'>
				<button onClick={() => navigate(-1)} className='back-button'>
					<FontAwesomeIcon icon={faArrowLeft} size='lg' />
				</button>
				<h2>Редактирование профиля</h2>
			</div>
			<div className='login-form'>
				{error && <p className='error-text'>{error}</p>}

				<div className='edit-profile-form'>
					<div className='input-label'>
						<label>Имя</label>
						<input
							type='text'
							value={fullName}
							onChange={e => setFullName(e.target.value)}
							className='input-field'
						/>
					</div>
					<div className='input-label'>
						<label>Email</label>
						<input
							type='email'
							value={email}
							onChange={e => setEmail(e.target.value)}
							className='input-field'
						/>
					</div>
					<div className='input-label'>
						<label>Телефон</label>
						<input
							type='text'
							value={phoneNumber}
							onChange={e => setPhoneNumber(e.target.value)}
							className='input-field'
						/>
					</div>
					<div className='avatar-section input-label mt-2'>
						<label className='mt-2'>Аватар</label>
						{avatar && <img src={avatar} className='avatar-preview' />}
						<input
							type='file'
							accept='image/*'
							onChange={handleAvatarChange}
							className='file-input'
						/>
					</div>
					<div className='height-box'></div>
					<div className='button-group'>
						<button onClick={handleSave} className='submit-button'>
							Сохранить
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default EditProfileScreen;
