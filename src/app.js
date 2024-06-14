import express from "express";
import {createServer} from 'http';
import initSocket from "./init/socket.js";
import { loadGameAssets } from "./init/asset.js";

const app = express();
const server = createServer(app);

const PORT = 3000;
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static('public'))
initSocket(server);

app.get('/', (req,res,next) => {
    res.send("Hello This is Personal Project Server made by jwc");
});

server.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);

    try {
        // 이곳에서 파일 읽음
        const assets = await loadGameAssets();
        console.log(assets);
        console.log('Assets loaded successfully');
    }catch (err) {
        console.error(`Server is running on PORT : ${PORT}`);
    };
});