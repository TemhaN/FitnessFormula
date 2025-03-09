import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const TrainerDescription = () => {
	const navigate = useNavigate();
	const { state } = useLocation();
	const [formData, setFormData] = useState({
		fullName: state?.fullName || '',
		email: state?.email || '',
		phoneNumber: state?.phoneNumber || '',
		password: state?.password || '',
		avatar: state?.avatar || '',
		description: '',
		experienceYears: 0,
		role: 'trainer',
	});
	const [error, setError] = useState('');
	const loading = false; // Заменили useState на константу, так как setLoading не используется

	useEffect(() => {
		if (!state || !state.fullName || !state.email) {
			setError('Необходимые данные для регистрации отсутствуют');
			navigate('/register');
		}
	}, [state, navigate]);

	const handleChange = e => {
		const { name, value } = e.target;
		setFormData(prev => ({ ...prev, [name]: value }));
	};

	const handleSubmit = e => {
		e.preventDefault();

		if (!formData.description || formData.experienceYears < 0) {
			setError('Пожалуйста, заполните описание и укажите корректный стаж');
			return;
		}

		setError('');
		navigate('/trainer-skills', { state: formData });
	};

	return (
		<div className='trainer-container'>
			<div className='trainer-description-box'>
				<h2 className='trainer-description-title'>
					Введите информацию о тренере
				</h2>
				{error && <p className='error-message'>{error}</p>}
				<form onSubmit={handleSubmit} className='trainer-description-form'>
					<div className='input-container'>
						<textarea
							name='description'
							placeholder='Ваше описание тренера'
							onChange={handleChange}
							className='input-field description-input'
							value={formData.description}
							disabled={loading}
						/>
					</div>
					<p className='text-align-center'>Ваш стаж опыта</p>
					<div className='experience-container'>
						<button
							type='button'
							className='experience-button'
							onClick={() =>
								setFormData(prev => ({
									...prev,
									experienceYears: Math.max(prev.experienceYears - 1, 0),
								}))
							}
							disabled={loading}
						>
							-
						</button>
						<span className='experience-number'>
							{formData.experienceYears}
						</span>
						<button
							type='button'
							className='experience-button'
							onClick={() =>
								setFormData(prev => ({
									...prev,
									experienceYears: prev.experienceYears + 1,
								}))
							}
							disabled={loading}
						>
							+
						</button>
					</div>
					<button type='submit' className='submit-button' disabled={loading}>
						Далее
					</button>
				</form>
			</div>
		</div>
	);
};

export default TrainerDescription;
