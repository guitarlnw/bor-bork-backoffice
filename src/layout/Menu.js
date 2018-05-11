import Link from 'next/link'
import { Layout, Menu, Icon } from 'antd';
const { Sider } = Layout;

class MenuLayout extends React.Component {
    state = {
        collapsed: false,
    };
    onCollapse = (collapsed) => {
        this.setState({ collapsed });
    }
    render() {
        return (
            <Sider
                collapsible
                collapsed={this.state.collapsed}
                onCollapse={this.onCollapse}
            >
                <div style={{ padding: 10, textAlign: 'center' }} >
                    <Link href="/">
                        <a style={{ color: 'white' }}>LOGO</a>
                    </Link>
                </div>
                <Menu theme="dark" defaultSelectedKeys={[this.props.active]} mode="inline">
                    <Menu.Item key="1">
                        <Link href="/team">
                            <a>
                                <Icon type="usergroup-add" />
                                <span>เพิ่ม ลบ แก้ไข ทีม</span>
                            </a>
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="2">
                        <Link href="/managteam">
                            <a>
                                <Icon type="team" />
                                <span>จัดการสมาชิกในทีม</span>
                            </a>
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="3">
                        <Link href="/notifications">
                            <a>
                                <Icon type="clock-circle-o" />
                                <span>จัดการการแจ้งเตือน</span>
                            </a>
                        </Link>
                    </Menu.Item>
                </Menu>
            </Sider>
        );
    }
}

export default MenuLayout