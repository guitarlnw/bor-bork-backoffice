import React, { Component } from 'react';
import { Table, Button, Modal, Row, Col, Input, Select } from 'antd';
import Layout from '../src/layout'
import axios from 'axios'

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
class TeamManage extends Component {
    state = {
        disableAddButton: true,
        disableRemoveButton: true,
        visibleAdd: 'block',
        input: '',
        team_id: '',
        selecterValue: '',
        users: [],
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

    componentDidMount() {
        this.getTeam()
        this.getUser()
        console.log('hello' + this.state.dataSource[0].question);

    }

    getTeam = () => {
        axios.get(`http://localhost:4000/get-team`)
            .then((response) => {
                let newTeam = []
                response.data.map(e => {
                    newTeam.push({ _id: e._id, team: e.team })
                })
                const newState = { ...this.state, teams: newTeam }
                this.setState(newState)
            })
        console.log('hello' + this.state.dataSource);
    }

    getUser = () => {
        axios.get(`http://localhost:4000/get-user`)
            .then((response) => {
                let newUser = []
                response.data.map(e => {
                    newUser.push({ _id: e.userId, name: e.user })
                })
                const newState = { ...this.state, users: newUser }
                this.setState(newState)
            })
        console.log(this.state);

    }

    addTeamButton = () => {
        // if ( this.state.visibleAdd === 'block') {
        //     this.setState({visibleAdd: 'none'})
        // }
        // if ( this.state.visibleAdd === 'none') {
        //     this.setState({visibleAdd: 'block'})
        // }
        axios.post(`http://localhost:4000/add-team`, { team: this.state.input })
            .then((response) => {
                console.log('OK');
                this.getTeam()
                this.getUser()
            })
        this.setState({ input: '' })
        console.log(this.state);

    }

    deleteTeamButton = () => {
        axios.post(`http://localhost:4000/remove-team`, { teamId: this.state.team_id })
            .then((response) => {
                console.log('OK', this.state.team_id);
                this.getTeam()
                this.getUser()
            })
        this.setState({ selecterValue: '' })
    }

    editTeamButton = () => {
        axios.post(`http://localhost:4000/edit-team`, { teamId: this.state.team_id, team: this.state.input })
            .then((response) => {
                console.log('OK', this.state.team_id);
                this.getTeam()
                this.getUser()
            })
        this.setState({ input: '' })
        this.setState({ selecterValue: '' })
    }

    handleInput = (e) => {
        let disabledButton
        if (!e.target.value) {
            disabledButton = true
        } else {
            disabledButton = false
        }
        this.setState({ ...this.state, input: e.target.value, disableAddButton: disabledButton })
    }

    changeTeam = (value) => {
        let newState = {}
        if (value === '') {
            newState = { ...this.setState, disableRemoveButton: true, team_id: value, selecterValue: value }
        } else {
            newState = { ...this.setState, disableRemoveButton: false, team_id: value, selecterValue: value }
        }
        this.setState(newState)
    }

    render() {
        return (
            <Layout activeMenu='1' >
                <h1> จัดการทีม </h1>
                <Row>
                    <Col span={18}>
                        <Select defaultValue="" style={{ width: 200 }} onChange={this.changeTeam}>
                            <Option value={this.state.selecterValue}>เลือกทีม</Option>
                            {
                                this.state.teams.map((option, index) =>
                                    <Option key={option._id} value={option._id}>{option.team}</Option>
                                )
                            }
                        </Select>
                    </Col>
                    <Col span={2}>
                        <Button onClick={this.addTeamButton} disabled={this.state.disableAddButton} >เพิ่มทีม</Button>
                    </Col>
                    <Col span={2}>
                        <Button onClick={this.deleteTeamButton} disabled={this.state.disableRemoveButton} >ลบทีม</Button>
                    </Col>
                    <Col span={2}>
                        <Button onClick={this.editTeamButton} disabled={this.state.disableRemoveButton} >แก้ไขชื่อ</Button>
                    </Col>
                    <Input style={{ display: `${this.state.visibleAdd}` }} onChange={this.handleInput} value={this.state.input} />
                </Row>
                {
                    this.state.team_id && <Table dataSource={this.state.dataSource} columns={columns} />
                }

            </Layout>
        );
    }
}

export default TeamManage;