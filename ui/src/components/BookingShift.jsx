import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ShiftsTab from './ShiftTab';



const ShiftsApp = () => {
  const [myShifts, setMyShifts] = useState([]);
  const [availableShifts, setAvailableShifts] = useState([]);
  const [locationsShifts, setLocationShifts] = useState([]);
  const [openTab, setOpenTab] = useState('MyShifts');
  const [locations, setLocations] = useState([]);
  const [activeLocationTab, setActiveLocationTab] = useState(locations[0]);
  const [shiftsByLocation, setShiftsByLocation] = useState({});
  


  useEffect(() => {
    fetchShifts();
  }, []);

  const getUniqueLocations = (shifts) => {
  const uniqueLocations = new Set();

  shifts.forEach(shift => {
    uniqueLocations.add(shift.area);
  });

  setLocations(Array.from(uniqueLocations));
  setActiveLocationTab(locations[0]);
  };

  const fetchShifts = async () => {
    try {
      const allShifts = await axios.get('http://127.0.0.1:8080/shifts');
      const myShifts = allShifts.data.filter(shift => shift.booked);
      setMyShifts(myShifts);
      setAvailableShifts(allShifts.data);
      getUniqueLocations(allShifts.data);
    } catch (error) {
      console.error('Error fetching my shifts:', error);
    }
  };

  

  const handleTabClick = (tab) => {
    setOpenTab(tab);
    fetchShifts();
    if (tab === 'AvailableShifts') {
      setActiveLocationTab(locations[0]);
      const shiftsByLocations = {};
      locations.forEach((location) => {
        shiftsByLocations[location] = availableShifts.filter(
          (shift) => shift.area === location
        );
      });
      setShiftsByLocation(shiftsByLocations);
      setLocationShifts(shiftsByLocations[locations[0]]);
    }
  };

  const handleLocationTabClick = (location) => {
    setActiveLocationTab(location);
    setLocationShifts(shiftsByLocation[location]); 
  };

  const bookshift = async (id) => {
  try {
    const response = await axios.post(`http://127.0.0.1:8080/shifts/${id}/book`);
    const updatedShiftsByLocation = { ...shiftsByLocation };
    const updatedShiftIndex = updatedShiftsByLocation[activeLocationTab].findIndex(
      (shift) => shift.id === response.data.id
    );
    updatedShiftsByLocation[activeLocationTab][updatedShiftIndex] = response.data;
    
    setShiftsByLocation(updatedShiftsByLocation);
    setLocationShifts(updatedShiftsByLocation[activeLocationTab]);
  } catch (error) {
    console.error('Error booking shift:', error);
  }
}

const cancelShift = async (id) => {
  try {
    const response = await axios.post(`http://127.0.0.1:8080/shifts/${id}/cancel`);
    const updatedShiftsByLocation = { ...shiftsByLocation };
    const updatedShiftIndex = updatedShiftsByLocation[activeLocationTab].findIndex(
      (shift) => shift.id === response.data.id
    );
    updatedShiftsByLocation[activeLocationTab][updatedShiftIndex] = response.data;
    
    setShiftsByLocation(updatedShiftsByLocation);
    setLocationShifts(updatedShiftsByLocation[activeLocationTab]);
    fetchShifts()
  } catch (error) {
    console.error('Error canceling shift:', error);
  }
}

  return (
    <div className='bg-primary-400 h-full min-h-screen flex-col pl-80 pt-20 pr-40'>
      <div className='mb-4 ml-6'>
        <button className={`${openTab === 'MyShifts' ? 'text-primary-50' : 'text-primary-200'} text-2xl mr-8`} onClick={() => handleTabClick('MyShifts')}>My Shifts</button>
        <button className={`${openTab === 'AvailableShifts' ? 'text-primary-50' : 'text-primary-200'} text-2xl`} onClick={() => handleTabClick('AvailableShifts')}>Available Shifts</button>
      </div>
      <div className='mr-40 bg-primary-500 shadow-xl border'>
        {openTab === 'AvailableShifts' && <div className='flex text-primary-50 text-xl justify-around h-16 border'>
            {locations.map((location, index) => (
              <button
                className={`${activeLocationTab === location ? 'text-primary-50' : 'text-primary-200'} text-xl mr-8`}
                onClick={() => handleLocationTabClick(location)}
                key={index}
              >
                {location} ({shiftsByLocation[location].length})
              </button>
            ))}
          </div>}
      {openTab === 'MyShifts' ? <ShiftsTab shifts={myShifts} openTab={openTab} bookshift={bookshift} cancelShift={cancelShift} /> : 
      <ShiftsTab shifts={locationsShifts} openTab={openTab} bookshift={bookshift} cancelShift={cancelShift}/> }
      </div>
    </div>
  );
};

export default ShiftsApp;

