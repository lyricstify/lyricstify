import { Observable } from 'rxjs';

export interface ObservableRunner {
  run(...options: unknown[]): Observable<unknown>;
}
