export const INTEREST_AREA_CATALOG: Record<string, number> = {
  Tecnologia: 2,
  'Tecnologia e Informatica': 2,
  Arte: 6,
  'Arte y Creatividad': 6,
  'Ciencias Exactas': 1,
  'Ciencias de la Salud': 3,
  'Ciencias Sociales': 4,
  Humanidades: 5,
  'Negocios y Administracion': 7,
  Ingenieria: 8,
  Comunicacion: 9,
  Educacion: 10,
  'Deportes y Recreacion': 11,
  'Ciencias Ambientales': 12
};

export function extractAreaIds(interests: string[]): string {
  const mapped = interests
    .map((interest) => INTEREST_AREA_CATALOG[interest.trim()])
    .filter((value): value is number => typeof value === 'number');
  const unique = Array.from(new Set(mapped));
  return unique.join(',');
}
