import {useState, useEffect} from "react";
import {NotificationContainer, NotificationManager} from 'react-notifications';

import 'react-notifications/lib/notifications.css';

import {SELECT_TYPES, STATES, BASE_URL} from "../consts/consts";
// var consts = require('../consts/consts');

export default function HomeComponent() {
    const [type, setType] = useState("");
    const [state, setState] = useState("");
    const [resultList, setResultList] = useState([]);

    const [firstName, setFirstName] = useState([]);
    const [lastName, setLastName] = useState([]);
    const [district, setDistrict] = useState([]);
    const [phone, setPhone] = useState([]);
    const [office, setOffice] = useState([]);
    const [selectedIdx, setSelectedIdx] = useState(-1);
    const [pagination, setPagination] = useState({pageNum: 1, entries: 0});

    useEffect(() => {
        setPagination({pageNum: 1, entries: resultList.length});
    }, [resultList]);

    const stateChange = (e) => {
        setState(e.target.value);
    };

    const selectSearchType = (e) => {
        setType(e.target.value);
    };

    const itemClicked = (idx) => {
        setFirstName(resultList[idx].name.split(" ")[0]);
        setLastName(resultList[idx].name.split(" ")[1]);
        setDistrict(resultList[idx].district);
        setPhone(resultList[idx].phone);
        setOffice(resultList[idx].office);
        setSelectedIdx(idx);
    };

    const reset = () => {
        setFirstName("");
        setLastName("");
        setDistrict("");
        setPhone("");
        setOffice("");
        setSelectedIdx(-1);
    };

    const submit = () => {
        if (!type) {
            NotificationManager.warning('Select rep/sen please!', 'Warning', 2000);
        } else if (!state) {
            NotificationManager.warning('Select state please!', 'Warning', 2000);
        } else {
            let url = BASE_URL;
            if (type === SELECT_TYPES.REP) {
                url += `/representatives/${state}`;
            } else if (type === SELECT_TYPES.SEN) {
                url += `/senators/${state}`;
            }

            fetch(url).then(response => response.json())
                .then((response) => {
                    if (type === SELECT_TYPES.REP) {
                        setResultList(response.results);
                    } else if (type === SELECT_TYPES.SEN) {
                        setResultList(response.results);
                    }
                    reset();
                })
                .catch(err => {
                    NotificationManager.warning(`Error while fetching data.\nMake sure server is running.`, 'Error', 4000);
                    return {
                        success: false,
                        status: 500,
                        msg: err,
                    }
                })
        }
    };

    const calcPage = () => {
        let start = pagination.pageNum * 10 - 9 > pagination.entries ? pagination.entries : pagination.pageNum * 10 - 9;
        let end = pagination.pageNum * 10 > pagination.entries ? pagination.entries : pagination.pageNum * 10;
        return {start: start, end: end};
    };

    return (
        <div className="bg-gradient-to-b from-fuchsia-600 to-fuchsia-900 text-gray-300 p-5">
            <NotificationContainer/>
            <div className="grid rounded-xl mx-12 mt-2 p-4 bg-gray-800 bg-opacity-30">
                <div className="text-gray-100"><b>Who's My Representative?</b></div>
                <div className="mt-3 border-b-2  border-gray-400 border-opacity-50 ..."/>
                <div className="flex m-4 justify-between items-center">
                    <div className="flex flex-col md:flex-row">
                        <div className="flex mr-4 mt-2 items-center">
                            <label htmlFor="countries"
                                   className="basis-4/12 flex items-center text-sm font-medium text-gray-300 mr-4">Rep / Sen:</label>
                            <select id="countries"
                                    className="w-60 md:w-min basis-8/12 bg-gray-900 bg-opacity-20 border  border-gray-400 border-opacity-70 text-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                                    value={type} onChange={selectSearchType}>
                                <option disabled defaultValue value="">
                                    Select an Option Here
                                </option>
                                <option className="text-gray-900" value={SELECT_TYPES.REP}>Representative</option>
                                <option className="text-gray-900" value={SELECT_TYPES.SEN}>Senator</option>
                            </select>
                        </div>
                        <div className="flex mr-4 mt-2 items-center">
                            <label htmlFor="countries"
                                   className="basis-4/12 flex items-center text-sm font-medium text-gray-300 mr-4">States:</label>
                            <select id="countries"
                                    className="w-60 md:w-min basis-8/12 bg-gray-900 bg-opacity-20 border  border-gray-400 border-opacity-70 text-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                                    value={state} onChange={stateChange}>
                                <option disabled defaultValue value="">Choose a State</option>
                                {
                                    STATES.map((item, idx) => (
                                        <option className="text-gray-900" value={item} key={idx}>{item}</option>
                                    ))
                                }
                            </select>
                        </div>
                    </div>
                    <button type="button"
                            className="align-self- text-white bg-white bg-opacity-20 hover:bg-gray-900 hover:bg-opacity-20 shadow-md shadow-fuchsia-600/50 focus:bg-opacity-40 focus:outline-none font-medium rounded-lg text-sm px-5 py-1 h-20 md:h-10 text-center"
                            onClick={submit}>Submit
                    </button>
                </div>
                <div className="grid grid-cols-2">

                    {/* Left Panel */}
                    <div className="mx-4">
                        <div className="my-2"> List / Representatives</div>
                        <div className="overflow-x-auto relative">
                            <table className="w-full text-sm text-left text-gray-500">
                                <thead className="text-xs text-gray-300 uppercase bg-gray-900 bg-opacity-20">
                                <tr>
                                    <th scope="col" className="py-3 px-6">
                                        Name
                                    </th>
                                    <th scope="col" className="py-3 px-6">
                                        Party
                                    </th>
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    resultList.map((senator, idx) =>
                                        !(idx < calcPage().end && idx >= calcPage().start - 1) ||
                                        <tr key={idx}
                                            className={`bg-gray-900 bg-opacity-10 hover:bg-purple-700 focus:bg-gray-200 border-b border-gray-400 border-opacity-30 cursor-pointer ${selectedIdx === idx ? "bg-violet-900  bg-opacity-50" : ""}`}
                                            onClick={() => itemClicked(idx)}>
                                            <td scope="row" className="py-4 px-6 font-medium text-gray-300">
                                                {senator.name}
                                            </td>
                                            <td className="py-4 px-6 text-gray-300">
                                                {senator.party}
                                            </td>
                                        </tr>
                                    )
                                }
                                </tbody>
                            </table>
                        </div>
                        {/*Pagination*/}
                        <div className="flex flex-col items-center mt-4">
                            <span className="text-sm text-gray-200 dark:text-gray-400">
                                Showing <span
                                className="font-semibold text-cyan-500 dark:text-white">{calcPage().start} </span>
                                to <span
                                className="font-semibold text-cyan-500 dark:text-white">{calcPage().end} </span>
                                of <span
                                className="font-semibold text-cyan-500 dark:text-white">{pagination.entries}</span> Entries </span>
                            <div className="inline-flex mt-2 xs:mt-0">
                                <button
                                    onClick={(e) => {
                                        if (pagination.pageNum > 1)
                                            setPagination(prev => {
                                                return {...prev, pageNum: prev.pageNum - 1}
                                            });
                                    }}
                                    className="inline-flex items-center py-2 px-4 text-sm font-medium text-white bg-gray-400 bg-opacity-20 hover:bg-opacity-20 rounded-l hover:bg-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                                    <svg aria-hidden="true" className="mr-2 w-5 h-5" fill="currentColor"
                                         viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd"
                                              d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z"
                                              clipRule="evenodd"></path>
                                    </svg>
                                    Prev
                                </button>
                                <button
                                    onClick={(e) => {
                                        if (pagination.pageNum * 10 < pagination.entries)
                                            setPagination(prev => {
                                                return {...prev, pageNum: prev.pageNum + 1}
                                            });
                                    }}
                                    className="inline-flex items-center py-2 px-4 text-sm font-medium text-white bg-gray-400 bg-opacity-20 hover:bg-opacity-20 rounded-r border-0 border-l border-gray-700 hover:bg-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                                    Next
                                    <svg aria-hidden="true" className="ml-2 w-5 h-5" fill="currentColor"
                                         viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd"
                                              d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                                              clipRule="evenodd"></path>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Panel */}
                    <div className="mx-4">
                        <div className="my-2"> Info</div>
                        <div className="my-4">
                            <input value={firstName} type="text" id="firstName"
                                   className="bg-gray-900 bg-opacity-20 border md:w-full border-gray-400 border-opacity-60 text-gray-300 text-sm rounded block p-2.5"
                                   placeholder="First Name" disabled/>
                        </div>
                        <div className="my-4">
                            <input value={lastName} type="text" id="lastName"
                                   className="bg-gray-900 bg-opacity-20 border md:w-full border-gray-400 border-opacity-60 text-gray-300 text-sm rounded block p-2.5"
                                   placeholder="Last Name" disabled/>
                        </div>
                        <div className="my-4">
                            <input value={district} type="text" id="district"
                                   className="bg-gray-900 bg-opacity-20 border md:w-full border-gray-400 border-opacity-60 text-gray-300 text-sm rounded block p-2.5"
                                   placeholder="District" disabled/>
                        </div>
                        <div className="my-4">
                            <input value={phone} type="text" id="Phone"
                                   className="bg-gray-900 bg-opacity-20 border md:w-full border-gray-400 border-opacity-60 text-gray-300 text-sm rounded block p-2.5"
                                   placeholder="Phone" disabled/>
                        </div>
                        <div className="my-2">
                            <input value={office} type="text" id="Office"
                                   className="bg-gray-900 bg-opacity-20 border md:w-full border-gray-400 border-opacity-60 text-gray-300 text-sm rounded block p-2.5"
                                   placeholder="Office" disabled/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}