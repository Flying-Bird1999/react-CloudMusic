import React, {useState, useEffect, useCallback, useRef} from 'react';
import { CSSTransition } from 'react-transition-group';
import { Container, ShortcutWrapper, HotKey, List, ListItem, SongItem } from './style';
import SearchBox from './../../baseUI/search-box/index';
import { connect } from 'react-redux';
import { getHotKeyWords, changeEnterLoading, getSuggestList  } from './store/actionCreators';
import Scroll from '../../baseUI/scroll';
import Loading from './../../baseUI/loading/index';
import LazyLoad, {forceCheck} from 'react-lazyload';
import { getName } from '../../api/utils';
import { getSongDetail } from './../Player/store/actionCreators';
import MusicalNote from '../../baseUI/music-note';

function Search (props) {
    // 控制动画
    const [show, setShow] = useState (false);
    const [query, setQuery] = useState ('');

    const {
        hotList,
        enterLoading,
        suggestList: immutableSuggestList,
        songsCount,
        songsList: immutableSongsList
    } = props;

    const suggestList = immutableSuggestList.toJS ();
    const songsList = immutableSongsList.toJS ();

    // 当搜索框为空，展示热门搜索列表
    // 当搜索框有内容时，发送 Ajax 请求，显示搜索结果
    // 点击搜索结果，分别进入到不同的详情页中

    const musicNoteRef = useRef ();


    const {
        getHotKeyWordsDispatch,
        changeEnterLoadingDispatch,
        getSuggestListDispatch,
        getSongDetailDispatch
    } = props;

    useEffect (() => {
        setShow (true);
        // 用了 redux 缓存，不再赘述
        if (!hotList.size)
            getHotKeyWordsDispatch ();
    }, []);

    //由于是传给子组件的方法，尽量用 useCallback 包裹，以使得在依赖未改变，始终给子组件传递的是相同的引用
    const searchBack = useCallback (() => {
        setShow (false);
    }, []);

    const handleQuery = (q) => {
        setQuery (q);
        if (!q) return;
        changeEnterLoadingDispatch (true);
        getSuggestListDispatch (q);
    }

    const selectItem = (e, id) => {
        getSongDetailDispatch (id);
        musicNoteRef.current.startAnimation ({x:e.nativeEvent.clientX, y:e.nativeEvent.clientY});
    }

    const renderHotKey = () => {
        let list = hotList ? hotList.toJS (): [];
        return (
            <ul>
                {
                    list.map (item => {
                        return (
                            <li className="item" key={item.first} onClick={() => setQuery (item.first)}>
                                <span>{item.first}</span>
                            </li>
                        )
                    })
                }
            </ul>
        )
    };



    // 歌手
    const renderSingers = () => {
        let singers = suggestList.artists;
        if (!singers || !singers.length) return;
        return (
            <List>
                <h1 className="title"> 相关歌手 </h1>
                {
                    singers.map ((item, index) => {
                        return (
                            <ListItem key={item.accountId+""+index} onClick={() => props.history.push (`/singers/${item.id}`)}>
                                <div className="img_wrapper">
                                    <LazyLoad placeholder={<img width="100%" height="100%" src={require ('./singer.png')} alt="singer"/>}>
                                        <img src={item.picUrl} width="100%" height="100%" alt="music"/>
                                    </LazyLoad>
                                </div>
                                <span className="name"> 歌手: {item.name}</span>
                            </ListItem>
                        )
                    })
                }
            </List>
        )
    };
    // 歌单
    const renderAlbum = () => {
        let albums = suggestList.playlists;
        if (!albums || !albums.length) return;
        return (
            <List>
                <h1 className="title"> 相关歌单 </h1>
                {
                    albums.map ((item, index) => {
                        return (
                            <ListItem key={item.accountId+""+index} onClick={() => props.history.push (`/album/${item.id}`)}>
                                <div className="img_wrapper">
                                    <LazyLoad placeholder={<img width="100%" height="100%" src={require ('./music.png')} alt="music"/>}>
                                        <img src={item.coverImgUrl} width="100%" height="100%" alt="music"/>
                                    </LazyLoad>
                                </div>
                                <span className="name"> 歌单: {item.name}</span>
                            </ListItem>
                        )
                    })
                }
            </List>
        )
    };
    // 单曲列表
    const renderSongs = () => {
        return (
            <SongItem style={{paddingLeft: "20px"}}>
                {
                    songsList.map(item => {
                        return (
                            <li key={item.id} onClick={(e) => selectItem (e, item.id)}>
                                <div className="info">
                                    <span>{item.name}</span>
                                    <span>
                                      {getName(item.artists)} - {item.album.name}
                                    </span>
                                </div>
                            </li>
                        )
                    })
                }
            </SongItem>
        )
    }

    return (
        <CSSTransition
            in={show}
            timeout={300}
            appear={true}
            classNames="fly"
            unmountOnExit
            onExited={() => props.history.goBack ()}
        >
            <Container play={songsCount}>
                <div className="search_box_wrapper">
                    <SearchBox back={searchBack} newQuery={query} handleQuery={handleQuery}></SearchBox>
                </div>
                <ShortcutWrapper show={!query}>
                    <Scroll>
                        <div>
                            <HotKey>
                                <h1 className="title"> 热门搜索 </h1>
                                {renderHotKey ()}
                            </HotKey>
                        </div>
                    </Scroll>
                </ShortcutWrapper>
                <ShortcutWrapper show={query}>
                    <Scroll onScorll={forceCheck}>
                        <div>
                            {renderSingers ()}
                            {renderAlbum ()}
                            {renderSongs ()}
                        </div>
                    </Scroll>
                </ShortcutWrapper>
                { enterLoading? <Loading></Loading> : null }
                <MusicalNote ref={musicNoteRef}></MusicalNote>
            </Container>
        </CSSTransition>
    )
}

// 映射 Redux 全局的 state 到组件的 props 上
const mapStateToProps = (state) => ({
    hotList: state.getIn (['search', 'hotList']),
    enterLoading: state.getIn (['search', 'enterLoading']),
    suggestList: state.getIn (['search', 'suggestList']),
    songsCount: state.getIn (['player', 'playList']).size,
    songsList: state.getIn (['search', 'songsList'])
});

// 映射 dispatch 到 props 上
const mapDispatchToProps = (dispatch) => {
    return {
        getHotKeyWordsDispatch () {
            dispatch (getHotKeyWords ());
        },
        changeEnterLoadingDispatch (data) {
            dispatch (changeEnterLoading (data))
        },
        getSuggestListDispatch (data) {
            dispatch (getSuggestList (data));
        },
        getSongDetailDispatch (id) {
            dispatch (getSongDetail (id));
        }
    }
};
// 将 ui 组件包装成容器组件
export default connect (mapStateToProps, mapDispatchToProps)(React.memo (Search));