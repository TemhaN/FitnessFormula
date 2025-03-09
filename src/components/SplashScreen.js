import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../SplashScreen.css'; // Импортируем внешний CSS файл

const SplashScreen = () => {
	const navigate = useNavigate();

	useEffect(() => {
		// Проверяем, авторизован ли пользователь
		const userData = JSON.parse(localStorage.getItem('userData'));
		const redirectPath = userData ? '/home' : '/login';
		const delay = 1000; // Задержка в миллисекундах (1 секунда)

		const timer = setTimeout(() => {
			console.log(`Переход на страницу: ${redirectPath}`);
			navigate(redirectPath); // Условный переход
		}, delay);

		// Очистка таймера при размонтировании компонента
		return () => clearTimeout(timer);
	}, [navigate]);

	return (
		<div className='splash-container'>
			<h1 className='splash-title'>
				Fitness
				<br />
				Formula
			</h1>
		</div>
	);
};

export default SplashScreen;
