import React from 'react'
import { doLogin } from '@/app/actions/index.js'

const LoginForm = () => {
  return (
    <form className="login-form" action={doLogin}>
        <div className='flex flex-col mb-4 jus'>
            <button
            className='btn-primary text-white font-bold py-2 px-4 rounded'
            type='submit' name="action" value="employee">
                Sign In as Employee
            </button>
            <button 
            className='btn-primary text-white font-bold mt-2 py-2 px-4 rounded'
            type='submit' name="action" value="manager">
                Sign In as Manager
            </button>
        </div>
    </form>
  )
}

export default LoginForm