import type { Category } from '../types';

export const SERVICE_CATEGORIES: Array<{ value: Category; label: string }> = [
  { value: 'personal-assistance', label: 'Aide à la personne' },
  { value: 'culture-leisure', label: 'Culture et loisirs' },
  { value: 'domestic', label: 'Services domestiques' },
  { value: 'tech', label: 'Services numériques' },
  { value: 'education', label: 'Éducation' },
  { value: 'administrative', label: 'Administratif' },
  { value: 'wellness', label: 'Bien-être' },
  { value: 'repair', label: 'Artisanat' },
  { value: 'mobility', label: 'Mobilité' },
  { value: 'solidarity', label: 'Solidarité' }
];