import React, {useState} from "react";
import {useNavigate} from 'react-router-dom'


const API = 'http://localhost:5000'

function Login() {
    const[error, setError] = useState('')
    const navigate = useNavigate()

    const HandleSubmit= async(e) =>{
        e.preventDefault();
        const email = e.target.email.value
        const password = e.target.password.value

        try{
            const response = await fetch (`${API}/api/users/login`, {method: 'POST', headers:{'Content-Type':'application/json'},body:JSON.stringify({email,password}),
        })

        const data = await response.json()

        if (response.ok){
            alert("Login successful")
            console.log("JWT TOKEN", data.token)
            console.log("username from server",data.username)
            localStorage.setItem('token',data.token)
            localStorage.setItem('username',data.username)
            navigate('/')
        } else {
            setError(data.message)
        }
    } catch(err) {
        console.error("Error",err)
    }

    e.target.reset()
    }

    return(
        <div className="flex items-center justify-center min-h-screen bg-gray-400">
            <div className="border rounded-2xl p-10 bg-white">
                <h1 className="text-4xl text-center mb-4">Login</h1>
                <form id="loginForm" onSubmit={HandleSubmit} className="space-y-5" >
                    Email: <input type="email" id="email" name="email" placeholder="Enter your email" required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"  /><br/>
                    Password: <input type="password" id="password" name="password" placeholder="Enter your password" required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"/>
                    <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ">Login</button>
                </form>
                <p className="text-center">Don't have an account? <br></br><button className="underline" onClick={() => navigate('/getstarted')} >Sign up</button></p>
            
            </div>
        
        </div>
   

    )
}

export default Login;
   
