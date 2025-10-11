import express from "express";
const app = express();
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import storyRoutes from "./routes/stories.js";
import commentRoutes from "./routes/comments.js";
import likeRoutes from "./routes/likes.js";
import relationshipRoutes from "./routes/relationships.js";
import cors from "cors";
import multer from "multer";
import cookieParser from "cookie-parser";
import { S3Client } from "@aws-sdk/client-s3";
import multerS3 from "multer-s3";
import dotenv from "dotenv";
dotenv.config();

//middlewares
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS.split(","),
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.options("*", cors());

app.use(express.json());
app.use(cookieParser());

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const storage = multerS3({
  s3: s3,
  bucket: process.env.S3_BUCKET_NAME,
  metadata: function (req, file, cb) {
    cb(null, { fieldName: file.fieldname });
  },
  key: function (req, file, cb) {
    cb(null, Date.now().toString() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

app.post("/api/upload", upload.single("file"), (req, res) => {
  res.status(200).json({
    url: req.file.location,
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/stories", storyRoutes);
app.use("/api/relationships", relationshipRoutes);

// Simple route to check if the server is running
app.get('/api/health', (req, res) => {
  res.status(200).send('OK');
});

// Modify this to test CI/CD pipeline
app.get('/api/about', (req, res) => {
  res.status(200).json({ message: 'This is a social media API server. Created by Hoang' });
});

// Get IP address of the server
const METADATA_BASE = "http://169.254.169.254/latest";

export async function getEc2PrivateIp() {
  try {
    // 1️⃣ Tạo session token (IMDSv2)
    const tokenRes = await fetch(`${METADATA_BASE}/api/token`, {
      method: "PUT",
      headers: {
        "X-aws-ec2-metadata-token-ttl-seconds": "21600", // 6 tiếng
      },
      timeout: 1000, // chỉ hỗ trợ qua AbortController, xử lý bên dưới
    });

    if (!tokenRes.ok) throw new Error(`Token request failed (${tokenRes.status})`);

    const token = await tokenRes.text();

    // 2️⃣ Gọi metadata API với token để lấy Private IPv4
    const ipRes = await fetch(`${METADATA_BASE}/meta-data/private-ipv4`, {
      headers: {
        "X-aws-ec2-metadata-token": token,
      },
    });

    if (!ipRes.ok) throw new Error(`Metadata request failed (${ipRes.status})`);

    const ip = await ipRes.text();
    return ip;
  } catch (err) {
    console.error("Không thể lấy private IPv4:", err.message);
    return null;
  }
}

app.get('/api/info', async (req, res) => {
  const ip = await getEc2PrivateIp();
  if (ip) {
    res.status(200).json({ privateIp: ip, message: `Hello from backend EC2 - private IP ${ip}` });
  } else {
    res.status(500).json({ error: "Can't get private IPv4" });
  }
});

app.listen(8800, () => {
  console.log("API working!");
});
