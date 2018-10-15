import { Pipe, PipeTransform } from '@angular/core';
import { Position } from '../models/position';
@Pipe({
  name: 'jobfilter'
})
export class JobfilterPipe implements PipeTransform {

  transform(position: Position[], searchPosition: string): Position[] {
    if (!position || !searchPosition) {
      return position;
    }
    return position.filter(position =>
      position.employee['name'].toLowerCase().indexOf(searchPosition.toLowerCase()) !== -1);
  }
}
