
import * as repository from '../repository/paymentRepository.js';
import { getConnection } from '../repository/db.js';

/***************************** 
 * Reservation 
*****************************/

export const payment = (req, res) => {
    repository.payment(req.body)
        .then(result => {
            res.json({ success: true, data: result });
        })
        .catch(error => {
            // 에러 메시지 전달
            res.status(500).json({
                success: false,
                message: error.message || '예약 처리 중 오류가 발생했습니다.'
            });
        });
}; 

/*****************************
 * flight
 *****************************/

export const flight = (req, res) => {
    const { flightNum } = req.body; // 클라이언트에서 통일한 키 이름으로 변경
  
    // 유효성 검사: flightNum이 없으면 바로 400 반환
    if (!flightNum) {
      return res.status(400).json({ success: false, message: '항공편 번호가 제공되지 않았습니다.' });
    }
  
    repository.flight(flightNum) // repository 함수 호출 시 flightNum 전달
      .then(result => {
        if (!result || result.result_rows.length === 0) {
          return res.status(404).json({ success: false, message: '해당 항공편이 없습니다.' });
        }
        res.json({ success: true, flight: result.result_rows });
      })
      .catch(error => {
        console.error('Error in flight repository:', error); // 디버깅을 위한 로깅 유지
        res.status(500).json({ success: false, message: error.message });
      });
  };

/******************
 * 최저가 조회
 *****************/   
export const lowest = (req, res) => {
  getConnection()
    .then((connection) => {
      // 날짜별 최저가를 구하는 쿼리 실행
      return repository.getLowestPricesByDate(connection);
    })
    .then((rows) => {
      res.json(rows);  // 날짜별 최저가 정보 전달
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Internal Server Error');
    });
};
