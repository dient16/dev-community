import { useForm } from 'react-hook-form';
import './Register.scss';
import { FaGithub } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { Link, useNavigate } from 'react-router-dom';
import { path } from '~/utils/constant';
import { useMutation } from '@tanstack/react-query';
import { apiRegister } from '~/apiServices';
import { Spin, message } from 'antd';
import { InputForm } from '~/components';

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
                        <button className="github">
                            <FaGithub size={17} style={{ marginRight: '0.5rem' }} />
                            Continue with Github
                        </button>
                    </div>
                    <div className="registration__hr">
                        <span>Continue with your email address</span>
                    </div>
                    <form id="email-form" className="registration__actions--email" onSubmit={handleSubmit(onSubmit)}>
                        <InputForm
                            id="email"
                            label="Email"
                            type="text"
                            register={register}
                            errors={errors}
                            validate={{
                                required: 'Email is required',
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: 'Invalid email address',
                                },
                            }}
                        />

                        <InputForm
                            id="password"
                            label="Password"
                            type="password"
                            register={register}
                            errors={errors}
                            validate={{
                                required: 'Password is required',
                                minLength: {
                                    value: 6,
                                    message: 'Password must be at least 6 characters',
                                },
                            }}
                        />

                        <InputForm
                            id="confirmPassword"
                            label="Confirm Password"
                            type="password"
                            register={register}
                            errors={errors}
                            validate={{
                                required: 'Confirm password is required',
                                minLength: {
                                    value: 6,
                                    message: 'Password must be at least 6 characters',
                                },
                                validate: (value) => value === getValues('password') || 'Passwords do not match',
                            }}
                        />

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
