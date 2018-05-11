import React, { Component } from 'react';
import Layout from '../src/layout'
import { Row, Col, Form, TimePicker, Button, Select, InputNumber, message } from 'antd';
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
            noti_time: {
                hour: '09',
                min: '05'
            },
            remind_time: {
                hour: '01',
                min: '00'
            },
            close_hour: '5',
            watcher: '',
            team: '',
            hasSelectedteam: false
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


    handleTeamSelectedChange = async (value) => {
        await this.setState({team: value, hasSelectedteam: true})
        console.log(value)
        this.getNotificationByTeam()
    }

    getNotificationByTeam = () => {
        
        fetch(process.env.URL_SERVICE+'/get-noti-by-team/'+this.state.team)
            .then(response => response.json())
            // .then(data => console.log(data))
            .then(data => {
                if(data.cronjob.first.schedule != ""){
                    console.log(data.cronjob)
                    let first_cronjob = data.cronjob.first.schedule.split(" ")
                    let close_cronjob = data.cronjob.close.schedule.split(" ")
                    let remind_cronjob = data.cronjob.remind.schedule.split(" ")

                    let noti_hour = first_cronjob[2]
                    let noti_min = first_cronjob[1]
                    let day_of_week = first_cronjob[5].split(",")

                    console.log(day_of_week)

                    let remind_hour = remind_cronjob[2] - noti_hour
                    let remind_min = remind_cronjob[1]
                    
                    let close_hour = close_cronjob[2] - noti_hour

                    console.log("noti:" + noti_hour +":"+ noti_min)
                    console.log("day of week:" + day_of_week)
                    console.log("remind:" + remind_hour+":"+remind_min)
                    console.log("close hour:"+close_hour)
                    
                    this.setState({ 
                        noti_day_of_week: day_of_week,
                        noti_time: {
                            hour: noti_hour.toString(),
                            min: noti_min.toString()
                        },
                        remind_time: {
                            hour: remind_hour.toString(),
                            min: remind_min.toString()
                        },
                        close_hour: close_hour.toString(),
                        watcher: (data.watcher_slack_id != null)? data.watcher_slack_id : ''
                    })
                }
                else{
                    this.setState({ 
                        noti_day_of_week: '',
                        noti_time: {
                            hour: '00',
                            min: '00'
                        },
                        remind_time: {
                            hour: '00',
                            min: '00'
                        },
                        close_hour: '1',
                        watcher: ''
                    })
                }

                this.setState({ 
                    noti_day_of_week: '',
                    noti_time: {
                        hour: '00',
                        min: '00'
                    },
                    remind_time: {
                        hour: '00',
                        min: '00'
                    },
                    close_hour: '1',
                    watcher: ''
                })
                
            })
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
        }).then((response) => {
            response.status === 200 ? message.info('Saved!') : message.info('Error!')
        }).catch((error) => message.info('Error!'))
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
                usersList.push(<Option key={this.state.users[i].userId}>{this.state.users[i].user}</Option>);
            }
        }

        console.log(this.state.noti_day_of_week)
        
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
                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        >
                            {teamsList}
                        </Select>
                    </FormItem>
                    <div style={{ display: (this.state.hasSelectedteam) ? 'block' : 'none' }}>
                    <FormItem label="วันที่แจ้งเตือน">
                        <Select
                            mode="multiple"
                            style={{ width: '100%' }}
                            placeholder="เลือกวันที่แจ้งเตือน"
                            defaultValue={['1','2','3']}
                            // value={['1','2','3']}
                            // value={this.state.noti_day_of_week}
                            onChange={(e) => this.handleChange(e, 'noti_day_of_week')}
                        >
                            {daysList}
                        </Select>
                    </FormItem>

                    <FormItem label="เวลาที่เริ่มถาม" >
                        <TimePicker defaultValue={moment(this.state.noti_time.hour+'.'+this.state.noti_time.min, format)} format={format} 
                        onChange={(e) => this.handleChange(e, 'noti_time')}
                        value={moment(this.state.noti_time.hour+'.'+this.state.noti_time.min, format)}
                        />
                    </FormItem>

                    <FormItem label="แจ้งเตือนถัดไปในอีก (ชั่วโมง:นาที)" >
                        <TimePicker defaultValue={moment(this.state.remind_time.hour+'.'+this.state.remind_time.min, format)} minuteStep={30} format={format}
                        onChange={(e) => this.handleChange(e, 'remind_time')}
                        value={moment(this.state.remind_time.hour+'.'+this.state.remind_time.min, format)} />
                    </FormItem>

                    <FormItem label="จำกัดชั่วโมงการปิดการรับคำตอบ" >
                        <Select onChange={(e) => this.handleChange(e, 'close_hour')}
                        defaultValue={this.state.close_hour}
                        value={this.state.close_hour} >
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
                            value={this.state.watcher}
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
                    </div>
                </Form>
            </Layout>
        );
    }
}
export default NotificationsManagement;
