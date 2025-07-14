import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Line, ReferenceLine } from 'recharts';
import { format } from 'date-fns';

const GanttChart = () => {
  // Sample CMO production data
  const productionData = [
    {
      task: 'VC23001 - Antiparasitic',
      start: new Date(2023, 6, 1),
      end: new Date(2023, 6, 15),
      cmo: 'BioPharm Solutions',
      progress: 100,
      status: 'Completed'
    },
    {
      task: 'VC23002 - Antibiotic',
      start: new Date(2023, 6, 10),
      end: new Date(2023, 6, 25),
      cmo: 'PharmaProd EU',
      progress: 75,
      status: 'In Progress'
    },
    {
      task: 'VC23003 - Vaccine',
      start: new Date(2023, 6, 5),
      end: new Date(2023, 6, 20),
      cmo: 'SteriTech Asia',
      progress: 90,
      status: 'In Progress'
    },
  ];

  // Convert dates to timestamps for plotting
  const processedData = productionData.map(item => ({
    ...item,
    startTs: item.start.getTime(),
    endTs: item.end.getTime(),
    duration: item.end.getTime() - item.start.getTime()
  }));

interface GanttBarProps {
    fill?: string;
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    payload?: {
        progress: number;
        task: string;
        start: Date;
        end: Date;
        cmo: string;
        status: string;
    };
}

  // Custom Gantt bar shape
  const GanttBar: React.FC<GanttBarProps> = (props) => {
    const { fill = '#3b82f6', x = 0, y = 0, width = 0, height = 0, payload = {
        progress: 0,
        task: '',
        start: new Date(),
        end: new Date(),
        cmo: '',
        status: ''
    } } = props;
    return (
      <g>
        {/* Background bar */}
        <rect
          x={x}
          y={y + 2}
          width={width}
          height={height - 4}
          fill="#e5e7eb"
          rx={4}
        />
        {/* Progress bar */}
        <rect
          x={x}
          y={y + 2}
          width={width * (payload.progress / 100)}
          height={height - 4}
          fill={fill}
          rx={4}
        />
        {/* Progress percentage */}
        <text
          x={x + 4}
          y={y + height / 2 + 6}
          fill="#1f2937"
          fontSize={12}
          fontWeight={500}
        >
          {`${payload.progress}%`}
        </text>
      </g>
    );
  };

  return (
    <div className="h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={processedData}
          layout="vertical"
          margin={{ top: 20, right: 40, left: 140, bottom: 20 }}
        >
          <XAxis
            type="number"
            domain={['dataMin', 'dataMax']}
            tickFormatter={(unixTime) => format(new Date(unixTime), 'MMM dd')}
            tick={{ fill: '#6b7280' }}
          />
          
          <YAxis
            type="category"
            dataKey="task"
            tick={{ fill: '#1f2937' }}
            width={130}
          />
          
          <Tooltip
            content={({ payload }) => (
              <div className="bg-white p-3 rounded-lg shadow-lg border">
                <p className="font-semibold">{payload?.[0]?.payload.task}</p>
                <p className="text-sm">
                  {format(payload?.[0]?.payload.start, 'MMM dd')} -{' '}
                  {format(payload?.[0]?.payload.end, 'MMM dd')}
                </p>
                <p className="text-sm">CMO: {payload?.[0]?.payload.cmo}</p>
                <p className="text-sm">
                  Status: 
                  <span className={`ml-1 ${
                    payload?.[0]?.payload.status === 'Completed' 
                      ? 'text-green-600' 
                      : 'text-amber-600'
                  }`}>
                    {payload?.[0]?.payload.status}
                  </span>
                </p>
              </div>
            )}
          />
          
          <ReferenceLine
            x={new Date().getTime()}
            stroke="#ef4444"
            strokeWidth={1.5}
            strokeDasharray="3 3"
            label={{
              value: 'Today',
              position: 'top',
              fill: '#ef4444',
              fontSize: 12
            }}
          />
          
          <Bar
            dataKey="startTs"
            shape={<GanttBar fill="#3b82f6" />}
            stackId="a"
            barSize={28}
          />
          
          <Bar
            dataKey="duration"
            shape={<GanttBar fill="#3b82f6" />}
            stackId="a"
            barSize={28}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GanttChart