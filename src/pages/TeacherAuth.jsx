import React from 'react';
import { AuthLayout } from '../layouts/AuthLayout';
import AuthForm from '../components/AuthForm';

function TeacherAuth() {
  return (
    <AuthLayout role="teacher">
      <AuthForm role="teacher" />
    </AuthLayout>
  );
}

export default TeacherAuth;
