
import React, { useRef, useState, useEffect } from "react";
//import { useOnClickOutside } from "usehooks-ts";
import { faker } from '@faker-js/faker';
import { ArcElement } from 'chart.js';

import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  Legend,
  Tooltip,
} from 'chart.js';
import {
  Chart,
} from 'react-chartjs-2';


const DoughnutChart: React.FunctionComponent=() =>{
    ChartJS.register(
        CategoryScale,
        LinearScale,
        ArcElement,
        Tooltip,
        Legend
      );
    const [isOnDoughnutChart, setDoughnutChart] = useState(true);
    const [backgroundColor, setBackgroundColor] = useState<string>('');
    const [hoverBackgroundColor, setHoverBackgroundColor] = useState<string>('');
    const [prevYearBackgroundColor, setPrevYearBackgroundColor] = useState<string>('');

    useEffect(() => {
      // Client-side-only code
    const computedStyle = getComputedStyle(document.documentElement);
    setBackgroundColor(computedStyle.getPropertyValue('--color-primary'));
    setHoverBackgroundColor(computedStyle.getPropertyValue('--color-primary-dark'));
    setPrevYearBackgroundColor(computedStyle.getPropertyValue('--color-primary-100'));

     }, [])
    const months = ['Oct', 'Nov', 'Dec'];
    const preMadeData = months.map(() => faker.datatype.number({ min: 0, max: 100 }));
    const data = {
        labels: months,
        datasets: [
          {
            xAxisID: 'x',
            yAxisID: 'y',
            data: preMadeData,
            backgroundColor: [backgroundColor, prevYearBackgroundColor, hoverBackgroundColor],
            borderWidth: 0,
            weight: 0.5,
          },
        ],
      }
    const options = {
        responsive: true,
        maintainAspectRatio: false,

      }
  
    const doughnutRef = useRef<ChartJS>(null);
  
    const handleDoughnutChartButton = () => {
        const { current: chart } = doughnutRef;
        const data = faker.datatype.number({ min: 0, max: 100 });
        if(chart){
          setDoughnutChart(!isOnDoughnutChart);
          if(chart.data.datasets[0] && chart.data.labels && chart.data.datasets[0].backgroundColor){
          if (isOnDoughnutChart) {
            chart.data.labels.unshift('Seb')
            chart.data.datasets[0].data.unshift(data)
            chart.update()
          } else {
            chart.data.labels.splice(0, 1)
            chart.data.datasets[0].data.splice(0, 1)
            chart.update()
          }
        }
          chart.update(); // chart now renders with item hidden
        }


      }
    return (
      <div className="bg-white rounded-md dark:bg-darker" x-data="{ isOn: false }">
      <div className="flex items-center justify-between p-4 border-b dark:border-primary">
        <h4 className="text-lg font-semibold text-gray-500 dark:text-light">Doughnut Chart</h4>
        <div className="flex items-center">
          <button
            className="relative focus:outline-none"
            onClick={handleDoughnutChartButton}
           // x-cloak
          >
            <div
              className="w-12 h-6 transition rounded-full outline-none bg-primary-100 dark:bg-primary-darker"
            ></div>
            <div
              className={`absolute top-0 left-0 inline-flex items-center justify-center w-6 h-6 transition-all duration-200 ease-in-out transform scale-110 rounded-full shadow-sm ${
                isOnDoughnutChart ? "translate-x-6 bg-primary-light dark:bg-primary" : "translate-x-0  bg-white dark:bg-primary-100"
                }`}   
            ></div>
          </button>
        </div>
      </div>
      <div className="relative p-4 h-72">
        <Chart id="lineChart" ref={doughnutRef} type='doughnut' options={options} data={data} />
      </div>
    </div>
    )
}
export default DoughnutChart