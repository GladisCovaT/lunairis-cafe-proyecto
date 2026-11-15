import { experiences } from './experiences';

export const ageGroups = [
  { value: 'ninos', name: 'Niños', range: '6 a 12 años', optionLabel: 'Niños (6-12 años)' },
  { value: 'jovenes', name: 'Jóvenes', range: '13 a 17 años', optionLabel: 'Jóvenes (13-17 años)' },
  { value: 'adultos', name: 'Adultos', range: '18 años en adelante', optionLabel: 'Adultos (18+ años)' }
];

// Horarios disponibles según el grupo de edad
export const schedules = {
  ninos: ['09:00', '10:30', '14:00', '15:30'],
  jovenes: ['11:00', '13:00', '15:00', '17:00'],
  adultos: ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00']
};

// Las experiencias reservables salen de la misma lista de la sección Experiencias
export const bookingActivities = [...experiences.map((experience) => experience.title), 'Experiencia libre'];
