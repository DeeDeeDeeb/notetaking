import React from 'react';
import { useNavigate } from 'react-router-dom'; 

const API = 'http://localhost:5000'

function Getstarted() {
  const navigate = useNavigate(); 

  
  const HandleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      username: e.target.username?.value.trim(),
      email: e.target.email?.value.trim(),
      password: e.target.password?.value.trim(),
    };
    if (formData.password !== e.target.confirmPassword.value.trim()) {
        alert('Passwords do not match!');
        return;
    }    
  
    try {
      console.log(JSON.stringify(formData));
      const response = await fetch(`${API}/api/users`, {method: 'POST',headers:{'Content-Type': 'application/json',},body: JSON.stringify(formData)});
      if (response.ok) {
        alert('Account created successfully!');
        e.target.reset();
        navigate('/');
      } else {
        const data = await response.json();
        console.error('Server Response:', data);
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Error:',error);
    }
  };
  

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-400'>
        <div className='bg-white border rounded-2xl p-10'>
            <h2 className='text-4xl text-center'>Create Your Account</h2><br/>
            <form className='space-y-5' onSubmit={HandleSubmit} >
            Username: <input type="text" id="username" name="username" placeholder="Enter your full name" required className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400' /><br/>
            Email: <input type="email" id="email" name="email" placeholder="Enter your email" required  className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400' /><br/>
            Password: <input type="password" id="password" name="password" placeholder="Enter a password" required  className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400' /><br/>
            Confirm password: <input type="password" id="confirmPassword" name="confirmPassword" placeholder="Confirm your password" required  className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400' /><br/>
            <button type="submit" className=' bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>Create Account</button>
        
      </form>
            

        </div>
     
    </div>
  );
}

export default Getstarted;