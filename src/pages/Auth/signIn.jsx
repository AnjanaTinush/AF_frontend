import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Input, Button, Checkbox, Card, Typography, Divider, message, Alert } from 'antd';
import { MailOutlined, LockOutlined, LoginOutlined, UserOutlined } from '@ant-design/icons';
import { loginUser, clearAuthState } from '../../Redux/slices/authSlice';
import signin from "../../assets/signin.png"; // Adjust the path to your image

const { Title, Text } = Typography;

const SignIn = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Get auth state from Redux store
  const { isLoading, error, successMessage, isAuthenticated } = useSelector(state => state.auth);
  
  useEffect(() => {
    // If authentication was successful, navigate to country list
    if (isAuthenticated && successMessage) {
      message.success(successMessage);
      setTimeout(() => {
        navigate('/countrylist');
      }, 1000);
    }
    
    // Cleanup function
    return () => {
      dispatch(clearAuthState());
    };
  }, [isAuthenticated, successMessage, navigate, dispatch]);
  
  const onFinish = (values) => {
    // Dispatch the login action with credentials
    dispatch(loginUser({
      email: values.email,
      password: values.password
    }));
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Left side with image - hidden on mobile, visible on md and up */}
      <div className="hidden md:flex md:w-1/2 lg:w-3/5 p-8 items-center justify-center bg-gradient-to-b from-slate-50 via-blue-50 to-indigo-100 overflow-hidden">
        <div className="relative w-full h-full max-w-2xl flex items-center justify-center">
          <img
            src={signin}
            alt="World Globe with Flags"
            className="rounded-2xl  object-cover w-full max-h-[80vh]"
          />
         
        </div>
      </div>
      
      {/* Right side with login form */}
      <div className="w-full md:w-1/2 lg:w-2/5 flex items-center justify-center p-4 md:p-8">
        <Card className="w-full max-w-md shadow-md rounded-lg border-0">
          <div className="text-center mb-6">
            <Title level={2} className="mb-1">Sign In</Title>
            <Text type="secondary">Access your account</Text>
          </div>
          
          {error && (
            <Alert
              message="Login Failed"
              description={error}
              type="error"
              showIcon
              closable
              className="mb-4"
              onClose={() => dispatch(clearAuthState())}
            />
          )}
          
          <Form
            name="signin"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            layout="vertical"
            size="large"
          >
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Please input your email!' },
                { type: 'email', message: 'Please enter a valid email!' }
              ]}
            >
              <Input prefix={<MailOutlined className="site-form-item-icon" />} placeholder="you@example.com" />
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[
                { required: true, message: 'Please input your password!' },
                { min: 6, message: 'Password must be at least 6 characters' }
              ]}
            >
              <Input.Password 
                prefix={<LockOutlined className="site-form-item-icon" />} 
                placeholder="••••••••" 
              />
            </Form.Item>

            <Form.Item>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Remember me</Checkbox>
              </Form.Item>

              <a className="float-right text-indigo-600" href="">
                Forgot password
              </a>
            </Form.Item>

            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={isLoading}
                block
                icon={<LoginOutlined />}
                className="bg-indigo-600 hover:bg-indigo-700 h-10"
              >
                Sign In
              </Button>
            </Form.Item>
          </Form>
          
          <Divider plain>
            <Text type="secondary">Don't have an account?</Text>
          </Divider>
          
          <Link to="/signup">
            <Button 
              block 
              icon={<UserOutlined />}
              className="h-10"
            >
              Create an account
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  );
};

export default SignIn;