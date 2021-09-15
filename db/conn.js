import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const DB = process.env.DATABASE

mongoose.connect(DB,
    {useNewUrlParser: true,
    useUnifiedTopology:true,
})
.then(() => {console.log(`Connection successful`)
})
.catch((err) => console.log(err));
