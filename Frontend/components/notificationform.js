import axios from 'axios';
import { useEffect, useState } from 'react';
import { NotificationContainer, NotificationManager } from 'react-notifications';

import 'react-notifications/lib/notifications.css';

var consts = require('../consts/consts');

export default function NotificationFormComponent() {
    const [reload, setReload] = useState(true);
    const [notifyBy, setNotifyBy] = useState({ email: true, phoneNumber: true });
    const [userInfo, setUserInfo] = useState({ firstName: '', lastName: '', email: '', phoneNumber: '', supervisor: '' });
    const [supervisor, setSupervisor] = useState([]);
    let loading = false;

    useEffect(() => {
        if (reload == true) {
            if (loading == true)
                return;
            // setLoader(prev => { return { ...prev, loading: true }; });
            loading = true;
            let url = consts.BACKEND_DOMAIN + consts.BE_API_URL_GET_SUPERVISOR_LIST;
            fetch(url).then(response => response.json())
                .then((response) => {
                    setReload(false);
                    loading = false;
                    setSupervisor(response);
                })
                .catch(err => {
                    setReload(false);
                    loading = false;
                    NotificationManager.warning(`Error while fetching data.\nMake sure server is running.`, 'Error', 4000);
                    return {
                        success: false,
                        status: 500,
                        msg: err,
                    }
                })
        }
    }, [reload]);

    const resetForm = () => {
        setNotifyBy({ email: true, phoneNumber: true });
        setUserInfo({ firstName: '', lastName: '', email: '', phoneNumber: '', supervisor: '' });
    }

    const validatePhoneNumberViaAPI = async (phoneNumber) => {
        try {
            const response = await axios.get(consts.API_URL_PHONE_VALIDATION + '?api_key=' + consts.API_KEY_PHONE_VALIDATIO + '&phone=' + phoneNumber);
            return response.data.valid;
        } catch (error) {
            throw new Error('Caught in validatePhoneNumber:', error);
        }
    };

    const validateEmail = (email) => /^[a-z.A-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(email);

    const submit = async () => {
        let warningMsg = '';
        if (userInfo.firstName == '') {
            warningMsg = 'Please input First Name';
        }
        else if (userInfo.lastName == '') {
            warningMsg = 'Please input Last Name';
        }
        else if (notifyBy.email == true) {
            if (userInfo.email == '')
                warningMsg = 'Please input email';
            if (validateEmail(userInfo.email) == false)
                warningMsg = 'Please input valid email';
        }
        if (warningMsg == '' && notifyBy.phoneNumber == true) {
            if (userInfo.phoneNumber == '')
                warningMsg = 'Please input phone number';
            else {
                let res = await validatePhoneNumberViaAPI(userInfo.phoneNumber);
                if (res == false)
                    warningMsg = 'Please input valid phone number';
            }
        }
        if (warningMsg == '' && userInfo.supervisor == '')
            warningMsg = 'Please select supervisor';

        if (warningMsg != '') {
            NotificationManager.warning(warningMsg, 'Warning', 2000);
            return;
        }

        let url = consts.BACKEND_DOMAIN + consts.BE_API_URL_CREATE_NOTIFICATION;
        axios.post(url, userInfo)
            .then(function (response) {
                NotificationManager.success(response.data.msg, 'Success', 2000);
                resetForm();
            })
            .catch(function (error) {
                NotificationManager.warning(error.response.data.message, 'Warning', 4000);
                return {
                    success: false,
                    status: 500,
                    msg: error.response.data.message,
                }
            });
    }

    return (
        <>
            <NotificationContainer />
            <div className='grid lg:grid-cols-5 grid-cols-1'>
                <div className='hidden lg:block'></div>
                <div className='lg:col-span-3 flex justify-center'>
                    <form className="flex flex-col justify-center px-4 h-screen py-auto w-full">
                        <div className="p-4 w-full bg-gray-500 rounded-t-xl border border-gray-200">
                            <p className="text-3xl text-gray-900 text-center font-bold">Notification Form</p>
                        </div>
                        <div className="p-4 w-full bg-gray-200 rounded-b-xl border border-gray-200">
                            <div className="grid gap-6 mb-6 sm:grid-cols-2">
                                <div>
                                    <label htmlFor="first_name" className="block mb-2 text-md font-medium text-gray-900 ">First name</label>
                                    <input onChange={(e) => { setUserInfo(prev => { return { ...prev, firstName: e.target.value } }); }} value={userInfo.firstName} type="text" id="first_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="John" required />
                                </div>
                                <div>
                                    <label htmlFor="last_name" className="block mb-2 text-md font-medium text-gray-900">Last name</label>
                                    <input onChange={(e) => { setUserInfo(prev => { return { ...prev, lastName: e.target.value } }); }} value={userInfo.lastName} type="text" id="last_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Doe" required />
                                </div>
                            </div>
                            <h3 className="mt-8 mb-2 text-lg font-large text-gray-900">How would you prefer to be notified?</h3>
                            <ul className="grid gap-6 w-full sm:grid-cols-2">
                                <li>
                                    <div className="flex flex-col mb-4">
                                        <div className="flex items-center mb-2">
                                            <input onChange={(e) => { setNotifyBy(prev => { return { ...prev, email: !prev.email } }); }} checked={notifyBy.email} id="email-checkbox" type="checkbox" value="" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500" />
                                            <label htmlFor="email-checkbox" className="ml-2 text-md font-medium text-gray-900 dark:text-gray-300">Email</label>
                                        </div>
                                        <div>
                                            <input onChange={(e) => { setUserInfo(prev => { return { ...prev, email: e.target.value } }); }} value={userInfo.email} type="email" disabled={!notifyBy.email} id="email" className="disabled:bg-gray-200 bg-gray-50 border border-gray-300 text-gray-900 text-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="" required />
                                        </div>
                                    </div>
                                </li>
                                <li>
                                    <div className="flex flex-col mb-4">
                                        <div className="flex items-center mb-2">
                                            <input onChange={(e) => { setNotifyBy(prev => { return { ...prev, phoneNumber: !prev.phoneNumber } }); }} checked={notifyBy.phoneNumber} id="phone-checkbox" name="phoneNumber" type="checkbox" value="" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500" />
                                            <label htmlFor="phone-checkbox" className="ml-2 text-md font-medium text-gray-900">Phone Number</label>
                                        </div>
                                        <div>
                                            <input onChange={(e) => { setUserInfo(prev => { return { ...prev, phoneNumber: e.target.value } }); }} value={userInfo.phoneNumber}
                                                type="text" disabled={!notifyBy.phoneNumber} id="phone" className="disabled:bg-gray-200 bg-gray-50 border border-gray-300 text-gray-900 text-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required />
                                        </div>
                                    </div>
                                </li>
                            </ul>
                            <div className="flex flex-col sm:flex-row justify-center sm:items-center mt-8 ">
                                <label htmlFor="large" className="block mb-2 sm:mr-2 text-base font-medium text-gray-900 ">Supervisor</label>
                                <div className="flex flex-row">
                                    <select onChange={(e) => { setUserInfo(prev => { return { ...prev, supervisor: e.target.value } }); }} value={userInfo.supervisor} id="large" className="block py-3 px-4 sm:w-96 w-full rounded-md text-base text-gray-900 bg-gray-50 border border-gray-300 focus:ring-blue-500 focus:border-blue-500">
                                        <option value="">Select Supervisor...</option>
                                        {
                                            supervisor.map((item, key) =>
                                                <option key={key} value={item}>{item}</option>
                                            )
                                        }
                                    </select>
                                    <button type="button" onClick={(e) => { setReload(true); }}
                                        className="text-white bg-gray-500 hover:bg-gray-800 focus:ring-4 rounded-md focus:outline-none focus:ring-blue-300 font-medium text-md w-auto px-4 py-2.5 text-center">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                                    </button>
                                </div>
                            </div>
                            <div className="mt-10 flex justify-center">
                                <button type="button" onClick={submit} className="text-white bg-gray-500 hover:bg-gray-800 focus:ring-4 rounded-md focus:outline-none focus:ring-blue-300 font-medium text-md w-full sm:w-40 px-5 py-2.5 text-center">Submit</button>
                            </div>
                        </div>
                    </form>
                </div>
                <div className='hidden lg:block'></div>
            </div>
        </>
    )
}