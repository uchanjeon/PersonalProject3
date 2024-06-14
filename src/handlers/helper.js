import { CLIENT_VERSION } from "../constants.js";
import { getGameAssets } from "../init/asset.js";
import { createStage, getStage, setStage } from "../models/stage.model.js";
import { getUser, removeUser } from "../models/user.model.js";
import handlerMapplings from "./handlerMapping.js";


export const handleDisconnect = (socket, uuid) => {
    removeUser(socket.id);
    console.log(`User disconnected : ${socket.id}`);
    console.log(`Current users : `, getUser());

}

export const handleConnection = (socket, uuid) => {
    console.log(`New player connected : socket ID: ${socket}, player ID : ${uuid}`);
    console.log(`Current users :`, getUser());

    createStage(uuid);
    // 'connection'이라는 이벤트를 통해서 player에게 id알려주기
    socket.emit('connection', { uuid });
}

export const handlerEvent = (io, socket, data) => {
    if ( !CLIENT_VERSION.includes(data.clientVersion) ) {
        socket.emit('response', {status: 'fail', message: 'Client version do not match'});
        return;
    }

    const handler = handlerMapplings[data.handlerId];
    if ( !handler ) {
        socket.emit('response', {status: 'fail', message: 'Handler not found'});
        return;
    }

    const response = handler(data.userid, data.payload);

    // player 모두에게 전달할 경우
    if( response.broadcast ) {
        io.emit('response', 'broadcast');
        return;
    }
    // player 한명에게 전달할 경우
    socket.emit('response', response);
}