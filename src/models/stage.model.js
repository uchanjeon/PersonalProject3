
// key: uuid, value: array
const stages = {};

// 스테이지 초기화
export const createStage = (uuid) => {
    stages[uuid] = [];
};

// 플레이어(uuid)의 스테이지 위치 찾기
export const getStage = (uuid) => {
    return stages[uuid];
};
// 플레이어(uuid)를 다음 스테이지 위치(id)로 시간(timestamp)을 저장해서 이동시키기
export const setStage = (uuid,id, timestamp) => {
    return stages[uuid].push({ id, timestamp });
};

export const clearStage = (uuid) => {
    stages[uuid] = [];
};