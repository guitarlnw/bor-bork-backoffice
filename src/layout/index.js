import Head from 'next/head'
import Menu from './Menu'
import { Layout, Breadcrumb } from 'antd';
const { Content, Footer } = Layout;

process.env.URL_SERVICE = 'http://localhost:4000'

const LayoutTemplate = (props) =>
    <div>
        <Head>
            <title>Backoffic Bor Bork Team</title>
            <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/antd/3.5.1/antd.min.css" />
        </Head>
        <Layout style={{ minHeight: '100vh' }}>
            <Menu active={props.activeMenu} />
            <Layout>
                <Content style={{ margin: '0 16px' }}>
                    <Breadcrumb style={{ margin: '16px 0' }}>
                    </Breadcrumb>
                    <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
                        {props.children}
                    </div>
                </Content>
                <Footer style={{ textAlign: 'center' }}>
                    Power By Bor Bork Team THiNKNET CNX
                    </Footer>
            </Layout>
        </Layout>
    </div>

export default LayoutTemplate