import React, {useState} from 'react'
import loginSignupImage from "../images/login-animation.gif";
import { Link } from "react-router-dom";
import {toast} from "react-hot-toast";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {loginRedux } from "../redux/userSlice";

const Login = () => {

    const [data, setData] = useState({
      email: "",
      password: "",
    });
    const navigate = useNavigate()
  
    const userData = useSelector(state => state)
    const dispatch = useDispatch()

    const handleOnChange = (e) => {
      const {name,value} =e.target
      setData((preve)=>{
        return{
          ...preve,
          [name] : value
        }
      })
  
    }
  
    const handleSubmit =async(e) =>{
      e.preventDefault()
      const {email,password} = data
      if(email && password){
        const fetchData = await fetch(`${process.env.REACT_APP_SERVER_DOMAIN}/login`,
          {
            method: "POST",
            headers: {
              "content-type": "application/json",
            },
            body: JSON.stringify(data),
          });

        const dataRes = await fetchData.json()
        console.log(dataRes)
        
        toast(dataRes.message)

          if(dataRes.alert){
            dispatch(loginRedux(dataRes))
            setTimeout(()=>{
            navigate("/")
          }, 1000);
        }
          console.log(userData)
      }
      else{
        alert("Please Enter required fields")
      }
    }
  return (
    <div className="p-3 md:p-4">
      <div className="w-full max-w-sm bg-white m-auto flex flex-col p-4 rounded-xl">
        {/*<h1 className='text-center text-2xl font-bold'>Signup</h1>*/}
        <div className="w-20 overflow-hidden rounded-full drop-shadow-md shadow-md m-auto">
          <img src={loginSignupImage} className="w-full" />
        </div>

        <form className="w-full py-2 flex flex-col" onSubmit={handleSubmit}>

          <label htmlFor="email">Email</label>
          <input
            type={"text"}
            id="email"
            name="email"
            className="mt-1 mb-2 w-full bg-slate-300 px-2 py-1 rounded focus-within:outline-blue-300"
            value={data.email}
            onChange={handleOnChange}
          />

          <label htmlFor="password">Password</label>
          <input
            type={"password"}
            id="password"
            name="password"
            className="mt-1 mb-2 w-full bg-slate-300 px-2 py-1 rounded focus-within:outline-blue-300"
            value={data.password}
            onChange={handleOnChange}
          />

          <button className="w-full max-w-[150px] m-auto bg-slate-300 hover:bg-slate-400 cursor-pointer text-xl font-medium py-1 rounded mt-3">
            Login
          </button>
        </form>
        <p className="text-left text-md mt-2">
          Don't have account ?{" "}
          <Link to={"/signup"} className="text-blue-500 underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login