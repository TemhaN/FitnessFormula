import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../api/fitnessApi';

const RegisterScreen = () => {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		fullName: '',
		email: '',
		phoneNumber: '',
		password: '',
		role: 'user', // По умолчанию — обычный пользователь
	});
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false); // Добавляем состояние загрузки

	// Проверяем, авторизован ли пользователь, чтобы перенаправить его
	useEffect(() => {
		const storedUserData = JSON.parse(localStorage.getItem('userData'));
		if (storedUserData) {
			navigate('/home'); // Если пользователь уже авторизован, перенаправляем
		}
	}, [navigate]);

	const handleChange = e => {
		const { name, value } = e.target;
		setFormData(prev => ({ ...prev, [name]: value }));
	};

	const handleRoleChange = role => {
		setFormData(prev => ({ ...prev, role }));
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

		setError(''); // Сбрасываем ошибку
		setLoading(true); // Показываем загрузку

		try {
			if (formData.role === 'trainer') {
				// Для тренера передаём данные на следующий экран
				navigate('/trainer-description', { state: formData });
			} else {
				// Для обычного пользователя регистрируем через API
				const data = await registerUser(formData);
				if (!data) {
					throw new Error('Неверный ответ от сервера');
				}

				// Сохраняем данные пользователя в localStorage
				localStorage.setItem('userData', JSON.stringify(data));

				alert(`Пользователь ${data.user?.fullName || 'зарегистрирован'}`);
				navigate('/home');
			}
		} catch (err) {
			setError(err.message || 'Ошибка при регистрации. Попробуйте снова.');
			console.error('Ошибка регистрации:', err);
		} finally {
			setLoading(false); // Сбрасываем состояние загрузки
		}
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
							disabled={loading}
							placeholder='Введите имя'
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
							disabled={loading}
							placeholder='Введите email'
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
							disabled={loading}
							placeholder='Введите номер телефона'
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
							disabled={loading}
							placeholder='Введите пароль'
						/>
					</div>

					<div className='role-switcher-container'>
						<p className='role-switcher-label'>Выберите роль</p>
						<div className='role-switcher'>
							<div
								className={`role-option ${
									formData.role === 'user' ? 'active' : ''
								}`}
								onClick={() => handleRoleChange('user')}
							>
								Обычный пользователь
							</div>
							<div
								className={`role-option ${
									formData.role === 'trainer' ? 'active' : ''
								}`}
								onClick={() => handleRoleChange('trainer')}
							>
								Тренер
							</div>
						</div>
					</div>
				</div>
				<button type='submit' className='submit-button' disabled={loading}>
					{loading ? 'Регистрация...' : 'Зарегистрироваться'}
				</button>
			</form>

			<button
				onClick={() => navigate('/login')}
				className='register-button'
				disabled={loading}
			>
				Уже есть аккаунт? <span>Войти</span>
			</button>
		</div>
	);
};

export default RegisterScreen;
