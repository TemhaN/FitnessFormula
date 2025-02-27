import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const PublishWorkout = () => {
	const navigate = useNavigate();
	const [title, setTitle] = useState('');
	const [startTime, setStartTime] = useState('');
	const [description, setDescription] = useState('');
	const [imageUrl, setImageUrl] = useState('');
	const [error, setError] = useState('');
	const [successMessage, setSuccessMessage] = useState('');

	// Получаем данные тренера из trainerData
	const storedTrainerData = JSON.parse(localStorage.getItem('trainerData'));
	const trainerId = storedTrainerData ? storedTrainerData.trainerId : null;
	console.log(storedTrainerData);
	const handleSubmit = e => {
		e.preventDefault();

		if (!title || !startTime || !description || !imageUrl || !trainerId) {
			setError('Пожалуйста, заполните все поля.');
			return;
		}

		const workoutData = {
			title,
			startTime,
			description,
			trainerId,
			imageUrl,
		};

		axios
			.post('https://192.168.8.158:7113/api/Workouts', workoutData)
			.then(response => {
				setSuccessMessage('Тренировка успешно опубликована!');
				setError('');
				navigate('/user');
			})
			.catch(err => {
				console.error('Ошибка при публикации тренировки:', err);
				setError('Не удалось опубликовать тренировку. Попробуйте снова.');
			});
	};

	return (
		<div>
			<div className='header'>
				<button onClick={() => navigate(-1)} className='back-button'>
					<FontAwesomeIcon icon={faArrowLeft} size='lg' />
				</button>
				<h2>Публикация тренировки</h2>
			</div>

			<form onSubmit={handleSubmit} className='publish-form'>
				<div className='form-group'>
					<label htmlFor='title'>Название тренировки:</label>
					<input
						type='text'
						id='title'
						value={title}
						onChange={e => setTitle(e.target.value)}
						className='input'
					/>
				</div>
				<div className='form-group'>
					<label htmlFor='startTime'>Дата и время начала:</label>
					<input
						type='datetime-local'
						id='startTime'
						value={startTime}
						onChange={e => setStartTime(e.target.value)}
						className='input'
					/>
				</div>
				<div className='form-group'>
					<label htmlFor='description'>Описание:</label>
					<textarea
						id='description'
						value={description}
						onChange={e => setDescription(e.target.value)}
						className='textarea'
					/>
				</div>
				<div className='form-group'>
					<label htmlFor='imageUrl'>Ссылка на изображение:</label>
					<input
						type='text'
						id='imageUrl'
						value={imageUrl}
						onChange={e => setImageUrl(e.target.value)}
						className='input'
					/>
				</div>

				{error && <p className='error'>{error}</p>}
				{successMessage && <p className='success'>{successMessage}</p>}

				<button type='submit' className='publish-submit-button submit-button'>
					Опубликовать тренировку
				</button>
			</form>
		</div>
	);
};

export default PublishWorkout;
