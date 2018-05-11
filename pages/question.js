import React, { Component } from 'react';
import { Table, Button, Modal, Row, Col, Input, Select } from 'antd';
import Layout from '../src/layout'

const Option = Select.Option;

const columns = [{
    title: 'question',
    dataIndex: 'question',
    key: 'question',
}, {
    title: 'mange',
    dataIndex: 'manage',
    key: 'manage',
}];

class Question extends Component {

    state = {
        visibleEdit: false,
        visibleAdd: false,
        input: '',
        team_id: '',
        teams: [
            { _id: 'ssdasjfapfdjpaj', team_name: 'bor bork' },
            { _id: 'asdasdasdasd', team_name: 'old team' }
        ],
        dataSource: [{
            key: '1',
            question: 'Mike',
            manage: <Button onClick={() => this.showModalEdit(1)} >แก้ไข</Button>
        }, {
            key: '2',
            question: 'John',
            manage: <Button onClick={() => this.showModalEdit(1)} >แก้ไข</Button>
        }]
    }

    changeTeam = (value) => {
        this.setState({
            team_id: value,
        })
    }

    changeInput = (e) => {
        this.setState({
            input: e.target.value,
        })
    }


    showModalAdd = () => {
        this.setState({
            visibleAdd: true,
        });
    }
    handleOkAdd = () => {
        this.setState({
            visibleAdd: false,
        });
        this.clearInput()
    }

    showModalEdit = () => {
        this.setState({
            visibleEdit: true,
        });
    }
    handleOkEdit = () => {
        this.setState({
            visibleEdit: false,
        });
        this.clearInput()
    }

    handleCancel = () => {
        this.setState({
            visibleEdit: false,
            visibleAdd: false,
        });
        this.clearInput()
    }

    clearInput = () => {
        this.setState({
            input: '',
        });
    }

    render() {
        const { dataSource, visibleAdd, visibleEdit, input, teams, team_id } = this.state
        return (
            <Layout activeMenu='2' >

                <h1>จัดการคำถาม</h1>

                <Select defaultValue="" style={{ width: 120 }} onChange={this.changeTeam} >
                    <Option value="">เลือกทีม</Option>
                    {
                        teams.map((option, index) =>
                            <Option key={+index} value={option._id}>{option.team_name}</Option>
                        )
                    }
                </Select>

                <Button onClick={() => this.showModalAdd(1)} >เพิ่มคำถาม</Button>


                {
                    team_id && <Table dataSource={dataSource} columns={columns} />
                }

                <br />
                <Modal
                    title="เพิ่มคำถาม"
                    visible={visibleAdd}
                    onOk={this.state.input ? this.handleOkAdd : null}
                    onCancel={this.handleCancel}
                >
                    <Input value={input} onChange={this.changeInput} placeholder="กรอกคำถามที่ต้องการ" />
                </Modal>

                <Modal
                    title="แก้ไข"
                    visible={visibleEdit}
                    onOk={this.handleOkEdit}
                    onCancel={this.handleCancel}
                >
                    <Input value={input} placeholder="กรอกคำถามที่ต้องการ" />
                </Modal>

            </Layout>
        );
    }
}

export default Question;