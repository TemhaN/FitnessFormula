import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../api/fitnessApi';

const LoginScreen = () => {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({ email: '', password: '' });
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false); // Добавляем состояние загрузки

	const handleChange = e => {
		const { name, value } = e.target;
		setFormData(prev => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async e => {
		e.preventDefault();
		if (!formData.email || !formData.password) {
			setError('Пожалуйста, заполните все поля');
			return;
		}

		setError(''); // Сбрасываем предыдущую ошибку
		setLoading(true); // Показываем, что идёт загрузка

		try {
			const data = await loginUser(formData);
			if (!data || !data.user) {
				throw new Error('Неверный ответ от сервера');
			}

			// Сохраняем данные пользователя в localStorage
			localStorage.setItem('userData', JSON.stringify(data));

			// Предполагаем, что fullName находится в data.user.fullName
			alert(`Добро пожаловать, ${data.user.fullName || 'пользователь'}`);
			navigate('/home');
		} catch (err) {
			setError(err.message || 'Неверный email или пароль');
			console.error('Ошибка входа:', err);
		} finally {
			setLoading(false); // Сбрасываем состояние загрузки
		}
	};

	const goToRegister = () => {
		navigate('/register');
	};

	return (
		<div className='login-container'>
			<h2 className='login-title'>Войти</h2>
			{error && <p className='error-message'>{error}</p>}
			<form onSubmit={handleSubmit} className='login-form'>
				<div className='login-box'>
					<div className='input-label'>
						<p>Email</p>
						<input
							type='email'
							name='email'
							value={formData.email} // Привязываем значение
							onChange={handleChange}
							className='input-field'
							disabled={loading} // Блокируем при загрузке
							placeholder='Введите email'
						/>
					</div>
					<div className='input-label'>
						<p>Пароль</p>
						<input
							type='password'
							name='password'
							value={formData.password} // Привязываем значение
							onChange={handleChange}
							className='input-field'
							disabled={loading} // Блокируем при загрузке
							placeholder='Введите пароль'
						/>
					</div>
				</div>
				<button
					type='submit'
					className='submit-button'
					disabled={loading} // Блокируем кнопку при загрузке
				>
					{loading ? 'Вход...' : 'Войти'}
				</button>
			</form>
			<button
				onClick={goToRegister}
				className='register-button'
				disabled={loading} // Блокируем при загрузке
			>
				Нет аккаунта? <span>Зарегистрироваться</span>
			</button>
		</div>
	);
};

export default LoginScreen;
