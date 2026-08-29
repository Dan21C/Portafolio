import type { ProjectStorage } from '../../../../catalog-core/repositories';
import type { ProjectSelection } from '../../../../catalog-core/models';
const STORAGE_KEY = 'apx-project-selection';
export class LocalProjectStorage implements ProjectStorage {
  get(): ProjectSelection[] { try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') as ProjectSelection[]; } catch { return []; } }
  save(items: ProjectSelection[]): void { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); }
  clear(): void { localStorage.removeItem(STORAGE_KEY); }
}
export const projectStorage: ProjectStorage = new LocalProjectStorage();
