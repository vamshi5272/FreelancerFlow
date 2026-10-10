import 'dotenv/config'; import express from 'express'; import mongoose from 'mongoose'; import cors from 'cors'; import helmet from 'helmet'; import rateLimit from 'express-rate-limit';
import auth from './src/auth.js'; import api from './src/data.js';
const app=express(); app.use(helmet()); app.use(cors({origin:process.env.CLIENT_ORIGIN||'http://localhost:5173'})); app.use(express.json({limit:'1mb'})); app.use('/api',rateLimit({windowMs:900000,limit:300}));
app.get('/api/health',(_q,r)=>r.json({ok:true})); app.use('/api/auth',auth); app.use('/api',api);
app.use((e,_q,r,_n)=>{console.error(e);r.status(e.status||500).json({message:e.message||'Server error'});});
if(!process.env.MONGODB_URI||!process.env.JWT_SECRET){console.error('Configure MONGODB_URI and JWT_SECRET in .env');process.exit(1);}
mongoose.connect(process.env.MONGODB_URI).then(()=>app.listen(process.env.PORT||5000,()=>console.log('API running on http://localhost:'+(process.env.PORT||5000)))).catch(e=>{console.error(e.message);process.exit(1)});
