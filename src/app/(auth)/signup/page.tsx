import React from 'react'
import { RegisterForm } from '~/components/register-form';

const SignUp = () => {
  return (
    <div className="bg-[url(/assets/img/bg.png)] flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10 ">
    <div className="flex w-full max-w-sm flex-col gap-6">
      <RegisterForm />
    </div>
  </div>
  )
}

export default SignUp;