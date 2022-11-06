import { useState, useEffect } from 'react';
import {
  format,
  subMonths,
  addMonths,
  subYears,
  addYears,
  isEqual,
  getDaysInMonth,
  getDay,
} from 'date-fns';
import React from 'react';

type DatepickerType = 'date' | 'month' | 'year';

export default function Datepicker({
  selectedDate,
  dateChanged,
  placeholder = 'Select Date',
}: {
  selectedDate: Date | null;
  placeholder?: string;
  dateChanged: (date: Date) => void;
}) {
  const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const [dayCount, setDayCount] = useState<Array<number>>([]);
  const [blankDays, setBlankDays] = useState<Array<number>>([]);
  const [showDatepicker, setShowDatepicker] = useState(false);
  const [datepickerHeaderDate, setDatepickerHeaderDate] = useState(new Date());
  const [type, setType] = useState<DatepickerType>('date');

  const decrement = () => {
    switch (type) {
      case 'date':
        setDatepickerHeaderDate((prev) => subMonths(prev, 1));
        break;
      case 'month':
        setDatepickerHeaderDate((prev) => subYears(prev, 1));
        break;
      case 'year':
        setDatepickerHeaderDate((prev) => subMonths(prev, 1));
        break;
    }
  };

  const increment = () => {
    switch (type) {
      case 'date':
        setDatepickerHeaderDate((prev) => addMonths(prev, 1));
        break;
      case 'month':
        setDatepickerHeaderDate((prev) => addYears(prev, 1));
        break;
      case 'year':
        setDatepickerHeaderDate((prev) => subMonths(prev, 1));
        break;
    }
  };

  const isToday = (date: number) =>
    selectedDate &&
    isEqual(
      new Date(selectedDate.getFullYear(), selectedDate.getMonth(), date),
      selectedDate
    );

  const setDateValue = (date: number) => () => {
    dateChanged(
      new Date(
        datepickerHeaderDate.getFullYear(),
        datepickerHeaderDate.getMonth(),
        date
      )
    );
    setShowDatepicker(false);
  };

  const getDayCount = (date: Date) => {
    let daysInMonth = getDaysInMonth(date);

    // find where to start calendar day of week
    let dayOfWeek = getDay(new Date(date.getFullYear(), date.getMonth(), 1));
    let blankDaysArray = [];
    for (let i = 1; i <= dayOfWeek; i++) {
      blankDaysArray.push(i);
    }

    let daysArray = [];
    for (let i = 1; i <= daysInMonth; i++) {
      daysArray.push(i);
    }

    setBlankDays(blankDaysArray);
    setDayCount(daysArray);
  };

  const isSelectedMonth = (month: number) =>
    selectedDate &&
    isEqual(
      new Date(selectedDate.getFullYear(), month, selectedDate.getDate()),
      selectedDate
    );

  const setMonthValue = (month: number) => () => {
    setDatepickerHeaderDate(
      new Date(
        datepickerHeaderDate.getFullYear(),
        month,
        datepickerHeaderDate.getDate()
      )
    );
    setType('date');
  };

  const toggleDatepicker = () => setShowDatepicker((prev) => !prev);

  const showMonthPicker = () => setType('month');

  const showYearPicker = () => setType('date');

  useEffect(() => {
    getDayCount(datepickerHeaderDate);
  }, [datepickerHeaderDate]);

  return (
    <div className="mb-5 w-64">
      <label htmlFor="datepicker" className="font-bold mb-1 text-white block">
        {placeholder}
      </label>
      <div className="relative">
        <input type="hidden" name="date" />
        <input
          type="text"
          readOnly
          className="cursor-pointer w-full pl-4 pr-10 py-3 leading-none rounded-lg shadow-sm focus:outline-none focus:shadow-outline bg-[#2C293D] text-white font-medium"
          placeholder="Select date"
          value={selectedDate ? format(selectedDate, 'dd/MM/yyyy') : ''}
          onClick={toggleDatepicker}
        />
        <div
          className="cursor-pointer absolute top-0 right-0 px-3 py-2"
          onClick={toggleDatepicker}
        >
          <svg
            className="h-6 w-6 text-gray-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        {showDatepicker && (
          <div
            className="bg-[#272535] mt-1 rounded-lg shadow p-4 fixed z-10 overflow-auto"
            style={{ width: '16rem' }}
          >
            <div className="flex justify-between items-center mb-2">
              <div>
                <button
                  type="button"
                  className="transition ease-in-out duration-100 inline-flex cursor-pointer hover:bg-gray-200 hover:text-gray-700 p-1 rounded-full"
                  onClick={decrement}
                >
                  <svg
                    className="h-6 w-6 text-gray-300 hover:text-gray-700 inline-flex"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
              </div>
              {type === 'date' && (
                <div
                  onClick={showMonthPicker}
                  className="flex-grow p-1 text-lg font-bold text-gray-200 cursor-pointer hover:bg-gray-200 hover:text-gray-700 rounded-lg"
                >
                  <p className="text-center">
                    {format(datepickerHeaderDate, 'MMMM')}
                  </p>
                </div>
              )}
              <div
                onClick={showYearPicker}
                className="flex-grow p-1 text-lg font-bold text-gray-200 cursor-pointer hover:bg-gray-200 hover:text-gray-700 rounded-lg"
              >
                <p className="text-center">
                  {format(datepickerHeaderDate, 'yyyy')}
                </p>
              </div>
              <div>
                <button
                  type="button"
                  className="transition ease-in-out duration-100 inline-flex cursor-pointer hover:bg-gray-200 hover:text-gray-700 p-1 rounded-full"
                  onClick={increment}
                >
                  <svg
                    className="h-6 w-6 text-gray-300 hover:text-gray-700 inline-flex"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>
            {type === 'date' && (
              <>
                <div className="flex flex-wrap mb-3 -mx-1">
                  {DAYS.map((day, i) => (
                    <div key={i} style={{ width: '14.26%' }} className="px-1">
                      <div className="text-gray-400 font-medium text-center text-xs">
                        {day}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap -mx-1">
                  {blankDays.map((_, i) => (
                    <div
                      key={i}
                      style={{ width: '14.26%' }}
                      className="text-center border p-1 border-transparent text-sm"
                    ></div>
                  ))}
                  {dayCount.map((d, i) => (
                    <div
                      key={i}
                      style={{ width: '14.26%' }}
                      className="px-1 mb-1"
                    >
                      <div
                        onClick={setDateValue(d)}
                        className={`cursor-pointer text-center text-sm rounded-full leading-loose transition ease-in-out duration-100 ${
                          isToday(d)
                            ? 'bg-blue-500 text-white'
                            : 'text-gray-200 hover:bg-blue-200'
                        }`}
                      >
                        {d}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
            {type === 'month' && (
              <div className="flex flex-wrap -mx-1">
                {Array(12)
                  .fill(null)
                  .map((_, i) => (
                    <div
                      key={i}
                      onClick={setMonthValue(i)}
                      style={{ width: '25%' }}
                    >
                      <div
                        className={`cursor-pointer p-5 font-semibold text-center text-sm rounded-lg hover:bg-gray-200 hover:text-gray-700 ${
                          isSelectedMonth(i)
                            ? 'bg-blue-500 text-white'
                            : 'text-gray-200 hover:bg-blue-200'
                        }`}
                      >
                        {format(
                          new Date(
                            datepickerHeaderDate.getFullYear(),
                            i,
                            datepickerHeaderDate.getDate()
                          ),
                          'MMM'
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            )}{' '}
            {/* {type === "year" && (
                      <Datepicker
                        datepickerHeaderDate={datepickerHeaderDate}
                        selectedDate={selectedDate}
                        setSelectedDate={setSelectedDate}
                        closeDatepicker={() => setShowDatepicker(false)}
                      />
                    )} */}
          </div>
        )}
      </div>
    </div>
  );
}
