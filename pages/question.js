import React, { Component } from 'react';
import { Table, Button, Modal, Row, Col, Input, Select } from 'antd';
import axios from 'axios'
import Layout from '../src/layout'

const { URL_SERVICE } = process.env

const Option = Select.Option;
const confirm = Modal.confirm;

const columns = [{
    title: 'question',
    dataIndex: 'question',
    key: 'question',
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

class Question extends Component {

    state = {
        visibleEdit: false,
        visibleAdd: false,
        buttonDisable: true,
        input: '',
        teams: [],
        index: '',
        indexQuestion: '',
        dataSource: []
    }

    componentDidMount = () => {
        this.getTeamService()
    }

    getTeamService = () => {
        axios.get(`${URL_SERVICE}/get-team`)
            .then((response) => {
                this.setState({ teams: response.data })
            })
    }

    changeTeam = (index) => {
        if (index !== '') {
            this.setTable(index)
            this.setState({ buttonDisable: false, index })
        } else {
            this.setState({ buttonDisable: true })
        }
    }

    setTable = (index) => {
        const { teams } = this.state
        const dataSource = []
        teams[index].question.forEach((row, index) => {
            const obj = {
                key: index,
                question: row.question,
                manage: <div>
                    <Button onClick={() => this.showModalEdit(row.id)} ghost type="primary" >แก้ไข</Button>&nbsp;
                    <Button onClick={() => this.showConfirm(row.id)} ghost type="danger" >ลบ</Button>
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
        const { input, index, teams } = this.state
        const temp = teams
        const body = { question: input, _id: teams[index]._id }
        const res = await axios.post(`${URL_SERVICE}/add-question`, body).then(response => response.data)
        temp[index].question = []
        await res.resultOnNewDate.question.forEach(newData => {
            temp[index].question.push({ id: newData.id, question: newData.question })
        });
        await this.setState({
            visibleAdd: false,
            teams: temp,
        });
        this.setTable(index)
        this.clearInput()
    }

    showModalEdit = (questionId) => {
        const { teams, index } = this.state
        const questionArr = teams[index].question
        const indexQuestion = getIndexIfObjWithAttr(questionArr, 'id', questionId)
        const question = questionArr[indexQuestion]
        this.setState({
            visibleEdit: true,
            indexQuestion,
            input: question.question,
        });
    }

    handleOkEdit = async () => {
        const { input, index, teams, indexQuestion } = this.state
        const temp = teams
        const question = teams[index].question[indexQuestion]
        const body = {
            question_id: question.id,
            question: input,
            team_id: teams[index]._id
        }
        const res = await axios.post(`${URL_SERVICE}/update-question`, body).then(response => response.data)

        temp[index].question = res.question
        await this.setState({
            visibleEdit: false,
            teams: temp,
        });
        this.setTable(index)
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

    deleteItem = async () => {
        const { input, index, teams, indexQuestion } = this.state
        const temp = teams
        const question = teams[index].question[indexQuestion]
        const body = {
            question_id: question.id,
            team_id: teams[index]._id
        }
        const res = await axios.post(`${URL_SERVICE}/delete-question`, body).then(response => response.data)
        temp[index].question = res.question
        await this.setState({
            teams: temp,
        });
        this.setTable(index)
    }

    showConfirm = (questionId) => {
        const _this = this
        const { teams, index } = this.state
        const questionArr = teams[index].question
        const indexQuestion = getIndexIfObjWithAttr(questionArr, 'id', questionId)
        this.setState({
            indexQuestion,
        });
        confirm({
            title: 'Do you Want to delete these items?',
            onOk() {
                _this.deleteItem()
            },
        });
    }

    render() {
        const { dataSource, visibleAdd, visibleEdit, input, teams, buttonDisable } = this.state
        return (
            <Layout activeMenu='2' >

                <h1>จัดการคำถาม</h1>

                <Select defaultValue="" style={{ width: 120 }} onChange={this.changeTeam} >
                    <Option value="">เลือกทีม</Option>
                    {
                        teams.map((option, index) =>
                            <Option key={+index} value={index}>{option.team}</Option>
                        )
                    }
                </Select>

                <br />
                <br />
                <Button type="primary" disabled={buttonDisable} onClick={() => this.showModalAdd()} >เพิ่มคำถาม</Button>
                <br />
                <br />

                <Table dataSource={dataSource} columns={columns} />

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
                    onOk={this.state.input ? this.handleOkEdit : null}
                    onCancel={this.handleCancel}
                >
                    <Input value={input} onChange={this.changeInput} placeholder="กรอกคำถามที่ต้องการ" />
                </Modal>

            </Layout>
        );
    }
}

export default Question;