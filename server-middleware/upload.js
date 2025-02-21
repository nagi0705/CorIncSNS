require('dotenv').config();
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(express.json());

// アップロードディレクトリを作成（なければ）
const uploadDir = path.join(__dirname, '../static/uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Multerの設定（ファイルの保存先とファイル名設定）
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

// ファイルアップロードの制限（画像・動画のみ）
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only images and videos are allowed.'), false);
    }
};

// アップロードの設定
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 50 * 1024 * 1024 } // 50MB制限
});

// **アップロード用API**
app.post('/api/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'ファイルがアップロードされていません' });
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({ success: true, fileUrl });
});

module.exports = app;