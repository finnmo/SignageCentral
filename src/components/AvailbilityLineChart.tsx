
import React, { useRef, useState, useEffect } from "react";
import {PointElement } from 'chart.js';

import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  LineElement,
  Legend,
  Tooltip,
} from 'chart.js';
import {
  Chart,
} from 'react-chartjs-2';


const AvailablityLineChart: React.FunctionComponent=() =>{
    ChartJS.register(
        CategoryScale,
        LinearScale,
        LineElement,
        PointElement,
        Tooltip,
        Legend
      );
    const [isOnLineChart, setIsOnLineChart] = useState(true);
    const [backgroundColor, setBackgroundColor] = useState<string>('');

    useEffect(() => {
      // Client-side-only code
    const computedStyle = getComputedStyle(document.documentElement);
    setBackgroundColor(computedStyle.getPropertyValue('--color-primary'));

     }, [])
     const months = ['Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun'];
     const preMadeData =  [5,5,5,4,5,3,5]
    const data = {
        labels: months,
        datasets: [
          {
            fill: false,
            xAxisID: 'x',
            yAxisID: 'y',
            lineTension: 0.3,  
            data: preMadeData,
            borderColor: backgroundColor,
            borderWidth: 2,
            pointRadius: 0,
            pointHoverRadius: 0,
            interaction: {
              mode: 'point'
            },
          },
        ],
      }
      const options ={
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          title: {
            display: false,
          },

        },
        hover: {
          intersect: false,
        },
        scales: {
          x: {
            position: 'bottom',
            grid: {
              display: false,
            },
            border: {
                display: false,
            },
          },
          y: {
            min: 0,
            position: 'bottom',
            border: {
                display: false,
            },
            grid: {
                drawBorder: false,
                display: false,
              },
            ticks: {
                beginAtZero: true,
                fontSize: 12,
                stepSize: 1,
                fontColor: '#97a4af',
                fontFamily: 'Open Sans, sans-serif',
                padding: 20,
            },
          }
        }
      }
  
    const lineRef = useRef<ChartJS>(null);
  
    const handleLineChartButton = () => {
        const { current: chart } = lineRef;
        if(chart){
            setIsOnLineChart(!isOnLineChart);
          if(chart.data.datasets[0])
          chart.data.datasets[0].data.reverse()
          chart.update(); // chart now renders with item hidden
        }
      }
    return (


        <div className="col-span-2 bg-white rounded-md dark:bg-darker" x-data="{ isOn: false }">
            <div className="flex items-center justify-between p-4 border-b dark:border-primary">
            <h4 className="text-lg font-semibold text-gray-500 dark:text-light">Digital Signs Online</h4>
            <div className="flex items-center">
                <button
                className="relative focus:outline-none"
                //x-cloak
                onClick={handleLineChartButton}
                >
                <div
                    className="w-12 h-6 transition rounded-full outline-none bg-primary-100 dark:bg-primary-darker"
                ></div>
                <div
                    className={`absolute top-0 left-0 inline-flex items-center justify-center w-6 h-6 transition-all duration-200 ease-in-out transform scale-110 rounded-full shadow-sm ${
                    isOnLineChart ? "translate-x-6 bg-primary-light dark:bg-primary" : "translate-x-0  bg-white dark:bg-primary-100"
                    }`}   
                ></div>
                </button>
            </div>
            </div>
            <div className="relative p-4 h-72">
                <Chart id="lineChart" ref={lineRef} type='line' options={options} data={data} />
            </div>
        </div>
    )
}
export default AvailablityLineChart