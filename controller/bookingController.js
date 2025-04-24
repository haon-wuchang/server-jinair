import * as repository from '../repository/bookingRepository.js';

/***************************** 
 * 항공권 선택 페이지
 * 예약 가능 항공권 조회
*****************************/
export const getOnewayList = async(req, res) => {
    const result = await repository.getOnewayList(req.body);
    res.json(result);
    res.end();
}

/***************************** 
 * 항공권 선택 페이지
 * 선택한 날짜 최저가 
*****************************/
export const getLowPrice = async(req, res) => {
    const result = await repository.getLowPrice(req.body);
    res.json(result);
    res.end();
}

/***************************** 
 * 탑승객 정보 입력 페이지
 * 예매자 정보 호출
*****************************/
export const getUserInfo = async(req, res) => {
    const result = await repository.getUserInfo(req.body);
    res.json(result);
    res.end();
}

/***************************** 
 * 좌석 선택 페이지
 * 좌석 정보 호출
*****************************/
export const getSeats = async(req, res) => {
    const result = await repository.getSeats(req.body);
    res.json(result);
    res.end();
}