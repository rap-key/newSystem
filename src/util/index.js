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

function getItem(label, key, pagepermisson, childrenlist, type, id) {
    const children = getItemList2(childrenlist)
    const icon = iconlist[key]
    if(children.length===0){return{
        label,
        key,
        pagepermisson,
        type,
        id,
        icon
    };
}
    return {
        label,
        key,
        pagepermisson,
        children,
        type,
        id,
        icon
    };
}

function getItemList(text) {
    return text.map(item => getItem(item.title, item.key, item.pageperssion, item.children, item.grade, item.id))
}

function getItemList1(label, key, pagepermisson, rightid, type, id) {
    // console.log(pagepermisson);
    const icon = iconlist[key]
    if(!pagepermisson){
        return
    }
    return {
        label,
        key,
        pagepermisson,
        rightid,
        type,
        id,
        icon
    };
}

function getItemList2(text) {
    
    return text.map(item => getItemList1(item.title, item.key, item.pagepermisson, item.rightId, item.grade, item.id))
}


export {getItemList,iconlist}