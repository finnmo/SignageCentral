
import React, { useRef, useState, useEffect } from "react";
//import { useOnClickOutside } from "usehooks-ts";
import { faker } from '@faker-js/faker';
import { ArcElement, InteractionItem } from 'chart.js';

import {
    Chart as ChartJS,
    LinearScale,
    CategoryScale,
    BarElement,
    Legend,
    Tooltip,
  } from 'chart.js';
  import {
    Chart,
  } from 'react-chartjs-2';


const ActiveSigns: React.FunctionComponent=() =>{
    ChartJS.register(
        CategoryScale,
        LinearScale,
        BarElement,
        ArcElement,
        Tooltip,
        Legend
      );
    const [backgroundColor, setBackgroundColor] = useState<string>('');
    const [usersCount, setUsersCount] = useState<string>('0');


    useEffect(() => {
      // Client-side-only code
    const computedStyle = getComputedStyle(document.documentElement);
    setBackgroundColor(computedStyle.getPropertyValue('--color-primary'));

     })
    
    function randomData(){
        return [faker.datatype.number({ min: 0, max: 100 }),
            faker.datatype.number({ min: 0, max: 100 }),
            faker.datatype.number({ min: 0, max: 100 }),
            faker.datatype.number({ min: 0, max: 100 }),
            faker.datatype.number({ min: 0, max: 100 }),
            faker.datatype.number({ min: 0, max: 100 }),
            faker.datatype.number({ min: 0, max: 100 }),
            faker.datatype.number({ min: 0, max: 100 }),
            faker.datatype.number({ min: 0, max: 100 }),
            faker.datatype.number({ min: 0, max: 100 }),
            faker.datatype.number({ min: 0, max: 100 }),
            faker.datatype.number({ min: 0, max: 100 }),
            faker.datatype.number({ min: 0, max: 100 }),
        ]
    }
    const data = {
        labels: [...randomData(), ...randomData()],
        datasets: [
          {
            xAxisID: 'x',
            yAxisID: 'y',
            data: [...randomData(), ...randomData()],
            backgroundColor: backgroundColor,
            borderWidth: 0,
            categoryPercentage: 1,
          },
        ],
      }
      const options ={
          responsive: true,
          cornerRadius: 2,
          maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false,
              },
              title: {
                display: false,
              },
              tooltips: {
                hasIndicator: true,
                intersect: false,
              },
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
                ticks: {
                  display: false
              },
              },
              y: {
                position: 'bottom',
                border: {
                    display: false,
                },
                grid: {
                    drawBorder: false,
                    display: false,
                  },
                ticks: {
                    display: false
                },
              }
            }
          }
  
    const activeUsersChart = useRef<ChartJS>(null);
    let randomUserCount = 0;

    useEffect(() => {
      const interval = setInterval(() => {
        const { current: chart } = activeUsersChart;
        if(chart && chart.data.datasets[0]){
          randomUserCount = faker.datatype.number({ min: 0, max: 100 });
          setUsersCount(randomUserCount.toString());
          chart.data.datasets[0].data.splice(0, 1)
          chart.update()

        }
      }, 1000);
      return () => clearInterval(interval);
    }, []);

    return (
    <>  
        <div className="col-span-1 bg-white rounded-md dark:bg-darker">
            <div className="p-4 border-b dark:border-primary">
            <h4 className="text-lg font-semibold text-gray-500 dark:text-light">Active users right now</h4>
            </div>
            <p className="p-4">
            <span className="text-2xl font-medium text-gray-500 dark:text-light">{usersCount}</span>
            <span className="text-sm font-medium text-gray-500 dark:text-primary">Users</span>
            </p>
            <div className="relative p-4">
                <Chart ref={activeUsersChart} type='bar' options={options} data={data} />
            </div>
        </div>
    </>
)
}
export default ActiveSigns