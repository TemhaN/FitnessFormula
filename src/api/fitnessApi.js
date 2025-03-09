import axios from 'axios';

const API_URL = 'https://localhost:7149/api';

// Функция для входа пользователя
export const loginUser = async formData => {
	try {
		console.log('Отправляем данные на сервер:', formData);
		const response = await axios.post(`${API_URL}/Accounts/login`, formData);
		console.log('Ответ от сервера:', response.data);
		return response.data;
	} catch (error) {
		console.error('Ошибка при отправке запроса:', error);
		throw error.response?.data || 'Ошибка при входе';
	}
};

// Функция для регистрации пользователя
export const registerUser = async formData => {
	try {
		console.log('Отправляем данные на сервер для регистрации:', formData);
		const response = await axios.post(`${API_URL}/Accounts/register`, formData);
		console.log('Ответ от сервера при регистрации:', response.data);
		return response.data;
	} catch (error) {
		console.error('Ошибка при отправке запроса на регистрацию:', error);
		throw error.response?.data || 'Ошибка при регистрации';
	}
};

// Функция для получения данных пользователя по ID
export const getUserById = async id => {
	try {
		const response = await axios.get(`${API_URL}/Accounts/${id}`);
		return response.data;
	} catch (error) {
		console.error('Ошибка при получении данных пользователя:', error);
		throw error.response?.data || 'Ошибка при получении данных пользователя';
	}
};

// Функция для получения списка скилов
export const getSkills = async () => {
	try {
		const response = await axios.get(`${API_URL}/Skills`);
		return response.data;
	} catch (error) {
		console.error('Ошибка при получении скилов:', error);
		throw error.response?.data || 'Ошибка при получении скилов';
	}
};

// Функция для регистрации тренера
export const registerTrainer = async trainerData => {
	try {
		const response = await axios.post(`${API_URL}/Trainers`, trainerData);
		return response.data;
	} catch (error) {
		console.error('Ошибка при регистрации тренера:', error);
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
		return response.data;
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
		return response.data;
	} catch (error) {
		console.error('Ошибка при получении тренеров:', error);
		throw error.response?.data || 'Ошибка при получении тренеров';
	}
};

// Функция для получения отзывов пользователя
export const getUserReviews = async userId => {
	try {
		const response = await axios.get(`${API_URL}/Reviews/user/${userId}`, {
			headers: {
				accept: 'application/json',
			},
		});
		return response.data;
	} catch (error) {
		console.error('Ошибка при получении отзывов пользователя:', error);
		throw error.response?.data || 'Ошибка при получении отзывов';
	}
};

// Функция для обновления профиля пользователя
export const updateUserProfile = async (userId, formData) => {
	try {
		const response = await axios.put(
			`${API_URL}/Accounts/update/${userId}`,
			formData,
			{
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			}
		);
		console.log('Ответ от сервера при обновлении профиля:', response.data);
		return response.data;
	} catch (error) {
		console.error('Ошибка при обновлении профиля:', error);
		throw error.response?.data || 'Ошибка при обновлении профиля';
	}
};
// Функция для публикации занятия
export const publishWorkout = async formData => {
	try {
		const response = await axios.post(`${API_URL}/Workouts`, formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		});
		console.log('Ответ от сервера при публикации тренировки:', response.data);
		return response.data;
	} catch (error) {
		console.error('Ошибка при публикации тренировки:', error);
		throw error.response?.data || 'Ошибка при публикации тренировки';
	}
};
// Функция для получения тренера по айди
export const getTrainerById = async trainerId => {
	try {
		const response = await axios.get(`${API_URL}/Trainers/${trainerId}`);
		return response.data;
	} catch (error) {
		console.error('Ошибка при получении данных тренера:', error);
		throw error.response?.data || 'Ошибка при получении данных тренера';
	}
};

// Получение тренировок тренера
export const getTrainerWorkouts = async trainerId => {
	try {
		const response = await axios.get(`${API_URL}/Workouts/trainer/${trainerId}`);
		console.log(`Workouts response for trainer ${trainerId}:`, response.data);
		return response.data || [];
	} catch (error) {
		console.error(`Ошибка при получении тренировок тренера ${trainerId}:`, error);
		return []; // Возвращаем пустой массив при ошибке
	}
};

// Получение отзывов тренера
export const getTrainerReviews = async trainerId => {
	try {
		const response = await axios.get(`${API_URL}/Reviews/trainer/${trainerId}`);
		console.log(`Reviews response for trainer ${trainerId}:`, response.data);
		return response.data || [];
	} catch (error) {
		console.error(`Ошибка при получении отзывов тренера ${trainerId}:`, error);
		return []; // Возвращаем пустой массив при ошибке
	}
};

// Отправка нового отзыва
export const postReview = async reviewData => {
	try {
		const response = await axios.post(`${API_URL}/Reviews`, reviewData, {
			headers: {
				'Content-Type': 'application/json',
			},
		});
		return response.data;
	} catch (error) {
		console.error('Ошибка при отправке отзыва:', error);
		throw error.response?.data || 'Ошибка при отправке отзыва';
	}
};

// Получение данных тренера по userId
export const getTrainerByUserId = async userId => {
	try {
		const response = await axios.get(`${API_URL}/Trainers/user/${userId}`);
		return response.data;
	} catch (error) {
		console.error('Ошибка при получении данных тренера:', error);
		// Не бросаем ошибку, если тренер не найден, возвращаем null
		return null;
	}
};

// Функция для получения всех занятий на которые подписан пользователь
export const getUserWorkoutRegistrations = async userId => {
	try {
		const response = await axios.get(
			`${API_URL}/WorkoutRegistrations/user/${userId}`
		);
		return response.data;
	} catch (error) {
		console.error('Ошибка при получении зарегистрированных занятий:', error);
		throw error.response?.data || 'Ошибка при получении занятий';
	}
};
// Получение информации о тренировке по ID
export const getWorkoutById = async workoutId => {
	try {
		const response = await axios.get(`${API_URL}/Workouts/${workoutId}`);
		return response.data;
	} catch (error) {
		console.error('Ошибка при получении данных тренировки:', error);
		throw error.response?.data || 'Ошибка при получении данных тренировки';
	}
};

// Регистрация пользователя на тренировку
export const registerForWorkout = async (userId, workoutId) => {
	try {
		const response = await axios.post(
			`${API_URL}/WorkoutRegistrations?userId=${userId}&workoutId=${workoutId}`
		);
		return response.data;
	} catch (error) {
		console.error('Ошибка при регистрации на тренировку:', error);
		throw error.response?.data || 'Ошибка при регистрации на тренировку';
	}
};
