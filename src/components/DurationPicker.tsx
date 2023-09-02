import React, { useState } from 'react';

const DurationPicker = () => {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    setHours(isNaN(value) ? 0 : value);
  };

  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    setMinutes(isNaN(value) ? 0 : value);
  };

  const handleSecondsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    setSeconds(isNaN(value) ? 30 : value);
  };

  return (
    <div>
      <label className='p-3'>
        h:
        <input className="dark:bg-primary dark:text-light focus:ring-primary mb-5 mr-2 ml-2 mt-2 h-8 w-1/5 items-center rounded  border border-gray-300 pl-3 text-sm font-normal text-gray-600 placeholder-gray-400 focus:outline-none focus:ring dark:border-gray-700 dark:placeholder-gray-200"
                      type="number"
          value={hours}
          onChange={handleHoursChange}
          defaultValue="0"
          
        />
      </label>
      <label className='p-3'>
        m:
        <input className="dark:bg-primary dark:text-light focus:ring-primary mb-5 mr-2 ml-2 mt-2 h-8 w-1/5 items-center rounded  border border-gray-300 pl-3 text-sm font-normal text-gray-600 placeholder-gray-400 focus:outline-none focus:ring dark:border-gray-700 dark:placeholder-gray-200"
        type="number"
          value={minutes}
          onChange={handleMinutesChange}
          defaultValue="0"
        />
      </label>
      <label className='p-3'>
        s:
        <input className="dark:bg-primary dark:text-light focus:ring-primary mb-5 mr-2 ml-2 mt-2 h-8 w-1/5 items-center rounded  border border-gray-300 pl-3 text-sm font-normal text-gray-600 placeholder-gray-400 focus:outline-none focus:ring dark:border-gray-700 dark:placeholder-gray-200"
          type="number"
          value={seconds}
          onChange={handleSecondsChange}
          defaultValue="30"
        />
      </label>
    </div>
  );
};

export default DurationPicker;
