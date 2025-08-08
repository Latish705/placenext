// 'use client';

// import { useState, useEffect } from 'react';
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
//   ArcElement,
// } from 'chart.js';
// import { Bar, Pie } from 'react-chartjs-2';
// import { BackendUrl } from '@/utils/constants';
// import axios from 'axios';

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
//   ArcElement
// );


// interface StatisticsData {
//   totalOffers: number;
//   under6LPA: number;
//   secondOfferAbove6LPA: number;
//   offersBelow6LPA: number;
//   offersAbove6LPA: number;
//   offersBelow6LPA_Accepted?: number;
//   offersBelow6LPA_NotAccepted?: number;
//   offersAbove6LPA_Accepted?: number;
//   offersAbove6LPA_NotAccepted?: number;
// }

// export default function StatisticsDashboard() {
//   const [selectedMetric, setSelectedMetric] = useState('totalOffers');
//   const [statisticsData, setStatisticsData] = useState<StatisticsData | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         console.log("Token:", token);
//         if (!token) {
//           console.error("No authentication token found");
//           return;
//         }

//         const [
//           totalOffersRes,
//           under6LPARes,
//           secondOfferAbove6LPARes,
//           belowRes,
//           aboveRes,
//         ] = await Promise.all([
//           axios(`${BackendUrl}/api/college/total_offers`, {
//             headers: { Authorization: `Bearer ${token}` },
//           }),
//           axios(`${BackendUrl}/api/college/students_accepted_under_6lpa`, {
//             headers: { Authorization: `Bearer ${token}` },
//           }),
//           axios(`${BackendUrl}/api/college/students_accepted_second_offer_above_6lpa`, {
//             headers: { Authorization: `Bearer ${token}` },
//           }),
//           axios(`${BackendUrl}/api/college/get_all_offers_below_6lpa`, {
//             headers: { Authorization: `Bearer ${token}` },
//           }),
//           axios(`${BackendUrl}/api/college/get_all_offers_above_6lpa`, {
//             headers: { Authorization: `Bearer ${token}` },
//           }),
//         ]);

//         console.log("📊 Total Offers Data:", totalOffersRes.data);
//         console.log("📉 Under 6 LPA Data:", under6LPARes.data);
//         console.log("📈 Second Offer Above 6 LPA Data:", secondOfferAbove6LPARes.data);
//         console.log("🔻 Offers Below 6 LPA:", belowRes.data);
//         console.log("🔺 Offers Above 6 LPA:", aboveRes.data);


//         // Calculate accepted/not accepted for below/above 6LPA
//         const offersBelow6LPA_Accepted = Array.isArray(belowRes.data.offers)
//           ? belowRes.data.offers.filter((o: any) => o.status === 'accepted').length
//           : 0;
//         const offersBelow6LPA_NotAccepted = Array.isArray(belowRes.data.offers)
//           ? belowRes.data.offers.filter((o: any) => o.status !== 'accepted').length
//           : 0;
//         const offersAbove6LPA_Accepted = Array.isArray(aboveRes.data.offers)
//           ? aboveRes.data.offers.filter((o: any) => o.status === 'accepted').length
//           : 0;
//         const offersAbove6LPA_NotAccepted = Array.isArray(aboveRes.data.offers)
//           ? aboveRes.data.offers.filter((o: any) => o.status !== 'accepted').length
//           : 0;

//         setStatisticsData({
//           totalOffers: totalOffersRes.data.totalOffers,
//           under6LPA: under6LPARes.data.count,
//           secondOfferAbove6LPA: secondOfferAbove6LPARes.data.count,
//           offersBelow6LPA: belowRes.data.count,
//           offersAbove6LPA: aboveRes.data.count,
//           offersBelow6LPA_Accepted,
//           offersBelow6LPA_NotAccepted,
//           offersAbove6LPA_Accepted,
//           offersAbove6LPA_NotAccepted,
//         });

//         setLoading(false);
//       } catch (error) {
//         console.error("❌ Error fetching statistics:", error);
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   const barChartData = {
//     labels: ['Total Offers', 'Under 6 LPA', 'Second Offer > 6 LPA', 'Below 6 LPA', 'Above 6 LPA'],
//     datasets: [
//       {
//         label: 'Number of Students',
//         data: statisticsData ? [
//           statisticsData.totalOffers,
//           statisticsData.under6LPA,
//           statisticsData.secondOfferAbove6LPA,
//           statisticsData.offersBelow6LPA,
//           statisticsData.offersAbove6LPA,
//         ] : [],
//         backgroundColor: [
//           'rgba(255, 99, 132, 0.5)',
//           'rgba(54, 162, 235, 0.5)',
//           'rgba(255, 206, 86, 0.5)',
//           'rgba(75, 192, 192, 0.5)',
//           'rgba(153, 102, 255, 0.5)',
//         ],
//         borderColor: [
//           'rgba(255, 99, 132, 1)',
//           'rgba(54, 162, 235, 1)',
//           'rgba(255, 206, 86, 1)',
//           'rgba(75, 192, 192, 1)',
//           'rgba(153, 102, 255, 1)',
//         ],
//         borderWidth: 1,
//       },
//     ],
//   };

//   const pieChartData = {
//     labels: ['Below 6 LPA', 'Above 6 LPA'],
//     datasets: [
//       {
//         data: statisticsData ? [
//           statisticsData.offersBelow6LPA,
//           statisticsData.offersAbove6LPA,
//         ] : [],
//         backgroundColor: [
//           'rgba(255, 99, 132, 0.5)',
//           'rgba(54, 162, 235, 0.5)',
//         ],
//         borderColor: [
//           'rgba(255, 99, 132, 1)',
//           'rgba(54, 162, 235, 1)',
//         ],
//         borderWidth: 1,
//       },
//     ],
//   };


//   const metrics = [
//     { id: 'totalOffers', label: 'Total Offers' },
//     { id: 'salaryDistribution', label: 'Salary Distribution' },
//     { id: 'under6LPA', label: 'Students Under 6 LPA' },
//     { id: 'secondOfferAbove6LPA', label: 'Second Offers Above 6 LPA' },
//     { id: 'below6LPA', label: 'Offers Below 6 LPA' },
//     { id: 'above6LPA', label: 'Offers Above 6 LPA' },
//   ];

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h1 className="text-3xl font-bold mb-8 text-center">Placement Statistics Dashboard</h1>

//       {/* Filters */}
//       <div className="mb-8">
//         <div className="flex flex-wrap gap-4 justify-center">
//           {metrics.map((metric) => (
//             <button
//               key={metric.id}
//               onClick={() => setSelectedMetric(metric.id)}
//               className={`px-4 py-2 rounded-lg transition-colors ${
//                 selectedMetric === metric.id
//                   ? 'bg-blue-500 text-white'
//                   : 'bg-gray-200 hover:bg-gray-300'
//               }`}
//             >
//               {metric.label}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Charts by tab */}
//       {selectedMetric === 'salaryDistribution' ? (
//         <div className="flex flex-col items-center">
//           <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xl mx-auto mb-8">
//             <h2 className="text-xl font-semibold mb-4 text-center">Salary Distribution</h2>
//             <div className="h-[400px]">
//               <Pie
//                 data={pieChartData}
//                 options={{
//                   responsive: true,
//                   maintainAspectRatio: false,
//                   plugins: {
//                     legend: {
//                       position: 'top' as const,
//                     },
//                     title: {
//                       display: true,
//                       text: 'Offers by Salary Range',
//                     },
//                   },
//                 }}
//               />
//             </div>
//           </div>
//         </div>
//       ) : selectedMetric === 'below6LPA' ? (
//         <div className="flex flex-col items-center">
//           <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xl mx-auto mb-8">
//             <h2 className="text-xl font-semibold mb-4 text-center">Offers Below 6 LPA: Accepted vs Not Accepted</h2>
//             <div className="h-[400px]">
//               <Pie
//                 data={{
//                   labels: ['Accepted', 'Not Accepted'],
//                   datasets: [
//                     {
//                       data: [
//                         statisticsData?.offersBelow6LPA_Accepted || 0,
//                         statisticsData?.offersBelow6LPA_NotAccepted || 0,
//                       ],
//                       backgroundColor: [
//                         'rgba(54, 162, 235, 0.5)',
//                         'rgba(255, 99, 132, 0.5)',
//                       ],
//                       borderColor: [
//                         'rgba(54, 162, 235, 1)',
//                         'rgba(255, 99, 132, 1)',
//                       ],
//                       borderWidth: 1,
//                     },
//                   ],
//                 }}
//                 options={{
//                   responsive: true,
//                   maintainAspectRatio: false,
//                   plugins: {
//                     legend: { position: 'top' as const },
//                     title: { display: true, text: 'Offers Below 6 LPA: Accepted vs Not Accepted' },
//                   },
//                 }}
//               />
//             </div>
//           </div>
//         </div>
//       ) : selectedMetric === 'above6LPA' ? (
//         <div className="flex flex-col items-center">
//           <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xl mx-auto mb-8">
//             <h2 className="text-xl font-semibold mb-4 text-center">Offers Above 6 LPA: Accepted vs Not Accepted</h2>
//             <div className="h-[400px]">
//               <Pie
//                 data={{
//                   labels: ['Accepted', 'Not Accepted'],
//                   datasets: [
//                     {
//                       data: [
//                         statisticsData?.offersAbove6LPA_Accepted || 0,
//                         statisticsData?.offersAbove6LPA_NotAccepted || 0,
//                       ],
//                       backgroundColor: [
//                         'rgba(75, 192, 192, 0.5)',
//                         'rgba(255, 206, 86, 0.5)',
//                       ],
//                       borderColor: [
//                         'rgba(75, 192, 192, 1)',
//                         'rgba(255, 206, 86, 1)',
//                       ],
//                       borderWidth: 1,
//                     },
//                   ],
//                 }}
//                 options={{
//                   responsive: true,
//                   maintainAspectRatio: false,
//                   plugins: {
//                     legend: { position: 'top' as const },
//                     title: { display: true, text: 'Offers Above 6 LPA: Accepted vs Not Accepted' },
//                   },
//                 }}
//               />
//             </div>
//           </div>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//           {/* Bar Chart */}
//           <div className="bg-white p-6 rounded-lg shadow-lg">
//             <h2 className="text-xl font-semibold mb-4">Overall Statistics</h2>
//             <div className="h-[400px]">
//               <Bar
//                 data={barChartData}
//                 options={{
//                   responsive: true,
//                   maintainAspectRatio: false,
//                   plugins: {
//                     legend: {
//                       position: 'top' as const,
//                     },
//                     title: {
//                       display: true,
//                       text: 'Placement Statistics Overview',
//                     },
//                   },
//                 }}
//               />
//             </div>
//           </div>

//           {/* Statistic Cards */}
//           <div className="lg:col-span-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
//             {selectedMetric === 'totalOffers' && (
//               <div className="bg-white p-6 rounded-lg shadow-lg">
//                 <h3 className="text-lg font-semibold mb-2">Total Offers</h3>
//                 <p className="text-3xl font-bold text-blue-500">
//                   {statisticsData?.totalOffers || 0}
//                 </p>
//               </div>
//             )}
//             {selectedMetric === 'under6LPA' && (
//               <div className="bg-white p-6 rounded-lg shadow-lg">
//                 <h3 className="text-lg font-semibold mb-2">Students Under 6 LPA</h3>
//                 <p className="text-3xl font-bold text-green-500">
//                   {statisticsData?.under6LPA || 0}
//                 </p>
//               </div>
//             )}
//             {selectedMetric === 'secondOfferAbove6LPA' && (
//               <div className="bg-white p-6 rounded-lg shadow-lg">
//                 <h3 className="text-lg font-semibold mb-2">Second Offers Above 6 LPA</h3>
//                 <p className="text-3xl font-bold text-purple-500">
//                   {statisticsData?.secondOfferAbove6LPA || 0}
//                 </p>
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }




'use client';

import { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import { BackendUrl } from '@/utils/constants';
import axios from 'axios';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface StatisticsData {
  totalOffers: number;
  under6LPA: number;
  secondOfferAbove6LPA: number;
  offersBelow6LPA: number;
  offersAbove6LPA: number;
  offersBelow6LPA_Accepted: number;
  offersBelow6LPA_NotAccepted: number;
  offersAbove6LPA_Accepted: number;
  offersAbove6LPA_NotAccepted: number;
}


export default function StatisticsDashboard() {
  const [selectedMetric, setSelectedMetric] = useState('totalOffers');
  const [statisticsData, setStatisticsData] = useState<StatisticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [studentsTable, setStudentsTable] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return console.error("No token found");

        const [
          totalOffersRes,
          under6LPARes,
          secondOfferAbove6LPARes,
          belowRes,
          aboveRes,
        ] = await Promise.all([
          axios(`${BackendUrl}/api/college/total_offers`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios(`${BackendUrl}/api/college/students_accepted_under_6lpa`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios(`${BackendUrl}/api/college/students_accepted_second_offer_above_6lpa`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios(`${BackendUrl}/api/college/get_all_offers_below_6lpa`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios(`${BackendUrl}/api/college/get_all_offers_above_6lpa`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const belowOffers = Array.isArray(belowRes.data.offers) ? belowRes.data.offers : [];
        const aboveOffers = Array.isArray(aboveRes.data.offers) ? aboveRes.data.offers : [];

        setStatisticsData({
          totalOffers: totalOffersRes.data.totalOffers,
          under6LPA: under6LPARes.data.count,
          secondOfferAbove6LPA: secondOfferAbove6LPARes.data.count,
          offersBelow6LPA: belowRes.data.count,
          offersAbove6LPA: aboveRes.data.count,
          offersBelow6LPA_Accepted: belowOffers.filter((o: any) => o.status === 'accepted').length,
          offersBelow6LPA_NotAccepted: belowOffers.filter((o: any) => o.status !== 'accepted').length,
          offersAbove6LPA_Accepted: aboveOffers.filter((o: any) => o.status === 'accepted').length,
          offersAbove6LPA_NotAccepted: aboveOffers.filter((o: any) => o.status !== 'accepted').length,
        });

        // Default: show all students for totalOffers
        setStudentsTable(belowOffers.concat(aboveOffers));

        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Update studentsTable when tab changes
  useEffect(() => {
    const fetchStudentsForTab = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        if (selectedMetric === 'below6LPA') {
          const res = await axios(`${BackendUrl}/api/college/get_all_offers_below_6lpa`, { headers: { Authorization: `Bearer ${token}` } });
          setStudentsTable(res.data.offers || []);
        } else if (selectedMetric === 'above6LPA') {
          const res = await axios(`${BackendUrl}/api/college/get_all_offers_above_6lpa`, { headers: { Authorization: `Bearer ${token}` } });
          setStudentsTable(res.data.offers || []);
        } else if (selectedMetric === 'under6LPA') {
          // Show only accepted under 6LPA
          const res = await axios(`${BackendUrl}/api/college/get_all_offers_below_6lpa`, { headers: { Authorization: `Bearer ${token}` } });
          setStudentsTable((res.data.offers || []).filter((o: any) => o.status === 'accepted'));
        } else if (selectedMetric === 'salaryDistribution') {
          // Show all offers
          const [belowRes, aboveRes] = await Promise.all([
            axios(`${BackendUrl}/api/college/get_all_offers_below_6lpa`, { headers: { Authorization: `Bearer ${token}` } }),
            axios(`${BackendUrl}/api/college/get_all_offers_above_6lpa`, { headers: { Authorization: `Bearer ${token}` } }),
          ]);
          setStudentsTable((belowRes.data.offers || []).concat(aboveRes.data.offers || []));
        } else if (selectedMetric === 'secondOfferAbove6LPA') {
          // Show only accepted second offers above 6LPA
          const res = await axios(`${BackendUrl}/api/college/get_all_offers_above_6lpa`, { headers: { Authorization: `Bearer ${token}` } });
          setStudentsTable((res.data.offers || []).filter((o: any) => o.status === 'accepted' && o.offerNumber === 2));
        } else {
          // Default: show all offers
          const [belowRes, aboveRes] = await Promise.all([
            axios(`${BackendUrl}/api/college/get_all_offers_below_6lpa`, { headers: { Authorization: `Bearer ${token}` } }),
            axios(`${BackendUrl}/api/college/get_all_offers_above_6lpa`, { headers: { Authorization: `Bearer ${token}` } }),
          ]);
          setStudentsTable((belowRes.data.offers || []).concat(aboveRes.data.offers || []));
        }
      } catch (err) {
        setStudentsTable([]);
      }
    };
    fetchStudentsForTab();
  }, [selectedMetric]);
  // Table rendering helper
  const renderTable = () => {
    if (!studentsTable || studentsTable.length === 0) return <div className="text-center text-gray-500">No students found for this statistic.</div>;
    return (
      <div className="overflow-x-auto mt-6">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b">Student Name</th>
              <th className="px-4 py-2 border-b">Email</th>
              <th className="px-4 py-2 border-b">Status</th>
              <th className="px-4 py-2 border-b">Package</th>
              <th className="px-4 py-2 border-b">Company</th>
              <th className="px-4 py-2 border-b">Offer #</th>
            </tr>
          </thead>
          <tbody>
            {studentsTable.map((offer: any, idx: number) => (
              <tr key={offer._id || idx} className="text-center">
                <td className="px-4 py-2 border-b">{offer.studentId?.stud_name || '-'}</td>
                <td className="px-4 py-2 border-b">{offer.studentId?.stud_email || '-'}</td>
                <td className="px-4 py-2 border-b">{offer.status || '-'}</td>
                <td className="px-4 py-2 border-b">{offer.package ? (offer.package / 100000).toFixed(2) + ' LPA' : '-'}</td>
                <td className="px-4 py-2 border-b">{offer.jobId?.company_name || '-'}</td>
                <td className="px-4 py-2 border-b">{offer.offerNumber || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const summaryCard = (title: string, value: number, colorClass: string) => (
    <div className={`bg-white shadow rounded p-4 flex-1 text-center mb-4 lg:mb-0`}>
      <h3 className={`text-md font-semibold ${colorClass}`}>{title}</h3>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );

  const metrics = [
    { id: 'totalOffers', label: 'Total Offers' },
    { id: 'salaryDistribution', label: 'Salary Distribution' },
    { id: 'under6LPA', label: 'Students Under 6 LPA' },
    { id: 'secondOfferAbove6LPA', label: 'Second Offers ≥ 6 LPA' },
    { id: 'below6LPA', label: 'Offers < 6 LPA' },
    { id: 'above6LPA', label: 'Offers ≥ 6 LPA' },
  ];

  const barChartData = {
    labels: ['Total Offers', 'Under 6 LPA', 'Second Offers ≥6 LPA', 'Offers <6 LPA', 'Offers ≥6 LPA'],
    datasets: [{
      label: 'Count',
      data: statisticsData
        ? [statisticsData.totalOffers, statisticsData.under6LPA, statisticsData.secondOfferAbove6LPA, statisticsData.offersBelow6LPA, statisticsData.offersAbove6LPA]
        : [],
      backgroundColor: ['#f87171', '#60a5fa', '#facc15', '#34d399', '#a78bfa'],
    }],
  };

  const pieBelow = {
    labels: ['Accepted', 'Not Accepted'],
    datasets: [{
      data: [statisticsData?.offersBelow6LPA_Accepted || 0, statisticsData?.offersBelow6LPA_NotAccepted || 0],
      backgroundColor: ['#60a5fa', '#f87171'],
    }],
  };

  const pieAbove = {
    labels: ['Accepted', 'Not Accepted'],
    datasets: [{
      data: [statisticsData?.offersAbove6LPA_Accepted || 0, statisticsData?.offersAbove6LPA_NotAccepted || 0],
      backgroundColor: ['#34d399', '#facc15'],
    }],
  };

  const pieSalary = {
    labels: ['< 6 LPA', '≥ 6 LPA'],
    datasets: [{
      data: [statisticsData?.offersBelow6LPA || 0, statisticsData?.offersAbove6LPA || 0],
      backgroundColor: ['#f87171', '#60a5fa'],
    }],
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin h-12 w-12 border-4 border-blue-500 rounded-full"></div>
    </div>
  );

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6">Placement Statistics Dashboard</h1>

      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {metrics.map(m => (
          <button
            key={m.id}
            onClick={() => setSelectedMetric(m.id)}
            className={`px-4 py-2 rounded ${selectedMetric === m.id ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {(selectedMetric === 'totalOffers' || selectedMetric === 'under6LPA' || selectedMetric === 'secondOfferAbove6LPA') && (
        <div className="lg:flex lg:gap-6 mb-8">
          <div className="bg-white shadow rounded p-6 lg:w-2/3 h-80">
            <Bar data={barChartData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
          <div className="flex-1 flex flex-col justify-between">
            {summaryCard('Total Offers', statisticsData?.totalOffers || 0, 'text-red-500')}
            {summaryCard('Under 6 LPA', statisticsData?.under6LPA || 0, 'text-blue-500')}
            {summaryCard('Second Offers ≥6 LPA', statisticsData?.secondOfferAbove6LPA || 0, 'text-yellow-500')}
          </div>
        </div>
      )}

      {selectedMetric === 'salaryDistribution' && (
        <div className="lg:flex lg:gap-6 mb-8">
          <div className="bg-white shadow rounded p-6 lg:w-2/3 h-80">
            <Pie data={pieSalary} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
          <div className="flex-1 flex flex-col justify-between">
            {summaryCard('Offers < 6 LPA', statisticsData?.offersBelow6LPA || 0, 'text-red-500')}
            {summaryCard('Offers ≥ 6 LPA', statisticsData?.offersAbove6LPA || 0, 'text-blue-500')}
          </div>
        </div>
      )}

      {selectedMetric === 'below6LPA' && (
        <div className="lg:flex lg:gap-6 mb-8">
          <div className="bg-white shadow rounded p-6 lg:w-2/3 h-80">
            <Pie data={pieBelow} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
          <div className="flex-1 flex flex-col justify-between">
            {summaryCard('Accepted', statisticsData?.offersBelow6LPA_Accepted || 0, 'text-green-500')}
            {summaryCard('Not Accepted', statisticsData?.offersBelow6LPA_NotAccepted || 0, 'text-red-500')}
          </div>
        </div>
      )}

      {selectedMetric === 'above6LPA' && (
        <div className="lg:flex lg:gap-6 mb-8">
          <div className="bg-white shadow rounded p-6 lg:w-2/3 h-80">
            <Pie data={pieAbove} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
          <div className="flex-1 flex flex-col justify-between">
            {summaryCard('Accepted', statisticsData?.offersAbove6LPA_Accepted || 0, 'text-green-500')}
            {summaryCard('Not Accepted', statisticsData?.offersAbove6LPA_NotAccepted || 0, 'text-red-500')}
          </div>
        </div>
      )}

      {/* Student Table for each tab */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4 text-center">Student Details</h2>
        {renderTable()}
      </div>
    </div>
  );
}
