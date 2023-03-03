import React, { useEffect } from 'react'
import './NewsSandBox.css'
import NProgress from "nprogress"
import 'nprogress/nprogress.css'
import SideMenu from '../../component/sandbox/SideMenu'
import TopHeader from '../../component/sandbox/TopHeader'
import { Layout } from 'antd'
import NewsRouter from '../../component/sandbox/NewsRouter'
const { Content } = Layout
export default function NewsSandBox() {
  NProgress.start()
  useEffect(()=>{
    NProgress.done();
  })
  return (
    <Layout className=''>
      {/* 侧边栏 */}
      <SideMenu></SideMenu>
      <Layout className='site-layout'>
        {/* 导航栏 */}
        <TopHeader></TopHeader>
        <Content
          className='site-layout-background'
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            overflow: 'auto'
            // background: colorBgContainer,
          }}
        >
          <NewsRouter></NewsRouter>
        </Content>
      </Layout>
    </Layout>
  )
}
