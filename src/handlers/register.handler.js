import { addUser } from "../models/user.model.js";
import { v4 as uuidv4 } from 'uuid';
import { handleConnection, handleDisconnect, handlerEvent } from "./helper.js";

// io : 웹소켓 객체
const registerHandler = (io) => {
    //io.on : 'connection' 이 발생할 때까지 대기할 것 ~ 서버에 접속하는 모든 유저 대상
    io.on('connection', (socket) =>{


        // 플레이어가 처음 접속했을 때 이벤트(등록)
        const userUUID = uuidv4();
        addUser({uuid: userUUID, socketId: socket.id});

        handleConnection(socket, userUUID);

        socket.on('event', (data) => {handlerEvent(io, socket, data)});
        
        // 접속 해제시 이벤트(접속 해제)
        //socket.on : 'disconnect' 이 발생할 때까지 대기할 것 ~ 서버에 접속하는 하나의 대상에 대한 이벤트
        socket.on('disconnect', (socket) => handleDisconnect(socket,userUUID));
    })
}

export default registerHandler;