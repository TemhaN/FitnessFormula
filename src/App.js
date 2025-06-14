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
import EditProfileScreen from './components/EditProfileScreen';
import UserInterestsScreen from './components/UserInterestsScreen';
import WorkoutsListScreen from './components/WorkoutsListScreen.js';
import CalculatorScreen from './components/CalculatorScreen';
import TrainerPendingCommentsScreen from './components/TrainerPendingCommentsScreen'; // Новый компонент

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
				<Route path='/user/interests' element={<UserInterestsScreen />} />
				<Route path='/trainer/:trainerId' element={<TrainerScreen />} />
				<Route
					path='/trainer/:trainerId/pending-comments'
					element={<TrainerPendingCommentsScreen />}
				/>
				<Route path='/workout/:workoutId' element={<WorkoutScreen />} />
				<Route path='/publish-workout' element={<PublishWorkout />} />
				<Route path='/trainer/workouts' element={<WorkoutsScreen />} />
				<Route path='/workouts-list' element={<WorkoutsListScreen />} />
				<Route path='/calculator' element={<CalculatorScreen />} />
				<Route path='/comments' element={<CommentsScreen />} />
				<Route
					path='/user/workoutregistration'
					element={<UserWorkoutsScreen />}
				/>
				<Route path='/edit-profile' element={<EditProfileScreen />} />
			</Routes>
		</Router>
	);
}

export default App;
