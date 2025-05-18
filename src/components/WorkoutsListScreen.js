import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
	getWorkouts,
	getGyms,
	getTrainers,
	getSkills,
} from '../api/fitnessApi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faSearch,
	faClock,
	faArrowLeft,
	faHouse,
	faUser,
	faFilter,
} from '@fortawesome/free-solid-svg-icons';

const WorkoutsListScreen = () => {
	const navigate = useNavigate();
	const [workouts, setWorkouts] = useState([]);
	const [gyms, setGyms] = useState([]);
	const [trainers, setTrainers] = useState([]);
	const [skills, setSkills] = useState([]);
	const [filters, setFilters] = useState({
		search: '',
		trainerId: '',
		gymId: '',
		startDate: '',
		skillId: '',
	});
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [showFilters, setShowFilters] = useState(false);

	useEffect(() => {
		const fetchInitialData = async () => {
			try {
				const [workoutsData, gymsData, trainersData, skillsData] =
					await Promise.all([
						getWorkouts(),
						getGyms(),
						getTrainers(),
						getSkills(),
					]);
				setWorkouts(workoutsData);
				setGyms(gymsData);
				setTrainers(trainersData);
				setSkills(skillsData);
			} catch (err) {
				setError('Не удалось загрузить данные. Попробуйте позже.');
			} finally {
				setLoading(false);
			}
		};
		fetchInitialData();
	}, []);

	const handleFilterChange = async e => {
		const { name, value } = e.target;
		const newFilters = { ...filters, [name]: value };
		setFilters(newFilters);
	};

	const applyFilters = async () => {
		try {
			setLoading(true);
			const params = {};
			if (filters.search) params.search = filters.search;
			if (filters.trainerId) params.trainerId = filters.trainerId;
			if (filters.gymId) params.gymId = filters.gymId;
			if (filters.startDate) params.startDate = filters.startDate;
			if (filters.skillId) params.skillId = filters.skillId;

			const filteredWorkouts = await getWorkouts(params);
			setWorkouts(filteredWorkouts);
			setShowFilters(false);
		} catch (err) {
			setError('Ошибка при фильтрации занятий');
		} finally {
			setLoading(false);
		}
	};

	const navigateToWorkout = workoutId => navigate(`/workout/${workoutId}`);

	return (
		<div className='home-screen'>
			<div className='header'>
				<button
					onClick={() => navigate(-1)}
					className='back-button'
					disabled={loading}
				>
					<FontAwesomeIcon icon={faArrowLeft} size='lg' />
				</button>
				<h2>Все занятия</h2>
			</div>

			<section className='home-padding'>
				{error && <p className='error-text'>{error}</p>}
				{loading ? (
					<p className='loading'>Загрузка...</p>
				) : (
					<>
						<div className='search-container'>
							<div className='form-group' style={{ maxWidth: '100%' }}>
								<div className='search-bar'>
									<FontAwesomeIcon icon={faSearch} className='search-icon' />
									<input
										type='text'
										name='search'
										value={filters.search}
										onChange={handleFilterChange}
										onBlur={applyFilters}
										placeholder='Поиск по названию'
										className='input-field'
									/>
								</div>
							</div>
							<button
								className='filter-button'
								onClick={() => setShowFilters(true)}
							>
								<FontAwesomeIcon icon={faFilter} size='lg' />
							</button>
						</div>

						{showFilters && (
							<div className='modal-overlay'>
								<div className='filters-modal'>
									<div className='modal-header'>
										<h2>Фильтры</h2>
										<button
											className='modal-close'
											onClick={() => setShowFilters(false)}
										>
											✕
										</button>
									</div>
									<div className='filters-grid'>
										<div className='form-group'>
											<select
												name='trainerId'
												value={filters.trainerId}
												onChange={handleFilterChange}
												className='input-field'
											>
												<option value=''>Все тренеры</option>
												{trainers.map(trainer => (
													<option
														key={trainer.trainerId}
														value={trainer.trainerId}
													>
														{trainer.user.fullName}
													</option>
												))}
											</select>
										</div>
										<div className='form-group'>
											<select
												name='gymId'
												value={filters.gymId}
												onChange={handleFilterChange}
												className='input-field'
											>
												<option value=''>Все залы</option>
												{gyms.map(gym => (
													<option key={gym.gymId} value={gym.gymId}>
														{gym.gymName}
													</option>
												))}
											</select>
										</div>
										<div className='form-group'>
											<select
												name='skillId'
												value={filters.skillId}
												onChange={handleFilterChange}
												className='input-field'
											>
												<option value=''>Все направления</option>
												{skills.map(skill => (
													<option key={skill.skillId} value={skill.skillId}>
														{skill.skillName}
													</option>
												))}
											</select>
										</div>
										<div className='form-group'>
											<input
												type='date'
												name='startDate'
												value={filters.startDate}
												onChange={handleFilterChange}
												className='input-field'
											/>
										</div>
									</div>
									<button
										className='submit-button'
										onClick={applyFilters}
										style={{
											width: '100%',
											maxWidth: '200px',
											margin: '20px auto',
										}}
									>
										Применить
									</button>
								</div>
							</div>
						)}

						{workouts.length > 0 ? (
							<div className='workouts-grid'>
								{workouts.map(workout => (
									<div
										key={workout.workoutId}
										onClick={() => navigateToWorkout(workout.workoutId)}
										className='card workout-card'
									>
										<div className='workout-image'>
											<img
												className='workout-img'
												src={
													workout.imageUrl
														? `https://localhost:7149/${workout.imageUrl}`
														: '/images/placeholder-image.png'
												}
												alt={workout.title}
												onError={e => {
													e.target.src = '/images/placeholder-image.png';
												}}
											/>
										</div>
										<div className='workout-text-box'>
											<p className='workout-title'>{workout.title}</p>
											<div className='workout-time'>
												<FontAwesomeIcon className='time-icon' icon={faClock} />
												<p>
													Начало в{' '}
													{new Date(workout.startTime).toLocaleTimeString([], {
														hour: '2-digit',
														minute: '2-digit',
													})}
												</p>
											</div>
											<p>Свободно мест: {workout.availableSlots}</p>
											{workout.gym && <p>Зал: {workout.gym.gymName}</p>}
										</div>
									</div>
								))}
							</div>
						) : (
							<p className='no-workouts'>Занятия не найдены.</p>
						)}
					</>
				)}
			</section>
		</div>
	);
};

export default WorkoutsListScreen;
