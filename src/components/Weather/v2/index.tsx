'use client';
import { JSX } from 'react';
import styles from './styles.module.css';
import { TbTemperature, TbWind } from 'react-icons/tb';
import { WiHumidity } from 'react-icons/wi';
import Image from 'next/image';
import LockUp from '@/components/Common/lockup';
import { iWeatherData } from '..';

interface iWeatherWidgetProps {
  data: iWeatherData;
  eventTime: `${string} - ${string}`;
}

interface iForecastDetailProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const ForecastDetail: React.FC<iForecastDetailProps> = ({
  icon,
  label,
  value,
}: iForecastDetailProps): JSX.Element => (
  <div className={styles.detail}>
    {icon}
    <p>{label}</p>
    <p>{value}</p>
  </div>
);

const WeatherWidget: React.FC<iWeatherWidgetProps> = ({ data, eventTime }) => {
  // Defensive: if no data, show nothing
  if (!data || !data.weatherCondition) return null;

  return (
    <div className={styles.background}>
      <div className={styles.weatherWidget}>
        <div>
          <div className={styles.header}>
            <LockUp
              overline={`Estimate for ${data.timeZone?.id || ''}`}
              title={eventTime}
            />
            <div className={styles.temperature}>
              <TbTemperature />
              <p className={styles.tempValue}>{data.temperature.degrees} °C</p>
            </div>
          </div>

          <div className={styles.status}>
            <div className={styles.statusText}>
              {data.weatherCondition.description.text}
            </div>
            <div className={styles.chance}>
              {data.currentTime
                ? new Date(data.currentTime).toLocaleString()
                : ''}
            </div>
          </div>
        </div>

        <div className={styles.weatherDetails}>
          <ForecastDetail
            icon={<TbWind size={20} />}
            label="Wind"
            value={`${data.wind.speed.value} km/h`}
          />
          <ForecastDetail
            icon={
              <Image
                src={data.weatherCondition.iconBaseUri + '.svg'}
                alt={data.weatherCondition.description.text}
                width={30}
                height={30}
              />
            }
            label="Condition"
            value={data.weatherCondition.type.replace(/_/g, ' ')}
          />
          <ForecastDetail
            icon={<WiHumidity size={20} />}
            label="Humidity"
            value={`${data.relativeHumidity}%`}
          />
        </div>

        <div className={styles.hourlyForecast}>
          {[data]?.map((hour) => (
            <div key={hour.currentTime} className={styles.forecastItem}>
              <p className={styles.forecastTime}>
                {hour.currentTime.split(' ')[1]}
              </p>
              <Image
                src={`${hour.weatherCondition.iconBaseUri}.svg`}
                alt={hour.weatherCondition.description.text}
                width={30}
                height={30}
              />
              <p>{hour.temperature.degrees}°C</p>
              <p>
                <WiHumidity size={15} color="var(--theme-color)" />{' '}
                {hour.precipitation.probability.percent}%
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;
