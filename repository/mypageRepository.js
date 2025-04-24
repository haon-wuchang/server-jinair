

import { db } from './db.js'

/************************************
 *       회원정보 불러오기
************************************/
export const getMyInfo = async (data) => {
  const sql = `select id,
		password,
        kname_first,
        kname_last,
        ename_first,
        ename_last,
        phone,
        profile_img,
        reg_date,
        zipcode,
        gender,
        email,
        detail_address,
		birth,
        country,
        nationality
		from customer 
    where id = ?`
  const [result] = await db.execute(sql, [data.id]);
  return { result_rows: result };
};


/************************************
 *       회원정보 수정
************************************/
export const updateMyInfo = async (data) => {
  const sql = `
    UPDATE customer SET 
      email = ?,
      phone = ?,
      nationality = ?,
      country = ?,
      zipcode = ?,
      address = ?,
      detail_address = ?,
      password = ?
    WHERE id = ?
  `;


  const values = [
    data.email ?? null,
    data.phone ?? null,
    data.nationality ?? null,
    data.residence ?? null,
    data.zipcode || null, // int라 없을경우 null로 변환
    data.address ?? null,
    data.detail_address ?? null,
    data.password ?? null,
    data.id ?? null
  ];

  await db.execute(sql, values);

  const [result] = await db.execute(`SELECT * FROM customer WHERE id = ?`, [data.id]);
  return result[0];
};



/************************************
 *       비밀번호 체크 
************************************/
export const checkPwd = async (id, password) => {
  const sql = `SELECT password FROM customer WHERE id = ?`;
  const [rows] = await db.execute(sql, [id]);
  return rows.length > 0 && rows[0].password === password;
};



/************************************
 *      나의 예약 불러오기
************************************/


export const getMyRes = async ({ id }) => {
  const sql = `
    
              select 
                  r.id,
                  r.fnum,
                  r.res_num,
                  r.passenger_name,
                  r.res_date,
                  f.departure_location,
                  f.d_acode,
                  f.departure_date,
                  f.arrive_location,
                  f.a_acode,
                  f.arrive_date
          from reservation r
          join flight f ON r.fnum = f.fnum
          where r.id = ?
        order by r.res_num, f.departure_date
    
    `;

  const [rows] = await db.execute(sql, [id]);

  //res_num(예약번호) 기준으로 그룹핑
  const resMap = new Map();

  for (const row of rows) {
    if (!resMap.has(row.res_num)) {
      resMap.set(row.res_num, []);
    }
    resMap.get(row.res_num).push(row);
  }

  const grouped = Array.from(resMap.values());
  return grouped;
};



/************************************
 *       관심 지역 불러오기
************************************/

export const getInterest = async ({ id }) => {
  const sql = `select interest_area from customer where id = ?`
  const [result] = await db.execute(sql, [id]);
  return result
};


/************************************
 *        관심지역 추가하기
************************************/
export const updateInterest = async ({ id, checkList }) => {
  const sql = `UPDATE customer SET interest_area = ? WHERE id = ?`;
  const values = [JSON.stringify(checkList), id];
  const [result] = await db.execute(sql, values);

  return result;
};



/************************************
 *        나의 사용가능 쿠폰 조회
************************************/


export const getMyCoupon = async ({ id }) => {
  const sql = `select * from coupon where id = ? and used = 0`;
  const [result] = await db.execute(sql, [id]);

  return result;
};


/************************************
 *      나의 쿠폰 카운트
************************************/

export const couponCount = async ({ id }) => {
  const sql = `
  SELECT COUNT(*) AS coupon_count
    FROM coupon
    WHERE id = ? and used = 0`;
  const [result] = await db.execute(sql, [id]);

  return result;
};


/************************************
 *      나의 쿠폰 사용 (특정 쿠폰)
************************************/

export const applyCoupon = async ({ id, couponCode }) => {
  const sql = `
  UPDATE coupon
    SET used = 1
    WHERE id = ? AND coupon_code = ? `

  const [result] = await db.execute(sql, [id, couponCode]);

  return result;
};


/************************************
 *    테마별 항공권 가져오기
************************************/

export const customTheme = async ({ category }) => {
  const sql = `
  SELECT p.promo_area,
          p.category,
          p.images,
          p.A_acode, 
          f.Departure_location Departure_location, 
          f.D_acode, 
          f.Arrive_location, 
          f.Departure_date, 
          f.basic_price
  FROM promotion p
    JOIN flight f ON p.A_acode = f.A_acode
    WHERE JSON_CONTAINS(p.category, ?)
    ORDER BY f.Departure_date ASC    
`;

  const categoryStr = JSON.stringify(category);
  const [result] = await db.execute(sql, [categoryStr]);

  return result;
};


/*******************************************************************
 * 유저가 설정한 관심지역 항공권 리스트 가져오기
 * 유저 관심지역이 국가명으로만 저장되므로 여기서 도착지 공항코드로 매핑함
********************************************************************/
export const customArea = async ({ id }) => {


  // 관심지역 먼저 불러오기 (위의 관심 지역 기존 로직 재사용)
  const [row] = await getInterest({ id });
  const interest = row?.interest_area || [];
  if (!interest.length) return [];

  //관심지역에 해당하는 지역 공항코드
  const areaList = {
    "일본": ["FUK", "ISG", "KKJ", "NGO", "OKA", "KIX", "CTS", "TAK", "NRT"],
    "중국": ["PVG", "CGO"],
    "홍콩": ["HKG"],
    "마카오": ["MFM"],
    "대만": ["RMQ", "TPE"],
    "베트남": ["DAD", "CXR", "PQC"],
    "말레이시아": ["BKI"],
    "필리핀": ["TAG", "CEB", "CRK"],
    "괌": ["GUM"],
    "태국": ["BKK", "HKT"]
  };

  // 관심국가를 A_acode(도착지 공항코드) 목록으로 변환
  const acodeList = interest.flatMap(country => areaList[country] || []);
  if (!acodeList.length) return [];

  // A_acode(도착지 공항코드)에 해당하는 항공편 정보 조회
  const questionMarks = acodeList.map(() => '?').join(',');

  const sql = `
    SELECT  
        p.promo_area AS promo_area,
        p.images AS images,
        p.A_acode AS A_acode, 
        f.Departure_location AS Departure_location, 
        f.D_acode AS D_acode, 
        f.Arrive_location AS Arrive_location, 
        f.Departure_date AS Departure_date, 
        f.basic_price AS basic_price
    FROM promotion p
    JOIN flight f ON p.A_acode = f.A_acode
    WHERE p.A_acode IN (${questionMarks})
    ORDER BY f.Departure_date ASC;
  `;
  const [result] = await db.execute(sql, acodeList);
  return result;
};



/************************************
 *        나의 사용가능 쿠폰 조회
************************************/


export const getMyQna = async ({ id }) => {
  const sql = `SELECT TITLE, CONTENT, REG_DATE, 
    category, comment, adminTitle, adminContent, customer_id AS id,
     (
    SELECT CONCAT('http://15.164.97.230:9001/', jt.img)
    FROM JSON_TABLE(
      JSON_UNQUOTE(qnaImg->>'$[0]'),
      '$[*]' COLUMNS (
        img VARCHAR(255) PATH '$'
      )
    ) AS jt
    LIMIT 1
  ) AS image
FROM qna 
WHERE customer_id = ? `;
  const [result] = await db.execute(sql, [id]);

  return result;

};
