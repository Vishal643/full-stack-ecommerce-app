import React, { useState, useEffect } from 'react';

import { toast } from 'react-toastify';
import { auth } from '../../firebase';
import { useSelector } from 'react-redux';

const Register = ({ history }) => {
	const [email, setEmail] = useState('');

	const { user } = useSelector((state) => ({ ...state }));

	useEffect(() => {
		if (user && user.token) {
			history.push('/');
		}
	}, [user]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		const config = {
			url: process.env.REACT_APP_REGISTER_REDIRECT_URL,
			handleCodeInApp: true,
		};

		// const response =
		await auth.sendSignInLinkToEmail(email, config);

		toast.success(
			`Email is sent to ${email}. Click the link to complete your registration`
		);

		//save user email to localstorage
		window.localStorage.setItem('emailForRegistration', email);

		//clear state
		setEmail('');
	};

	const registerForm = () => (
		<form onSubmit={handleSubmit}>
			<input
				type='email'
				value={email}
				className='form-control'
				onChange={(e) => setEmail(e.target.value)}
				autoFocus
				placeholder='Enter you email'
			/>
			<br />
			<button type='submit' className='btn btn-raised'>
				Register
			</button>
		</form>
	);

	return (
		<div className='container p-5'>
			<div className='row'>
				<div className='col-md-6 offset-md-3'>
					<h4>Register</h4>

					{registerForm()}
				</div>
			</div>
		</div>
	);
};

export default Register;
