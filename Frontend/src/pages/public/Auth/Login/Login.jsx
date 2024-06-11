import './Login.scss';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { path } from '~/utils/constant';
import { Button, InputForm } from '~/components';
import { useMutation } from '@tanstack/react-query';
import { Spin, message } from 'antd';
import { apiLogin } from '~/apiServices';
import { useAuth } from '~/hooks';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';

const Login = () => {
    const {
        handleSubmit,
        register,
        formState: { errors },
        reset,
    } = useForm({
        defaultValues: {
            username: '',
            password: '',
        },
    });
    const navigate = useNavigate();
    const { signIn } = useAuth();
    const mutation = useMutation({
        mutationFn: apiLogin,
        onSuccess: (data) => {
            if (data.status === 'success') {
                message.success('Login success');
                signIn(data.accessToken, data.userData);
                reset();
                navigate(`/${path.HOME}`);
            } else {
                message.error(data.message);
            }
        },
        onError: () => {
            message.error('Login error');
        },
    });

    const handleLogin = (data) => {
        mutation.mutate(data);
    };

    return (
        <Spin size="large" spinning={mutation.isPending} fullscreen={mutation.isPending}>
            <div className="login">
                <div className="login__content">
                    <h1>Welcome Back to Dev Community</h1>
                    <p>Log in to your account</p>
                </div>
                <div className="login__actions">
                    <div className="login__actions--providers">
                        <button className="google">
                            <FcGoogle size={17} style={{ marginRight: '0.5rem' }} />
                            Continue with Google
                        </button>
                        <button className="github">
                            <FaGithub size={17} style={{ marginRight: '0.5rem' }} />
                            Continue with Github
                        </button>
                    </div>
                    <div className="login__hr">
                        <span>Or log in with your email</span>
                    </div>
                </div>
                <form className="login__form" onSubmit={handleSubmit(handleLogin)}>
                    <InputForm
                        id={'email'}
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
                        id={'password'}
                        label="Password"
                        register={register}
                        errors={errors}
                        type="password"
                        validate={{
                            required: 'Password is required',
                            minLength: {
                                value: 6,
                                message: 'Password must be at least 6 characters',
                            },
                        }}
                    />
                    <Button type="submit" primary style={{ margin: '0' }}>
                        Login
                    </Button>
                </form>
                <div className="login__hr">
                    <span>
                        {"Don't have an account?"} <Link to={`/${path.REGISTER}`}>Sign Up</Link>
                    </span>
                </div>
            </div>
        </Spin>
    );
};

export default Login;
