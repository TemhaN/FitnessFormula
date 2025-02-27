import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { registerTrainer, getSkills } from '../api/fitnessApi';

const TrainerSkills = () => {
	const navigate = useNavigate();
	const { state } = useLocation();
	const [skills, setSkills] = useState([]);
	const [selectedSkills, setSelectedSkills] = useState([]);
	const [error, setError] = useState('');
	const [formData, setFormData] = useState(state || {});

	useEffect(() => {
		getSkills()
			.then(data => setSkills(data))
			.catch(err => setError('Не удалось загрузить скилы'));
	}, []);

	const handleSkillChange = skillId => {
		setSelectedSkills(prevSkills => {
			// Добавляем или удаляем скил из выбранных
			const newSelectedSkills = prevSkills.includes(skillId)
				? prevSkills.filter(id => id !== skillId)
				: [skillId, ...prevSkills]; // Ставим выбранный скил в начало списка

			// Теперь сортируем список, чтобы выбранные скиллы были всегда вверху
			const updatedSkills = [...skills];
			updatedSkills.sort((a, b) => {
				// Если скилл выбран, он поднимется в начало
				const isASelected = newSelectedSkills.includes(a.skillId);
				const isBSelected = newSelectedSkills.includes(b.skillId);
				if (isASelected && !isBSelected) return -1;
				if (!isASelected && isBSelected) return 1;
				return 0;
			});
			setSkills(updatedSkills);
			return newSelectedSkills;
		});
	};

	const handleSubmit = async () => {
		try {
			if (!formData) {
				setError('Данные тренера не найдены');
				return;
			}

			const formDataToSubmit = {
				...formData,
				skillIds: selectedSkills,
			};

			console.log('Данные перед отправкой:', formDataToSubmit);

			const response = await registerTrainer(formDataToSubmit);

			if (response?.user && response?.session) {
				localStorage.setItem(
					'userData',
					JSON.stringify({
						message: 'Пользователь успешно создан',
						user: response.user,
						session: response.session,
					})
				);
			}

			alert('Тренер успешно зарегистрирован');
			navigate('/home');
		} catch (err) {
			setError('Ошибка при регистрации тренера');
		}
	};

	return (
		<div className='trainer-skills-box'>
			<div className='trainer-skills-container'>
				<h2 className='trainer-skills-title'>Выберите свои навыки</h2>
				{error && <p className='error-message'>{error}</p>}
				<div className='skills-list'>
					{skills.map(skill => {
						const isSelected = selectedSkills.includes(skill.skillId);
						return (
							<div
								key={skill.skillId}
								className={`skill-item ${isSelected ? 'selected' : ''}`}
								onClick={() => handleSkillChange(skill.skillId)}
							>
								<span className='skill-text'>{skill.skillName}</span>
							</div>
						);
					})}
				</div>
				<button onClick={handleSubmit} className='submit-button'>
					Зарегистрировать тренера
				</button>
			</div>
		</div>
	);
};

export default TrainerSkills;
