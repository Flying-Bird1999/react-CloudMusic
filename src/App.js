import React from 'react';
import { IconStyle } from './assets/iconfont/iconfont';
import { GlobalStyle } from './style';

import { renderRoutes } from 'react-router-config';//renderRoutes 读取路由配置转化为 Route 标签
import routes from './routes/index'
import { HashRouter } from 'react-router-dom'

import { Provider } from 'react-redux'
import store from './store/index'

import { Data } from './application/Singers/data'

function App () {
    return (
        <Provider store={store}>
            <HashRouter>
                <div className="App">
                    <GlobalStyle></GlobalStyle>
                    <IconStyle></IconStyle>
                    <Data>
                        { renderRoutes(routes) }
                    </Data>
                </div>
            </HashRouter>
        </Provider>
    );
}

export default App;