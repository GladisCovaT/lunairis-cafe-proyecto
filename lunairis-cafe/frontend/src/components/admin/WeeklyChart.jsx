export default function WeeklyChart({ days }) {
  const max = Math.max(1, ...days.map((day) => day.count));

  return (
    <div className="bar-chart" id="weeklyChart" aria-label="Gráfico de pedidos por día">
      {days.map((day, index) => {
        const level = day.count === 0 ? 0 : Math.max(1, Math.ceil((day.count / max) * 10));
        const tone = day.count === 0 ? 'bar-empty' : day.count === max ? 'bar-peak' : 'bar-normal';
        return (
          <div className="chart-day" key={index}>
            <span className="chart-value">{day.count}</span>
            <div className="chart-bar-wrap">
              <div className={`chart-bar bar-level-${level} ${tone}`}></div>
            </div>
            <small>{day.label}</small>
          </div>
        );
      })}
    </div>
  );
}
