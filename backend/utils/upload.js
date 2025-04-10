const multer = require('multer');
const path = require('path');

// Set storage engine
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

// Initialize upload
const upload = multer({
  storage,
  limits: { fileSize: 1000000 }, // 1MB limit
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  },
});

// Check file type
function checkFileType(file, cb) {
  
    const filetypes = /csv|xlsx/; 
    const allowedMimetypes = [
      'text/csv', 
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ];
  
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    const mimetype = allowedMimetypes.includes(file.mimetype);
  
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb('Error: Only CSV and Excel files are allowed!');
    }
  }




module.exports = upload;