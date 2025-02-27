import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const TrainerDescription = () => {
	const navigate = useNavigate();
	const { state } = useLocation(); // Получаем данные, переданные из RegisterScreen

	const [formData, setFormData] = useState({
		user: {
			fullName: state.fullName,
			email: state.email,
			phoneNumber: state.phoneNumber,
			password: state.password,
			avatar: state.avatar,
		},
		description: '',
		experienceYears: 0,
	});

	const [error, setError] = useState('');

	const handleChange = e => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleSubmit = async e => {
		e.preventDefault();
		try {
			// Сохраняем данные о пользователе в localStorage
			const userData = {
				fullName: formData.fullName,
				email: formData.email,
				phoneNumber: formData.phoneNumber,
				password: formData.password,
				avatar: formData.avatar,
			};

			localStorage.setItem('userData', JSON.stringify(userData));

			// Переход на экран выбора скилов
			navigate('/trainer-skills', { state: formData });
		} catch (err) {
			setError(err.message || 'Что-то пошло не так');
		}
	};

	return (
		<div className='trainer-container'>
			<div className='trainer-description-box'>
				<h2 className='trainer-description-title'>
					Введите информацию о тренере
				</h2>
				{error && <p className='error-message'>{error}</p>}
				<form onSubmit={handleSubmit} className='trainer-description-form'>
					<div className='input-container'>
						<textarea
							name='description'
							placeholder='Ваше описание тренера'
							onChange={handleChange}
							className='input-field description-input'
							value={formData.description}
						/>
					</div>
					<p className='text-align-center'>Ваш стаж опыта</p>
					<div className='experience-container'>
						<button
							type='button'
							className='experience-button'
							onClick={() =>
								setFormData({
									...formData,
									experienceYears: Math.max(formData.experienceYears - 1, 0),
								})
							}
						>
							-
						</button>
						<span className='experience-number'>
							{formData.experienceYears}
						</span>
						<button
							type='button'
							className='experience-button'
							onClick={() =>
								setFormData({
									...formData,
									experienceYears: formData.experienceYears + 1,
								})
							}
						>
							+
						</button>
					</div>
					<button type='submit' className='submit-button'>
						Далее
					</button>
				</form>
			</div>
		</div>
	);
};

export default TrainerDescription;
