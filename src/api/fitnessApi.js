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
export const getWorkouts = async (filters = {}) => {
	try {
		const response = await axios.get(`${API_URL}/Workouts`, {
			params: filters,
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
		const response = await axios.get(
			`${API_URL}/Workouts/trainer/${trainerId}`
		);
		console.log(`Workouts response for trainer ${trainerId}:`, response.data);
		return response.data || [];
	} catch (error) {
		console.error(
			`Ошибка при получении тренировок тренера ${trainerId}:`,
			error
		);
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
// Функция для получения списка зарегистрированных пользователей на тренировку
export const getWorkoutRegistrations = async (workoutId, trainerId) => {
	try {
		const response = await axios.get(
			`${API_URL}/Workouts/${workoutId}/registrations/trainer/${trainerId}`
		);
		return response.data;
	} catch (error) {
		console.error('Ошибка при получении списка зарегистрированных:', error);
		throw (
			error.response?.data || 'Ошибка при получении списка зарегистрированных'
		);
	}
};

// Функция для удаления регистрации на тренировку
export const unregisterFromWorkout = async (registrationId, userId) => {
	const response = await fetch(
		`${API_URL}/WorkoutRegistrations/${registrationId}/user/${userId}`,
		{
			method: 'DELETE',
		}
	);
	if (!response.ok) {
		throw new Error('Ошибка при отмене регистрации');
	}
	return response.json();
};

// Функция для получения списка спортзалов
export const getGyms = async () => {
	const response = await fetch(`${API_URL}/Gyms`, {
		method: 'GET',
	});
	if (!response.ok) {
		throw new Error('Ошибка при загрузке списка спортзалов');
	}
	return response.json();
};

// Получение списка зарегистрированных пользователей для тренера-создателя
export const getWorkoutRegistrationsForTrainer = async (
	workoutId,
	trainerId
) => {
	try {
		const response = await axios.get(
			`${API_URL}/WorkoutRegistrations/workout/${workoutId}/trainer/${trainerId}`
		);
		return response.data;
	} catch (error) {
		console.error('Ошибка при получении списка зарегистрированных:', error);
		throw (
			error.response?.data || 'Ошибка при получении списка зарегистрированных'
		);
	}
};

// Удаление пользователя с тренировки тренером
export const removeUserFromWorkout = async (workoutId, trainerId, userId) => {
	try {
		const response = await axios.delete(
			`${API_URL}/WorkoutRegistrations/workout/${workoutId}/trainer/${trainerId}/user/${userId}`
		);
		return response.data;
	} catch (error) {
		console.error('Ошибка при удалении пользователя с тренировки:', error);
		throw error.response?.data || 'Ошибка при удалении пользователя';
	}
};

// Функция для получения комментариев к тренировке
export const getWorkoutComments = async workoutId => {
	try {
		const response = await axios.get(
			`${API_URL}/WorkoutComments/workout/${workoutId}`
		);
		return response.data;
	} catch (error) {
		console.error('Ошибка при получении комментариев:', error);
		throw error.response?.data || 'Ошибка при получении комментариев';
	}
};

// Функция для отправки комментария к тренировке
export const postWorkoutComment = async commentData => {
	try {
		const response = await axios.post(
			`${API_URL}/WorkoutComments`,
			commentData
		);
		return response.data;
	} catch (error) {
		console.error('Ошибка при отправке комментария:', error);
		throw error.response?.data || 'Ошибка при отправке комментария';
	}
};

// Получение статистики тренера
export const getTrainerStatistics = async trainerId => {
	try {
		const response = await axios.get(
			`${API_URL}/Trainers/${trainerId}/statistics`
		);
		return response.data;
	} catch (error) {
		console.error('Error fetching trainer statistics:', error);
		throw error;
	}
};

// Получение уведомлений пользователя
export const getNotifications = async userId => {
	try {
		const response = await axios.get(`${API_URL}/Notifications/${userId}`);
		return response.data;
	} catch (error) {
		throw error;
	}
};

// Отметка уведомления как прочитанного
export const markNotificationAsRead = async (notificationId, userId) => {
	try {
		await axios.patch(
			`${API_URL}/Notifications/${notificationId}/read?userId=${userId}`,
			{}
		);
	} catch (error) {
		throw error;
	}
};

// Удаление уведомления
export const deleteNotification = async (notificationId, userId) => {
	try {
		await axios.delete(
			`${API_URL}/Notifications/${notificationId}?userId=${userId}`
		);
	} catch (error) {
		throw error;
	}
};

// Получение списка интересов пользователя
export const getUserInterests = async userId => {
	try {
		const response = await axios.get(`${API_URL}/Accounts/interests/${userId}`);
		return response.data;
	} catch (error) {
		throw error;
	}
};

// Получение списка недельных заданий для пользователя
export const getWeeklyChallenge = async userId => {
	try {
		const response = await axios.get(
			`${API_URL}/Accounts/weekly-challenge/${userId}`
		);
		return response.data;
	} catch (error) {
		throw error;
	}
};

// Обновление интересов пользователя
export const updateUserInterests = async (userId, skillIds) => {
	try {
		const response = await axios.post(
			`${API_URL}/Accounts/interests/${userId}`,
			skillIds
		);
		return response.data;
	} catch (error) {
		throw error;
	}
};

// Получение статистики пользователя
export const getUserStatistics = async userId => {
	try {
		const response = await axios.get(
			`${API_URL}/Accounts/statistics/${userId}`
		);
		console.log(`Statistics response for user ${userId}:`, response.data);
		return response.data;
	} catch (error) {
		console.error(
			`Ошибка при получении статистики пользователя ${userId}:`,
			error
		);
		throw (
			error.response?.data || 'Ошибка при получении статистики пользователя'
		);
	}
};
