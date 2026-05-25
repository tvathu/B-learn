import React from 'react';
import { AuthLayout } from '../layouts/AuthLayout';
import AuthForm from '../components/AuthForm';

function StudentAuth() {
  return (
    <AuthLayout role="student">
      <AuthForm role="student" />
    </AuthLayout>
  );
}

export default StudentAuth;
