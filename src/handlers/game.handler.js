// 게임 시작 종료 프로토콜
import { getGameAssets } from '../init/asset.js';
import { getStage, setStage, clearStage } from '../models/stage.model.js';

export const gameStart = (uuid, payload) => {

    const { stages } = getGameAssets();

    clearStage(uuid);
    
    // stages 배열에서 0번쨰 스테이지에 player 입장시키기
    setStage(uuid, stages.data[0].id, payload.timestamp);
    console.log(`Stage :`, getStage(uuid));

    return { status: "success" }
}
export const gameEnd = (uuid, payload) => {
    // player가 게임 종료 시 타임스탬프와 총 점수 알려주기
    const {timestamp: gameEndTime,score} = payload;
    const stages = getStage(uuid);

    if(!stages.length) {
        return { status: 'fail', message: "No stages found for user"};
    }

    //각 스테이지의 지속 시간을 계산하여 총 점수 계산
    stages.forEach((stage, index) => {
        let stageEndTime;
        if (index === stages.length -1) {
            stageEndTime = gameEndTime;
        } else {
            stageEndTime = stages[index+1].timestamp;
        }

        const stageDuration = (stageEndTime - stage.timestamp)/1000;
        totalScore += stageDuration;
    })

    //점수와 타임스탬프 검증
    // 오차 범위 : 5
    if (Math.abs(score - totalScore) > 5) {
        return { status: "fail", message: "Score verification failed"};
    }

    return { status: "success", message: "Game Ended", score }
}