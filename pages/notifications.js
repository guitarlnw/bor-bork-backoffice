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
          isLoading: false,
        };
      }
    
    handleChange = (value) => {
        console.log(`selected ${value}`)
    }

    handleSubmit = (e) => {
        e.preventDefault()
        console.log(e)
    }


    componentDidMount() {
        this.setState({ isLoading: true })
    
        fetch(API + DEFAULT_QUERY)
          .then(response => response.json())
        //   .then(data => this.setState({ teams: data.teams, isLoading: false }))
      }


    render() {
        const format = 'HH:mm';
        const daysOfWeekText = ['จันทร์','อังคาร','พุธ','พฤหัสบดี','ศุกร์','เสาร์','อาทิตย์']
        const daysList = [];
        const hoursList = [];
        for (let i = 0; i < 7 ; i++) {
            daysList.push(<Option key={i+1}>{daysOfWeekText[i]}</Option>);
        }
        for (let i = 0; i < 5; i++) {
            hoursList.push(<Option key={i+1}>{i+1}</Option>)
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
                            onChange={this.handleChange}
                            // onFocus={handleFocus}
                            // onBlur={handleBlur}
                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        >
                            <Option value="team1">Team1</Option>
                            <Option value="team2">Team2</Option>
                            <Option value="team3">Team3</Option>
                        </Select>
                    </FormItem>
                </Form>

                <Form onSubmit={this.handleSubmit}>
                    <FormItem label="วันที่แจ้งเตือน">
                        <Select
                            mode="multiple"
                            style={{ width: '100%' }}
                            placeholder="เลือกวันที่แจ้งเตือน"
                            // defaultValue={['a10', 'c12']} TODO: get from current cronjob by team
                            onChange={this.handleChange}
                        >
                            {daysList}
                        </Select>
                    </FormItem>

                    <FormItem label="เวลาที่เริ่มถาม" >
                        <TimePicker defaultValue={moment('9.00', format)} format={format} />
                    </FormItem>

                    <FormItem label="แจ้งเตือนถัดไปในอีก (ชั่วโมง:นาที)" >
                        <TimePicker minuteStep={30} format={format} />
                    </FormItem>

                    <FormItem label="จำกัดชั่วโมงการปิดการรับคำตอบ" >
                        <Select onChange={this.handleChange}>
                            {hoursList}
                        </Select>
                    </FormItem>

                    <FormItem label="ผู้รับการแจ้งเตือน" >
                        <Select
                            showSearch
                            style={{ width: 200 }}
                            placeholder="เลือกผู้รับการแจ้งเตือน"
                            optionFilterProp="children"
                            onChange={this.handleChange}
                            // onFocus={handleFocus}
                            // onBlur={handleBlur}
                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        >
                            <Option value="jack">Jack</Option>
                            <Option value="lucy">Lucy</Option>
                            <Option value="tom">Tom</Option>
                        </Select>
                    </FormItem>
                </Form>
            </Layout>
        );
    }
}

export default NotificationsManagement;