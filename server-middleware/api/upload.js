require('dotenv').config();
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(express.json());

// 📌 アップロードフォルダのパス
const uploadDir = path.join(__dirname, '../../static/uploads');

// フォルダが存在しない場合は作成
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// 📌 Multer設定（ファイルの保存先とファイル名）
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        const filename = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}${ext}`;
        cb(null, filename);
    }
});

// 📌 ファイルフィルター（画像・動画のみ）
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
        cb(null, true);
    } else {
        cb(new Error('無効なファイルタイプです（画像・動画のみ許可）'), false);
    }
};

// 📌 アップロード制限（50MB）
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 50 * 1024 * 1024 }
});

/**
 * 📌 ファイルアップロードAPIエンドポイント
 * POST /api/upload
 */
app.post('/api/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'ファイルがアップロードされていません' });
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({ success: true, fileUrl });
});

module.exports = app;