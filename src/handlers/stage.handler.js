import { getGameAssets } from "../init/asset.js";
import { getStage, setStage } from "../models/stage.model.js";


export const moveStageHandler = (userId, payload) => {

    // 유저는 스테이지를 하나씩 올라갈 수 있다.
    // - 현재 유저의 스테이지 위치 정보
    let currentStages = getStage(userId);
    if ( !currentStages ) {
        return { status: 'fail', message: 'No stages found for user' }
    }

    // - 오름차순 >>> 가장 큰 스테이지 id를 확인 >>> 유저의 현재 스테이지
    currentStages.sort((a,b) => a.id - b.id);
    const currentStage = currentStages[currentStages.length -1];

    // - 클라이언트 정보와 서버의 정보 비교
    if ( currentStage.id !== payload.currentStage) {
        return { status: 'fail', message: "Current Stage do not match" }
    }
 
    // - 점수 검증
    const serverTime = Date.now();
    const elapsedTime = (serverTime - currentStage.timestamp)/1000;

 
    // 수정 필요함------------------------------------------------------------------------------------------------------
    if (elapsedTime < 100 || elapsedTime > 105) {
        return { status: 'fail', message: 'Invalid elapsed time'};
    }

    // - 다음 스테이지(targetStage)에 대한 검증 >>> 게임에셋에 존재하는지
    const {stages} = getGameAssets();
    if ( !stages.data.some((stage) => stage.id === payload.targetStage)) {
        return { status: 'fail', message: "Target Stage not found" };
    }


    // 유저는 일전 점수 이상이면 다음 페이지로 이동한다.(저장)
    setStage(userId, payload.targetStage, serverTime);

    return { status : "success" }
}
