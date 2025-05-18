import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import {
	getUserInterests,
	updateUserInterests,
	getSkills,
} from '../api/fitnessApi';

const UserInterestsScreen = () => {
	const navigate = useNavigate();
	const [userId, setUserId] = useState(null);
	const [skills, setSkills] = useState([]);
	const [selectedSkills, setSelectedSkills] = useState([]);
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const initializeData = async () => {
			const storedUserData = localStorage.getItem('userData');
			if (!storedUserData) {
				navigate('/login');
				return;
			}

			const parsedUserData = JSON.parse(storedUserData);
			if (!parsedUserData?.user?.userId) {
				navigate('/login');
				return;
			}

			setUserId(parsedUserData.user.userId);
			setLoading(true);

			try {
				const [skillsData, interestsData] = await Promise.all([
					getSkills(),
					getUserInterests(parsedUserData.user.userId),
				]);

				setSkills(skillsData);
				setSelectedSkills(interestsData.map(interest => interest.skillId));
			} catch (err) {
				setError('Ошибка при загрузке данных');
				console.error('Ошибка загрузки данных:', err);
			} finally {
				setLoading(false);
			}
		};

		initializeData();
	}, [navigate]);

	const handleSkillToggle = skillId => {
		setSelectedSkills(prev =>
			prev.includes(skillId)
				? prev.filter(id => id !== skillId)
				: [...prev, skillId]
		);
	};

	const handleSaveInterests = async () => {
		if (selectedSkills.length === 0) {
			setError('Пожалуйста, выберите хотя бы один навык');
			return;
		}

		try {
			await updateUserInterests(userId, selectedSkills);
			navigate('/user');
		} catch (err) {
			setError('Ошибка при сохранении интересов');
			console.error('Ошибка сохранения интересов:', err);
		}
	};

	if (loading) return <p className='loading'>Загрузка...</p>;

	return (
		<div className='user-interests'>
			<div className='header'>
				<button onClick={() => navigate(-1)} className='back-button'>
					<FontAwesomeIcon icon={faArrowLeft} size='lg' />
				</button>
				<h2>Мои интересы</h2>
			</div>

			{error && <p className='error-message'>{error}</p>}
			{skills.length > 0 ? (
				<div className='skills-list skills-list-user'>
					{skills.map(skill => {
						const isSelected = selectedSkills.includes(skill.skillId);
						return (
							<div
								key={skill.skillId}
								className='skill-card skill-unselected'
								onClick={() => !loading && handleSkillToggle(skill.skillId)}
							>
								<div className={`${isSelected ? 'skill-selected' : ''}`}>
									<span>{skill.skillName}</span>
								</div>
							</div>
						);
					})}
				</div>
			) : (
				<p className='no-skills'>Навыки не найдены.</p>
			)}

			<div className='action-buttons-skills'>
				<button
					onClick={handleSaveInterests}
					className='action-button-skills register-button'
					disabled={loading}
				>
					Сохранить
				</button>
				<button
					onClick={() => navigate('/user')}
					className='action-button-skills unregister-button'
					disabled={loading}
				>
					Отмена
				</button>
			</div>
		</div>
	);
};

export default UserInterestsScreen;
