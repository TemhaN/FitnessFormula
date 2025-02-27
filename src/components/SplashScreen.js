import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Импортируем useNavigate
import '../SplashScreen.css'; // Импортируем внешний CSS файл

const SplashScreen = () => {
	const navigate = useNavigate();

	useEffect(() => {
		const timer = setTimeout(() => {
			console.log('Переход на страницу входа...');
			navigate('/login'); // Переход на экран входа
		}, 1000); // Задержка 1 секунд

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
