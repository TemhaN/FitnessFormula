import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const UserWorkoutsScreen = () => {
	const [workouts, setWorkouts] = useState([]);
	const navigate = useNavigate();

	useEffect(() => {
		const userData = JSON.parse(localStorage.getItem('userData'));
		if (!userData) return;

		fetch(
			`https://localhost:7149/api/WorkoutRegistrations/user/${userData.user.userId}`
		)
			.then(response => response.json())
			.then(data => setWorkouts(data))
			.catch(error => console.error('Ошибка загрузки занятий:', error));
	}, []);

	return (
		<div className='user-workouts'>
			<div className='header'>
				<button onClick={() => navigate(-1)} className='back-button'>
					<FontAwesomeIcon icon={faArrowLeft} size='lg' />
				</button>
				<h2>Мои занятия</h2>
			</div>

			{workouts.length > 0 ? (
				<div className='workouts-list'>
					{workouts.map(registration => (
						<div
							key={registration.workout.workoutId}
							onClick={() =>
								navigate(`/workout/${registration.workout.workoutId}`)
							}
							className='workout-card mt'
						>
							<img
								src={
									`https://localhost:7149${registration.workout.imageUrl}` ||
									'/images/placeholder-image.png'
								}
								alt={registration.workout.title}
								className='workout-img-register'
								onError={e => {
									e.target.src = '/images/placeholder-image.png';
								}}
							/>
							<div className='workout-info'>
								<p className='workout-title mt-2'>
									{registration.workout.title}
								</p>
								<p className='workout-description'>
									{registration.workout.description}
								</p>
								<div className='workout-time'>
									<FontAwesomeIcon className='time-icon' icon={faClock} />
									<p>
										Начало в{' '}
										{new Date(
											registration.workout.startTime
										).toLocaleTimeString([], {
											hour: '2-digit',
											minute: '2-digit',
										})}
									</p>
								</div>
								<p className='registration-date mt-2'>
									Вы записались{' '}
									{new Date(registration.registrationDate).toLocaleDateString()}
								</p>
							</div>
						</div>
					))}
				</div>
			) : (
				<p className='no-workouts'>Вы ещё не записаны на занятия.</p>
			)}
		</div>
	);
};

export default UserWorkoutsScreen;
