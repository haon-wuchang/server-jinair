import { db } from './db.js';

/***************************** 
 * 항공권 선택 페이지
 * 예약 가능 항공권 조회
*****************************/
export const getOnewayList = async({departure, arrive, startDate}) => {
    const date = startDate.replace(/\(.*\)/g, '').trim().replace(/\./g, '-');

    const sql = `
        select fNUM,
                pnum,
                Departure_location,
                left(Departure_date, 10) as Departure_date,
                right(Departure_date, 8) as Departure_time,
                D_acode,
                Arrive_location,
                left(Arrive_date, 10) as Arrive_date,
                right(Arrive_date, 8) as Arrive_time,
                A_acode,
                basic_price,
                premium_price
        from flight
        where Arrive_location = ?
            and Departure_location = ?
            and left(Arrive_date, 10) = ?
    `;

    const values = [departure, arrive, date];

    const [result] = await db.execute(sql, values);

    return result;
}

/***************************** 
 * 탑승객 정보 입력 페이지
 * 예매자 정보 호출
*****************************/
export const getUserInfo = async({id}) => {
    // console.log("아이디 확인 --> ", id);
    
    const sql = `
    select id,
            email,
            phone,
            kname_first,
            kname_last,
            birth,
            gender
    from customer
    where id = ?
    `;
    
    const [result] = await db.execute(sql, [id]);

    // console.log("정보 확인 --> ", result);
    return {"result": result[0]};
}

/***************************** 
 * 좌석 선택 페이지
 * 좌석 정보 호출
*****************************/
export const getSeats = async({fnum}) => {
    const sql = `
    select *
    from seats
    where fNUM = ?
    `;
    
    const [result] = await db.execute(sql, [fnum]);

    // return result;
    return {"result": result[0]};
}