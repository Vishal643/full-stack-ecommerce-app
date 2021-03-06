import React, { useState, useEffect } from 'react';

import axios from 'axios';

import { toast } from 'react-toastify';
import { auth, googleAuthProvider } from '../../firebase';

import { Button } from 'antd';
import { MailOutlined, GoogleOutlined } from '@ant-design/icons';

import { Link } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';

const Login = ({ history }) => {
	const [email, setEmail] = useState('champchaudhary345@gmail.com');
	const [password, setPassword] = useState('123456');
	const [loading, setLoading] = useState(false);

	const dispatch = useDispatch();

	const { user } = useSelector((state) => ({ ...state }));

	useEffect(() => {
		if (user && user.token) {
			history.push('/');
		}
	}, [user]);

	//making request to backend
	const createOrUpdateUser = async (authToken) => {
		return await axios.post(
			`${process.env.REACT_APP_API}/create-or-update-user`,
			{},
			{
				headers: {
					authToken,
				},
			}
		);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		try {
			const result = await auth.signInWithEmailAndPassword(email, password);
			const { user } = result;
			const idTokenResult = await user.getIdTokenResult();

			createOrUpdateUser(idTokenResult.token)
				.then((res) => console.log('create or update response', res))
				.catch((err) => console.log(err));

			// dispatch({
			// 	type: 'LOGGED_IN_USER',
			// 	payload: {
			// 		email: user.email,
			// 		token: idTokenResult.token,
			// 	},
			// });
			// history.push('/');
		} catch (error) {
			toast.error(error.message);
			setLoading(false);
		}
	};

	const googleLogin = async () => {
		auth
			.signInWithPopup(googleAuthProvider)
			.then(async (result) => {
				const { user } = result;
				const idTokenResult = await user.getIdTokenResult();

				dispatch({
					type: 'LOGGED_IN_USER',
					payload: {
						email: user.email,
						token: idTokenResult.token,
					},
				});
				history.push('/');
			})
			.catch((error) => toast.error(error.message));
	};
	const loginForm = () => (
		<form onSubmit={handleSubmit}>
			<div className='form-group'>
				<input
					type='email'
					value={email}
					className='form-control'
					onChange={(e) => setEmail(e.target.value)}
					autoFocus
					placeholder='Enter your Email'
				/>
			</div>
			<div className='form-group'>
				<input
					type='password'
					value={password}
					className='form-control'
					onChange={(e) => setPassword(e.target.value)}
					autoFocus
					placeholder='Enter your password'
				/>
			</div>
			<Button
				onClick={handleSubmit}
				type='primary'
				className='mb-3'
				block
				shape='round'
				size='large'
				disabled={!email || password.length < 6}
				icon={<MailOutlined />}
			>
				Login With Email/Password
			</Button>
		</form>
	);

	return (
		<div className='container p-5'>
			<div className='row'>
				<div className='col-md-6 offset-md-3'>
					{loading ? (
						<h4 className='text-danger'>Loading...</h4>
					) : (
						<h4>Login</h4>
					)}
					{loginForm()}
					<Button
						onClick={googleLogin}
						type='danger'
						className='mb-3'
						block
						shape='round'
						size='large'
						icon={<GoogleOutlined />}
					>
						Login With Google
					</Button>
					<Link to='/forgot/password' className='float-right text-danger'>
						Forgot Password?
					</Link>
				</div>
			</div>
		</div>
	);
};

export default Login;
