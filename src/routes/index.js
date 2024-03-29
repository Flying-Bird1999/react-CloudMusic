import React from 'react';
import { Redirect } from "react-router-dom";
import Home from '../application/Home/index'
import Recommend from '../application/Recommend/index'
import Singers from '../application/Singers/index'
import Rank from '../application/Rank/index'
import Album from '../application/Album/index'
import Singer from '../application/Singer';
import Search from '../application/Search'

export default [
    {
        path: '/',
        component: Home,
        routes: [
            {
                path: '/',
                exact: true,
                render: ()=> (<Redirect to={"/recommend"}/>)
            },
            {
                path: '/recommend',
                component: Recommend,
                routes: [
                    {
                        path: '/recommend/:id',
                        component: Album
                    }
                ]
            },
            {
                path: '/singers',
                component: Singers,
                routes: [
                    {
                        path: '/singers/:id',
                        component: Singer
                    }
                ]
            },
            {
                path: '/rank',
                component: Rank,
                routes: [
                    {
                        path: "/rank/:id",
                        component: Album
                    }
                ]
            },
            {
                path: "/album/:id",
                exact: true,
                key: "album",
                component: Album
            },
            {
                path: '/search',
                exact: true,
                key: 'search',
                component: Search
            }
        ]
    }
]