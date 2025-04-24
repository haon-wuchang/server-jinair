import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { db } from '../repository/db.js';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images/'); // 저장 폴더
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        const timestamp = Date.now();
        cb(null, `${timestamp}${ext}`);
    }
});

const upload = multer({ storage }).single("file");

export const fileUpload = (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            console.error("업로드 에러:", err);
            return res.status(500).json({ error: "파일 업로드 실패" });
        }

        // 기존 이미지 삭제 조건
        const oldFile = req.body.oldFile;
        if (oldFile) {
            const oldFilePath = path.join("images", oldFile);
            if (fs.existsSync(oldFilePath)) {
                try {
                    fs.unlinkSync(oldFilePath);
                    console.log("이전 파일 삭제 완료:", oldFilePath);
                } catch (error) {
                    console.error("이전 파일 삭제 실패:", error);
                }
            }
        }

        // 새 이미지 경로 구성 및 DB 업데이트
        const { id } = req.body;

        const newPath = `/images/${req.file.filename}`;
        await db.execute(
            `UPDATE customer SET profile_img = JSON_ARRAY(?) WHERE id = ?`,
            [newPath, id]
        );

        // 클라이언트로 응답
        res.json({
            success: true,
            filename: req.file.filename,
            imagePath: newPath,
            original: req.file.originalname
        });
    });
};


// 프로필 이미지 삭제
export const fileDelte = async (req, res) => {
    const { filename, id } = req.body;


    if (!filename) {
        return res.status(400).json({ success: false, message: "파일명이 없습니다." });
    }

    const filePath = path.join("images", filename);

    // 이미지 파일 삭제
    if (fs.existsSync(filePath)) {
        try {
            fs.unlinkSync(filePath);
            console.log("프로필 이미지 삭제 완료:", filePath);
        } catch (error) {
            console.error("파일 삭제 실패:", error);
            return res.status(500).json({ success: false, message: "파일 삭제 실패" });
        }
    }

    // DB profile_img => NULL
    try {
        await db.execute(
            `UPDATE customer SET profile_img = NULL WHERE id = ?`,
            [id]
        );
        return res.json({ success: true, message: "삭제 완료" });
    } catch (err) {
        console.error("DB 업데이트 실패:", err);
        return res.status(500).json({ success: false, message: "DB 업데이트 실패" });
    }
};