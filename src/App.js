import React, { Component } from 'react';
import moment from 'moment';
// import SampleChart from './chart1.js'; 
// import Dots from './dots.js'; 
// import Sunburst from './sunburst';
import Rose from './rose';
// import Linechart from './linechart';
// import Player1 from './player1';
// import Mosaic from './mosaic';
import CampaignChart from './CampaignChart';
import AudienzzRadar from './audienzzRadar';
import AudienzzIncome from './audienzzIncome';
import AudienzzDivisions from './audienzzDivisions';
import AudienzzDots from './audienzzDots';
import AudienzzRanks from './audienzzRanks';
import AudienzzDonut from './audienzzDonut';


class App extends Component {
  constructor() {
    super();
    this.state = {
      // data: this.generate(),
      // dotsData: this.generateDots(),
      // sunburstData: this.generateSunburst(),
      roseData1: this.generateRose1(),
      roseData2: this.generateRose2(),
      roseData3: this.generateRose3(),
      roseData4: this.generateRose4(),
      roseData5: this.generateRose5(),
      roseData6: this.generateRose6(),
      //linechartData: this.generateLinechart(),
      // player1Data: this.generatePlayer1(),
      audienzzDonut: this.generateAudienzzDonut(),
      campaignChart: this.generateCampaignChart(),
      audienzzRadar: this.generateAudienzzRadar(),
      audienzzIncome: this.generateAudienzzIncome(),
      audienzzDivisions: this.generateAudienzzDivisions(),
      audienzzDots: this.generateAudienzzDots(),
      audienzzRanks: this.generateAudienzzRanks()
    }
  }


  generateAudienzzRadar() {
    return [
            {axis:"Owns a High-End Car", value: Math.round(Math.random() * 80), image: "car.png"},
            {axis:"Donates Money", value: Math.round(Math.random() * 60), image: "money.png"},
            {axis:"Owns a Vacation Flat", value: Math.round(Math.random() * 20), image: "vacation.png"},
            {axis:"Owns a Real-Estate", value: Math.round(Math.random() * 89), image: "house.png"}    
          ];
  }


  generateAudienzzIncome() {
    return [
            {name:"100.000+", value: Math.round(Math.random() * 60) + 10, color:"#468AB0"}, 
            {name:"80.000 - 100.000", value: Math.round(Math.random() * 30) + 10, color:"#3BA2AD"}, 
            {name:"60.000 - 80.000", value: Math.round(Math.random() * 10) + 10, color:"#2FA692"}, 
            {name:"40.000 - 60.000", value: Math.round(Math.random() * 50) + 10, color:"#35B36C"}    
          ];
  }

  generateAudienzzDivisions() {
    return [
            {name:"Industry01", value: Math.round(Math.random() * 60) + 10}, 
            {name:"Industry02", value: Math.round(Math.random() * 30) + 10}, 
            {name:"Industry03", value: Math.round(Math.random() * 10) + 10}, 
            {name:"Industry04", value: Math.round(Math.random() * 50) + 10},
            {name:"Industry05", value: Math.round(Math.random() * 60) + 10}, 
            {name:"Industry06", value: Math.round(Math.random() * 30) + 10}, 
            {name:"Industry07", value: Math.round(Math.random() * 10) + 10}, 
            {name:"Industry08", value: Math.round(Math.random() * 50) + 10},
            {name:"Industry09", value: Math.round(Math.random() * 60) + 10}, 
            {name:"Industry10", value: Math.round(Math.random() * 30) + 10}, 
            {name:"Industry11", value: Math.round(Math.random() * 10) + 10}, 
            {name:"Industry12", value: Math.round(Math.random() * 50) + 10},    
            {name:"Industry13", value: Math.round(Math.random() * 60) + 10}, 
            {name:"Industry14", value: Math.round(Math.random() * 30) + 10}, 
            {name:"Industry15", value: Math.round(Math.random() * 10) + 10}, 
            {name:"Industry16", value: Math.round(Math.random() * 50) + 10}        
          ];
  }


  generateAudienzzDots() {

    var maleValue = Math.round(Math.random() * 50) + 25;

    return [
      {name: "Male", percentage: maleValue, color: '#5294B9'},
      {name: "Female", percentage: 100 - maleValue, color: '#E9686B'}
    ];
  }

  generateAudienzzRanks() {
    return [
      {name: "C Level", icon: "1.png", value: Math.random() * 40, backgroundColor: '#478BB1', hoverBackgroundColor: '#478BB1'},
      {name: "Middle Management", icon: "2.png", value: Math.random() * 40, backgroundColor: '#D54D7A', hoverBackgroundColor: '#D54D7A'},
      {name: "Employee", icon: "3.png", value: Math.random() * 40, backgroundColor: '#F3AC4E', hoverBackgroundColor: '#F3AC4E'},
      {name: "Aprentice", icon: "4.png", value: Math.random() * 40, backgroundColor: '#35B997', hoverBackgroundColor: '#35B997'}
    ];
  }


  generateCampaignChart() {

    return function (start, end) {
        let cur = start;
        let result = [];
        while(cur <= end) {
          result.push({
            date: cur.format('YYYY-MM-DD'),
            value: Math.random() * 1000
          });
          cur.add(1,'days')
        }
        return result;
      }(moment('2016-07-10', 'YYYY-MM-DD'), moment('2016-07-17', 'YYYY-MM-DD'));

  }


  generateAudienzzDonut() {
    return {
      name: "Impressions",
      group: "Age Groups",
      icon:"icon.png",
      data: [
        {name: "12-20", value: Math.random() * 40, backgroundColor: '#FBB24E'},
        {name: "31-40", value: Math.random() * 40, backgroundColor: '#D94E7C'},
        {name: "21-30", value: Math.random() * 40, backgroundColor: '#40BE9B'},
        {name: "41+", value: Math.random() * 40, backgroundColor: '#488CB3'}
      ]};
  }


  
  // generateLinechart () {
  //   return [
  //     { 
  //       "name": "Campain1",
  //       "values": [ {"date": "1-May-16", "value": Math.random() * 50}, {"date": "14-May-16", "value": Math.random() * 50}, {"date": "23-May-16", "value": Math.random() * 50}, {"date": "29-May-16", "value": Math.random() * 50}, {"date": "5-Jun-16", "value": Math.random() * 50}]
  //     },
  //     { 
  //       "name": "Campain2",
  //       "values": [ {"date": "1-May-16", "value": Math.random() * 50}, {"date": "14-May-16", "value": Math.random() * 50}, {"date": "23-May-16", "value": Math.random() * 50}, {"date": "29-May-16", "value": Math.random() * 50}, {"date": "5-Jun-16", "value": Math.random() * 50}]
  //     },
  //     { 
  //       "name": "Campain3",
  //       "values": [ {"date": "1-May-16", "value": Math.random() * 50}, {"date": "14-May-16", "value": Math.random() * 50}, {"date": "23-May-16", "value": Math.random() * 50}, {"date": "29-May-16", "value": Math.random() * 50}, {"date": "5-Jun-16", "value": Math.random() * 50}]
  //     },
  //     { 
  //       "name": "Campain4",
  //       "values": [ {"date": "1-May-16", "value": Math.random() * 50}, {"date": "14-May-16", "value": Math.random() * 50}, {"date": "23-May-16", "value": Math.random() * 50}, {"date": "29-May-16", "value": Math.random() * 50}, {"date": "5-Jun-16", "value": Math.random() * 50}]
  //     }
  //   ]
  // }

  generateRose1() {

    // let randomNum = Math.random();

    // sum of all sizes should be 100
    // sum of all values === "Size" 
    
    //http://localhost:8080/advertiser2/types?endDate=1493845199&startDate=1491166800&type=2

    return [    
      {
        "Type": "Image", 
        "Size":  0, 
        "Image": "roseImage.png",
        "Values": [
          {"name": "Desktop", "value": 0, "color":"#DE6465", "hoverColor":"#D32F30"}, 
          {"name": "Mobile", "value": 0, "color":"#4DC29F", "hoverColor":"#37A182"}, 
          {"name": "Tablet", "value": 0, "color":"#EEAA58", "hoverColor":"#E88C1D"}
        ]
      },
      {
        "Type": "Flash", 
        "Size":  100, 
        "Image": "",
        "Values": [
          {"name": "Desktop", "value": 82, "color":"#DE6465", "hoverColor":"#D32F30"}, 
          {"name": "Mobile", "value": 5, "color":"#4DC29F", "hoverColor":"#37A182"}, 
          {"name": "Tablet", "value": 11, "color":"#EEAA58", "hoverColor":"#E88C1D"}
        ]
      },
      {
        "Type": "Video", 
        "Size":  0, 
        "Image": "roseVideo.png",
        "Values": [
          {"name": "Desktop", "value": 0, "color":"#DE6465", "hoverColor":"#D32F30"}, 
          {"name": "Mobile", "value": 0, "color":"#4DC29F", "hoverColor":"#37A182"}, 
          {"name": "Tablet", "value": 0, "color":"#EEAA58", "hoverColor":"#E88C1D"}
        ]
      },
      {
        "Type": "Html", 
        "Size":  0, 
        "Image": "roseHtml.png",
        "Values": [
          {"name": "Desktop", "value": 0, "color":"#DE6465", "hoverColor":"#D32F30"}, 
          {"name": "Mobile", "value": 0, "color":"#4DC29F", "hoverColor":"#37A182"}, 
          {"name": "Tablet", "value": 0, "color":"#EEAA58", "hoverColor":"#E88C1D"}
        ]
      }
    ];
  }

  generateRose2() {
    //http://localhost:8080/advertiser2?country=DE&sources=1186
    return [    
      {
        "Type": "Image", 
        "Size":  8, 
        "Image": "roseImage.png",
        "Values": [
          {"name": "Desktop", "value": 6, "color":"#DE6465", "hoverColor":"#D32F30"}, 
          {"name": "Mobile", "value": 2, "color":"#4DC29F", "hoverColor":"#37A182"}, 
          {"name": "Tablet", "value": 0, "color":"#EEAA58", "hoverColor":"#E88C1D"}
        ]
      },
      {
        "Type": "Flash", 
        "Size":  0, 
        "Image": "",
        "Values": [
          {"name": "Desktop", "value": 0, "color":"#DE6465", "hoverColor":"#D32F30"}, 
          {"name": "Mobile", "value": 0, "color":"#4DC29F", "hoverColor":"#37A182"}, 
          {"name": "Tablet", "value": 0, "color":"#EEAA58", "hoverColor":"#E88C1D"}
        ]
      },
      {
        "Type": "Video", 
        "Size":  0, 
        "Image": "roseVideo.png",
        "Values": [
          {"name": "Desktop", "value": 0, "color":"#DE6465", "hoverColor":"#D32F30"}, 
          {"name": "Mobile", "value": 0, "color":"#4DC29F", "hoverColor":"#37A182"}, 
          {"name": "Tablet", "value": 0, "color":"#EEAA58", "hoverColor":"#E88C1D"}
        ]
      },
      {
        "Type": "Html", 
        "Size":  91, 
        "Image": "roseHtml.png",
        "Values": [
          {"name": "Desktop", "value": 76, "color":"#DE6465", "hoverColor":"#D32F30"}, 
          {"name": "Mobile", "value": 14, "color":"#4DC29F", "hoverColor":"#37A182"}, 
          {"name": "Tablet", "value": 0, "color":"#EEAA58", "hoverColor":"#E88C1D"}
        ]
      }
    ];
  }

 generateRose3() {
    //http://localhost:8080/device=3&endDate=1493585999&sources=129&startDate=1490994000
    return [    
      {
        "Type": "Image", 
        "Size":  75, 
        "Image": "roseImage.png",
        "Values": [
          {"name": "Desktop", "value": 0, "color":"#DE6465", "hoverColor":"#D32F30"}, 
          {"name": "Mobile", "value": 0, "color":"#4DC29F", "hoverColor":"#37A182"}, 
          {"name": "Tablet", "value": 75, "color":"#EEAA58", "hoverColor":"#E88C1D"}
        ]
      },
      {
        "Type": "Flash", 
        "Size":  0, 
        "Image": "",
        "Values": [
          {"name": "Desktop", "value": 0, "color":"#DE6465", "hoverColor":"#D32F30"}, 
          {"name": "Mobile", "value": 0, "color":"#4DC29F", "hoverColor":"#37A182"}, 
          {"name": "Tablet", "value": 0, "color":"#EEAA58", "hoverColor":"#E88C1D"}
        ]
      },
      {
        "Type": "Video", 
        "Size":  0, 
        "Image": "roseVideo.png",
        "Values": [
          {"name": "Desktop", "value": 0, "color":"#DE6465", "hoverColor":"#D32F30"}, 
          {"name": "Mobile", "value": 0, "color":"#4DC29F", "hoverColor":"#37A182"}, 
          {"name": "Tablet", "value": 0, "color":"#EEAA58", "hoverColor":"#E88C1D"}
        ]
      },
      {
        "Type": "Html", 
        "Size":  24, 
        "Image": "roseHtml.png",
        "Values": [
          {"name": "Desktop", "value": 0, "color":"#DE6465", "hoverColor":"#D32F30"}, 
          {"name": "Mobile", "value": 0, "color":"#4DC29F", "hoverColor":"#37A182"}, 
          {"name": "Tablet", "value": 24, "color":"#EEAA58", "hoverColor":"#E88C1D"}
        ]
      }
    ];
  }

  generateRose4() {
    //http://localhost:8080/advertiser2/types?endDate=1514757599&startDate=1483221600   (this year)
    return [    
      {
        "Type": "Image", 
        "Size":  64, 
        "Image": "roseImage.png",
        "Values": [
          {"name": "Desktop", "value": 54, "color":"#DE6465", "hoverColor":"#D32F30"}, 
          {"name": "Mobile", "value": 6, "color":"#4DC29F", "hoverColor":"#37A182"}, 
          {"name": "Tablet", "value": 4, "color":"#EEAA58", "hoverColor":"#E88C1D"}
        ]
      },
      {
        "Type": "Flash", 
        "Size":  0, 
        "Image": "",
        "Values": [
          {"name": "Desktop", "value": 0, "color":"#DE6465", "hoverColor":"#D32F30"}, 
          {"name": "Mobile", "value": 0, "color":"#4DC29F", "hoverColor":"#37A182"}, 
          {"name": "Tablet", "value": 0, "color":"#EEAA58", "hoverColor":"#E88C1D"}
        ]
      },
      {
        "Type": "Video", 
        "Size":  0, 
        "Image": "roseVideo.png",
        "Values": [
          {"name": "Desktop", "value": 0, "color":"#DE6465", "hoverColor":"#D32F30"}, 
          {"name": "Mobile", "value": 0, "color":"#4DC29F", "hoverColor":"#37A182"}, 
          {"name": "Tablet", "value": 0, "color":"#EEAA58", "hoverColor":"#E88C1D"}
        ]
      },
      {
        "Type": "Html", 
        "Size":  34, 
        "Image": "roseHtml.png",
        "Values": [
          {"name": "Desktop", "value": 29, "color":"#DE6465", "hoverColor":"#D32F30"}, 
          {"name": "Mobile", "value": 3, "color":"#4DC29F", "hoverColor":"#37A182"}, 
          {"name": "Tablet", "value": 1, "color":"#EEAA58", "hoverColor":"#E88C1D"}
        ]
      }
    ];
  }

   generateRose5() {
    //http://localhost:8080/advertiser2/types?endDate=1514757599&startDate=1483221600   (last year)
    return [    
      {
        "Type": "Image", 
        "Size":  64, 
        "Image": "roseImage.png",
        "Values": [
          {"name": "Desktop", "value": 54, "color":"#DE6465", "hoverColor":"#D32F30"}, 
          {"name": "Mobile", "value": 5, "color":"#4DC29F", "hoverColor":"#37A182"}, 
          {"name": "Tablet", "value": 4, "color":"#EEAA58", "hoverColor":"#E88C1D"}
        ]
      },
      {
        "Type": "Flash", 
        "Size":  0, 
        "Image": "",
        "Values": [
          {"name": "Desktop", "value": 0, "color":"#DE6465", "hoverColor":"#D32F30"}, 
          {"name": "Mobile", "value": 0, "color":"#4DC29F", "hoverColor":"#37A182"}, 
          {"name": "Tablet", "value": 0, "color":"#EEAA58", "hoverColor":"#E88C1D"}
        ]
      },
      {
        "Type": "Video", 
        "Size":  0, 
        "Image": "roseVideo.png",
        "Values": [
          {"name": "Desktop", "value": 0, "color":"#DE6465", "hoverColor":"#D32F30"}, 
          {"name": "Mobile", "value": 0, "color":"#4DC29F", "hoverColor":"#37A182"}, 
          {"name": "Tablet", "value": 0, "color":"#EEAA58", "hoverColor":"#E88C1D"}
        ]
      },
      {
        "Type": "Html", 
        "Size":  34, 
        "Image": "roseHtml.png",
        "Values": [
          {"name": "Desktop", "value": 29, "color":"#DE6465", "hoverColor":"#D32F30"}, 
          {"name": "Mobile", "value": 3, "color":"#4DC29F", "hoverColor":"#37A182"}, 
          {"name": "Tablet", "value": 1, "color":"#EEAA58", "hoverColor":"#E88C1D"}
        ]
      }
    ];
  }

   generateRose6() {
    //http://localhost:8080/advertiser2device=2&endDate=1492721999&sources=129&startDate=1491426000
    return [    
      {
        "Type": "Image", 
        "Size":  15, 
        "Image": "roseImage.png",
        "Values": [
          {"name": "Desktop", "value": 0, "color":"#DE6465", "hoverColor":"#D32F30"}, 
          {"name": "Mobile", "value": 15, "color":"#4DC29F", "hoverColor":"#37A182"}, 
          {"name": "Tablet", "value": 0, "color":"#EEAA58", "hoverColor":"#E88C1D"}
        ]
      },
      {
        "Type": "Flash", 
        "Size":  0, 
        "Image": "",
        "Values": [
          {"name": "Desktop", "value": 0, "color":"#DE6465", "hoverColor":"#D32F30"}, 
          {"name": "Mobile", "value": 0, "color":"#4DC29F", "hoverColor":"#37A182"}, 
          {"name": "Tablet", "value": 0, "color":"#EEAA58", "hoverColor":"#E88C1D"}
        ]
      },
      {
        "Type": "Video", 
        "Size":  0, 
        "Image": "roseVideo.png",
        "Values": [
          {"name": "Desktop", "value": 0, "color":"#DE6465", "hoverColor":"#D32F30"}, 
          {"name": "Mobile", "value": 0, "color":"#4DC29F", "hoverColor":"#37A182"}, 
          {"name": "Tablet", "value": 0, "color":"#EEAA58", "hoverColor":"#E88C1D"}
        ]
      },
      {
        "Type": "Html", 
        "Size":  84, 
        "Image": "roseHtml.png",
        "Values": [
          {"name": "Desktop", "value": 0, "color":"#DE6465", "hoverColor":"#D32F30"}, 
          {"name": "Mobile", "value": 84, "color":"#4DC29F", "hoverColor":"#37A182"}, 
          {"name": "Tablet", "value": 0, "color":"#EEAA58", "hoverColor":"#E88C1D"}
        ]
      }
    ];
  }

  // generateDots() {
  //   return [
  //     {name: "GDN", percentage: Math.random() * 50, color: 'red'},
  //     {name: "Network", percentage: Math.random() * 50, color: 'green'},
  //     {name: "Direct", percentage: Math.random() * 50, color: 'blue'},
  //     {name: "test", percentage: Math.random() * 50, color: 'yellow'},
  //     {name: "test2", percentage: Math.random() * 50, color: 'orange'},
  //   ];
  // };

  // generate() {
  //   return [
  //     {name: "News and Media", icon: "1.png", value: Math.random() * 40, backgroundColor: 'red', hoverBackgroundColor: 'red'},
  //     {name: "Arts and Entartainment", icon: "2.png", value: Math.random() * 40, backgroundColor: 'blue', hoverBackgroundColor: 'blue'},
  //     {name: "Sports", icon: "3.png", value: Math.random() * 40, backgroundColor: 'orange', hoverBackgroundColor: 'orange'},
  //     {name: "Autos and Vehicles", icon: "4.png", value: Math.random() * 40, backgroundColor: 'grey', hoverBackgroundColor: 'grey'},
  //     {name: "Internet and Telecom", icon: "5.png", value: Math.random() * 40, backgroundColor: 'green', hoverBackgroundColor: 'green'},
  //   ];
  // }

  // generateSunburst() {

  //   let data = [
  //             {
  //               "name": "Player 2",
  //               "children": [
  //                         {
  //                           "name": "Player 6",
  //                           "children": [
  //                             {
  //                               "name": "Player 6",
  //                               "size": Math.random() * 231
  //                             },
  //                             {
  //                               "name": "Player 4",
  //                               "size": Math.random() * 89
  //                             }

  //                           ]
  //                         }
  //                     ]
  //             },
  //             {
  //               "name": "Player 5",
  //               "children": [
  //                     {
  //                       "name": "Player 2",
  //                       "size": Math.random() * 335
  //                     },
  //                     {
  //                       "name": "Player 4",
  //                       "size": Math.random() * 40
  //                     }
  //                 ]
  //             },
  //             {
  //               "name": "Player 3",
  //               "children": [
  //                     {
  //                       "name": "Player 4",
  //                       "size": Math.random() * 219
  //                     },
  //                     {
  //                       "name": "Player 5",
  //                       "size": Math.random() * 40
  //                     }
  //                 ]
  //             },
  //             {
  //               "name": "Player 4",
  //               "children": [
  //                     {
  //                       "name": "Player 3",
  //                       "size": Math.random() * 280
  //                     }
  //                 ]
  //             }
  //   ];                  

  //   if (Math.random() > 0.5) {
  //     data.pop();
  //   }

  //   return {
  //     colors: {
  //         "Player 1": "#EF5342",
  //         "Player 2": "#F8B15B",
  //         "Player 3": "#EA696B",
  //         "Player 4": "#EFCF71",
  //         "Player 5": "#41BE9A",
  //         "Player 6": "#479193"
  //     },
  //     data: data
  //   }
  // }

  // generatePlayer1 () {
  //   return {
  //     "name": "Player 1",
  //     "color": "#F35246",
  //     "input": {
  //               "children": [
  //                 {
  //                   "children": [
  //                     {"name": "Player 8", "color": "#FBB065", "percentage":"34", "change": "0.2"},
  //                     {"name": "Player 9", "color": "#ED676C", "percentage":"18", "change": "0.5"},
  //                     {"name": "Player 10", "color": "#F0CF7A", "percentage":"9", "change": "0.9"},
  //                     {"name": "Player 11", "color": "#31BE9C", "percentage":"2", "change": "-0.22"},
  //                     {"name": "Player 12", "color": "#429092", "percentage":"2", "change": "-0.2"}
  //                   ]
  //                 }
  //               ]
  //             },
  //     "output": {
  //               "children": [
  //                 {
  //                   "children": [
  //                     {"name": "Player 2", "color": "#94377D", "percentage":"34", "change": "0.2"},
  //                     {"name": "Player 3", "color": "#9C51A7", "percentage":"18", "change": "0.5"},
  //                     {"name": "Player 4", "color": "#DA4D79", "percentage":"9", "change": "-0.2"}
  //                   ]
  //                 }
  //               ]
  //             }
  //   }


  // }
 



  handleTransition = () => {
    this.setState({
      // data: this.generate(),
      // dotsData: this.generateDots(),
      // sunburstData: this.generateSunburst(),
      // roseData: this.generateRose(),
      // linechartData: this.generateLinechart(),
      // player1Data: this.generatePlayer1(),
      audienzzDonut: this.generateAudienzzDonut(),
      campaignChart: this.generateCampaignChart(),
      audienzzRadar: this.generateAudienzzRadar(),
      audienzzIncome: this.generateAudienzzIncome(),
      audienzzDivisions: this.generateAudienzzDivisions(),
      audienzzDots: this.generateAudienzzDots(),
      audienzzRanks: this.generateAudienzzRanks()
    });
  }

  render() {


    return (

      <div>
        <button onClick={this.handleTransition}>test transition</button>

        <div className="Rose">
          <Rose dataset={this.state.roseData1} />
        </div> 

        <div className="Rose">
          <Rose dataset={this.state.roseData2} />
        </div>  

        <div className="Rose">
          <Rose dataset={this.state.roseData3} />
        </div>  

        <div className="Rose">
          <Rose dataset={this.state.roseData4} />
        </div>

        <div className="Rose">
          <Rose dataset={this.state.roseData5} />
        </div>

        <div className="Rose">
          <Rose dataset={this.state.roseData6} />
        </div>  

        <div className="AudienzzDonut">
          <AudienzzDonut dataset={this.state.audienzzDonut} />
        </div> 

        <div className="AudienzzIncome">
          <AudienzzIncome dataset={this.state.audienzzIncome} />
        </div> 

        <div>
          <CampaignChart
            title="Impressions"
            data={this.state.campaignChart}
          />
        </div>

        <div className="AudienzzRanks">
          <AudienzzRanks dataset={this.state.audienzzRanks} />
        </div> 

        <div className="AudienzzDots">
          <AudienzzDots dataset={this.state.audienzzDots} />
        </div> 

        <div className="AudienzzDivisions">
          <AudienzzDivisions dataset={this.state.audienzzDivisions} />
        </div>   

  

        <div className="AudienzzRadar">
          <AudienzzRadar dataset={this.state.audienzzRadar} />
        </div>   
      </div>      
    );



    // return (
    //   <div>
    //     <button onClick={this.handleTransition}>test transition</button>

    //     <div>
    //       <CampaignChart
    //         title="Impressions"
    //         data={this.state.campaignChart}
    //       />
    //     </div>

    //     <div className="Mosaic">
    //       <Mosaic dataset={this.state.roseData} />
    //     </div>

    //     <div className="Rose">
    //       <Rose dataset={this.state.roseData} />
    //     </div>         
    //     <div className="Player1">
    //       <Player1 dataset={this.state.player1Data} />
    //     </div>         
    //     <div className="Linechart">
    //       <Linechart dataset={this.state.linechartData} />
    //     </div> 
    //     <div className="App">
    //       <SampleChart dataset={this.state.data} />
    //     </div>
        
    //     <div className="Dots">
    //       <Dots dataset={this.state.dotsData} />
    //     </div>  
    //     <div className="Sunburst">
    //       <Sunburst dataset={this.state.sunburstData} />
    //     </div>   
    //   </div>      
    // );
  }
}

export default App;
