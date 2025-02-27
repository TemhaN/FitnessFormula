import React, { useState } from 'react';
import { loginUser } from '../api/fitnessApi';
import { useNavigate } from 'react-router-dom';

const LoginScreen = () => {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({ email: '', password: '' });
	const [error, setError] = useState('');

	const handleChange = e => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleSubmit = async e => {
		e.preventDefault();
		try {
			const data = await loginUser(formData);
			// Сохраняем данные пользователя в localStorage
			localStorage.setItem('userData', JSON.stringify(data));

			alert('Добро пожаловать, ' + data.fullName);
			navigate('/home'); // Переход на главный экран
		} catch (err) {
			setError(err.message || 'Неверный email или пароль');
		}
	};

	// Переход на экран регистрации
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
							onChange={handleChange}
							className='input-field'
						/>
					</div>
					<div className='input-label'>
						<p>Пароль</p>
						<input
							type='password'
							name='password'
							onChange={handleChange}
							className='input-field'
						/>
					</div>
				</div>
				<button type='submit' className='submit-button'>
					Войти
				</button>
			</form>
			<button onClick={goToRegister} className='register-button'>
				Нет аккаунта? <span>Зарегистрироваться</span>
			</button>
		</div>
	);
};

export default LoginScreen;
