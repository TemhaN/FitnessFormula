import axios from 'axios';

// const API_URL = 'https://localhost:7149/api';

const API_URL = 'https://localhost:7149/api';

// Функция для входа пользователя
export const loginUser = async formData => {
	try {
		console.log('Отправляем данные на сервер:', formData); // Логируем данные
		const response = await axios.post(`${API_URL}/Accounts/login`, formData);
		console.log('Ответ от сервера:', response.data); // Логируем ответ
		return response.data;
	} catch (error) {
		console.error('Ошибка при отправке запроса:', error); // Логируем ошибку
		throw error.response?.data || 'Ошибка при входе';
	}
};

// Функция для регистрации пользователя
export const registerUser = async formData => {
	try {
		console.log('Отправляем данные на сервер для регистрации:', formData); // Логируем данные
		const response = await axios.post(`${API_URL}/Accounts/register`, formData);
		console.log('Ответ от сервера при регистрации:', response.data); // Логируем ответ
		return response.data;
	} catch (error) {
		console.error('Ошибка при отправке запроса на регистрацию:', error); // Логируем ошибку
		throw error.response?.data || 'Ошибка при регистрации';
	}
};

// Функция для получения данных пользователя по ID
export const getUserById = async id => {
	try {
		const response = await axios.get(`${API_URL}/Accounts/${id}`);
		return response.data;
	} catch (error) {
		console.error('Ошибка при получении данных пользователя:', error); // Логируем ошибку
		throw error.response?.data || 'Ошибка при получении данных пользователя';
	}
};

// Функция для получения списка скилов
export const getSkills = async () => {
	try {
		const response = await axios.get(`${API_URL}/Skills`);
		return response.data;
	} catch (error) {
		console.error('Ошибка при получении скилов:', error); // Логируем ошибку
		throw error.response?.data || 'Ошибка при получении скилов';
	}
};

// Функция для регистрации тренера
export const registerTrainer = async trainerData => {
	try {
		const response = await axios.post(`${API_URL}/Trainers`, trainerData);
		return response.data;
	} catch (error) {
		console.error('Ошибка при регистрации тренера:', error); // Логируем ошибку
		throw error.response?.data || 'Ошибка при регистрации тренера';
	}
};
// Функция для получения списка тренировок
export const getWorkouts = async () => {
	try {
		const response = await axios.get(`${API_URL}/Workouts`, {
			headers: {
				accept: 'application/json',
			},
		});
		return response.data; // возвращаем данные о тренировках
	} catch (error) {
		console.error('Ошибка при получении тренировок:', error);
		throw error.response?.data || 'Ошибка при получении тренировок';
	}
};
// Функция для получения списка тренеров
export const getTrainers = async () => {
	try {
		const response = await axios.get(`${API_URL}/Trainers`, {
			headers: {
				accept: 'text/plain',
			},
		});
		return response.data; // возвращаем данные о тренерах
	} catch (error) {
		console.error('Ошибка при получении тренеров:', error);
		throw error.response?.data || 'Ошибка при получении тренеров';
	}
};
