import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const CalculatorScreen = () => {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		weight: 85,
		height: 170,
		age: 30,
		gender: 'male',
		activity: 'sedentary',
	});
	const [result, setResult] = useState(null);
	const [error, setError] = useState('');

	const weightRef = useRef(null);
	const heightRef = useRef(null);
	const ageRef = useRef(null);

	const weightOptions = Array.from({ length: 121 }, (_, i) => i + 30);
	const heightOptions = Array.from({ length: 121 }, (_, i) => i + 100);
	const ageOptions = Array.from({ length: 85 }, (_, i) => i + 16);

	const itemWidth = 40;

	const handleScroll = (ref, name, options) => {
		if (!ref.current) return;
		const scrollLeft = ref.current.scrollLeft;
		const index = Math.round(scrollLeft / itemWidth);
		const clampedIndex = Math.max(0, Math.min(index, options.length - 1));
		const newValue = options[clampedIndex];

		if (newValue !== formData[name]) {
			setFormData(prev => ({ ...prev, [name]: newValue }));
		}
	};

	const scrollToValue = (ref, value, options) => {
		if (!ref.current) return;
		const index = options.indexOf(value);
		if (index === -1) return;

		const targetPosition = index * itemWidth;
		ref.current.scrollTo({
			left: targetPosition,
			behavior: 'smooth',
		});
	};

	const handleScrollEnd = (ref, name, options) => {
		if (!ref.current) return;
		const scrollLeft = ref.current.scrollLeft;
		const index = Math.round(scrollLeft / itemWidth);
		const clampedIndex = Math.max(0, Math.min(index, options.length - 1));
		const targetPosition = clampedIndex * itemWidth;

		ref.current.scrollTo({
			left: targetPosition,
			behavior: 'smooth',
		});
	};

	const setupScrollListeners = (ref, name, options) => {
		if (!ref.current) return;
		let timeout;
		const onScroll = () => {
			handleScroll(ref, name, options);
			clearTimeout(timeout);
			timeout = setTimeout(() => handleScrollEnd(ref, name, options), 10);
		};
		ref.current.addEventListener('scroll', onScroll);
		return () => ref.current?.removeEventListener('scroll', onScroll);
	};

	useEffect(() => {
		if (weightRef.current)
			scrollToValue(weightRef, formData.weight, weightOptions);
		if (heightRef.current)
			scrollToValue(heightRef, formData.height, heightOptions);
		if (ageRef.current) scrollToValue(ageRef, formData.age, ageOptions);

		const cleanups = [
			setupScrollListeners(weightRef, 'weight', weightOptions),
			setupScrollListeners(heightRef, 'height', heightOptions),
			setupScrollListeners(ageRef, 'age', ageOptions),
		];

		return () => cleanups.forEach(cleanup => cleanup?.());
	}, []);

	useEffect(() => {
		const { weight, height, age, gender, activity } = formData;

		if (!weight || !height || !age) {
			setResult(null);
			return;
		}
		if (weight < 30 || height < 100 || age < 16) {
			setResult(null);
			return;
		}

		setError('');

		let bmr;
		if (gender === 'male') {
			bmr = 10 * weight + 6.25 * height - 5 * age + 5;
		} else {
			bmr = 10 * weight + 6.25 * height - 5 * age - 161;
		}

		const activityFactors = {
			sedentary: 1.2,
			light: 1.375,
			moderate: 1.55,
			high: 1.725,
			extreme: 1.9,
		};
		const calories = Math.round(bmr * activityFactors[activity]);
		const carbsCalories = calories * 0.4;
		const proteinCalories = calories * 0.3;
		const fatCalories = calories * 0.3;

		const carbs = Math.round(carbsCalories / 4);
		const protein = Math.round(proteinCalories / 4);
		const fat = Math.round(fatCalories / 9);

		setResult({
			calories,
			carbs,
			protein,
			fat,
		});
	}, [formData]);

	const getItemStyles = (index, currentValue, options) => {
		const currentIndex = options.indexOf(currentValue);
		const offset = Math.abs(index - currentIndex);
		const opacity = 1 - offset * 0.25;
		const scale = 1 - offset * 0.04;
		const yOffset = offset * offset * 1;
		const blur = offset * 0.8;
		const color = offset === 0 ? '#f7f7f7' : `rgba(255, 255, 255, ${opacity})`;

		return {
			transform: `scale(${scale}) translateY(${yOffset}px)`,
			opacity: Math.max(0.2, opacity),
			fontSize: `${18 - offset * 2}px`,
			color,
			width: `${itemWidth}px`,
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			height: '100%',
			transition: 'all 0.3s ease',
			filter: `blur(${blur}px)`,
		};
	};

	return (
		<div className='calculator-screen'>
			<div className='header'>
				<button onClick={() => navigate(-1)} className='back-button'>
					<FontAwesomeIcon icon={faArrowLeft} size='lg' />
				</button>
				<h2>Калькулятор КБЖУ</h2>
			</div>
			<section className='calculator-padding'>
				{error && <p className='error-text'>{error}</p>}
				<div className='calculator-form card-glass'>
					<div className='form-group'>
						<label className='input-label'>Вес (кг)</label>
						<div className='arc-picker'>
							<div className='arc-arrow' />
							<div className='arc-picker-wrapper' ref={weightRef}>
								<div className='arc-items'>
									{weightOptions.map((value, index) => (
										<span
											key={value}
											className='arc-item'
											style={getItemStyles(
												index,
												formData.weight,
												weightOptions
											)}
										>
											{value}
										</span>
									))}
								</div>
							</div>
						</div>
					</div>
					<div className='form-group'>
						<label className='input-label'>Рост (см)</label>
						<div className='arc-picker'>
							<div className='arc-arrow' />
							<div className='arc-picker-wrapper' ref={heightRef}>
								<div className='arc-items'>
									{heightOptions.map((value, index) => (
										<span
											key={value}
											className='arc-item'
											style={getItemStyles(
												index,
												formData.height,
												heightOptions
											)}
										>
											{value}
										</span>
									))}
								</div>
							</div>
						</div>
					</div>
					<div className='form-group'>
						<label className='input-label'>Возраст (лет)</label>
						<div className='arc-picker'>
							<div className='arc-arrow' />
							<div className='arc-picker-wrapper' ref={ageRef}>
								<div className='arc-items'>
									{ageOptions.map((value, index) => (
										<span
											key={value}
											className='arc-item'
											style={getItemStyles(index, formData.age, ageOptions)}
										>
											{value}
										</span>
									))}
								</div>
							</div>
						</div>
					</div>
					<div className='form-group'>
						<label className='input-label'>Пол</label>
						<select
							name='gender'
							value={formData.gender}
							onChange={e =>
								setFormData({ ...formData, gender: e.target.value })
							}
							className='input-field'
						>
							<option value='male'>Мужской</option>
							<option value='female'>Женский</option>
						</select>
					</div>
					<div className='form-group'>
						<label className='input-label'>Активность</label>
						<select
							name='activity'
							value={formData.activity}
							onChange={e =>
								setFormData({ ...formData, activity: e.target.value })
							}
							className='input-field'
						>
							<option value='sedentary'>Сидячий (офис, мало движения)</option>
							<option value='light'>Лёгкая (1–3 тренировки/нед)</option>
							<option value='moderate'>Умеренная (3–5 тренировок/нед)</option>
							<option value='high'>Высокая (6–7 тренировок/нед)</option>
							<option value='extreme'>Экстремальная (спортсмены)</option>
						</select>
					</div>
				</div>

				{result && (
					<div
						className='result-card card-glass'
						style={{ animation: 'slideUp 0.5s ease-in' }}
					>
						<h3>Твоя норма:</h3>
						<div className='result-item'>
							<span>Калории</span>
							<strong>{result.calories} ккал/день</strong>
						</div>
						<div className='result-item'>
							<span>Белки</span>
							<strong>
								{result.protein} г (
								{Math.round(((result.protein * 4) / result.calories) * 100)}%)
							</strong>
						</div>
						<div className='result-item'>
							<span>Жиры</span>
							<strong>
								{result.fat} г (
								{Math.round(((result.fat * 9) / result.calories) * 100)}%)
							</strong>
						</div>
						<div className='result-item'>
							<span>Углеводы</span>
							<strong>
								{result.carbs} г (
								{Math.round(((result.carbs * 4) / result.calories) * 100)}%)
							</strong>
						</div>
					</div>
				)}
			</section>
		</div>
	);
};

export default CalculatorScreen;
