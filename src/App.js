import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RegisterScreen from './components/RegisterScreen';
import LoginScreen from './components/LoginScreen';
import HomeScreen from './components/HomeScreen';
import SplashScreen from './components/SplashScreen';
import TrainerDescriptionScreen from './components/TrainerDescription';
import TrainerSkills from './components/TrainerSkills';
import UserScreen from './components/UserScreen';
import TrainerScreen from './components/TrainerScreen';
import WorkoutScreen from './components/WorkoutScreen';
import PublishWorkout from './components/PublishWorkout';
import WorkoutsScreen from './components/WorkoutsScreen';
import CommentsScreen from './components/CommentsScreen';
import UserWorkoutsScreen from './components/UserWorkoutsScreen';
	
function App() {
	return (
		<Router>
			<Routes>
				<Route path='/' element={<SplashScreen />} />
				<Route path='/register' element={<RegisterScreen />} />
				<Route path='/login' element={<LoginScreen />} />
				<Route path='/home' element={<HomeScreen />} />
				<Route
					path='/trainer-description'
					element={<TrainerDescriptionScreen />}
				/>
				<Route path='/trainer-skills' element={<TrainerSkills />} />
				<Route path='/user' element={<UserScreen />} />
				<Route path='/trainer/:trainerId' element={<TrainerScreen />} />
				<Route path='/workout/:workoutId' element={<WorkoutScreen />} />
				<Route path='/publish-workout' element={<PublishWorkout />} />
				<Route path='/trainer/workouts' element={<WorkoutsScreen />} />
				<Route path='/comments' element={<CommentsScreen />} />
				<Route path='/comments' element={<CommentsScreen />} />
				<Route
					path='/user/workoutregistration'
					element={<UserWorkoutsScreen />}
				/>
			</Routes>
		</Router>
	);
}

export default App;
