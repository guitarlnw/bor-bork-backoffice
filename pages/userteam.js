import React, { Component } from 'react';
import { Table, Button, Modal, Row, Col, Input, Select } from 'antd';
import axios from 'axios'
import Layout from '../src/layout'

const { URL_SERVICE } = process.env

const Option = Select.Option;

const columns = [{
  title: 'ผุ้ใช้',
  dataIndex: 'member',
  key: 'member',
}, {
  title: 'จัดการ',
  dataIndex: 'manage',
  key: 'manage',
}];

export default class UserGroup extends Component {

  state = {
    dataSource: [],
    teams: [],
    member: [],
    index: '',
  }

  componentDidMount = () => {
    this.getTeamService()
  }

  getTeamService = () => {
    axios.get(`${URL_SERVICE}/get-team`)
      .then((response) => {
        this.setState({ teams: response.data })
        this.setTable()
      })
  }

  changeTeam = (index) => {
    const { teams } = this.state
    const temp = teams
    if (index !== '') {
      axios.get(`${URL_SERVICE}/get-user-team/${teams[index]._id}`)
        .then((response) => {
          this.setState({ user: response.data })
        })
    } else {
      this.setState({
        dataSource: [],
        buttonDisable: true
      })
    }
  }

  setTable = (index) => {
    const { teams } = this.state
    const dataSource = []
    teams[index].member.forEach((row, index) => {
      const obj = {
        key: index,
        member: row.name,
        manage: <div>
          <Button onClick={() => this.showModalEdit(row.id)} ghost type="primary" >แก้ไข</Button>&nbsp;
                <Button onClick={() => this.showConfirm(row.id)} ghost type="danger" >ลบ</Button>
        </div>
      }
      dataSource.push(obj)
    });
    this.setState({ dataSource })
  }

  render() {
    const { teams } = this.state
    return (
      <div>
        <Layout activeMenu='4' >

          <h1>จัดการทีม</h1>

          <Select defaultValue="" style={{ width: 120 }} onChange={this.changeTeam} >
            <Option value="">เลือกทีม</Option>
            {
              teams.map((option, index) =>
                <Option key={+index} value={index}>{option.team}</Option>
              )
            }
          </Select>

          <br /><br />
          <Button type="primary" onClick={() => this.showModalAdd()} >เพิ่มคนในทีม</Button>
          <br /><br />

        </Layout>
      </div>
    )
  }
}
