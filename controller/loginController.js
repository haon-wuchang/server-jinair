import React from 'react';
import * as repository from '../repository/loginRepository.js';
import jwt from 'jsonwebtoken';
import {sendMail} from'../utils/sendMail.js';
import axios from 'axios';

/***************************** 
 * 로그인 
*****************************/
export const checkLogin = async(req, res) =>{
  let result = await repository.checkLogin(req.body);
  if(result.cnt === 1){
    const token = jwt.sign({"userId":req.body.id},'xIP999DfLP');
    result = {...result, "token":token};
   }
  res.json(result);
  res.end();
};


/***************************** 
 * 인증번호 이메일 발송
*****************************/
export const getAuthCode = async(req, res) =>{
  const { name, email} = req.body;

  const authCode = Math.floor(Math.random() * 1000000).toString();
  console.log('authCode ->>',authCode);
  
  const subject = '[JinAir] 이메일 인증번호가 도착하였습니다.';
  const message = `발급된 인증번호는 [ ${authCode} ]입니다.`;
  
  try {
    const result = await sendMail(name, email, subject, message);
    if(result === 'success'){
      res.status(200).json({success : true, code: authCode})
    }else{
      res.status(500).json({success: false, error: result})  
    }
  } catch (error) {
    console.log('서버오류',error);
  }
};


/***************************** 
 * 아이디 찾기
*****************************/
export const getFindId = async(req, res) =>{
  const kname_first = req.body.name.slice(0,1);
  const kname_last = req.body.name.slice(1,3);
  const formData = {...req.body, kname_first,kname_last};

  const result = await repository.getFindId(formData);
  res.json(result);
  res.end();
};


/***************************** 
 * 비밀번호 찾기
*****************************/
export const getFindPwd = async(req, res) =>{
    const { id, name, email } = req.body;

    const kname_first = name.slice(0,1);
    const kname_last = name.slice(1,3);
    const formData = {...req.body, kname_first,kname_last};

    const findResult= await repository.getFindPwd(formData);

    if(findResult[0]?.cnt){
      const updateResult= await repository.updatePwd(formData);
      return res.json({
                success: true,
                data: {
                  password: updateResult.password,
                  findResult
                }        
          });
    }else{
      res.json({success: false,
                data: {findResult}});
      res.end();
    }
};

/***************************** 
 * 아이디 중복체크
*****************************/
export const getIdCheck = async(req, res)=>{
  const result = await repository.getIdCheck(req.body);
  res.json(result);
  res.end();
};

/***************************** 
 * 회원가입
*****************************/
export const setSignup = async(req, res)=>{
  const phone = `${req.body.phone.slice(0,3)}-${req.body.phone.slice(3,7)}-${req.body.phone.slice(7,12)}`
  const formData = {...req.body, phone}
  
  const result = await repository.setSignup(formData);
  res.json(result);
  res.end();
};


/***************************** 
 * sns 네이버 로그인 토큰 받기
*****************************/
export const getNaverToken = async (req, res) => {
  const { code, state } = req.body;

  const client_id = 'CLQEVWVzvGWP5Smx7Vgn';
  const client_secret = '_TXhJET9_C';
  const redirect_uri = 'http://jinair-client.s3-website.ap-northeast-2.amazonaws.com/naver-redirect'; 

  try {// 1. access_token 요청
    const tokenResponse = await axios.get('https://nid.naver.com/oauth2.0/token', {
      params: {grant_type: 'authorization_code', client_id,  client_secret, code, state,}
    });

    const tokenData = tokenResponse.data;

    if (!tokenData.access_token) {
      return res.status(400).json({ error: '토큰 발급 실패', details: tokenData });
    }

    // 2. 유저 정보 요청
    const userResponse = await axios.get('https://openapi.naver.com/v1/nid/me', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`
      }
    });

    const userInfo = userResponse.data;

    if (!userInfo?.response?.email) {
      return res.status(400).json({ error: '유저 정보 없음', details: userInfo });
    }

    return res.json({ user: userInfo.response });
  } catch (err) {
    console.error('네이버 로그인 오류:', err.response?.data || err.message);
    return res.status(500).json({ error: '네이버 로그인 처리 실패', details: err.response?.data || err.message });
  }
};

/***************************** 
 * sns 카카오톡 로그인 토큰 받기
*****************************/
export const getKakaoToken = async (req, res) => {
  const { code } = req.body;

  const REST_API_KEY = '3f5c49e05800584ba496c54e74152ab3'; 
  const REDIRECT_URI = 'http://jinair-client.s3-website.ap-northeast-2.amazonaws.com/kakao-redirect'; 

  try {
    // 1. access_token 요청
    const tokenRes = await axios.post(
      'https://kauth.kakao.com/oauth/token',
      new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: REST_API_KEY,
        redirect_uri: REDIRECT_URI,
        code,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const access_token = tokenRes.data.access_token;

    if (!access_token) {
      return res.status(400).json({ error: '카카오 access_token 발급 실패' });
    }

    // 2. 유저 정보 요청
    const userRes = await axios.get('https://kapi.kakao.com/v2/user/me', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const userInfo = userRes.data;
    return res.json({ user: userInfo }); // 프론트에서 postMessage로 받음

  } catch (err) {
    console.error('카카오 로그인 처리 오류:', err.response?.data || err.message);
    return res.status(500).json({
      error: '카카오 로그인 처리 중 오류',
      details: err.response?.data || err.message,
    });
  }
};

/***************************** 
 * sns 간편 로그인 
*****************************/
export const getSnsSignup = async(req, res) =>{
  const result = await repository.getSnsSignup(req.body);
  res.json(result);
  res.end();
};

