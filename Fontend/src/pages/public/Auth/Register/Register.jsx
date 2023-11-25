import { useForm } from 'react-hook-form';
import './Register.scss';
import { AiFillFacebook } from 'react-icons/ai';
import { FcGoogle } from 'react-icons/fc';
import { Link, useNavigate } from 'react-router-dom';
import { path } from '~/utils/constant';
import clsx from 'clsx';
import { useMutation } from '@tanstack/react-query';
import { apiRegister } from '~/apiServices';
import { Spin, message } from 'antd';

function SignUp() {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },
        getValues,
    } = useForm({
        defaultValues: {
            email: '',
            password: '',
            confirmPassword: '',
        },
    });
    const registerMutation = useMutation({
        mutationFn: apiRegister,
    });
    const onSubmit = (data) => {
        delete data.confirmPassword;
        registerMutation.mutate(data, {
            onSuccess: (data) => {
                if (data.status === 'success') {
                    message.success('Register successful');
                    navigate(`/${path.LOGIN}`);
                } else {
                    message.error(data.message);
                }
            },
            onError: () => {
                message.error('Something went wrong');
            },
        });
    };

    return (
        <Spin spinning={registerMutation.isPending} fullscreen={registerMutation.isPending} size="large">
            <div className="registration">
                <div className="registration__content">
                    <h1>Welcome to Dev Community</h1>
                    <p>The way to the top of programming.</p>
                </div>
                <div className="registration__actions">
                    <div className="registration__actions--providers">
                        <button className="google">
                            <FcGoogle size={17} style={{ marginRight: '0.5rem' }} />
                            Continue with Google
                        </button>
                        <button className="facebook">
                            <AiFillFacebook size={17} style={{ marginRight: '0.5rem' }} />
                            Continue with Facebook
                        </button>
                    </div>
                    <div className="registration__hr">
                        <span>Continue with your email address</span>
                    </div>
                    <form id="email-form" className="registration__actions--email" onSubmit={handleSubmit(onSubmit)}>
                        <div>
                            <label htmlFor="email">Email</label>
                            <input
                                className={clsx(errors.email && 'error')}
                                {...register('email', {
                                    required: 'Email is required',
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: 'Invalid email address',
                                    },
                                })}
                                type="text"
                            />
                            {errors.email && <p className="error-message">{errors.email.message}</p>}
                        </div>

                        <div>
                            <label htmlFor="password">Password</label>
                            <input
                                className={clsx(errors.password && 'error')}
                                {...register('password', {
                                    required: 'Password is required',
                                    minLength: {
                                        value: 6,
                                        message: 'Password must be at least 6 characters',
                                    },
                                })}
                                type="password"
                            />
                            {errors.password && <p className="error-message">{errors.password.message}</p>}
                        </div>

                        <div>
                            <label htmlFor="confirm">Confirm Password</label>
                            <input
                                {...register('confirmPassword', {
                                    required: 'Confirm password is required',
                                    minLength: {
                                        value: 6,
                                        message: 'Password must be at least 6 characters',
                                    },
                                    validate: (value) => value === getValues('password') || 'Passwords do not match',
                                })}
                                className={clsx(errors.confirmPassword && 'error')}
                                type="password"
                            />
                            {errors.confirmPassword && (
                                <p className="error-message">{errors.confirmPassword.message}</p>
                            )}
                        </div>

                        <button id="enter" type="submit">
                            Sign Up
                        </button>
                    </form>
                    <div className="registration__hr">
                        <span>
                            Already have an account? <Link to={`/${path.LOGIN}`}>Sign In</Link>
                        </span>
                    </div>
                </div>
            </div>
        </Spin>
    );
}

export default SignUp;
