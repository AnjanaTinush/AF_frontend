import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Input, Button, Card, Typography, Divider, Row, Col, message, Alert } from 'antd';
import { 
  UserOutlined, 
  MailOutlined, 
  LockOutlined, 
  HomeOutlined, 
  PhoneOutlined,
  LoginOutlined 
} from '@ant-design/icons';
import { registerUser, clearAuthState } from '../../Redux/slices/authSlice';
import signup from "../../assets/signup.png"; // Adjust the path to your image

const { Title, Text } = Typography;

const SignUp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  
  // Get auth state from Redux store
  const { isLoading, error, successMessage } = useSelector(state => state.auth);
  
  // Effect to handle successful registration
  useEffect(() => {
    if (successMessage) {
      message.success(successMessage);
      // Redirect to login page after a short delay
      setTimeout(() => {
        navigate('/signin');
      }, 2000);
    }
    
    // Cleanup function
    return () => {
      dispatch(clearAuthState());
    };
  }, [successMessage, navigate, dispatch]);
  
  const onFinish = async (values) => {
    // Prepare data for API
    const userData = {
      fullName: values.name,
      email: values.email,
      phone: values.phone,
      password: values.password,
      address: values.address,
      role: 'user', // Default role
      imageurl: '' // Default empty image URL
    };
    
    // Dispatch the register action
    dispatch(registerUser(userData));
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Left side with image - hidden on mobile, visible on md and up */}
      <div className="hidden md:flex md:w-1/2 lg:w-3/5 p-8 items-center justify-center bg-gradient-to-b from-slate-50 via-blue-50 to-indigo-100 overflow-hidden">
        <div className="relative w-full h-full max-w-2xl flex items-center justify-center">
          <img
            src={signup}
            alt="World Explorer Illustration"
            className="rounded-2xl object-cover w-full max-h-[80vh]"
          />
        </div>
      </div>
      
      {/* Right side with signup form */}
      <div className="w-full md:w-1/2 lg:w-2/5 flex items-center justify-center p-4 md:p-8">
        <Card className="w-full max-w-md shadow-md rounded-lg border-0">
          <div className="text-center mb-6">
            <Title level={2} className="mb-1">Create Account</Title>
            <Text type="secondary">Join our global currency explorer</Text>
          </div>
          
          {error && (
            <Alert
              message="Registration Failed"
              description={error}
              type="error"
              showIcon
              closable
              className="mb-4"
              onClose={() => dispatch(clearAuthState())}
            />
          )}
          
          {successMessage && (
            <Alert
              message="Registration Successful"
              description={successMessage}
              type="success"
              showIcon
              closable
              className="mb-4"
            />
          )}
          
          <Form
            form={form}
            name="signup"
            onFinish={onFinish}
            layout="vertical"
            size="large"
            scrollToFirstError
          >
            <Form.Item
              name="name"
              label="Full Name"
              rules={[{ required: true, message: 'Please input your name!' }]}
            >
              <Input prefix={<UserOutlined />} placeholder="John Doe" />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Please input your email!' },
                { type: 'email', message: 'Please enter a valid email!' }
              ]}
            >
              <Input prefix={<MailOutlined />} placeholder="you@example.com" />
            </Form.Item>

           
            <Form.Item
              name="address"
              label="Address"
              rules={[{ required: true, message: 'Please input your address!' }]}
            >
              <Input prefix={<HomeOutlined />} placeholder="123 Street, City" />
            </Form.Item>

            <Form.Item
              name="phone"
              label="Phone Number"
              rules={[
                { required: true, message: 'Please input your phone number!' },
                { 
                  pattern: /^\d{10,15}$/,
                  message: 'Please enter a valid phone number (10-15 digits)' 
                }
              ]}
            >
              <Input prefix={<PhoneOutlined />} placeholder="+1 234 567 890" />
            </Form.Item>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="password"
                  label="Password"
                  rules={[
                    { required: true, message: 'Please input your password!' },
                    { min: 6, message: 'Password must be at least 6 characters' }
                  ]}
                  hasFeedback
                >
                  <Input.Password prefix={<LockOutlined />} placeholder="••••••••" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="confirmPassword"
                  label="Confirm Password"
                  dependencies={['password']}
                  hasFeedback
                  rules={[
                    { required: true, message: 'Please confirm your password!' },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('password') === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('Passwords do not match!'));
                      },
                    }),
                  ]}
                >
                  <Input.Password prefix={<LockOutlined />} placeholder="••••••••" />
                </Form.Item>
              </Col>
            </Row>


            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={isLoading}
                block
                className="bg-indigo-600 hover:bg-indigo-700 h-10"
              >
                Create Account
              </Button>
            </Form.Item>
          </Form>
          
          <Divider plain>
            <Text type="secondary">Already have an account?</Text>
          </Divider>
          
          <Link to="/signin">
            <Button 
              block 
              icon={<LoginOutlined />}
              className="h-10"
            >
              Sign in to your account
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  );
};

export default SignUp;