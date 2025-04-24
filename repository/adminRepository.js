import { db } from "./db.js";



/***************************
 * 1. 어드민 로그인
 ***************************/
export const getAdminLogin = async(formData) => {
  const sql =`
        select count(*) as cnt from admin 
        where aid =? 
        and password =? 
  `;

  const values = [ formData.id, formData.password ];

  const [result] = await db.execute(sql, values);
  return result[0];
};

/***************************
 * 2. 비행 리스트 조회
 ***************************/
export const getFlightList = async() =>{
  const sql=`
    SELECT  ROW_NUMBER() OVER (ORDER BY departure_date desc) AS no
            , departure_location
            , d_acode
            , arrive_location
            , a_acode
            , fnum
            , date_format(departure_date, '%Y-%m-%d %H-%I:%S') AS  departure_date
            , format(basic_price, 0) as price
    FROM flight;
 `;

 const [result] = await db.execute(sql);
 return result;
};

/***************************
 * 3. 항공권 등록 fnum 조회
 ***************************/
export const getFnum = async() =>{
  const sql =`
    select max(fnum) as fnum from flight;
  `;

  const [result] = await db.execute(sql);
  return result[0].fnum;
};


/***************************
 * 4. 항공권 등록
 ***************************/
export const setFlightRegister = async(formData) =>{
  const flightSql =`
  insert into flight
  values(?,?, ?,?,?,?, ?,?, 188,180,8, ?,?)
  `;

  const flightValues = [
    formData.fnum ,
    formData.pnum ,
    formData.departure_location ,
    formData.d_acode ,
    formData.arrive_location ,
    formData.a_acode ,
    formData.departure_date ,
    formData.arrive_date ,
    formData.basic_price ,
    formData.premium_price 
  ];

  const seatList = [
    "28A", "28B", "28C", "28D", "28E", "28F",
    "29A", "29B", "29C", "29D", "29E", "29F",
    "30A", "30B", "30C", "30D", "30E", "30F",
    "31A", "31B", "31C", "31D", "31E", "31F",
    "32A", "32B", "32C", "32D", "32E", "32F",
    "33A", "33B", "33C", "33D", "33E", "33F",
    "34A", "34B", "34C", "34D", "34E", "34F",
    "35A", "35B", "35C", "35D", "35E", "35F",
    "36A", "36B", "36C", "36D", "36E", "36F",
    "37A", "37B", "37C", "37D", "37E", "37F",
    "38A", "38B", "38C", "38D", "38E", "38F",
    "39A", "39B", "39C", "39D", "39E", "39F",
    "40A", "40B", "40C", "40D", "40E", "40F",
    "41A", "41B", "41C", "41D", "41E", "41F",
    "42A", "42B", "42C", "42D", "42E", "42F",
    "43A", "43B", "43C", "43D", "43E", "43F",
    "44A", "44B", "44C", "44D", "44E", "44F",
    "45A", "45B", "45C", "45D", "45E", "45F",
    "46A", "46B", "46C", "46D", "46E", "46F",
    "47A", "47B", "47C", "47D", "47E", "47F",
    "48A", "48B", "48C", "48D", "48E", "48F",
    "49A", "49B", "49C", "49D", "49E", "49F",
    "50A", "50B", "50C", "50D", "50E", "50F",
    "51A", "51B", "51C", "51D", "51E", "51F",
    "52A", "52B", "52C", "52D", "52E", "52F",
    "53A", "53B", "53C", "53D", "53E", "53F",
    "54A", "54B", "54C", "54D", "54E", "54F",
    "55A", "55B", "55C", "55D", "55E", "55F",
    "56A", "56B", "56C", "56D", "56E", "56F",
    "57A", "57B", "57C", "57D", "57E", "57F"
  ];
  const premiumList = ["7A", "7B", "7D", "7E", "8A", "8B", "8D", "8E"];

  const seatSql = `
    INSERT INTO seats (fNUM, basic_seats, reserved_basic, premium_seat, reserved_premium)
    VALUES (?, ?, NULL, ?, NULL)
  `;

  const [result] = await db.execute(flightSql, flightValues);
  if(result.affectedRows ===1 ){
    const result = await db.execute(seatSql, [ formData.fnum, JSON.stringify(seatList), JSON.stringify(premiumList) ]);
    return result[0].affectedRows;
  }
   return result.affectedRows;
  };  


/***************************
 * 5. 항공권 삭제
 ***************************/
export const deleteFlight = async({fnums}) =>{
  const list = fnums.map(()=>'?').join(',');
  const sql =`delete from flight where fnum in (${list})`;
  
  const [result] = await db.execute(sql, fnums);
  return result.affectedRows;
};


/***************************
 * 6. 항공권 검색
 ***************************/
export const getsearchflightlist = async({type, keyword}) =>{
  const sql =`
    SELECT  ROW_NUMBER() OVER (ORDER BY departure_date desc) AS no
            , departure_location
            , d_acode
            , arrive_location
            , a_acode
            , fnum
            , date_format(departure_date, '%Y-%m-%d %H-%I:%S') AS  departure_date
            , format(basic_price, 0) as price
    FROM flight
    where ${type} LIKE ?;
  `;

  const value = `%${keyword}%`;

  const [result] = await db.execute(sql, [value]);
  return result;
};


/***************************
 * 7. 공지사항 리스트 조회
 ***************************/
export const getNoticeList = async() =>{
  const sql =` 
      select  ROW_NUMBER() OVER (ORDER BY reg_date desc) AS no
              , num
              , title 
              , date_format(reg_date, '%Y-%m-%d %H-%I:%S') AS  reg_date 
      from notice 
      where type = 'n'  `;

  const [result] = await db.execute(sql);
  return result;
}; 

/***************************
 * 8. 공지사항 삭제 로직
 ***************************/
export const deleteNoticeList = async({nums})=>{
  const list = nums.map(()=>'?').join(',');
  const sql =`delete from notice where num in (${list})`;
 
  const [result] = await db.execute(sql, nums);
  return result.affectedRows;
} 

/***************************
 * 9. 공지사항 검색 로직
 ***************************/
export const getSearchNoticeList = async({keyword})=>{
  
 const sql =`
  select  ROW_NUMBER() OVER (ORDER BY reg_date desc) AS no
          , num
          , title 
          , date_format(reg_date, '%Y-%m-%d %H-%I:%S') AS  reg_date 
  from   notice 
  where  type = 'n'
    and  title like ?; 
 `;
 
  const [result] = await db.execute(sql, [`%${keyword}%`]);
  return result;
} 

/***************************
 * 10. 공지사항 등록 로직
 ***************************/
export const setNoticeRegister = async(inputData) =>{
  const sql =`
    insert into notice(type, title, content, reg_date)
    values(?,?,?, NOW());
 `;
  const values = ['N',inputData.title, inputData.content];
  const [result] = await db.execute(sql, values);
  return result.affectedRows;
};

/***************************
 * 11. 공지사항 상세페이지 조회 로직
 ***************************/
export const getNoticeInfo = async({num}) =>{
  const sql =`select title, content from notice where num =?`;

  const value = Number(String(num).replace(/^:/, ''));
  const [result] = await db.execute(sql, [value]);
  return result[0];
};

/***************************
 * 12. 공지사항 상세페이지 업데이트 로직
 ***************************/
export const updateNoticeInfo = async(dataToSend) =>{
  const sql =`update notice set title=?, content=? where num=?`;
  const values= [dataToSend.title, dataToSend.content, Number(String(dataToSend.num).replace(/^:/, ''))];

  const [result] = await db.execute(sql, values);
  return result.affectedRows;
}