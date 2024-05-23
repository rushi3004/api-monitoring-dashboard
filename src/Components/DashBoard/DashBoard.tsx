import React, { useState } from 'react'
import Header from '../Header'
import Cost from './Cost/Cost'
import Activity from './Activity/Activity'

function DashBoard() {
    const [activeComponent, setActiveComponent] = useState<string | null>("activity");

     const handleCost = () =>{
        setActiveComponent("cost")
     }

     const handleActivity = () =>{
        setActiveComponent("activity")
        console.log("Clicked Activity");
     }
    return (
        <>
        <Header/>
        <div className='container mt-5'>
            <button type="button" className="btn btn-light bg-color-gray btn-sm mr-0" onClick={handleCost}>Cost</button>
            <button type="button" className="btn btn-dark btn-sm ml-0" onClick={handleActivity}>Activity</button>
            
            {activeComponent === 'cost' && <Cost/>}
            {activeComponent === 'activity' && <Activity/>}
           
        </div>
        </>
    )
}

export default DashBoard


