import React from 'react';
import { Form, Input, Button } from 'antd';
import './Register.scss';
const Register = () => {
    const onFinish = (values) => {
        console.log('Received values:', values);
    };

    return (
        <Form className="register-form" onFinish={onFinish}>
            <Form.Item
                name="email"
                rules={[
                    {
                        type: 'email',
                        message: 'Please enter a valid email address!',
                    },
                    {
                        required: true,
                        message: 'Please enter your email!',
                    },
                ]}
            >
                <Input placeholder="Email" />
            </Form.Item>

            <Form.Item
                name="password"
                rules={[
                    {
                        required: true,
                        message: 'Please enter your password!',
                    },
                ]}
            >
                <Input.Password placeholder="Password" />
            </Form.Item>

            <Form.Item
                name="confirmPassword"
                dependencies={['password']}
                hasFeedback
                rules={[
                    {
                        required: true,
                        message: 'Please confirm your password!',
                    },
                    ({ getFieldValue }) => ({
                        validator(_, value) {
                            if (!value || getFieldValue('password') === value) {
                                return Promise.resolve();
                            }
                            return Promise.reject(new Error('The two passwords do not match!'));
                        },
                    }),
                ]}
            >
                <Input.Password placeholder="Confirm Password" />
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Register
                </Button>
            </Form.Item>
        </Form>
    );
};

export default Register;
