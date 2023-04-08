
import React, { useRef, useState, useEffect } from "react";
import classNames from "classnames";
import Link from "next/link";
import Image from "next/image";
import Layout from "../pages/layouts/Layout"
import { useOnClickOutside } from "usehooks-ts";
import { faker } from '@faker-js/faker';
import type { InteractionItem } from 'chart.js';

import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
} from 'chart.js';
import {
  Chart,
  getDatasetAtEvent,
  getElementAtEvent,
  getElementsAtEvent,
} from 'react-chartjs-2';


  const BarChart: React.FunctionComponent=() =>{
    ChartJS.register(
        CategoryScale,
        LinearScale,
        BarElement,
        Tooltip,
        Legend
      );

    const [backgroundColor, setBackgroundColor] = useState<string>('');
    const [hoverBackgroundColor, setHoverBackgroundColor] = useState<string>('');
    const [prevYearBackgroundColor, setPrevYearBackgroundColor] = useState<string>('');
    const [prevYearHoverBackgroundColor, setPrevHoverYearBackgroundColor] = useState<string>('');
    const [isPrevYear, setPrevYear] = useState(true);

    useEffect(() => {
      // Client-side-only code
    const computedStyle = getComputedStyle(document.documentElement);
    setBackgroundColor(computedStyle.getPropertyValue('--color-primary'));
    setHoverBackgroundColor(computedStyle.getPropertyValue('--color-primary-dark'));
    setPrevYearBackgroundColor(computedStyle.getPropertyValue('--color-primary-100'));
    setPrevHoverYearBackgroundColor(computedStyle.getPropertyValue('--color-primary-100'));

     })
    
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

    const data = {
      labels: months,
      datasets: [
        {
          maxBarThickness: 10,
          xAxisID: 'x',
          yAxisID: 'y',
          data: months.map(() => faker.datatype.number({ min: 0, max: 100 })),
          backgroundColor: prevYearBackgroundColor,
          hoverBackgroundColor: prevYearHoverBackgroundColor,
        },
        {
          maxBarThickness: 10,
          xAxisID: 'x',
          yAxisID: 'y',
          data: months.map(() => faker.datatype.number({ min: 0, max: 100 })),
          backgroundColor: backgroundColor,
          hoverBackgroundColor: hoverBackgroundColor
        },
      ],
    }
    const options ={
        responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top' as const,
              display: false,
            },
            title: {
              display: false,
            },
          },
          
          scales: {
            x: {
              position: 'bottom',
              grid: {
                display: false,
              }
            },
            y: {
              position: 'bottom',
              grid: {
                display: false,
              },
              min: 0,
              max: 150,
              ticks: {
                stepSize: 50,
                padding: 10,
              },
            }
          }
      }

  const chartRef = useRef<ChartJS>(null);

  const handleBarChartButton = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { current: chart } = chartRef;
    if(chart){
      setPrevYear(!isPrevYear);
      chart.data.datasets.forEach(function(ds) {
        ds.hidden = !ds.hidden;
      });
      chart.update(); // chart now renders with item hidden
    }
  }

    
    return (
  <div className="col-span-2 bg-white rounded-md dark:bg-darker" x-data="{ isOn: false }">
    <div className="flex items-center justify-between p-4 border-b dark:border-primary">
        <h4 className="text-lg font-semibold text-gray-500 dark:text-light">Bar Chart</h4>
        <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-500 dark:text-light">Last year</span>
        <button
            className="relative focus:outline-none"
            //x-cloak
            onClick={handleBarChartButton}
        >
            <div
            className="w-12 h-6 transition rounded-full outline-none bg-primary-100 dark:bg-primary-darker"
            ></div>
            <div
            className={`absolute top-0 left-0 inline-flex items-center justify-center w-6 h-6 transition-all duration-200 ease-in-out transform scale-110 rounded-full shadow-sm ${
              isPrevYear ? "translate-x-6 bg-primary-light dark:bg-primary" : "translate-x-0  bg-white dark:bg-primary-100"
                }`}   
            ></div>
        </button>
        </div>
    </div>
    <div className="relative p-4 h-72">
      <Chart ref={chartRef} type='bar' options={options} data={data} />
    </div>
    </div>

    )
}
export default BarChart