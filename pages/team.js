import React, { Component } from 'react';
import { Table, Button, Modal, Row, Col, Input, Select } from 'antd';
import axios from 'axios'
import Layout from '../src/layout'

const { URL_SERVICE } = process.env

const Option = Select.Option;
const confirm = Modal.confirm;

const columns = [{
    title: 'team',
    dataIndex: 'team',
    key: 'team',
}, {
    title: 'mange',
    dataIndex: 'manage',
    key: 'manage',
}];


const getIndexIfObjWithAttr = function (array, attr, value) {
    for (var i = 0; i < array.length; i++) {
        if (array[i][attr] === value) {
            return i;
        }
    }
    return -1;
}

class Team extends Component {

    state = {
        visibleEdit: false,
        visibleAdd: false,
        buttonDisable: true,
        input: '',
        teams: [],
        editData: {},
        index: '',
        indexQuestion: '',
        dataSource: []
    }

    componentDidMount = () => {
        this.getTeamService()
    }

    getTeamService = () => {
        axios.get(`${URL_SERVICE}/get-team`)
            .then(async (response) => {
                await this.setState({ teams: response.data })
                this.setTable()
            })
    }

    changeTeam = (index) => {
        if (index !== '') {
            this.setTable(index)
            this.setState({ buttonDisable: false, index })
        } else {
            this.setState({
                dataSource: [],
                buttonDisable: true
            })
        }
    }

    setTable = () => {
        const { teams } = this.state
        const dataSource = []
        teams.forEach((row, index) => {
            const obj = {
                key: index,
                team: row.team,
                manage: <div>
                    <Button onClick={() => this.showModalEdit(row)} ghost type="primary" >แก้ไข</Button>&nbsp;
                    <Button onClick={() => this.showConfirm(row)} ghost type="danger" >ลบ</Button>
                </div>
            }
            dataSource.push(obj)
        });
        this.setState({ dataSource })
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
    handleOkAdd = async () => {
        const { input, teams } = this.state
        const temp = teams
        const body = { team: input }
        const res = await axios.post(`${URL_SERVICE}/add-team`, body).then(() => {
            this.setState({
                visibleAdd: false,
            });
            this.getTeamService()
        })
        this.clearInput()
    }

    showModalEdit = (row) => {
        this.setState({
            editData: row,
            input: row.team,
            visibleEdit: true,
        });
    }

    handleOkEdit = async () => {
        const { editData, input } = this.state
        const body = {
            teamId: editData._id,
            team: input
        }
        const res = await axios.post(`${URL_SERVICE}/edit-team`, body).then(() => {
            this.setState({
                visibleEdit: false,
            });
            this.getTeamService()
        })
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

    deleteItem = async (row) => {
        const body = {
            teamId: row._id
        }
        await axios.post(`${URL_SERVICE}/remove-team`, body).then(() => {
            this.setState({
                visibleEdit: false,
            });
            this.getTeamService()
        })
    }

    showConfirm = (row) => {
        const _this = this
        confirm({
            title: 'Do you Want to delete these items?',
            onOk() {
                _this.deleteItem(row)
            },
        });
    }

    render() {
        const { dataSource, visibleAdd, visibleEdit, input, teams, buttonDisable } = this.state
        return (
            <Layout activeMenu='1' >

                <h1>จัดการทีม</h1>
                <br />
                <Button type="primary" onClick={() => this.showModalAdd()} >เพิ่ม</Button>
                <br />
                <br />

                <Table dataSource={dataSource} columns={columns} />

                <br />
                <Modal
                    title="เพิ่ม"
                    visible={visibleAdd}
                    onOk={this.state.input ? this.handleOkAdd : null}
                    onCancel={this.handleCancel}
                >
                    <Input value={input} onChange={this.changeInput} placeholder="กรอกชื่อที่ต้องการ" />
                </Modal>

                <Modal
                    title="แก้ไข"
                    visible={visibleEdit}
                    onOk={this.state.input ? this.handleOkEdit : null}
                    onCancel={this.handleCancel}
                >
                    <Input value={input} onChange={this.changeInput} placeholder="กรอกชื่อที่ต้องการ" />
                </Modal>

            </Layout>
        );
    }
}

export default Team;