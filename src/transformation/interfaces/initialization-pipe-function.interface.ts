import { Observable } from 'rxjs';
import { LineResponseInterface } from '../../lyric/interfaces/line-response.interface.js';

export type InitializationPipeFunction = (
  lines: LineResponseInterface[],
) => Observable<LineResponseInterface[]>;
