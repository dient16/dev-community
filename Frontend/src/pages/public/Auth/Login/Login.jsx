import './Login.scss';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { path } from '~/utils/constant';
import { Button, InputForm } from '~/components';
import { useMutation } from '@tanstack/react-query';
import { Spin, message } from 'antd';
import { apiLogin } from '~/apiServices';
import { useAuth } from '~/hooks';
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
                <form className="login__form" onSubmit={handleSubmit(handleLogin)}>
                    <h3 className="login__title">Login</h3>
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
            </div>
        </Spin>
    );
};

export default Login;
