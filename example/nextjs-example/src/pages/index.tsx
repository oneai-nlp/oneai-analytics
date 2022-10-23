import Chart from '../Chart';

export default function Home() {
  return (
    <div className="h-screen w-screen">
      <div className="h-5/6">
        <Chart />
      </div>
      <div className="h-1/6 ">
        <button type="button" className="bg-slate-600 w-full h-full">
          hi
        </button>
      </div>
    </div>
  );
}
