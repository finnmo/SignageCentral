export interface Props {
    durationHours: number;
    setDurationHours: (hours: number) => void;
    durationMinutes: number;
    setDurationMinutes: (minutes: number) => void;
    durationSeconds: number;
    setDurationSeconds: (seconds: number) => void;
}
 function DurationPicker(props: Props) {

    const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value, 10);
        props.setDurationHours(isNaN(value) ? 0 : value);
    };

    const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value, 10);
        props.setDurationMinutes(isNaN(value) ? 0 : value);
    };

    const handleSecondsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value, 10);
        props.setDurationSeconds(isNaN(value) ? 30 : value);
    };

    return (
        <div>
            <label className='p-3'>
                h:
                <input className="dark:bg-primary dark:text-light focus:ring-primary mb-5 mr-2 ml-2 mt-2 h-8 w-1/5 items-center rounded  border border-gray-300 pl-3 text-sm font-normal text-gray-600 placeholder-gray-400 focus:outline-none focus:ring dark:border-gray-700 dark:placeholder-gray-200"
                    type="number"
                    value={props.durationHours}
                    onChange={handleHoursChange}
                    />
            </label>
            <label className='p-3'>
                m:
                <input className="dark:bg-primary dark:text-light focus:ring-primary mb-5 mr-2 ml-2 mt-2 h-8 w-1/5 items-center rounded  border border-gray-300 pl-3 text-sm font-normal text-gray-600 placeholder-gray-400 focus:outline-none focus:ring dark:border-gray-700 dark:placeholder-gray-200"
                    type="number"
                    value={props.durationMinutes}
                    onChange={handleMinutesChange}
                     />
            </label>
            <label className='p-3'>
                s:
                <input className="dark:bg-primary dark:text-light focus:ring-primary mb-5 mr-2 ml-2 mt-2 h-8 w-1/5 items-center rounded  border border-gray-300 pl-3 text-sm font-normal text-gray-600 placeholder-gray-400 focus:outline-none focus:ring dark:border-gray-700 dark:placeholder-gray-200"
                    type="number"
                    value={props.durationSeconds}
                    onChange={handleSecondsChange}
                     />
            </label>
        </div>
    );
}

export default DurationPicker;
