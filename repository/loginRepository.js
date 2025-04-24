import React from 'react';
import { db } from'./db.js';

/***************************** 
 * 로그인 
*****************************/
export const checkLogin = async(formData) =>{
  const sql =`
    select count(*) as cnt 
    from customer
    where id=? and password =?
  `;

  const values = [formData.id, formData.password];

  const [result] = await db.execute(sql, values);
  return result[0];
};


/***************************** 
 * 아이디 찾기
*****************************/
export const getFindId = async(formData) =>{
  const sql =`
    select id, count(*) as cnt 
      from customer 
     where kname_first = ?
       and kname_last = ?
       and email = ?
  group by id;
  `;

  const values =[formData.kname_first, formData.kname_last, formData.email];
  const [result] = await db.execute(sql, values);
  return result;
};  

/***************************** 
 * 비밀번호 찾기
*****************************/
export const getFindPwd = async(formData) =>{
  const sql =`
  select count(*) as cnt 
    from customer 
   where id= ?
     and kname_first = ?
     and kname_last = ?
     and email = ?
  `;

  const values = [formData.id
                , formData.kname_first
                , formData.kname_last
                , formData.email];

  const [result] = await db.execute(sql, values);
  return result;
}  

/***************************** 
 * 임시 비밀번호 발급
*****************************/
export const updatePwd = async(formData) =>{
  const sql =`
    update customer 
       set password = LEFT(UUID(), 8)
     where id=?
       and kname_first = ?
       and kname_last = ?
       and email= ?;
  `;

  const values = [formData.id
                , formData.kname_first
                , formData.kname_last
                , formData.email];

  const [updateResult] =  await db.execute(sql, values);

  if(updateResult.affectedRows){
    const selectSql=`select password from customer where id =? and email =? `;

    const [getResult]= await db.execute(selectSql, [formData.id, formData.email]);
    console.log('getResult',getResult[0]);
    return getResult[0];
  }
  return updateResult.affectedRows;
};

/***************************** 
 * 아이디 중복체크
*****************************/
export const getIdCheck = async({id})=>{
  const sql =`select count(*) as cnt from customer where id=?`;

  const [result] = await db.execute(sql, [id]);
  return result;
};


/***************************** 
 * 회원가입
*****************************/
export const setSignup = async(formData)=>{
  console.log('레파지토리1',formData);
  const sql =`
    insert into customer (id, password, kname_first, kname_last, ename_first, ename_last
                        , phone, email, gender, birth, reg_date)
    values(?,?,?,?,?,?,?,?,?,?, now());
  `;

  const values = [
    formData.id, 
    formData.password,
    formData.kname_first,
    formData.kname_last,
    formData.ename_first,
    formData.ename_last,
    formData.phone,
    formData.email,
    formData.gender,
    formData.birth
  ];
  const [result] = await db.execute(sql, values);
  return result.affectedRows;
}  


/***************************** 
 * sns 간편 로그인 
*****************************/
export const getSnsSignup = async(formData) =>{
  let data =[];
  const sql =`select count(*) as cnt from customer where email = ?`;
  
  const [result] = await db.execute(sql, [formData.email]);
  const cnt = result[0].cnt;

  if(cnt === 1){
    const sql =`select id, password from customer where email = ?`;
    const [userRes] = await db.execute(sql, [formData.email]);

    const { id, password } = userRes[0];
    return {cnt, id, password};
  }
  return {cnt};
};  