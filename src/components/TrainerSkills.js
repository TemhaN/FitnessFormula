import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { registerTrainer, getSkills } from '../api/fitnessApi';

const TrainerSkills = () => {
	const navigate = useNavigate();
	const { state } = useLocation();
	const [skills, setSkills] = useState([]);
	const [selectedSkills, setSelectedSkills] = useState([]);
	const [formData] = useState(state || {});
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (!state) {
			setError('Данные тренера отсутствуют');
			navigate('/register');
			return;
		}

		const fetchSkills = async () => {
			try {
				setLoading(true);
				const skillsData = await getSkills();
				setSkills(skillsData || []);
			} catch (err) {
				setError(err.message || 'Не удалось загрузить навыки');
			} finally {
				setLoading(false);
			}
		};

		fetchSkills();
	}, [state, navigate]);

	const handleSkillChange = skillId => {
		setSelectedSkills(prev =>
			prev.includes(skillId)
				? prev.filter(id => id !== skillId)
				: [...prev, skillId]
		);
	};

	const handleSubmit = async () => {
		if (selectedSkills.length === 0) {
			setError('Пожалуйста, выберите хотя бы один навык');
			return;
		}

		setError('');
		setLoading(true);

		try {
			const formDataToSubmit = {
				description: formData.description || '',
				experienceYears: formData.experienceYears || 0,
				skillIds: selectedSkills,
				user: {
					fullName: formData.fullName || '',
					email: formData.email || '',
					phoneNumber: formData.phoneNumber || '',
					password: formData.password || '',
					avatar: formData.avatar || '',
				},
			};

			console.log('Данные перед отправкой:', formDataToSubmit);

			const response = await registerTrainer(formDataToSubmit);

			const userData = {
				user: response.user || { fullName: formData.fullName },
				token: response.session || response.token,
			};

			localStorage.setItem('userData', JSON.stringify(userData));
			alert(`Тренер ${formData.fullName || 'успешно зарегистрирован'}`);
			navigate('/home');
		} catch (err) {
			setError(err.message || 'Ошибка при регистрации тренера');
			console.error('Ошибка регистрации тренера:', err);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='trainer-skills-box'>
			<div className='trainer-skills-container'>
				<h2 className='trainer-skills-title'>Выберите свои навыки</h2>
				{error && <p className='error-message'>{error}</p>}
				{loading && skills.length === 0 ? (
					<p>Загрузка навыков...</p>
				) : skills.length > 0 ? (
					<div className='skills-list'>
						{skills.map(skill => {
							const isSelected = selectedSkills.includes(skill.skillId);
							return (
								<div
									key={skill.skillId}
									className={`skill-item ${isSelected ? 'selected' : ''}`}
									onClick={() => !loading && handleSkillChange(skill.skillId)}
								>
									<span className='skill-text'>{skill.skillName}</span>
								</div>
							);
						})}
					</div>
				) : (
					<p>Навыки не найдены</p>
				)}
				<button
					onClick={handleSubmit}
					className='submit-button'
					disabled={loading}
				>
					{loading ? 'Регистрация...' : 'Зарегистрировать тренера'}
				</button>
			</div>
		</div>
	);
};

export default TrainerSkills;
