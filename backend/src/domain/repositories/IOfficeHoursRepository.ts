import { OfficeHours } from '../entities/OfficeHours';
import { IRepository } from './IRepository';

export interface IOfficeHoursRepository extends IRepository<OfficeHours> {
  findByAlumniId(alumniId: string): Promise<OfficeHours | null>;
}
