import React, { useState, useEffect } from 'react';

import { toast } from 'react-toastify';
import { auth } from '../../firebase';

const RegisterComplete = ({ history }) => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	useEffect(() => {
		setEmail(window.localStorage.getItem('emailForRegistration'));
	}, []);

	const handleSubmit = async (e) => {
		e.preventDefault();

		//validation
		if (!email || !password) {
			toast.error('Email and Password is Required');
			return;
		}

		if (password.length < 6) {
			toast.error('Password must be atleast 6 characters long');
			return;
		}

		try {
			const result = await auth.signInWithEmailLink(
				email,
				window.location.href
			);
			if (result.user.emailVerified) {
				//remove user email from localstorage

				window.localStorage.removeItem('emailForRegistration');

				//get user id token

				let user = auth.currentUser;
				await user.updatePassword(password);
				const idTokenResults = await user.getIdTokenResult();

				console.log(idTokenResults);
				//redirect
				history.push('/');
			}
		} catch (error) {
			toast.error('Something Went Wrong. Please try again.');
		}
	};

	const completeRegistrationForm = () => (
		<form onSubmit={handleSubmit}>
			<input type='email' value={email} className='form-control' disabled />

			<input
				type='password'
				placeholder='Enter password'
				className='form-control'
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				autoFocus
			/>
			<br />
			<button type='submit' className='btn btn-raised'>
				Complete Registration
			</button>
		</form>
	);

	return (
		<div className='container p-5'>
			<div className='row'>
				<div className='col-md-6 offset-md-3'>
					<h4>Register Complete</h4>

					{completeRegistrationForm()}
				</div>
			</div>
		</div>
	);
};

export default RegisterComplete;
