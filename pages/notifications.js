import React, { Component } from 'react';
import Layout from '../src/layout'
import { Row, Col, Form, TimePicker, Button, Select, InputNumber } from 'antd';
import moment from 'moment';


const FormItem = Form.Item;
const Option = Select.Option;


class NotificationsManagement extends Component {

    constructor(props) {
        super(props);
    
        this.state = {
            teams: [],
            users: [],
            noti_day_of_week: '',
            noti_time: {},
            remind_time: {},
            close_hour: '',
            watcher: '',
            team: ''
        };
      }
    
    handleChange = (value, type) => {
        switch (type) {
            case 'noti_day_of_week': {
                this.setState({noti_day_of_week: value.toString()})
                break
            }
            case 'noti_time': {
                this.setState({noti_time: 
                    {
                        hour: moment(value).format('HH'),
                        min: moment(value).format("mm")
                    }
                })
                break
            }
            case 'remind_time': {
                this.setState({remind_time: 
                    {
                        hour: moment(value).format('HH'),
                        min: moment(value).format("mm")
                    }
                })
                break
            }
            case 'close_hour': {
                this.setState({close_hour: value})
                break
            }
            case 'watcher': {
                this.setState({watcher: value})
                break
            }
            default:
                break;
        }
    }

    handleSubmit = (e) => {
        e.preventDefault()
        
        console.log(this.state)

        this.updateCronJob1()
        this.updateCronJob2()
        this.updateCronJob3()
    }

    updateCronJob1 = () => {
        fetch(process.env.URL_SERVICE+'/update-cronjob-1/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                teamId: this.state.team,
                firstMin: this.state.noti_time.min,
                firstHour: this.state.noti_time.hour,
                dayOfWeek: this.state.noti_day_of_week
            })
        })
    }

    updateCronJob2 = () => {
        fetch(process.env.URL_SERVICE+'/update-cronjob-2/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                teamId: this.state.team,
                firstMin: this.state.noti_time.min,
                firstHour: this.state.noti_time.hour,
                min: this.state.remind_time.min,
                hour: this.state.remind_time.hour,
                dayOfWeek: this.state.noti_day_of_week
            })
        })
    }

    updateCronJob3 = () => {
        fetch(process.env.URL_SERVICE+'/update-cronjob-3/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                teamId: this.state.team,
                firstMin: this.state.noti_time.min,
                firstHour: this.state.noti_time.hour,
                hour: this.state.close_hour,
                dayOfWeek: this.state.noti_day_of_week
            })
        })
    }


    handleTeamSelectedChange = (value) => {
        this.setState({team: value})
        console.log(value)
    }

    async getUsers() {
        await fetch(process.env.URL_SERVICE+'/get-user')
            .then(response => response.json())
            .then(data => this.setState({ users: data }))
    }

    async getTeams() {
        await fetch(process.env.URL_SERVICE+'/get-team')
            .then(response => response.json())
            .then(data => this.setState({ teams: data }))
    }

    componentWillMount() {
        this.getTeams()
        this.getUsers()
    }


    render() {
        const format = 'HH:mm'
        const daysOfWeekText = ['จันทร์','อังคาร','พุธ','พฤหัสบดี','ศุกร์','เสาร์','อาทิตย์']
        const daysList = []
        const hoursList = []
        const teamsList = []
        const usersList = []
        for (let i = 0; i < 7 ; i++) {
            daysList.push(<Option key={i+1}>{daysOfWeekText[i]}</Option>);
        }
        for (let i = 0; i < 5; i++) {
            hoursList.push(<Option key={i+1}>{i+1}</Option>)
        }
        // set teams
        if(this.state.teams.length > 0) {
            for (let i = 0; i < this.state.teams.length; i++) {
                teamsList.push(<Option key={this.state.teams[i]._id}>{this.state.teams[i].team}</Option>);
            }
        }
        //set user
        if(this.state.users.length > 0) {
            for (let i = 0; i < this.state.users.length; i++) {
                usersList.push(<Option key={this.state.users[i]._id}>{this.state.users[i].user}</Option>);
            }
        }
        
        return (
            <Layout activeMenu='3' >
                <Form onSubmit={this.handleSubmit}>
                    <FormItem label="ทีม" >
                        <Select
                            showSearch
                            style={{ width: 200 }}
                            placeholder="เลือกทีม"
                            optionFilterProp="children"
                            onChange={this.handleTeamSelectedChange}
                            // onFocus={handleFocus}
                            // onBlur={handleBlur}
                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        >
                            {teamsList}
                        </Select>
                    </FormItem>
                
                    <FormItem label="วันที่แจ้งเตือน">
                        <Select
                            mode="multiple"
                            style={{ width: '100%' }}
                            placeholder="เลือกวันที่แจ้งเตือน"
                            // defaultValue={['a10', 'c12']} TODO: get from current cronjob by team
                            onChange={(e) => this.handleChange(e, 'noti_day_of_week')}
                        >
                            {daysList}
                        </Select>
                    </FormItem>

                    <FormItem label="เวลาที่เริ่มถาม" >
                        <TimePicker defaultValue={moment('9.05', format)} format={format} 
                        onChange={(e) => this.handleChange(e, 'noti_time')}/>
                    </FormItem>

                    <FormItem label="แจ้งเตือนถัดไปในอีก (ชั่วโมง:นาที)" >
                        <TimePicker defaultValue={moment('0.00', format)} minuteStep={30} format={format}
                        onChange={(e) => this.handleChange(e, 'remind_time')} />
                    </FormItem>

                    <FormItem label="จำกัดชั่วโมงการปิดการรับคำตอบ" >
                        <Select onChange={(e) => this.handleChange(e, 'close_hour')}>
                            {hoursList}
                        </Select>
                    </FormItem>

                    <FormItem label="ผู้รับการแจ้งเตือน" >
                        <Select
                            showSearch
                            style={{ width: 200 }}
                            placeholder="เลือกผู้รับการแจ้งเตือน"
                            optionFilterProp="children"
                            onChange={(e) => this.handleChange(e, 'watcher')}
                            // onFocus={handleFocus}
                            // onBlur={handleBlur}
                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        >
                            {usersList}
                        </Select>
                    </FormItem>

                    <FormItem >
                        <Button type="primary" htmlType="submit">Save</Button>
                    </FormItem>
                </Form>
            </Layout>
        );
    }
}
export default NotificationsManagement;
