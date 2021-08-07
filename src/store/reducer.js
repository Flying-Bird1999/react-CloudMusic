// 从这里取state是一个immutable对象
import { combineReducers } from 'redux-immutable';
import { reducer as recommendReducer  } from '../application/Recommend/store/index'
import { reducer as singersReducer } from '../application/Singers/store/index'
import { reducer as rankReducer } from '../application/Rank/store/index'
import { reducer as albumReducer } from '../application/Album/store/index'

export default combineReducers ({
    // 之后开发具体功能模块的时候添加 reducer
    recommend: recommendReducer,
    singers: singersReducer,
    rank: rankReducer,
    album: albumReducer
});