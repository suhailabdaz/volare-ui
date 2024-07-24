import React from 'react';
import GODSPEED from '../../../assets/images/GODSPEED.png';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { adminAxios } from '../../../services/axios/AdminAxios';
import { adminEndpoints } from '../../../services/endpoints/AdminEndpoints';
import { useDispatch } from 'react-redux';
import { login } from '../../../redux/slices/adminSlice';
import LoginModal from './LoginModal';
import  cloudimage from '../../../assets/images/White aesthetic widget in 2022 _ Black and white clouds, White clouds, Cloud wallpaper.jpeg'
import  noolamala from '../../../assets/images/Topographic white mouse pad.jpeg'


function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  
  return (
<div className="relative min-h-screen w-full bg-gray-100 font-PlayfairDisplay">
  <img src={cloudimage} alt="" className="absolute inset-0 w-full h-full object-cover" />
  <div className="relative z-10 pt-4">
    <LoginModal />
  </div>
</div>

  );
}

export default Login;
