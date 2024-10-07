const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Настройка CORS
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Настройка хранения файлов
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

// Создание папки для загрузок
const fs = require('fs');
const uploadsDir = './uploads';
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

// Эндпоинт для загрузки видео
app.post('/api/videos', upload.single('video'), (req, res) => {
    res.json({ message: 'Video uploaded successfully', file: req.file });
});

// Маршрут для получения списка видео файлов
app.get('/api/videos', (req, res) => {
  const uploadsDir = path.join(__dirname, 'uploads');
  fs.readdir(uploadsDir, (err, files) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Ошибка при чтении папки uploads' });
    }
    // Фильтруем только файлы с расширением .mp4
    const videoFiles = files.filter(file => path.extname(file).toLowerCase() === '.mp4');
    // Формируем массив объектов с информацией о файлах
    const videos = videoFiles.map(file => ({
      name: file,
      url: `/uploads/${file}`
    }));
    res.json(videos);
  });
});

// Маршрут для удаления видео файла
app.delete('/api/videos/:fileName', (req, res) => {
  const fileName = req.params.fileName;
  const filePath = path.join(__dirname, 'uploads', fileName);
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Ошибка при удалении файла' });
    }
    res.json({ message: 'Файл успешно удален' });
  });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
