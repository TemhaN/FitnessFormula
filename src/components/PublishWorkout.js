import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { publishWorkout, getGyms } from '../api/fitnessApi';

const PublishWorkout = () => {
	const navigate = useNavigate();
	const [title, setTitle] = useState('');
	const [startTime, setStartTime] = useState('');
	const [description, setDescription] = useState('');
	const [imageFile, setImageFile] = useState(null);
	const [gymId, setGymId] = useState('');
	const [maxParticipants, setMaxParticipants] = useState('');
	const [gyms, setGyms] = useState([]);
	const [error, setError] = useState('');
	const [successMessage, setSuccessMessage] = useState('');
	const [loading, setLoading] = useState(false);

	const storedTrainerData = JSON.parse(localStorage.getItem('trainerData'));
	const trainerId = storedTrainerData ? storedTrainerData.trainerId : null;

	// Загрузка списка спортзалов при монтировании компонента
	useEffect(() => {
		const fetchGyms = async () => {
			try {
				const gymsData = await getGyms();
				setGyms(gymsData);
			} catch (err) {
				setError('Не удалось загрузить список спортзалов.');
				console.error('Ошибка при загрузке спортзалов:', err);
			}
		};

		fetchGyms();
	}, []);

	const handleSubmit = async e => {
		e.preventDefault();

		if (
			!title ||
			!startTime ||
			!description ||
			!imageFile ||
			!trainerId ||
			!gymId ||
			!maxParticipants
		) {
			setError('Пожалуйста, заполните все поля.');
			return;
		}

		if (maxParticipants <= 0) {
			setError('Максимальное количество участников должно быть больше 0.');
			return;
		}

		setError('');
		setLoading(true);

		const formData = new FormData();
		formData.append('Title', title);
		formData.append('StartTime', startTime);
		formData.append('Description', description);
		formData.append('TrainerId', trainerId);
		formData.append('ImageFile', imageFile);
		formData.append('GymId', gymId);
		formData.append('MaxParticipants', maxParticipants);

		try {
			await publishWorkout(formData);

			setSuccessMessage('Тренировка успешно опубликована!');
			setError('');
			navigate('/user');
		} catch (err) {
			setError(
				err.message || 'Не удалось опубликовать тренировку. Попробуйте снова.'
			);
			console.error('Ошибка при публикации тренировки:', err);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div>
			<div className='header'>
				<button
					onClick={() => navigate(-1)}
					className='back-button'
					disabled={loading}
				>
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
						disabled={loading}
						placeholder='Введите название'
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
						disabled={loading}
					/>
				</div>
				<div className='form-group'>
					<label htmlFor='description'>Описание:</label>
					<textarea
						id='description'
						value={description}
						onChange={e => setDescription(e.target.value)}
						className='textarea'
						disabled={loading}
						placeholder='Опишите тренировку'
					/>
				</div>
				<div className='form-group'>
					<label htmlFor='gymId'>Спортзал:</label>
					<select
						id='gymId'
						value={gymId}
						onChange={e => setGymId(e.target.value)}
						className='input'
						disabled={loading}
					>
						<option value=''>Выберите спортзал</option>
						{gyms.map(gym => (
							<option key={gym.gymId} value={gym.gymId}>
								{gym.gymName} ({gym.address})
							</option>
						))}
					</select>
				</div>
				<div className='form-group'>
					<label htmlFor='maxParticipants'>
						Максимальное количество участников:
					</label>
					<input
						type='number'
						id='maxParticipants'
						value={maxParticipants}
						onChange={e => setMaxParticipants(e.target.value)}
						className='input'
						disabled={loading}
						placeholder='Введите число'
						min='1'
					/>
				</div>
				<div className='form-group'>
					<label htmlFor='imageFile'>Изображение:</label>
					<input
						type='file'
						id='imageFile'
						onChange={e => setImageFile(e.target.files[0])}
						className='input'
						accept='image/*'
						disabled={loading}
					/>
				</div>

				{error && <p className='error'>{error}</p>}
				{successMessage && <p className='success'>{successMessage}</p>}

				<button
					type='submit'
					className='publish-submit-button submit-button'
					disabled={loading}
				>
					{loading ? 'Публикация...' : 'Опубликовать тренировку'}
				</button>
			</form>
		</div>
	);
};

export default PublishWorkout;
