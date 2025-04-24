import { db } from './db.js'

/*************************
 * 예약 정보 삽입
 *************************/  

export const payment = ({ id, fnum, passenger_names }) => {
  const setResNum = `
    SET @res_num = CONCAT(
      CHAR(FLOOR(RAND() * 26) + 65),
      LPAD(FLOOR(RAND() * 100), 2, '0'),
      CHAR(FLOOR(RAND() * 26) + 65),
      LPAD(FLOOR(RAND() * 10), 1, '0'),
      CHAR(FLOOR(RAND() * 26) + 65)
    );
  `;

  const cleanedPassengerNames = passenger_names.map(name =>
    name.trim().replace(/\s+/g, '')
  );

  const passengerJSON = JSON.stringify(cleanedPassengerNames);

  let insertQuery;
  let insertParams;

  if (fnum.length === 1) {
    insertQuery = `
      INSERT INTO reservation (id, fnum, passenger_name, res_num, res_date)
      VALUES (?, ?, CAST(? AS JSON), @res_num, NOW());
    `;
    insertParams = [id, fnum[0], passengerJSON];
  } else if (fnum.length === 2) {
    insertQuery = `
      INSERT INTO reservation (id, fnum, passenger_name, res_num, res_date)
      VALUES 
        (?, ?, CAST(? AS JSON), @res_num, NOW()),
        (?, ?, CAST(? AS JSON), @res_num, NOW());
    `;
    insertParams = [
      id, fnum[0], passengerJSON,
      id, fnum[1], passengerJSON
    ];
  } else {
    return Promise.reject(new Error('fnum 배열의 길이가 유효하지 않습니다.'));
  }

  return db.execute(setResNum)
    .then(() => db.execute(insertQuery, insertParams));
};




/*************************
 * 차트 정보 정보 조회
 *************************/
export const active = async (data) => {
  const sql = `
    SELECT 
      D_acode, 
      Arrive_date, 
      AVG(basic_price) AS average_price 
    FROM flight 
    WHERE D_acode = ? 
    GROUP BY Arrive_date;
  `;
  const [result] = await db.execute(sql, [data.d_acode]); // 데이터의 d_acode 값에 맞춰서 "tak" 같은 값을 전달
  return result;
};
 
/*************************
 * 비행기 정보 조회 (Repository)
 *************************/

export const flight = async (flightNumber) => {
  const sql = `SELECT * FROM flight WHERE fNUM = ?`;

  try {
    const [result] = await db.execute(sql, [flightNumber]); 
    return { result_rows: result };
  } catch (error) {
    console.error('SQL Error:', error);
    throw new Error('항공편 조회 중 오류가 발생했습니다.');
  }
};
/***************************
 * lowest 조회
 ***************************/
export const getLowestPricesByDate = async (conn) => {
  const sql = `
    WITH RankedFlights AS (
  SELECT 
    DATE(Departure_date) AS flight_date, 
    Departure_location AS name,
    basic_price AS min_basic_price,
    ROW_NUMBER() OVER (PARTITION BY DATE(Departure_date) ORDER BY basic_price ASC) AS rn
  FROM 
    flight
)
SELECT 
  flight_date,
  name,
  min_basic_price
FROM 
  RankedFlights
WHERE 
  rn = 1
ORDER BY 
  flight_date ASC;

  `;
  const [rows] = await conn.query(sql);
  return rows;
};
