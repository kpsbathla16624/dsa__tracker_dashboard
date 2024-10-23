import React, { useState, useEffect } from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import { Tooltip as ReactTooltip } from 'react-tooltip'; 
import { addDays, format, startOfMonth, endOfMonth } from 'date-fns';

interface Submission {
    date: string;
    count: number;
}

interface HeatMapProps {
    codechefId: string;
    codeforcesId: string;
    leetcodeId: string;
}

const HeatMap: React.FC<HeatMapProps> = ({ codechefId, codeforcesId, leetcodeId }) => {
    const [heatmapData, setHeatmapData] = useState<Submission[]>([]);

    useEffect(() => {
        const fetchHeatmapData = async () => {
            try {
                const response = await fetch(
                    `/api/heatmap/getHeatmapData?codechefid=${codechefId}&codeforcesid=${codeforcesId}&leetcodeid=${leetcodeId}`
                );
                const data = await response.json();
                const combinedData = processCombinedData(data);
                setHeatmapData(combinedData);
            } catch (error) {
                console.error('Error fetching heatmap data:', error);
            }
        };

        fetchHeatmapData();
    }, [codechefId, codeforcesId, leetcodeId]);

    const processCombinedData = (data: any): Submission[] => {
        const combinedHeatmap: { [date: string]: number } = {};

        const leetcodeData = JSON.parse(data.leetcode.submissionCalendar);
        for (const timestamp in leetcodeData) {
            const date = format(new Date(Number(timestamp) * 1000), 'yyyy-MM-dd');
            combinedHeatmap[date] = (combinedHeatmap[date] || 0) + leetcodeData[timestamp];
        }

        data.codeforces.result.forEach((submission: any) => {
            const date = format(new Date(submission.creationTimeSeconds * 1000), 'yyyy-MM-dd');
            combinedHeatmap[date] = (combinedHeatmap[date] || 0) + 1;
        });

        data.codechef.heatMap.forEach((submission: any) => {
            const date = submission.date;
            combinedHeatmap[date] = (combinedHeatmap[date] || 0) + submission.value;
        });

        return Object.entries(combinedHeatmap).map(([date, count]) => ({ date, count }));
    };

    // Calculate start date as January 1st of the current year
    const startDate = new Date(new Date().getFullYear(), 0, 1);
    const endDate = new Date(); // Current date

    return (
        <div className='w-full h-full flex flex-col my-2 p-2 border rounded-lg shadow-lg backdrop-blur-lg bg-opacity-75 bg-gradient-to-br from-gray-800 via-black to-gray-800'>
            <h2 className='text-center text-white'>Combined Submissions</h2>
            {heatmapData.length > 0 ? (
                <div className=''>
                    <CalendarHeatmap 
                        startDate={startDate}
                        endDate={endDate}
                        values={heatmapData}
                        showWeekdayLabels={true}
                        weekdayLabels={['S', 'M', 'T', 'W', 'T', 'F', 'S']}
                        classForValue={(value: { date: string; count?: number } | undefined) => {
                            if (!value || value.count === 0) return 'color-empty';
                            if ((value.count ?? 0) >= 1 && (value.count ?? 0) <= 2) return 'color-scale-1'; 
                            if ((value.count ?? 0) >= 3 && (value.count ?? 0) <= 5) return 'color-scale-2'; 
                            if ((value.count ?? 0) >= 6 && (value.count ?? 0) <= 9) return 'color-scale-3'; 
                            return 'color-scale-4'; 
                        }}
                        titleForValue={(value) => 
                            value && value.count 
                            ? `${format(new Date(value.date), 'd MMMM')}: ${value.count} submissions`
                            : ''
                        } 
                        showMonthLabels={true}
                    />
                    <ReactTooltip /> 
                </div>
            ) : (
                <p className='text-center text-white'>Loading heatmap...</p>
            )}
        </div>
    );
};

export default HeatMap;
