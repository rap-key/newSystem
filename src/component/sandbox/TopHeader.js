import { Layout, Dropdown, Space,Avatar } from 'antd';
import { useNavigate } from "react-router";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined
} from '@ant-design/icons';
import {connect} from "react-redux"
const { Header } = Layout;
function TopHeader(props) {
  console.log(props);
  // const [collapsed, setCollapsed] = useState(false)
  const changeCollapsed = () => {
    // setCollapsed(!collapsed)
    props.changeCollapsed()
    
  }
  const {role:{roleName},username} = JSON.parse(localStorage.getItem("token")||'')
  const navigate = useNavigate();
  const items = [
    {
      label: (
        <a>
          {roleName}
        </a>
      ),
    },
    {
      danger: true,
      label: (
        <a onClick={()=>{
          localStorage.removeItem('token')
          navigate('/login')
          // console.log(props.history);
        }}>退出</a>
      )
    },
  ];
  return (
    <Header
      className='site-layout-background'
      style={{
        padding: '0 16px'
        // background: colorBgContainer,
      }}
    >
      {/* {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
            className: 'trigger',
            onClick: () => setCollapsed(!collapsed),
          })} */}
      {
        props.isCollapsed ? <MenuUnfoldOutlined onClick=
        {changeCollapsed} /> : <MenuFoldOutlined onClick=
        {changeCollapsed} />
      }
      <div style={{ float: 'right' }}>
        <span>欢迎<span style={{color:'#1890ff'}}>{username}</span>回来</span>
        <Dropdown
          menu={{
            items,
          }}
        >
          <Space>
            <Avatar size="large" icon={<UserOutlined />} />
          </Space>
        </Dropdown>
      </div>
    </Header>
  )
}

const mapStateToProps = ({CollApsedReducer:{isCollapsed}})=>{
  return{
    isCollapsed
  }
}

const mapDispatchToProps = {
  changeCollapsed(){
    return{
      type:"change_collapsed"
    }
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(TopHeader)