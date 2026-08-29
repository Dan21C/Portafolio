import {describe,expect,it} from 'vitest';
import {dashboardDateQuery,dashboardViewState} from './dashboardView';
describe('dashboard view states and ranges',()=>{
  it('maps loading error empty and data states',()=>{expect(dashboardViewState(true,'',null)).toBe('loading');expect(dashboardViewState(false,'failed',null)).toBe('error');expect(dashboardViewState(false,'',{summary:{totalRequests:0}})).toBe('empty');expect(dashboardViewState(false,'',{summary:{totalRequests:2}})).toBe('data');});
  it.each([['7','2026-08-12T00:00:00.000Z'],['30','2026-07-20T00:00:00.000Z'],['90','2026-05-21T00:00:00.000Z'],['year','2026-01-01T00:00:00.000Z']])('builds %s calendar range',(range,expected)=>{expect(dashboardDateQuery(range,new Date('2026-08-18T17:00:00Z')).dateFrom).toBe(expected);});
});
