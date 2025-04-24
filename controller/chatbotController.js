import * as repository from '../repository/chatbotRepository.js';

// 나라 데이터 가져오기
export const getCountry = async(req, res) =>{
  let result = await repository.getCountry(req.body);
  res.json(result);
  res.end();
};

// 비행 스케쥴 있는지 조회
export const searchSchedule = async(req, res) =>{
  // console.log('하온테스트',req.body);  
  let result = await repository.searchSchedule(req.body);
  res.json(result);
  res.end();
};

// 비행 스케쥴 정보가져오기
export const getSchedule = async(req, res) =>{
  // console.log('하온테스트',req.body);  
  let result = await repository.getSchedule(req.body);
  res.json(result);
  res.end();
};

// 비행 스케쥴 있는지 조회 airplane
export const searchAirplane = async(req, res) =>{
  // console.log('하온테스트',req.body);  
  let result = await repository.searchAirplane(req.body);
  res.json(result);
  res.end();
};

// 당월 최저가 가져오기 출발지 도착지 가격
export const searchMonthCheap = async(req, res) =>{
  // console.log('하온테스트',req.body);  
  let result = await repository.searchMonthCheap(req.body);
  res.json(result);
  res.end();
};


// 예약번호 아이디로 예약조회
export const searchReservation = async(req, res) =>{
  // console.log('하온테스트',req.body);  
  let result = await repository.searchReservation(req.body);
  res.json(result);
  res.end();
};

// 예약정보 가져오기
export const getReservation = async(req, res) =>{
  // console.log('하온테스트',req.body);  
  let result = await repository.getReservation(req.body);
  res.json(result);
  res.end();
};




// qna 이미지 저장소
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'upload_files/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
})

export const QnaUpload = (req, res) => {
  const maxFiles = parseInt(req.query.maxFiles);
  const fupload = multer({ storage: storage }).array('files', maxFiles);

  fupload(req, res, (err) => {
    if (err) {
      console.log(err);
    } else {
      const oldFileArray = req.body.oldFiles.split(",");

      for (const oldFile of oldFileArray) {
        if (oldFile) {
          const oldFilePath = path.join('upload_files/', oldFile);
          if (fs.existsSync(oldFilePath)) {
            try {
              fs.unlinkSync(oldFilePath);
            } catch (error) {
              console.error('이전파일 삭제실패', error);
            }
          }
        } // if문 end
      }  //for 문 end
      let uploadFileName = [];
      let sourceFileName = [];
      let oldFile = [];

      for (const file of req.files) {
        // 웹에서 사용 가능한 경로로 통일
        const webPath = 'upload_files/' + file.filename; // 경로 통일
        uploadFileName.push(webPath); // ex: upload_files/1743747265618-945236041-ad1.jpeg
        sourceFileName.push(file.originalname);
        oldFile.push(file.filename);
      }

      res.json({
        uploadFileName: uploadFileName,
        sourceFileName: sourceFileName,
        oldFile: oldFile
      });
    }
  });
}


// qna 이미지 등록
export const registerQna = async(req,res) => {
  // console.log(req.body);
    const result = await repository.registerQna(req.body);
    res.json(result); 
    res.end();
}

//qna 테이블 정보 전체 가져오기
export const getQnaAll = async(req,res) => {
    const result = await repository.getQnaAll(req.body);
    res.json(result); 
    res.end();
}

// qna 상세 정보 조회
export const getQna = async(req,res) => {  
  const result = await repository.getQna(req.body.qid);  
  res.json(result); 
  res.end();
}
// qna 상세 정보 조회
export const detailNotImg = async(req,res) => {  
  const result = await repository.detailNotImg(req.body.qid);  
  res.json(result); 
  res.end();
}


// qna 답변여부 업데이트
export const updateComment = async(req,res) => {  
  // console.log(req.body);
  
  const result = await repository.updateComment(req.body);  
  res.json(result); 
  res.end();
}

// 체크인 정보있는지 조회
export const checkCheckIn = async(req, res) =>{
  // console.log('하온테스트',req.body);  
  let result = await repository.checkCheckIn(req.body);
  res.json(result);
  res.end();
};

// 고객정보가져오기
export const getCustomerInfo = async(req, res) =>{
  // console.log('하온테스트',req.body);  
  let result = await repository.getCustomerInfo(req.body);
  res.json(result);
  res.end();
};