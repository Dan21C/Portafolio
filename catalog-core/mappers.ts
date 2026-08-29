import type { CreateProjectRequestDto, CreateSolutionRequest, SolutionDetailDto } from './contracts';
import type { ProjectRequest, Solution, SolutionMedia } from './models';
export const getSolutionCover = (solution: Pick<Solution, 'gallery'>): SolutionMedia | undefined => solution.gallery.find((media) => media.isCover) ?? solution.gallery.slice().sort((a, b) => a.order - b.order)[0];
export const mapSolutionDetail = (dto: SolutionDetailDto): Solution => ({ ...dto, gallery: dto.gallery.map((media) => ({ ...media })) });
export const mapCreateSolutionRequest = (solution: Omit<Solution, 'id' | 'order'>): CreateSolutionRequest => ({ ...solution, gallery: solution.gallery.map((media) => ({ ...media })) });
export const mapCreateProjectRequest = (request: Omit<ProjectRequest, 'id' | 'createdAt'>): CreateProjectRequestDto => ({ name: request.name, company: request.company, email: request.email, phone: request.phone, projectType: request.projectType, city: request.city, approximateDate: request.approximateDate, attendees: request.attendees, message: request.message, items: request.selections.map((item) => ({ ...item })) });
