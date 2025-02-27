import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../api/fitnessApi'; // Импортируем функцию регистрации

const RegisterScreen = () => {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		fullName: '',
		email: '',
		phoneNumber: '',
		password: '',
		role: 'user', // Стандартно — обычный пользователь
	});
	const [error, setError] = useState('');
	const [userData, setUserData] = useState(null); // Для хранения данных о пользователе

	// Извлекаем данные пользователя из localStorage при загрузке компонента
	useEffect(() => {
		const storedUserData = JSON.parse(localStorage.getItem('userData'));
		if (storedUserData) {
			setUserData(storedUserData);
		}
	}, []);

	const handleChange = e => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleSubmit = async e => {
		e.preventDefault();

		// Проверка на пустые поля
		if (
			!formData.fullName ||
			!formData.email ||
			!formData.phoneNumber ||
			!formData.password
		) {
			setError('Пожалуйста, заполните все поля');
			return;
		}

		try {
			if (formData.role === 'trainer') {
				// Для тренера передаем данные на следующий экран
				navigate('/trainer-description', { state: formData });
			} else {
				// Для обычного пользователя отправляем данные на сервер
				const data = await registerUser(formData);

				// Сохраняем данные пользователя в localStorage
				localStorage.setItem('userData', JSON.stringify(data));

				alert('Пользователь зарегистрирован');
				navigate('/home'); // Переход на главный экран
			}
		} catch (err) {
			setError(err.message || 'Что-то пошло не так');
		}
	};

	const handleRoleChange = e => {
		setFormData({ ...formData, role: e.target.value });
	};

	return (
		<div className='login-container'>
			<h2 className='login-title'>Создать Аккаунт</h2>
			{error && <p className='error-message'>{error}</p>}
			<form onSubmit={handleSubmit} className='login-form'>
				<div className='login-box'>
					<div className='input-label'>
						<p>Имя</p>
						<input
							type='text'
							name='fullName'
							onChange={handleChange}
							value={formData.fullName}
							className='input-field'
						/>
					</div>
					<div className='input-label'>
						<p>Email</p>
						<input
							type='email'
							name='email'
							onChange={handleChange}
							value={formData.email}
							className='input-field'
						/>
					</div>
					<div className='input-label'>
						<p>Телефон</p>
						<input
							type='tel'
							name='phoneNumber'
							onChange={handleChange}
							value={formData.phoneNumber}
							className='input-field'
						/>
					</div>
					<div className='input-label'>
						<p>Пароль</p>
						<input
							type='password'
							name='password'
							onChange={handleChange}
							value={formData.password}
							className='input-field'
						/>
					</div>

					<div className='role-switcher-container'>
						<p className='role-switcher-label'>Выберите роль</p>
						<div className='role-switcher'>
							<div
								className={`role-option ${
									formData.role === 'user' ? 'active' : ''
								}`}
								onClick={() => handleRoleChange({ target: { value: 'user' } })}
							>
								Обычный пользователь
							</div>
							<div
								className={`role-option ${
									formData.role === 'trainer' ? 'active' : ''
								}`}
								onClick={() =>
									handleRoleChange({ target: { value: 'trainer' } })
								}
							>
								Тренер
							</div>
						</div>
					</div>
				</div>
				<button type='submit' className='submit-button'>
					Зарегистрироваться
				</button>
			</form>

			{/* Кнопка для перехода на экран входа */}
			<button onClick={() => navigate('/login')} className='register-button'>
				Уже есть аккаунт? <span>Войти</span>
			</button>
		</div>
	);
};

export default RegisterScreen;
