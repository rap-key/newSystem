import React, { useState, useEffect } from 'react'
import { Spin } from 'antd'
import { connect } from 'react-redux'
import axios from 'axios'
import Home from '../../views/sandbox/home/Home'
import UserList from '../../views/sandbox/user-manage/UserList'
import RightList from '../../views/sandbox/right-manage/RightList'
import RoleList from '../../views/sandbox/right-manage/RoleList'
import NewsAdd from "../../views/sandbox/news-manage/NewsAdd";
import NewsDraft from "../../views/sandbox/news-manage/NewsDraft";
import Audit from "../../views/sandbox/audit-manage/Audit";
import AuditList from "../../views/sandbox/audit-manage/AuditList";
import NewsCategroy from "../../views/sandbox/news-manage/NewsCategroy";
import Unpublished from "../../views/sandbox/publish-manage/Unpublished";
import Published from "../../views/sandbox/publish-manage/Published";
import Sunset from "../../views/sandbox/publish-manage/Sunset"
import { Navigate, Route, Routes } from 'react-router-dom'
import NoPermission from '../../views/sandbox/nopermission/NoPermission'
import NewsPreview from '../../views/sandbox/news-manage/NewsPreview'
import NewsUpdate from '../../views/sandbox/news-manage/NewsUpdate'

const LocalRouterMap = {
    "/home": <Home />,
    "/user-manage/list": <UserList />,
    "/right-manage/role/list": <RoleList />,
    "/right-manage/right/list": <RightList />,
    "/news-manage/add": <NewsAdd />,
    "/news-manage/category": <NewsCategroy />,
    "/news-manage/preview/:id": <NewsPreview />,
    "/news-manage/update/:id": <NewsUpdate />,
    "/news-manage/draft": <NewsDraft />,
    "/audit-manage/audit": <Audit />,
    "/audit-manage/list": <AuditList />,
    "/publish-manage/unpublished": <Unpublished />,
    "/publish-manage/published": <Published />,
    "/publish-manage/sunset": <Sunset />,

}
function NewsRouter(props) {
    const [backRouteList, setbackRouteList] = useState([])
    useEffect(() => {
        Promise.all([
            axios.get("/rights"),
            axios.get("/children"),
        ]).then(res => {
            // console.log(res);
            setbackRouteList([...res[0].data, ...res[1].data])
            // console.log([...res[0].data,...res[1].data]);

        })
    }, [])


    // ????????????????????????
    const { role: { rights } } = JSON.parse(localStorage.getItem("token"))
    const checkRoute = (item) => {
        // ?????????????????????????????????????????????????????????????????????item.key???????????????????????????????????????routepermisson????????????
        return LocalRouterMap[item.key] && (item.pagepermisson || item.routepermisson)
    }
    // ???????????????????????????
    const checkUserPermission = (item) => {
        return rights.includes(item.key)
    }

    return (
        <Spin size="large" spinning={props.isLoading}>
            <Routes>
                {backRouteList.map((item) => (
                    <Route
                        path={item.key}
                        key={item.key}
                        element={LocalRouterMap[item.key]}
                    />
                ))}
                <Route path="/" element={<Navigate replace from="/" to="/home"  exact/>} />
                <Route path="*" element={<NoPermission />} />
            </Routes>
        </Spin>
    )
}

const mapStateToProps = ({ LoadingReducer: { isLoading } }) => {
    return {
        isLoading
    }
}

export default connect(mapStateToProps)(NewsRouter)