import { Directive, forwardRef, HostBinding } from '@angular/core';
import { DraggaleDirective } from './draggale.directive';

@Directive({
  selector: '[appSortable]',
  providers: [
    {provide: DraggaleDirective, useExisting:forwardRef(()=> SortableDirective)}
  ]
})
export class SortableDirective extends DraggaleDirective {
  @HostBinding('class.sortable') sortable = true;
}
