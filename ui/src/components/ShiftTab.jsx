import React from 'react';
import { format } from 'date-fns';

const ShiftsTab = ({ shifts, openTab, bookshift, cancelShift }) => {
    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        return `${date.getHours()}:${String(date.getMinutes()).padStart(
            2,
            '0'
        )}`;
    };

    const groupShifts = (shifts) => {
        const groupedShifts = {};

        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        shifts.forEach((shift) => {
            const shiftDate = new Date(shift.startTime);
            const sectionTitle =
                shiftDate.toDateString() === today.toDateString()
                    ? 'Today'
                    : shiftDate.toDateString() === tomorrow.toDateString()
                    ? 'Tomorrow'
                    : `${format(shiftDate, 'MMMM d')}`;

            if (!groupedShifts[sectionTitle]) {
                groupedShifts[sectionTitle] = { shifts: [], count: 0 };
            }

            const overlaps = groupedShifts[sectionTitle].shifts.some(
                (existingShift) =>
                    shift.startTime < existingShift.endTime &&
                    shift.endTime > existingShift.startTime
            );

            groupedShifts[sectionTitle].shifts.push({ ...shift, overlaps });
            groupedShifts[sectionTitle].count += 1;
        });

        return groupedShifts;
    };

    const calculateTotalHours = (shifts) => {
        const totalMilliseconds = shifts.reduce((total, shift) => {
            const start = new Date(shift.startTime);
            const end = new Date(shift.endTime);
            return total + (end - start);
        }, 0);

        const totalHours = Math.floor(totalMilliseconds / (1000 * 60 * 60));
        const totalMinutes = Math.floor(
            (totalMilliseconds % (1000 * 60 * 60)) / (1000 * 60)
        );

        if (totalMinutes === 0) {
            return `${totalHours} h`;
        } else {
            return `${totalHours} h ${totalMinutes} min`;
        }
    };

    return (
        <div>
            {Object.entries(groupShifts(shifts)).map(
                ([sectionTitle, { shifts, count }]) => {
                    const totalHours = calculateTotalHours(shifts);
                    return (
                        <div key={sectionTitle}>
                            <h3 className='text-primary-100 bg-primary-400 h-12 pl-4 font-medium flex items-center'>
                                {sectionTitle}{' '}
                                {openTab === 'MyShifts' && (
                                    <span className='text-primary-200 text-sm ml-4'>
                                        {count} shifts {totalHours}
                                    </span>
                                )}
                            </h3>
                            {shifts.map((shift) => (
                                <div
                                    key={shift.id}
                                    className='border flex items-center p-4 justify-between pr-20'
                                >
                                    <div className='text-base font-medium'>
                                        <p className='text-primary-100'>
                                            {formatTime(shift.startTime)} -{' '}
                                            {formatTime(shift.endTime)}
                                        </p>
                                        {openTab === 'MyShifts' && (
                                            <p className='font-normal text-primary-200'>
                                                {shift.area}
                                            </p>
                                        )}
                                    </div>
                                    <div className='flex items-center space-x-6'>
                                        {openTab === 'AvailableShifts' &&
                                        shift.booked ? (
                                            <p className='text-primary-100 mr-2'>
                                                Booked
                                            </p>
                                        ) : (
                                            shift.overlaps && (
                                                <p className='text-secondary-200 mr-2'>
                                                    Overlapping
                                                </p>
                                            )
                                        )}
                                        <button
                                            disabled={
                                                shift.overlaps ||
                                                shift.startTime <=
                                                    new Date().getTime()
                                            }
                                            className={`${
                                                shift.booked
                                                    ? 'border rounded-full py-2 w-24 text-secondary-200 border-secondary-100 bg-secondary-50'
                                                    : 'border rounded-full py-2 w-24 text-secondary-500 border-secondary-400 bg-secondary-300'
                                            } ${
                                                shift.overlaps ||
                                                shift.startTime <=
                                                    new Date().getTime()
                                                    ? 'cursor-not-allowed opacity-50'
                                                    : ''
                                            } font-medium`}
                                            onClick={() =>
                                                shift.booked
                                                    ? cancelShift(shift.id)
                                                    : bookshift(shift.id)
                                            }
                                        >
                                            {shift.booked ? 'Cancel' : 'Book'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    );
                }
            )}
        </div>
    );
};

export default ShiftsTab;
