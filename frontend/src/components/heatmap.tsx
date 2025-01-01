"use client";
import React, { useEffect, useState } from 'react';
import { format, differenceInDays } from 'date-fns';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import host from '../consts';

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
    const [loading, setLoading] = useState(true);
    const [currentStreak, setCurrentStreak] = useState(0);
    const [maxStreak, setMaxStreak] = useState(0);


    useEffect(() => {
        const fetchHeatmapData = async () => {
            try {
                const response = await fetch(
                    `${host}/api/heatmap/getHeatmapData?codechefid=${codechefId}&codeforcesid=${codeforcesId}&leetcodeid=${leetcodeId}`
                );
                const data = await response.json();
                const combinedData = processCombinedData(data);
                setHeatmapData(combinedData);
                calculateStreaks(combinedData);
            } catch (error) {
                console.error('Error fetching heatmap data:', error);
            } finally {
                setLoading(false);
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

    const calculateStreaks = (data: Submission[]) => {
        const sortedData = data
            .filter((entry) => entry.count > 0)
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        let maxStreak = 0;
        let currentStreak = 0;
        let lastDate: Date | null = null;

        sortedData.forEach((entry) => {
            const currentDate = new Date(entry.date);

            if (lastDate && differenceInDays(currentDate, lastDate) === 1) {
                currentStreak++;
            } else if (!lastDate || differenceInDays(currentDate, lastDate) > 1) {
                currentStreak = 1;
            }

            maxStreak = Math.max(maxStreak, currentStreak);
            lastDate = currentDate;
        });

        // Check for ongoing streak
        const today = new Date();
        const lastEntryDate = sortedData.length ? new Date(sortedData[sortedData.length - 1].date) : null;
        if (lastEntryDate && differenceInDays(today, lastEntryDate) === 0 || lastEntryDate && differenceInDays(today, lastEntryDate) === 1) {
            setCurrentStreak(currentStreak);
        } else {
            setCurrentStreak(0);
        }

        setMaxStreak(maxStreak);
    };

    const endDate = new Date(); // Today's date
    const startDate = new Date(); // Start with today's date
    startDate.setFullYear(startDate.getFullYear() - 1); // Go back exactly 1 year
    

    return (
        <div className="w-full  flex flex-col  p-2 border border-white rounded-xl shadow-lg bg-transparent">
            <h2 className="text-start font-bold text-xl  text-white">Combined Submissions</h2>
            <h2 className="text-start font-bold text-md mb-1 text-white">(from LeetCode , Codeforces , Codechef)</h2>
            
            {loading ? (
                <div className="animate-pulse">
                    <div className="w-full h-[200px] shimmer-effect"></div>
                </div>
            ) : (
                <div className="opacity-85">
                    <CalendarHeatmap
                        gutterSize={4}
                        startDate={startDate}
                        endDate={endDate}
                        values={heatmapData}
                        showWeekdayLabels={true}

                        weekdayLabels={['S', 'M', 'T', 'W', 'T', 'F', 'S']}
                        classForValue={(value) => {
                            if (!value || value.count === 0) return 'color-empty';
                            if (value.count >= 1 && value.count <= 2) return 'color-scale-1';
                            if (value.count >= 3 && value.count <= 5) return 'color-scale-2';
                            if (value.count >= 6 && value.count <= 9) return 'color-scale-3';
                            return 'color-scale-4';
                        }}
                        titleForValue={(value) =>
                            value && value.count
                                ? `${format(new Date(value.date), 'd MMMM yyyy')}: ${value.count} submissions`
                                : 'No submissions'
                        }
                        showMonthLabels={true}
                        transformDayElement={(element, value) => {
                            const style = {
                                fill: !value || value.count === 0 ? '#16191C' : undefined,
                                backdropFilter: !value || value.count === 0 ? 'blur(20px)' : undefined,
                                borderRadius: '10px',
                            };
                            return React.cloneElement(element as React.ReactElement, { style });
                        }}
                    />
                    <ReactTooltip />
                </div>
            )}
            <div className= " flex space-x-10 text-white mb-4">
                <p>🔥 Current Streak: {currentStreak} days</p>
                <p>🏆 Max Streak: {maxStreak} days</p>
            </div>
        </div>
    );
};

export default HeatMap;
