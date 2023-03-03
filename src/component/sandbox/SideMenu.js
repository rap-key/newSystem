import './index.css'
import { getItemList } from '../../util';
import React, { useEffect, useState } from 'react';
import { Layout, Menu} from 'antd';
import { useNavigate, useLocation } from "react-router";
import axios from 'axios'
import {connect} from "react-redux"
import SubMenu from 'antd/es/menu/SubMenu';
import {
  UserOutlined,
} from '@ant-design/icons';

const iconlist = {
  "/home": <UserOutlined />,
  "/user-manage/list": <UserOutlined />,
  "/right-manage/role/list": <UserOutlined />,
  "/right-manage/right/list": <UserOutlined />,
  "/news-manage/add": <UserOutlined />,
  "/news-manage/draft": <UserOutlined />,
  "/news-manage/category": <UserOutlined />,
  "/audit-manage/audit": <UserOutlined />,
  "/audit-manage/list": <UserOutlined />,
  "/publish-manage/unpublished": <UserOutlined />,
  "/publish-manage/published": <UserOutlined />,
  "/publish-manage/sunset": <UserOutlined />,
}

const { Sider } = Layout;


function SideMenu(props) {

  const [menu, setMenu] = useState([])

  useEffect(() => {
    axios.get("/rights?_embed=children").then(res => {

      setMenu(getItemList(res.data))
    })
  }, [])

  let navigate = useNavigate();

  const { role: { rights } } = JSON.parse(localStorage.getItem("token"))
  // item.key表示侧边栏的数据
  const checkPagePermission = (item) => {
    // 当前登录的用户的权限列表包括item.key才有可能继续修改侧边栏，如果没有则应该被隐藏
    return item.pagepermisson && rights.includes(item.key)
  }


  const renderMenu = (menuList) => {
    return menuList.map(item => {
      // 如果item.children为false，则不会再取.length
      if (item.children?.length > 0 && checkPagePermission(item)) {
        return <SubMenu key={item.key} icon={iconlist[item.key]} title={item.title}>
        {/* 如果是二级列表，调用递归 */}
        {renderMenu(item.children)}
        </SubMenu>
   }
      return checkPagePermission(item) && <Menu.Item key={item.key} icon={iconlist[item.key]} onClick={() => {
        //  console.log(props)
        props.history.push(item.key)
      }}>{item.title}</Menu.Item>
    })
  }

  const handelgo=(props)=>{
    navigate(`${props.key}`)
  }

  let location = useLocation();
  const selectKeys = [location.pathname];
  const openKeys = ["/" + location.pathname.split("/")[1]];
  return (
    <Sider trigger={null} collapsible collapsed={props.isCollapsed}>
      <div style={{ display: 'flex', height: "100%", flexDirection: 'column' }}>
        <div className="logo">News System</div>
        <div style={{ flex: 1, "overflow": "auto" }}>
          <Menu theme="dark" mode="inline" selectedKeys={selectKeys} defaultOpenKeys={openKeys} items={menu} onClick={handelgo}>
          </Menu>
        </div>
      </div>
    </Sider >
  )
  //   }
}
const mapStateToProps = ({CollApsedReducer:{isCollapsed}})=>{
  return{
    isCollapsed
  }
}
export default connect(mapStateToProps)(SideMenu)